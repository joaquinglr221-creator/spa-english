const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- Progreso (se guarda en el celular de cada terapeuta) ----------
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
let known = new Set(store.get("known", []));
const toggleKnown = (en) => {
  known.has(en) ? known.delete(en) : known.add(en);
  store.set("known", [...known]);
  USO.track(known.has(en) ? "learned" : "unlearned", { item: en, category: categoryOf(en) });
};
// Categoría de una palabra, para el reporte de uso.
const categoryOf = (en) => (VOCAB.find((c) => c.words.some((w) => w.en === en)) || {}).title;

// ---------- Voz en inglés ----------
// Voces de efectos o muy robóticas que traen macOS/iOS; nunca se eligen solas.
const NOVELTY_VOICES = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Fred|Good News|Jester|Junior|Kathy|Organ|Superstar|Ralph|Trinoids|Whisper|Zarvox|Grandma|Grandpa|Rocko|Eddy|Flo|Reed|Sandy|Shelley)\b/i;
const GOOD_VOICES = /^(Ava|Samantha|Allison|Susan|Zoe|Evan|Nathan|Tom|Joelle|Noelle|Serena|Daniel|Karen|Moira|Tessa)\b/i;

function voiceScore(v) {
  let score = 0;
  if (NOVELTY_VOICES.test(v.name)) score -= 1000;
  if (/natural|neural|online/i.test(v.name)) score += 100;
  if (/google/i.test(v.name)) score += 90;
  if (/premium/i.test(v.name)) score += 80;
  if (/enhanced|mejorada/i.test(v.name)) score += 70;
  if (GOOD_VOICES.test(v.name)) score += 50;
  if (v.lang.replace("_", "-") === "en-US") score += 10;
  return score;
}

let englishVoices = [];
let englishVoice = null;
function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  englishVoices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("en"))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
  englishVoice = englishVoices[0] || null; // solo si falta algún audio grabado
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Audios pregrabados con la voz Ava (Premium); los genera scripts/generar_audios.py. La app siempre
// usa esta voz; la del celular solo suena si a una frase le faltara su audio grabado.
const RECORDED = typeof AUDIO_FILES !== "undefined" ? AUDIO_FILES : {};
const HAS_RECORDED = Object.keys(RECORDED).length > 0;
const useRecorded = HAS_RECORDED;
let currentAudio = null;

// Hash FNV-1a del texto: es el nombre del archivo de audio (scripts/generar_audios.py usa esta misma función).
function audioKey(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
const spokenText = (text) => text.replace(/\s*\/\s*/g, ", ");

function speak(text, slow = false) {
  if (text) USO.track("audio", { item: text.slice(0, 120) });
  const clean = spokenText(text);
  if (currentAudio) currentAudio.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const key = audioKey(clean);
  if (useRecorded && RECORDED[key]) {
    currentAudio = new Audio(`audio/${RECORDED[key]}/${key}.m4a`);
    currentAudio.playbackRate = slow ? 0.7 : 1;
    // Si falla (mala señal), se reintenta la grabación antes de recurrir a la voz del celular.
    const audio = currentAudio;
    audio.play().catch(() =>
      setTimeout(() => {
        if (currentAudio !== audio) return;
        audio.load();
        audio.play().catch(() => speakWithDevice(clean, slow));
      }, 400)
    );
    return;
  }
  speakWithDevice(clean, slow);
}

function speakWithDevice(text, slow) {
  if (!("speechSynthesis" in window)) {
    alert("Este navegador no puede leer en voz alta.");
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  if (englishVoice) u.voice = englishVoice;
  u.rate = slow ? 0.65 : 0.95;
  speechSynthesis.speak(u);
}

const speakButtons = (text) => `
  <button class="icon-btn" data-speak="${esc(text)}" aria-label="Escuchar">🔊</button>
  <button class="icon-btn" data-speak="${esc(text)}" data-slow aria-label="Escuchar despacio">🐢</button>`;

// ---------- Vocabulario ----------
const PHOTOS = typeof IMAGES !== "undefined" ? IMAGES : {};
// Una palabra puede estar en dos categorías (p. ej. "Swedish massage"); aquí cuenta una sola vez.
const ALL_WORDS = [...new Map(VOCAB.flatMap((c) => c.words).map((w) => [w.en, w])).values()];
let currentWords = [];

// Resalta en la frase la palabra estudiada (acepta plurales y formas como allergy → allergies).
function highlight(sentence, word) {
  const terms = word
    .split("/")
    .map((t) => t.replace(/\(.*?\)/g, "").trim().replace(/^to /i, ""))
    .filter(Boolean);
  const LINKING = /^(con|para|por|sin|del|las|los|the|and|with|for|your|you)$/i;
  const words = [...terms, ...terms.flatMap((t) => t.split(/\s+/).filter((x) => x.length >= 3 && !LINKING.test(x)))];
  const tries = [...words, ...words.filter((t) => t.length >= 4 && /s$/i.test(t)).map((t) => t.slice(0, -1))];
  for (const t of tries) {
    const stem = t
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/y$/i, "(?:y|ie)")
      .replace(/o$/i, "(?:o|a)"); // relajado → relajada
    const m = sentence.match(new RegExp(`(^|[^\\p{L}])(${stem}(?:s|es|ed|d)?)(?=[^\\p{L}]|$)`, "iu"));
    if (m) {
      const i = m.index + m[1].length;
      return `${esc(sentence.slice(0, i))}<mark>${esc(m[2])}</mark>${esc(sentence.slice(i + m[2].length))}`;
    }
  }
  return esc(sentence);
}

function wordList(words) {
  if (!words.length) return `<p class="muted">No se encontraron palabras.</p>`;
  return words
    .map(
      (w) => `
    <article class="word ${known.has(w.en) ? "is-known" : ""}">
      ${PHOTOS[w.en] ? `<img class="thumb" src="${esc(PHOTOS[w.en].src)}" alt="${esc(w.en)}" loading="lazy" data-zoom="${esc(w.en)}">` : ""}
      <div class="word-text">
        <p class="en">${esc(w.en)}</p>
        <p class="pron">/${esc(w.pron)}/</p>
        <p class="es">${esc(w.es)}</p>
      </div>
      <div class="word-actions">
        ${speakButtons(w.en)}
        <button class="icon-btn known-btn" data-known="${esc(w.en)}" aria-label="Marcar como aprendida">${known.has(w.en) ? "✅" : "⬜"}</button>
      </div>
      <div class="example">
        <div>
          <p class="en">${highlight(w.ex, w.hl || w.en)}</p>
          <p class="es">${highlight(w.exEs, w.hlEs || w.es)}</p>
        </div>
        <div class="row">${speakButtons(w.ex)}</div>
      </div>
      ${w.sheet ? `<button class="btn small ghost sheet-btn" data-sheet="${esc(w.sheet)}" data-title="${esc(w.en)}">📄 Ver ficha técnica</button>` : ""}
    </article>`
    )
    .join("");
}

// Ícono dibujado de la categoría (js/icons.js); si no tiene, su emoji.
const CAT_ICONS = typeof ICONS !== "undefined" ? ICONS : {};
const catIcon = (c, size = "", color = "") =>
  `<span class="cat-icon ${size} ${color ? "colored" : ""}" ${color ? `style="--c:${color}"` : ""} aria-hidden="true">${
    CAT_ICONS[c.id] ? `<svg viewBox="0 0 24 24">${CAT_ICONS[c.id]}</svg>` : c.icon
  }</span>`;

// Colores del menú: cada categoría (y cada paso del script) toma uno de la paleta, en el orden en que
// aparece, para que los recuadros vecinos sean de distinto color.
const PALETA = ["#7b4fa0", "#c2185b", "#d9622b", "#b7791f", "#2e7d4f", "#1f8a82", "#2f6db5", "#4b54b8"];
const colorPorIndice = (i) => PALETA[i % PALETA.length];

// Secciones del menú de inicio; una categoría nueva que no esté aquí aparece en "Otras".
const MENU_GROUPS = [
  { title: "Spa y cabina", ids: ["cuerpo", "tratamientos", "masajes", "tecnicas", "verbos", "posiciones", "productos", "aromas", "instalaciones", "amenidades", "bienestar"] },
  { title: "Salud y seguridad", ids: ["salud", "encuesta", "malestares", "piel"] },
  { title: "Salón y barbería", ids: ["barberia", "peinados", "coloracion"] },
  { title: "Recepción y hotel", ids: ["recepcion", "hotel"] },
];

// Orden en que se ven las categorías en el menú (por secciones): de ahí sale su color.
function ordenMenu() {
  const ids = MENU_GROUPS.flatMap((g) => g.ids);
  return [...ids, ...VOCAB.map((c) => c.id).filter((id) => !ids.includes(id))];
}
const colorCategoria = (id) => colorPorIndice(Math.max(0, ordenMenu().indexOf(id)));

function menuTile(c) {
  const learned = c.words.filter((w) => known.has(w.en)).length;
  const pct = Math.round((learned / c.words.length) * 100);
  const color = colorCategoria(c.id);
  return `<a class="tile colored ${pct === 100 ? "is-done" : ""}" style="--c:${color}" href="#/${c.id}">${catIcon(c, "", color)}<span class="tile-title">${esc(c.title)}</span><small class="muted">${learned} de ${c.words.length}</small><span class="cat-bar"><span style="width:${pct}%"></span></span></a>`;
}

function menu() {
  const grouped = new Set(MENU_GROUPS.flatMap((g) => g.ids));
  const groups = [...MENU_GROUPS, { title: "Otras", ids: VOCAB.map((c) => c.id).filter((id) => !grouped.has(id)) }];
  return groups
    .map((g) => {
      const cats = g.ids.map((id) => VOCAB.find((c) => c.id === id)).filter(Boolean);
      return cats.length ? `<p class="chips-label">${g.title}</p><div class="grid menu">${cats.map(menuTile).join("")}</div>` : "";
    })
    .join("");
}

// Logotipos del hotel: solo cuando la app se abre desde el servidor del hotel (/apps/spa/).
// La versión de internet no los muestra ni los incluye
// (scripts/publicar.py deja fuera images/logos/).
const BRANDS = USO.hotel || location.protocol === "file:" // en el hotel o abierta como archivo en la computadora; nunca en internet
  ? `
    <header class="brands">
      <img src="images/logos/secrets-riviera-cancun.png" alt="Secrets Riviera Cancún Resort & Spa">
      <img src="images/logos/breathless-riviera-cancun.png" alt="Breathless Riviera Cancún Resort & Spa">
      <img src="images/logos/world-of-hyatt-inclusive-collection.svg" alt="World of Hyatt Inclusive Collection">
    </header>`
  : "";

// Video de fondo de los recuadros del inicio y de las portadas (videos/portadas/<nombre>.mp4).
const vidFondo = (n) =>
  `<video class="banner-video" src="videos/portadas/${n}.mp4" poster="videos/portadas/${n}.jpg" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>`;

// ---------- Scripts de servicio por etapas ----------
// Script de servicio AAA (js/service-script.js), hidroterapia (js/hydro-script.js) y valet de spa
// (js/valet-script.js): mismas vistas, cada uno con su ruta, portada y textos.
const STAGES = typeof SERVICE_SCRIPT !== "undefined" ? SERVICE_SCRIPT : [];
const VIDEOS = typeof SCRIPT_VIDEOS !== "undefined" ? SCRIPT_VIDEOS : {}; // js/videos.js (solo el script de servicio)
let practiceScript = false;
const WHO = { therapist: "Therapist · Terapeuta", guest: "Guest · Huésped", valet: "Spa Valet · Valet de spa", concierge: "Spa Concierge · Concierge del spa", trainer: "Gym Trainer · Entrenador" };

const PROGRAMAS = {
  script: {
    stages: STAGES, icono: "script", portada: "images/script/portada.jpg", titulo: "Script de servicio Terapeuta",
    kicker: "Programa de servicio · Estándares AAA", standardsLabel: "⭐ Estándares AAA",
    desc: "La experiencia completa de la terapeuta con el huésped, de la bienvenida a la despedida.",
    flow: "Welcome → Recognize → Discover → Anticipate → Personalize → Deliver → Follow up → Farewell",
  },
  hidroterapia: {
    stages: typeof HYDRO_SCRIPT !== "undefined" ? HYDRO_SCRIPT : [], icono: "instalaciones", portada: "images/script/hidroterapia.jpg",
    titulo: "Script de hidroterapia", kicker: "Circuito de hidroterapia · Seguridad y servicio", standardsLabel: "⭐ Pautas y seguridad",
    desc: "Cómo recibir, orientar y cuidar al huésped en cada estación del circuito de hidroterapia.",
    flow: "Warm shower → Sauna → Cold shower → Steam room → Cold plunge → Vitality pool → Whirlpool → Relaxation lounge",
    volver: "#/valet", volverTexto: "← Valet de spa",
  },
  "valet-script": {
    stages: typeof VALET_SCRIPT !== "undefined" ? VALET_SCRIPT : [], icono: "amenidades", portada: "images/script/valet.jpg",
    titulo: "Script del valet de spa", kicker: "Spa Valet · Estándares AAA", standardsLabel: "⭐ Estándares AAA",
    desc: "El servicio del valet de spa: bienvenida, lockers, amenidades, áreas del spa y despedida.",
    flow: "Welcome → Recognize → Anticipate → Assist → Explain → Personalize → Follow up → Farewell",
    volver: "#/valet", volverTexto: "← Valet de spa",
  },
  "gym-script": {
    stages: typeof GYM_SCRIPT !== "undefined" ? GYM_SCRIPT : [], icono: "script", portada: "images/script/gym.jpg",
    titulo: "Script del entrenador del gym", kicker: "Gym Trainer · Estándares AAA", standardsLabel: "⭐ Estándares AAA",
    desc: "Bienvenida, objetivos, equipos, instrucciones seguras, entrenamiento personalizado y despedida.",
    flow: "Welcome → Recognize → Discover → Anticipate → Personalize → Explain → Deliver → Follow up → Farewell",
    volver: "#/gym", volverTexto: "← Gym del spa",
  },
  "concierge-script": {
    stages: typeof CONCIERGE_SCRIPT !== "undefined" ? CONCIERGE_SCRIPT : [], icono: "script", portada: "images/script/concierge.jpg",
    titulo: "Script del Spa Concierge", kicker: "Spa Concierge · Ventas y bienestar", standardsLabel: "⭐ Estándares de venta",
    desc: "Bienvenida, evaluación de necesidades, masajes, hidroterapia, objeciones y cierre de la venta.",
    flow: "Welcome → Assess needs → Recommend → Upsell → Handle objections → Close → Confirm",
    volver: "#/concierge", volverTexto: "← Spa Concierge",
  },
};

const stageIcon = (st, size, programa = "script") =>
  catIcon({ id: programa === "script" ? `st-${st.id}` : `${programa}-${st.id}`, icon: st.icon }, size, colorPorIndice(PROGRAMAS[programa].stages.indexOf(st)));

// Sin etapa: las etapas en recuadros, como el menú de categorías.
function viewScriptMenu(programa = "script") {
  const P = PROGRAMAS[programa], S = P.stages;
  const videos = programa === "script" ? Object.keys(VIDEOS).length : 0;
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="${P.volver || "#/"}">${P.volverTexto || "← Inicio"}</a>
    ${programa === "script" ? `<section class="script-hero con-video">${vidFondo("script")}` : `<section class="script-hero" style="background-image:url('${P.portada}')">`}
      <div class="script-hero-text">
        <p class="script-kicker">${esc(P.kicker)}</p>
        <h1>${esc(P.titulo)}</h1>
        <p>${esc(P.desc)}</p>
      </div>
    </section>
    <div class="script-facts">
      <span><b>${S.length}</b> pasos</span>
      <span><b>${S.reduce((n, st) => n + st.lines.length, 0)}</b> frases con audio</span>
      <span><b>${S.reduce((n, st) => n + st.standards.length, 0)}</b> ${programa === "hidroterapia" ? "pautas" : programa === "concierge-script" ? "estándares" : "estándares AAA"}</span>
      ${videos ? `<span><b>${videos}</b> ${videos === 1 ? "video" : "videos"}</span>` : ""}
    </div>
    <p class="script-flow">${esc(P.flow)}</p>
    <a class="btn full center" href="#/${programa}/${S[0].id}">▶ Comenzar con el Paso 1</a>
    <h2 class="section-title">Los ${S.length} pasos</h2>
    <div class="grid menu">${S.map(
      (st, n) => `<a class="tile colored" style="--c:${colorPorIndice(n)}" href="#/${programa}/${st.id}">${stageIcon(st, "", programa)}<small class="step-num">Paso ${n + 1}</small><span class="tile-title">${esc(st.titleEs)}</span><small class="muted">${esc(st.title)}</small></a>`
    ).join("")}</div>
    <a class="btn ghost full center" href="${P.volver || "#/"}">${P.volverTexto || "← Volver al inicio"}</a>`;
}

function viewScript(stageId, programa = "script") {
  if (!stageId) return viewScriptMenu(programa);
  const P = PROGRAMAS[programa], S = P.stages;
  const i = Math.max(0, S.findIndex((st) => st.id === stageId));
  const st = S[i];
  const lines = st.lines
    .map(
      (l) => `
      <div class="line ${l.who}">
        <p class="who">${WHO[l.who]}</p>
        ${l.avoid ? `<p class="avoid">✗ ${esc(l.avoid)}</p>` : ""}
        <p class="en reveal">${l.avoid ? "✓ " : ""}${esc(l.en)}</p>
        <p class="es">${esc(l.es)}</p>
        <div class="row">${speakButtons(l.en)}</div>
      </div>`
    )
    .join("");
  const prev = S[i - 1], next = S[i + 1];
  const video = programa === "script" && VIDEOS[st.id];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/${programa}">← Los ${S.length} pasos del script</a>
    <section class="card">
      <div class="cat-head">${stageIcon(st, "md", programa)}<div>
        <p class="label">Paso ${i + 1} de ${S.length}</p>
        <h2 class="stage-title">${esc(st.title)}</h2>
        <p class="muted">${esc(st.titleEs)}</p>
      </div></div>
      <div class="standards">
        <p class="label">${P.standardsLabel}</p>
        <ul>${st.standards.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
    </section>
    ${video ? `<video class="stage-video" controls playsinline preload="metadata" src="${esc(video)}#t=0.5"></video>` : ""}
    <div class="row between">
      <button class="btn small" id="play-stage">▶ Escuchar todo el diálogo</button>
      <label class="toggle"><input type="checkbox" id="practice-toggle" ${practiceScript ? "checked" : ""}> Modo práctica (ocultar inglés)</label>
    </div>
    <div class="dialogue ${practiceScript ? "practice" : ""}">${lines}</div>
    <div class="row between stage-nav">
      ${prev ? `<a class="btn ghost small" href="#/${programa}/${prev.id}">← ${esc(prev.titleEs)}</a>` : "<span></span>"}
      ${next ? `<a class="btn small" href="#/${programa}/${next.id}">${esc(next.titleEs)} →</a>` : `<a class="btn small" href="#/${programa}">Terminar ✓</a>`}
    </div>`;
}

// Reproduce varias frases seguidas (el diálogo completo de una etapa).
let playQueue = null;
function speakAll(texts) {
  const run = { stop: false };
  if (playQueue) playQueue.stop = true;
  playQueue = run;
  const next = (n) => {
    if (run.stop || n >= texts.length) return;
    const clean = spokenText(texts[n]);
    const key = audioKey(clean);
    if (currentAudio) currentAudio.pause();
    if (useRecorded && RECORDED[key]) {
      currentAudio = new Audio(`audio/${RECORDED[key]}/${key}.m4a`);
      currentAudio.onended = () => setTimeout(() => next(n + 1), 350);
      currentAudio.play().catch(() => next(n + 1));
    } else if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "en-US";
      if (englishVoice) u.voice = englishVoice;
      u.rate = 0.95;
      u.onend = () => setTimeout(() => next(n + 1), 350);
      speechSynthesis.speak(u);
    }
  };
  next(0);
}

// ---------- Venta de ampolletas BABOR (js/ampolletas.js) y material original ----------
const AMPS = typeof AMPOLLETAS !== "undefined" ? AMPOLLETAS : [];
const AMP_VID = typeof AMP_VIDEOS !== "undefined" ? AMP_VIDEOS : {}; // js/videos-ampolletas.js

// Material original: páginas de los PDF convertidas en imágenes (images/material/).
const MATERIAL = {
  "ampoule-bar": { title: "BABOR Ampoule Bar 2026", subtitle: "Presentación de ampolletas para terapeutas", pages: 7 },
  "natura-bisse": { title: "Natura Bissé · Guía de producto", subtitle: "Retail México (en español)", pages: 26 },
  "spa-concierge": { title: "Spa Concierge · Sales & Wellness Script", subtitle: "Manual original (en inglés)", pages: 11, volver: "#/concierge", volverTexto: "← Spa Concierge" },
  "gym-workouts": { title: "Work Outs", subtitle: "Ejercicios, equipo, verbos y calentamiento", pages: 20, volver: "#/gym", volverTexto: "← Gym del spa" },
  "gym-equipment": { title: "Gym Equipment", subtitle: "Equipo del gimnasio", pages: 18, volver: "#/gym", volverTexto: "← Gym del spa" },
  "gym-verbs": { title: "Gym Verbs", subtitle: "Verbos del entrenamiento", pages: 8, volver: "#/gym", volverTexto: "← Gym del spa" },
  "valet-spa": { title: "Valet Spa Script", subtitle: "Presentación de vocabulario para valets", pages: 14, volver: "#/valet", volverTexto: "← Valet de spa" },
};

const VENTA_ESTANDARES = [
  ["Recomienda después de escuchar: usa lo que el huésped te contó en la consulta.", "Recommend after listening: use what the guest told you in the consultation."],
  ["Recomienda uno o dos productos como máximo, los que de verdad necesita su piel.", "Recommend one or two products at most, the ones the guest's skin really needs."],
  ["Explica el beneficio, cómo se usa y un ingrediente clave; no recites toda la ficha.", "Explain the benefit, how to use it and one key ingredient; don't recite the whole sheet."],
  ["Ofrece apartarlo en la recepción del spa; nunca presiones.", "Offer to set it aside at Spa Reception; never pressure the guest."],
  ["Si el huésped dice que no, agradece con la misma amabilidad.", "If the guest says no, thank them with the same kindness."],
];
const VENTA_NO = ["No problem at all. If you change your mind, Spa Reception will be happy to help you.",
  "No hay ningún problema. Si cambia de opinión, la recepción del spa con gusto le ayudará."];

const BABOR_LIMPIO = [
  ["Libre de silicona", "Silicone-free"], ["Libre de parabenos", "Paraben-free"], ["Libre de PEGs", "PEG-free"],
  ["Libre de microplásticos", "Microplastic-free"], ["Libre de lactosa", "Lactose-free"], ["Libre de gluten", "Gluten-free"],
  ["Libre de aceite mineral", "Mineral oil-free"], ["Libre de tintes sintéticos", "Synthetic dye-free"],
  ["Probado dermatológicamente", "Dermatologically tested"], ["Vegano", "Vegan"],
];

const bilingue = (es, en) => `<span class="bi"><span>🇲🇽 ${esc(es)}</span><span class="bi-en">🇺🇸 ${esc(en)}</span></span>`;

// Texto bilingüe con botones para escuchar el inglés (🔊 y 🐢).
const bilingueAudio = (es, en, hablar = en) => `<div class="bi-audio">${bilingue(es, en)}<div class="row">${speakButtons(hablar)}</div></div>`;

function dialogueHtml(lines) {
  return lines
    .map(
      (l) => `
      <div class="line ${l.who}">
        <p class="who">${WHO[l.who]}</p>
        <p class="en reveal">${esc(l.en)}</p>
        <p class="es">${esc(l.es)}</p>
        <div class="row">${speakButtons(l.en)}</div>
      </div>`
    )
    .join("");
}

function viewAmpolletas() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/productos-belleza">← Productos de belleza</a>
    <section class="script-hero" style="background-image:url('images/ampolletas/portada.jpg')">
      <div class="script-hero-text">
        <p class="script-kicker">BABOR Ampoule Bar 2026 · Español / English</p>
        <h1>Venta de ampolletas</h1>
        <p>La ficha de cada ampolleta en español e inglés, y su script para recomendarla al huésped.</p>
      </div>
    </section>
    <div class="script-facts">
      <span><b>${AMPS.length}</b> productos</span>
      <span><b>${AMPS.reduce((n, a) => n + a.script.length, 0)}</b> frases de venta con audio</span>
    </div>
    <section class="card">
      <p class="label">⭐ Cómo recomendar · How to recommend (AAA)</p>
      <ul class="amp-list">${VENTA_ESTANDARES.map(([es, en]) => `<li>${bilingueAudio(es, en)}</li>`).join("")}</ul>
      <div class="line therapist amp-no">
        <p class="who">Si el huésped dice que no · If the guest says no</p>
        <p class="en">${esc(VENTA_NO[0])}</p><p class="es">${esc(VENTA_NO[1])}</p>
        <div class="row">${speakButtons(VENTA_NO[0])}</div>
      </div>
    </section>
    <h2 class="section-title">Las ${AMPS.length} ampolletas</h2>
    <div class="grid menu amp-grid">${AMPS.map(
      (a, n) => `<a class="tile colored" style="--c:${colorPorIndice(n)}" href="#/ampolletas/${a.id}">
        <img class="amp-thumb" src="${esc(a.img)}" alt="" loading="lazy">
        <span class="tile-title">${esc(a.name)}</span>
        <small class="muted">${esc(a.use.es)} · ${esc(a.instant.es)}</small></a>`
    ).join("")}</div>
    <section class="card">
      <p class="label">🌿 Fórmulas BABOR · BABOR formulas</p>
      <div class="amp-clean">${BABOR_LIMPIO.map(([es, en]) => `<span>✓ 🇲🇽 ${esc(es)} <em>🇺🇸 ${esc(en)}</em></span>`).join("")}</div>
    </section>
    <h2 class="section-title">Material original</h2>
    <div class="amp-docs">${Object.entries(MATERIAL).filter(([, m]) => !m.volver).map(
      ([id, m]) => `<a class="amp-doc" href="#/material/${id}"><img src="images/material/${id}/p01.jpg" alt="" loading="lazy">
        <span><b>${esc(m.title)}</b><small>${esc(m.subtitle)} · ${m.pages} páginas</small></span></a>`
    ).join("")}</div>
    <a class="btn ghost full center" href="#/productos-belleza">← Volver a Productos de belleza</a>`;
}

function viewAmpolleta(id) {
  const i = AMPS.findIndex((a) => a.id === id);
  if (i < 0) return viewAmpolletas();
  const a = AMPS[i];
  const fila = (es, en, valor) => `<tr><th>${bilingueAudio(es, en)}</th><td>${valor}</td></tr>`;
  const prev = AMPS[i - 1], next = AMPS[i + 1];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/ampolletas">← Todas las ampolletas</a>
    <section class="card amp-card" style="--c:${colorPorIndice(i)}">
      <img class="amp-photo" src="${esc(a.img)}" alt="${esc(a.name)}">
      <div>
        <p class="label">${esc(a.line)}</p>
        <h2 class="stage-title">${esc(a.name)}</h2>
        <div class="muted">${bilingueAudio(a.concern.es, a.concern.en)}</div>
      </div>
    </section>
    <section class="card">
      <table class="amp-table">
        ${fila("Beneficio instantáneo", "Instant benefit", bilingueAudio(a.instant.es, a.instant.en))}
        ${fila("Beneficio en 7 días", "7-day benefit", bilingueAudio(a.days7.es, a.days7.en))}
        ${fila("Uso", "Use", bilingueAudio(a.use.es, a.use.en))}
        ${fila("Efecto", "Effect", bilingueAudio(a.effect.es, a.effect.en))}
        ${fila("Activos", "Key ingredients", `<ul class="amp-list">${a.actives.es.map((x, k) => `<li>${bilingueAudio(x, a.actives.en[k])}</li>`).join("")}</ul>`)}
      </table>
    </section>
    <h2 class="section-title">💬 Script de venta · Sales script</h2>
    ${AMP_VID[a.id] ? `<video class="stage-video" controls playsinline preload="metadata" src="${esc(AMP_VID[a.id])}#t=0.5"></video>` : ""}
    <div class="row between">
      <button class="btn small" id="play-stage">▶ Escuchar todo el diálogo</button>
      <label class="toggle"><input type="checkbox" id="practice-toggle" ${practiceScript ? "checked" : ""}> Modo práctica (ocultar inglés)</label>
    </div>
    <div class="dialogue ${practiceScript ? "practice" : ""}">${dialogueHtml(a.script)}</div>
    <div class="row between stage-nav">
      ${prev ? `<a class="btn ghost small" href="#/ampolletas/${prev.id}">← ${esc(prev.name)}</a>` : "<span></span>"}
      ${next ? `<a class="btn small" href="#/ampolletas/${next.id}">${esc(next.name)} →</a>` : `<a class="btn small" href="#/ampolletas">Terminar ✓</a>`}
    </div>`;
}

// ---------- Natura Bissé: guía de producto en español e inglés (js/natura.js) ----------
const NB = typeof NATURA !== "undefined" ? NATURA : { categories: [], products: [] };
const nbCat = (id) => NB.categories.find((c) => c.id === id) || { es: id, en: id };
const titulo = (s) => s.replace(/\b([A-ZÁÉÍÓÚÑ])([A-ZÁÉÍÓÚÑ'’]+)\b/g, (m, a, b) => a + b.toLowerCase()).replace(/\bNb·/g, "NB·").replace(/\bC\+c\b/g, "C+C").replace(/\bSpf\b/g, "SPF").replace(/\bPa\+\+\+/g, "PA+++").replace(/\bS\.o\.s\b/gi, "S.O.S").replace(/\bA\.h\.a\b/gi, "A.H.A").replace(/\bP\.h\.a\b/gi, "P.H.A");

function viewNatura() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/productos-belleza">← Productos de belleza</a>
    <section class="script-hero" style="background-image:url('images/natura-portada/portada.jpg')">
      <div class="script-hero-text">
        <p class="script-kicker">Natura Bissé · Retail México · Español / English</p>
        <h1>Guía de producto</h1>
        <p>Los ${NB.products.length} productos de la guía, con sus beneficios e ingredientes en español e inglés.</p>
      </div>
    </section>
    <input id="nb-search" class="search" type="search" placeholder="Buscar producto o ingrediente…" autocomplete="off">
    <div id="nb-list">${nbLista(NB.products)}</div>
    <a class="btn ghost full" href="#/material/natura-bisse">📄 Ver la guía original (PDF, en español)</a>
    <a class="btn ghost full center" href="#/productos-belleza">← Volver a Productos de belleza</a>`;
}

function nbLista(products) {
  if (!products.length) return `<p class="muted">No se encontraron productos.</p>`;
  return NB.categories
    .map((c, n) => {
      const ps = products.filter((p) => p.cat === c.id);
      if (!ps.length) return "";
      return `<p class="chips-label">${esc(c.es)} · <em>${esc(c.en)}</em></p>
        <div class="grid menu nb-grid">${ps.map((p) => `<a class="tile colored" style="--c:${colorPorIndice(n)}" href="#/natura/${p.id}">
          <img class="nb-thumb" src="${esc(p.img)}" alt="" loading="lazy"><span class="tile-title">${esc(titulo(p.name))}</span></a>`).join("")}</div>`;
    })
    .join("");
}


function viewNaturaProducto(id) {
  const i = NB.products.findIndex((p) => p.id === id);
  if (i < 0) return viewNatura();
  const p = NB.products[i];
  const c = nbCat(p.cat);
  const color = colorPorIndice(NB.categories.indexOf(c));
  const prev = NB.products[i - 1], next = NB.products[i + 1];
  const lista = (items) => `<ul class="amp-list">${items.map((x) => `<li>${bilingueAudio(x.es, x.en)}</li>`).join("")}</ul>`;
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/natura">← Guía Natura Bissé</a>
    <section class="card amp-card" style="--c:${color}">
      <img class="amp-photo nb-photo" src="${esc(p.img)}" alt="${esc(p.name)}">
      <div>
        <p class="label">${esc(c.es)} · ${esc(c.en)}</p>
        <h2 class="stage-title">${esc(titulo(p.name))}</h2>
        ${p.tagline ? `<div class="muted">${bilingueAudio(p.tagline.es, p.tagline.en)}</div>` : ""}
        <div class="row">${speakButtons(titulo(p.name))}</div>
      </div>
    </section>
    <section class="card">
      <p class="label">💛 ¿Por qué te encantará? · Why you'll love it</p>
      ${lista(p.benefits)}
    </section>
    ${p.howTo.length ? `<section class="card"><p class="label">🧴 Cómo se usa · How to use</p>${lista(p.howTo)}</section>` : ""}
    ${p.tip ? `<section class="card tip"><p class="label">💡 Pro tip</p>${bilingueAudio(p.tip.es, p.tip.en)}</section>` : ""}
    <section class="card">
      <p class="label">🔬 ¿Cómo actúa? · How it works</p>
      <table class="amp-table">${p.ingredients.map((g) => `<tr><th>${bilingue(g.es, g.en)}</th><td>${bilingueAudio(g.descEs, g.descEn, `${g.en}. ${g.descEn}.`)}</td></tr>`).join("")}</table>
    </section>
    <a class="btn ghost small" href="#/material/natura-bisse">📄 Ver en la guía original · página ${p.page}</a>
    <div class="row between stage-nav">
      ${prev ? `<a class="btn ghost small" href="#/natura/${prev.id}">← ${esc(titulo(prev.name))}</a>` : "<span></span>"}
      ${next ? `<a class="btn small" href="#/natura/${next.id}">${esc(titulo(next.name))} →</a>` : `<a class="btn small" href="#/natura">Terminar ✓</a>`}
    </div>`;
}

// ---------- Valet de spa ----------
const VALET_VOC = typeof VALET_VOCAB !== "undefined" ? VALET_VOCAB : [];

// Lista de vocabulario con pronunciación, traducción y audio (valet y concierge).
// Foto de una palabra (js/images.js), sin importar mayúsculas.
const fotoDe = (en) => PHOTOS[en] || PHOTOS[en.toLowerCase()];

const vocabFilas = (words) => `<section class="card valet-vocab">${words.map(
  (w) => `<div class="valet-word">${
    fotoDe(w.en) ? `<img class="vocab-foto" src="${esc(fotoDe(w.en).src)}" alt="" loading="lazy" data-foto="${esc(fotoDe(w.en).src)}" data-en="${esc(w.en)}" data-es="${esc(w.es)}" data-pron="${esc(w.pron || "")}">` : ""
  }<div class="vocab-txt"><b>${esc(w.en)}</b>${w.pron ? ` <small class="muted">${esc(w.pron)}</small>` : ""}<br><span>🇲🇽 ${esc(w.es)}</span>${
    w.ex ? `<p class="vocab-ex"><span class="vocab-ex-en">💬 ${esc(w.ex)} <span class="vocab-ex-play">${speakButtons(w.ex)}</span></span><span class="muted">🇲🇽 ${esc(w.exEs)}</span></p>` : ""
  }</div><div class="row">${speakButtons(w.en)}</div></div>`
).join("")}</section>`;

function viewValet() {
  const V = PROGRAMAS["valet-script"], H = PROGRAMAS.hidroterapia;
  const m = MATERIAL["valet-spa"];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">${vidFondo("valet")}
      <div class="script-hero-text">
        <p class="script-kicker">Spa Valet · Spa Attendant · Estándares AAA</p>
        <h1>Valet de spa</h1>
        <p>Atención al huésped en vestidores, lockers, amenidades y áreas húmedas. Principio clave: <em>“Everything has been taken care of.”</em></p>
      </div>
    </section>
    ${V.stages.length ? `<a class="script-banner" href="#/valet-script" style="background-image:url('${V.portada}')">
      <span class="script-banner-text"><small>${esc(V.kicker)}</small><b>${esc(V.titulo)}</b><span>${V.stages.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>` : ""}
    ${H.stages.length ? `<a class="script-banner" href="#/hidroterapia" style="background-image:url('${H.portada}')">
      <span class="script-banner-text"><small>${esc(H.kicker)}</small><b>${esc(H.titulo)}</b><span>${H.stages.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>` : ""}
    ${VALET_VOC.length ? `<h2 class="section-title">Vocabulario esencial · ${VALET_VOC.length} palabras</h2>
    ${vocabFilas(VALET_VOC)}` : ""}
    <h2 class="section-title">Material original</h2>
    <div class="amp-docs"><a class="amp-doc" href="#/material/valet-spa"><img src="images/material/valet-spa/p01.jpg" alt="" loading="lazy">
      <span><b>${esc(m.title)}</b><small>${esc(m.subtitle)} · ${m.pages} páginas</small></span></a></div>
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

// ---------- Gym del spa (js/gym-script.js) ----------
const GYM_VOC = typeof GYM_VOCAB !== "undefined" ? GYM_VOCAB : [];
const GYM_GRP = typeof GYM_GRUPOS !== "undefined" ? GYM_GRUPOS : [];
// Portada: la foto del gimnasio del vocabulario (cuando exista); si no, un degradado.
const portadaGym = () => (fotoDe("Fitness Center") ? `background-image:url('${fotoDe("Fitness Center").src}')` : "background:linear-gradient(135deg,#2f6b8a,#5b3f78)");

// Partes del vocabulario del gym: equipo (de "Cardio area" a "Disinfectant wipes" + el equipo de las presentaciones)
// y el resto de los términos del entrenamiento.
const GYM_PH = typeof GYM_PHRASAL !== "undefined" ? GYM_PHRASAL : [];
const GYM_EQ = typeof GYM_EQUIPOS !== "undefined" ? GYM_EQUIPOS : [];
const GYM_CU = typeof GYM_CUERPO !== "undefined" ? GYM_CUERPO : [];
function gymPartes() {
  const a = GYM_VOC.findIndex((w) => w.en === "Cardio area"), b = GYM_VOC.findIndex((w) => w.en === "Disinfectant wipes");
  const equipoPres = (GYM_GRP.find((g) => g.title === "Gym equipment") || { words: [] }).words;
  return {
    equipo: [...GYM_VOC.slice(a, b + 1), ...equipoPres],
    terminos: [...GYM_VOC.slice(0, a), ...GYM_VOC.slice(b + 1)],
    grupos: GYM_GRP.filter((g) => g.title !== "Gym equipment"),
  };
}
const fondoFoto = (palabra, degradado) => (fotoDe(palabra) ? `background-image:url('${fotoDe(palabra).src}')` : `background:${degradado}`);

function viewGym() {
  const G = PROGRAMAS["gym-script"], P = gymPartes();
  const recuadro = (href, fondo, titulo, sub) =>
    `<a class="script-banner" href="${href}" style="${fondo}"><span class="script-banner-text"><b>${titulo}</b><span>${sub}</span></span></a>`;
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">${vidFondo("gym")}
      <div class="script-hero-text">
        <p class="script-kicker">Gym Trainer · Fitness Center · Estándares AAA</p>
        <h1>Gym del spa</h1>
        <p>Inglés para el entrenador: recibir al huésped, explicar los equipos, dar instrucciones seguras y recomendar el spa. Principio de servicio: <em>“Create a personalized wellness experience and make every guest feel cared for.”</em></p>
      </div>
    </section>
    <div class="inicio-grid">
      <a class="script-banner con-video" href="#/gym-script">${vidFondo("gym")}
        <span class="script-banner-text"><b>🏋️ ${esc(G.titulo)}</b><span>${G.stages.length} pasos con audio</span></span></a>
      ${recuadro("#/gym-equipo", fondoFoto("Treadmill", "linear-gradient(135deg,#2f6b8a,#1f3d55)"), "🚴 Equipo del gym", `${P.equipo.length} equipos con foto y audio`)}
      ${recuadro("#/gym-instrucciones", fondoFoto("Dumbbells", "linear-gradient(135deg,#7b5e8c,#2f8a7a)"), "📣 Instrucciones de uso", `${GYM_PH.length} phrasal verbs y cómo usar ${GYM_EQ.length} equipos`)}
      ${recuadro("#/gym-cuerpo", "background-image:url('images/anatomia/musculos.jpg')", "💪 Partes del cuerpo", `${GYM_CU.length} partes y grupos musculares`)}
      ${recuadro("#/gym-vocab", fondoFoto("Workout", "linear-gradient(135deg,#c98a2e,#7b5e8c)"), "📚 Vocabulario del entrenamiento", `${P.terminos.length + P.grupos.reduce((n, g) => n + g.words.length, 0)} palabras: términos, ejercicios, verbos y calentamiento`)}
    </div>
    <h2 class="section-title">Material original</h2>
    <div class="amp-docs">${["gym-workouts", "gym-equipment", "gym-verbs"].map((id) => {
      const m = MATERIAL[id];
      return `<a class="amp-doc" href="#/material/${id}"><img src="images/material/${id}/p01.jpg" alt="" loading="lazy">
        <span><b>${esc(m.title)}</b><small>${esc(m.subtitle)} · ${m.pages} páginas</small></span></a>`;
    }).join("")}</div>
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

function viewGymSub(cual) {
  const P = gymPartes();
  const cab = (titulo, sub) => `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/gym">← Gym del spa</a>
    <h2 class="section-title">${titulo}</h2><p class="muted">${sub}</p>`;
  const pie = `<a class="btn ghost full center" href="#/gym">← Volver a Gym del spa</a>`;
  if (cual === "equipo")
    return `${cab("🚴 Equipo del gym", `${P.equipo.length} equipos. Toca la foto para verla en grande y escucharla.`)}${vocabFilas(P.equipo)}${pie}`;
  if (cual === "cuerpo")
    return `${cab("💪 Partes del cuerpo", "Las partes del cuerpo y los grupos musculares que se trabajan en el gym.")}
      <div class="inicio-grid"><a class="script-banner" href="#/anatomia/musculos" style="background-image:url('images/anatomia/musculos.jpg')">
        <span class="script-banner-text"><b>🫀 Lámina del sistema muscular</b><span>Los músculos numerados en inglés y español</span></span></a></div>
      ${vocabFilas(GYM_CU)}${pie}`;
  if (cual === "vocab")
    return `${cab("📚 Vocabulario del entrenamiento", "Términos del entrenador, ejercicios, verbos y calentamiento.")}
      <h3 class="piel-sub">Términos del entrenamiento · ${P.terminos.length}</h3>${vocabFilas(P.terminos)}
      ${P.grupos.map((g) => `<h3 class="piel-sub">${esc(g.titleEs)} · ${g.words.length}</h3><p class="muted">🇺🇸 ${esc(g.title)}</p>${vocabFilas(g.words)}`).join("")}${pie}`;
  // Instrucciones de uso: phrasal verbs y cada equipo con sus pasos y beneficios
  return `${cab("📣 Instrucciones de uso del equipo", "Primero los phrasal verbs para dar instrucciones; después, cómo usar cada equipo y sus beneficios.")}
    <h3 class="piel-sub">Phrasal verbs para dar instrucciones · ${GYM_PH.length}</h3>
    ${vocabFilas(GYM_PH)}
    <h3 class="piel-sub">Cómo usar cada equipo · ${GYM_EQ.length}</h3>
    ${GYM_EQ.map((q, k) => {
      const f = fotoDe(q.foto);
      return `<section class="card gym-eq" style="--c:${colorPorIndice(k)}">
        <div class="gym-eq-cab">${f ? `<img class="vocab-foto" src="${esc(f.src)}" alt="" loading="lazy" data-foto="${esc(f.src)}" data-en="${esc(q.en)}" data-es="${esc(q.es)}">` : ""}
          <div class="bi-audio"><span class="bi"><b>🇺🇸 ${esc(q.en)}</b><span>🇲🇽 ${esc(q.es)}</span></span><div class="row">${speakButtons(q.en)}</div></div></div>
        <p class="label">🧭 Cómo se usa · How to use it</p>
        <ol class="gym-pasos">${q.pasos.map((x) => `<li>${bilingueAudio(x.es, x.en)}</li>`).join("")}</ol>
        <p class="label">✨ Beneficios · Benefits</p>
        <ul class="gym-pasos">${q.beneficios.map((x) => `<li>${bilingueAudio(x.es, x.en)}</li>`).join("")}</ul>
      </section>`;
    }).join("")}${pie}`;
}

// ---------- Spa Concierge ----------
const CONC_VOC = typeof CONCIERGE_VOCAB !== "undefined" ? CONCIERGE_VOCAB : [];
const CONC_KPIS = typeof CONCIERGE_KPIS !== "undefined" ? CONCIERGE_KPIS : [];

function viewConcierge() {
  const C = PROGRAMAS["concierge-script"], H = PROGRAMAS.hidroterapia;
  const m = MATERIAL["spa-concierge"];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">${vidFondo("concierge")}
      <div class="script-hero-text">
        <p class="script-kicker">Spa Concierge · Professional Sales &amp; Guest Experience</p>
        <h1>Spa Concierge</h1>
        <p>Venta consultiva y recomendaciones centradas en el huésped: masajes, hidroterapia y tratamientos de bienestar, sin presión y sin promesas médicas.</p>
      </div>
    </section>
    <a class="script-banner" href="#/concierge-script" style="background-image:url('${C.portada}')">
      <span class="script-banner-text"><small>${esc(C.kicker)}</small><b>${esc(C.titulo)}</b><span>${C.stages.length} pasos con audio, del saludo al cierre</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>
    ${H.stages.length ? `<a class="script-banner" href="#/hidroterapia" style="background-image:url('${H.portada}')">
      <span class="script-banner-text"><small>${esc(H.kicker)}</small><b>${esc(H.titulo)}</b><span>${H.stages.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>` : ""}
    ${CONC_VOC.map((g) => `<h2 class="section-title">${esc(g.titleEs)} · ${g.words.length}</h2>
    <p class="muted">🇺🇸 ${esc(g.title)}</p>
    ${vocabFilas(g.words)}`).join("")}
    ${CONC_KPIS.length ? `<h2 class="section-title">Indicadores de ventas (KPI)</h2>
    <section class="card valet-vocab">${CONC_KPIS.map(
      (k) => `<div class="valet-word"><div><b>${esc(k.en)}</b><br><span>🇲🇽 ${esc(k.es)}</span><br><small class="muted">${esc(k.formula)}</small></div><div class="row">${speakButtons(k.en)}</div></div>`
    ).join("")}</section>` : ""}
    <h2 class="section-title">Material original</h2>
    <div class="amp-docs"><a class="amp-doc" href="#/material/spa-concierge"><img src="images/material/spa-concierge/p01.jpg" alt="" loading="lazy">
      <span><b>${esc(m.title)}</b><small>${esc(m.subtitle)} · ${m.pages} páginas</small></span></a></div>
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

// ---------- Anatomía del cuerpo humano (js/anatomia.js) ----------
const ANAT = typeof ANATOMIA !== "undefined" ? ANATOMIA : [];

function viewAnatomia() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/vocabularios">← Vocabularios</a>
    <section class="script-hero anat-hero" style="background-image:url('images/anatomia/musculos.jpg')">
      <div class="script-hero-text">
        <p class="script-kicker">Human anatomy · Inglés / Español</p>
        <h1>Anatomía del cuerpo humano</h1>
        <p>Las partes del cuerpo y todos sus sistemas en ${ANAT.length} láminas. Toca un número para ver y escuchar su nombre en inglés.</p>
      </div>
    </section>
    <div class="grid menu">${ANAT.map(
      (l, n) => `<a class="tile colored anat-tile" style="--c:${colorPorIndice(n)}" href="#/anatomia/${l.id}">
        <img class="anat-thumb" src="${esc(l.img)}" alt="" loading="lazy">
        <span class="tile-title">${esc(l.titulo)}</span>
        <small class="muted">${esc(l.title)} · ${l.partes.length} partes</small></a>`
    ).join("")}
    ${PIEL_D ? `<a class="tile colored anat-tile" style="--c:${colorPorIndice(ANAT.length)}" href="#/la-piel">
        <img class="anat-thumb" src="images/anatomia/piel.jpg" alt="" loading="lazy">
        <span class="tile-title">La piel: tipos, colores y afecciones</span>
        <small class="muted">Skin types, tones and conditions</small></a>` : ""}</div>
    <a class="btn ghost full center" href="#/vocabularios">← Volver a Vocabularios</a>`;
}

function viewLamina(id) {
  const i = ANAT.findIndex((l) => l.id === id);
  if (i < 0) return viewAnatomia();
  const l = ANAT[i], prev = ANAT[i - 1], next = ANAT[i + 1];
  const c = colorPorIndice(i);
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/anatomia">← Anatomía</a>
    <h2 class="section-title anat-title" style="color:${c}"><span>${l.icon}</span> ${esc(l.titulo)}</h2>
    <p class="muted">🇺🇸 ${esc(l.title)} · ${l.partes.length} partes. Toca un número para escuchar su nombre.</p>
    <div class="anat-tools"><button id="anat-zoom" class="btn ghost">🔍 Ampliar la imagen</button></div>
    <div class="anat-scroll"><div class="anat${l.h > l.w * 1.6 ? " alta" : ""}" style="aspect-ratio:${l.w} / ${l.h};--c:${c}">
      <img src="${esc(l.img)}" alt="${esc(l.titulo)}">
      ${l.partes.map((p, n) => `<button class="anat-pin" data-pin="${n}" data-speak="${esc(p.en)}" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(p.en)}">${n + 1}</button>`).join("")}
    </div></div>
    <div id="anat-sel" class="anat-sel muted">👆 Toca un número de la imagen</div>
    <ol class="anat-lista" style="--c:${c}">${l.partes.map(
      (p, n) => `<li data-fila="${n}"><span class="anat-num">${n + 1}</span><div class="anat-txt"><b>🇺🇸 ${esc(p.en)}</b><span>🇲🇽 ${esc(p.es)}</span></div><div class="row">${speakButtons(p.en)}</div></li>`
    ).join("")}</ol>
    <p class="anat-credito">${esc(l.credito)}</p>
    <div class="row between stage-nav">
      ${prev ? `<a class="btn ghost small" href="#/anatomia/${prev.id}">← ${esc(prev.titulo)}</a>` : "<span></span>"}
      ${next ? `<a class="btn small" href="#/anatomia/${next.id}">${esc(next.titulo)} →</a>` : `<a class="btn small" href="#/anatomia">Terminar ✓</a>`}
    </div>`;
}

// ---------- La piel: tipos, colores y afecciones (js/piel.js) ----------
const PIEL_D = typeof PIEL !== "undefined" ? PIEL : null;
const NIVELES = {
  ok: { icono: "✅", texto: "Se puede tratar", en: "Can be treated" },
  precaucion: { icono: "⚠️", texto: "Con precaución", en: "With caution" },
  evitar: { icono: "⛔", texto: "Evitar o no tratar", en: "Avoid / do not treat" },
};

function afeccionesLista(lista) {
  if (!lista.length) return `<p class="muted">No se encontraron afecciones.</p>`;
  return lista
    .map((a) => {
      const foto = PHOTOS[a.en.toLowerCase()];
      return `<div class="piel-af nivel-${a.nivel}">
        ${foto ? `<img class="piel-af-img" src="${esc(foto.src)}" alt="" loading="lazy" data-foto="${esc(foto.src)}" data-en="${esc(a.en)}" data-es="${esc(a.es)}">` : `<span class="piel-af-img vacia">${NIVELES[a.nivel].icono}</span>`}
        <div class="piel-af-txt">
          <div class="bi-audio"><span class="bi"><b>🇺🇸 ${esc(a.en)}</b><span>🇲🇽 ${esc(a.es)}</span></span><div class="row">${speakButtons(a.en)}</div></div>
          <span class="piel-nivel">${NIVELES[a.nivel].icono} ${NIVELES[a.nivel].texto} · <em>${NIVELES[a.nivel].en}</em></span>
          ${bilingueAudio(a.nota.es, a.nota.en)}
        </div>
      </div>`;
    })
    .join("");
}

function viewPiel() {
  const P = PIEL_D;
  const capas = ANAT.find((l) => l.id === "piel");
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/vocabularios">← Vocabularios</a>
    <section class="script-hero anat-hero" style="background-image:url('images/anatomia/piel.jpg')">
      <div class="script-hero-text">
        <p class="script-kicker">Skin · Inglés / Español</p>
        <h1>La piel</h1>
        <p>Capas de la piel, tipos de piel, colores y ${P.afecciones.length} afecciones, con lo que debe hacer la terapeuta en cada caso.</p>
      </div>
    </section>
    <div class="piel-nav">
      <button data-ir="piel-capas">🖐️ Capas</button><button data-ir="piel-tipos">🧴 Tipos</button>
      <button data-ir="piel-colores">🎨 Colores</button><button data-ir="piel-afecciones">🩹 Afecciones</button><button data-ir="piel-frases">💬 Frases</button>
    </div>

    <h2 class="section-title" id="piel-capas">🖐️ Capas y estructura de la piel</h2>
    ${capas ? `<a class="script-banner piel-banner" href="#/anatomia/piel" style="background-image:url('${capas.img}')">
      <span class="script-banner-text"><small>Skin: layers and structure</small><b>Lámina de la piel</b><span>${capas.partes.length} partes: epidermis, dermis, hipodermis, glándulas y receptores</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>` : ""}

    <h2 class="section-title" id="piel-tipos">🧴 Tipos de piel · Skin types</h2>
    <div class="piel-tipos">${P.tipos.map(
      (t, n) => `<section class="card piel-tipo" style="--c:${colorPorIndice(n)}">
        <div class="bi-audio"><span class="bi"><b>${t.icon} 🇺🇸 ${esc(t.en)}</b><span>🇲🇽 ${esc(t.es)}</span></span><div class="row">${speakButtons(t.en)}</div></div>
        ${bilingueAudio(t.desc.es, t.desc.en)}
        <p class="label">💡 En el spa · At the spa</p>
        ${bilingueAudio(t.tip.es, t.tip.en)}
      </section>`
    ).join("")}</div>

    <h2 class="section-title" id="piel-colores">🎨 Colores de piel (fototipos) · Skin tones</h2>
    <p class="muted">De la piel más clara a la más oscura, y cómo reacciona cada una al sol.</p>
    <div class="piel-colores">${P.fototipos.map(
      (f) => `<div class="piel-color"><span class="piel-foto"><img src="${f.img}" alt="${esc(f.es)}" loading="lazy"><span class="piel-muestra" style="background:${f.color}"></span></span>
        <div class="piel-af-txt">
          <div class="bi-audio"><span class="bi"><b>🇺🇸 ${esc(f.en)}</b><span>🇲🇽 ${esc(f.es)}</span></span><div class="row">${speakButtons(f.en)}</div></div>
          ${bilingueAudio(f.desc.es, f.desc.en)}
        </div></div>`
    ).join("")}</div>
    <h3 class="piel-sub">Subtonos y otras palabras para describir el color</h3>
    <div class="piel-colores">${P.tonos.map(
      (f) => `<div class="piel-color"><span class="piel-foto"><img src="${f.img}" alt="${esc(f.es)}" loading="lazy"><span class="piel-muestra" style="background:${f.color}"></span></span>
        <div class="piel-af-txt">
          <div class="bi-audio"><span class="bi"><b>🇺🇸 ${esc(f.en)}</b><span>🇲🇽 ${esc(f.es)}</span></span><div class="row">${speakButtons(f.en)}</div></div>
          ${bilingueAudio(f.desc.es, f.desc.en)}
        </div></div>`
    ).join("")}</div>

    <h2 class="section-title" id="piel-afecciones">🩹 Afecciones de la piel · Skin conditions</h2>
    <div class="piel-filtros">
      <button class="on" data-nivel="">Todas (${P.afecciones.length})</button>
      ${Object.entries(NIVELES).map(([k, v]) => `<button data-nivel="${k}">${v.icono} ${v.texto} (${P.afecciones.filter((a) => a.nivel === k).length})</button>`).join("")}
    </div>
    <input id="piel-buscar" class="search" type="search" placeholder="Buscar afección en inglés o español…" autocomplete="off">
    <div id="piel-af-lista">${afeccionesLista(P.afecciones)}</div>
    <p class="anat-credito">Orientación general para el spa; ante cualquier duda, seguir el protocolo del spa y consultar a la supervisora o al médico.</p>

    <h2 class="section-title" id="piel-frases">💬 Frases para la consulta · Useful phrases</h2>
    <section class="card">${P.frases.map((f) => bilingueAudio(f.es, f.en)).join("")}</section>
    <a class="btn ghost full center" href="#/vocabularios">← Volver a Vocabularios</a>`;
}

// Marca una parte de la lámina: su número en la imagen, su fila en la lista y el recuadro de abajo.
function marcarParte(n, desdeLista) {
  const l = ANAT.find((x) => x.id === location.hash.split("/")[2]);
  if (!l) return;
  const p = l.partes[n];
  document.querySelectorAll(".anat-pin.on, .anat-lista li.on").forEach((e) => e.classList.remove("on"));
  const pin = document.querySelector(`.anat-pin[data-pin="${n}"]`);
  const fila = document.querySelector(`.anat-lista li[data-fila="${n}"]`);
  pin && pin.classList.add("on");
  fila && fila.classList.add("on");
  $("#anat-sel").classList.remove("muted");
  $("#anat-sel").innerHTML = `<span class="anat-num">${n + 1}</span><span class="anat-txt"><b>🇺🇸 ${esc(p.en)}</b><span>🇲🇽 ${esc(p.es)}</span></span><span class="row">${speakButtons(p.en)}</span>`;
  if (desdeLista && pin) pin.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

function viewMaterial(id) {
  const m = MATERIAL[id];
  if (!m) return viewAmpolletas();
  const pages = Array.from({ length: m.pages }, (_, k) => `images/material/${id}/p${String(k + 1).padStart(2, "0")}.jpg`);
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="${m.volver || "#/ampolletas"}">${m.volverTexto || "← Venta de ampolletas"}</a>
    ${id === "natura-bisse" ? `<a class="btn full center" href="#/natura">🇺🇸 Ver la versión en español e inglés</a>` : ""}
    <h2 class="section-title">${esc(m.title)}</h2>
    <p class="muted">${esc(m.subtitle)} · ${m.pages} páginas. Toca una página para verla en grande.</p>
    <div class="material-pages">${pages.map((src, k) => `<img src="${src}" alt="Página ${k + 1}" loading="lazy" data-sheet="${src}" data-title="${esc(m.title)} · página ${k + 1}">`).join("")}</div>`;
}

// ---------- Pruebas de listening y writing de cada vocabulario ----------
// Listening: se escucha la palabra y se elige entre 4 opciones. Writing: se ve en español y se escribe en inglés.
// El resultado va al reporte de uso (evento "quiz") y cada error como "miss".
const MODOS = {
  listening: { icono: "🎧", nombre: "Listening", desc: "Escucha la palabra y elige cuál es" },
  writing: { icono: "✍️", nombre: "Writing", desc: "Lee la palabra en español y escríbela en inglés" },
};
const PREGUNTAS_POR_PRUEBA = 10;
let prueba = null;

const barajar = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const leerMejor = (clave) => {
  try {
    return JSON.parse(localStorage.getItem(`mejor:${clave}`) || "null");
  } catch {
    return null;
  }
};
const guardarMejor = (clave, r) => {
  try {
    const m = leerMejor(clave);
    if (!m || r.aciertos / r.total > m.aciertos / m.total) localStorage.setItem(`mejor:${clave}`, JSON.stringify(r));
  } catch {}
};

function nuevaPrueba(cat, modo) {
  const preguntas = barajar(cat.words).slice(0, Math.min(PREGUNTAS_POR_PRUEBA, cat.words.length));
  return {
    clave: `${cat.id}/${modo}`, cat, modo, i: 0, aciertos: 0, respondida: null, fallas: [],
    preguntas: preguntas.map((w) => ({
      w,
      opciones: modo === "listening" ? barajar([w, ...barajar(cat.words.filter((x) => x.en !== w.en)).slice(0, 3)]) : null,
    })),
  };
}

// Normaliza una respuesta escrita: sin mayúsculas, acentos, signos ni espacios de más.
const normalizar = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();

function respuestasValidas(en) {
  const v = new Set();
  const agregar = (t) => {
    const n = normalizar(t);
    if (!n) return;
    v.add(n);
    v.add(n.replace(/^(to|a|an|the) /, ""));
  };
  agregar(en);
  agregar(en.replace(/\([^)]*\)/g, ""));
  en.split("/").forEach(agregar);
  return [...v];
}

function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// "ok" = correcta, "casi" = un pequeño error de ortografía (cuenta como correcta), "mal" = incorrecta.
function revisarEscrita(escrito, en) {
  const n = normalizar(escrito);
  if (!n) return "mal";
  const validas = respuestasValidas(en);
  if (validas.includes(n)) return "ok";
  const tolerancia = (t) => (t.length >= 30 ? 3 : t.length >= 12 ? 2 : t.length >= 5 ? 1 : 0);
  return validas.some((v) => distancia(n, v) <= tolerancia(v)) ? "casi" : "mal";
}

function botonesPrueba(cat) {
  return `<div class="prueba-botones">${Object.entries(MODOS)
    .map(([modo, m]) => {
      const mejor = leerMejor(`${cat.id}/${modo}`);
      return `<a class="prueba-boton" href="#/practica/${cat.id}/${modo}"><span class="prueba-icono">${m.icono}</span>
        <span><b>Prueba de ${m.nombre}</b><small>${m.desc}${mejor ? ` · Mejor: ${mejor.aciertos}/${mejor.total}` : ""}</small></span></a>`;
    })
    .join("")}</div>`;
}

function viewPruebas() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">${vidFondo("pruebas")}
      <div class="script-hero-text"><p class="script-kicker">Listening · Writing</p>
      <h1>🎧✍️ Pruebas de listening y writing</h1>
      <p>Elige un vocabulario. En cada prueba hay ${PREGUNTAS_POR_PRUEBA} preguntas al azar.</p></div></section>
    ${VOCAB.map(
      (c) => `<section class="card prueba-cat">
        <h3 class="cat-head" style="color:${colorCategoria(c.id)}">${catIcon(c, "md", colorCategoria(c.id))}<span>${esc(c.title)} <span class="muted">· ${c.words.length} palabras</span></span></h3>
        ${botonesPrueba(c)}</section>`
    ).join("")}
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

function viewPrueba(catId, modo) {
  const cat = VOCAB.find((c) => c.id === catId);
  if (!cat || !MODOS[modo]) return viewPruebas();
  if (!prueba || prueba.clave !== `${cat.id}/${modo}`) prueba = nuevaPrueba(cat, modo);
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/${cat.id}">← ${esc(cat.title)}</a>
    <h2 class="section-title cat-head" style="color:${colorCategoria(cat.id)}">${catIcon(cat, "md", colorCategoria(cat.id))}<span>${MODOS[modo].icono} Prueba de ${MODOS[modo].nombre} <span class="muted">· ${esc(cat.title)}</span></span></h2>
    <div id="prueba">${pruebaHtml()}</div>`;
}

function pruebaHtml() {
  const P = prueba, total = P.preguntas.length;
  if (P.i >= total) return resultadoHtml();
  const { w, opciones } = P.preguntas[P.i];
  const r = P.respondida;
  const avance = `<div class="prueba-avance"><span>Pregunta ${P.i + 1} de ${total}</span><span>✓ ${P.aciertos}</span></div>
    <div class="progress"><div style="width:${(P.i / total) * 100}%"></div></div>`;
  const foto = PHOTOS[w.en] ? `<img class="prueba-foto" src="${esc(PHOTOS[w.en].src)}" alt="" loading="lazy">` : "";
  const siguiente = r ? `<button id="prueba-sig" class="btn full center">${P.i + 1 < total ? "Siguiente →" : "Ver mi resultado"}</button>` : "";
  if (P.modo === "listening") {
    return `${avance}
      <section class="card prueba-card">
        <p class="label">🎧 Escucha y elige la palabra que oíste</p>
        <div class="prueba-escuchar">
          <button class="btn prueba-play" data-speak="${esc(w.en)}">🔊 Escuchar</button>
          <button class="btn ghost" data-speak="${esc(w.en)}" data-slow>🐢 Despacio</button>
        </div>
        <div class="prueba-opciones">${opciones
          .map((o, k) => {
            const cls = !r ? "" : o.en === w.en ? "bien" : r.elegida === o.en ? "mal" : "apagada";
            return `<button class="prueba-opcion ${cls}" data-opcion="${k}" ${r ? "disabled" : ""}>${esc(o.en)}</button>`;
          })
          .join("")}</div>
        ${r ? `<div class="prueba-retro ${r.ok ? "bien" : "mal"}">${r.ok ? "✓ ¡Correcto!" : `✗ Era: <b>${esc(w.en)}</b>`}<span>🇲🇽 ${esc(w.es)}</span></div>${foto}` : ""}
      </section>${siguiente}`;
  }
  return `${avance}
    <section class="card prueba-card">
      <p class="label">✍️ Escribe en inglés</p>
      <p class="prueba-es">🇲🇽 ${esc(w.es)}</p>
      ${foto}
      <input id="prueba-texto" class="search prueba-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
        placeholder="Escribe aquí en inglés…" value="${r ? esc(r.escrito) : ""}" ${r ? "disabled" : ""}>
      ${r ? "" : `<div class="row between"><button id="prueba-pista" class="btn ghost small">💡 Pista</button><button id="prueba-revisar" class="btn small">Revisar ✓</button></div>
        <p id="prueba-pista-txt" class="muted prueba-pista"></p>`}
      ${r ? `<div class="prueba-retro ${r.ok ? "bien" : "mal"}">${
        r.ok ? (r.casi ? `✓ ¡Casi perfecto! Revisa la ortografía: <b>${esc(w.en)}</b>` : "✓ ¡Correcto!") : `✗ La respuesta es: <b>${esc(w.en)}</b>`
      }<div class="row">${speakButtons(w.en)}</div></div>` : ""}
    </section>${siguiente}`;
}

function resultadoHtml() {
  const P = prueba, total = P.preguntas.length, pct = Math.round((P.aciertos / total) * 100);
  const otro = P.modo === "listening" ? "writing" : "listening";
  const msg = pct === 100 ? "¡Perfecto! 🌟" : pct >= 80 ? "¡Muy bien! 👏" : pct >= 60 ? "¡Bien! Sigue practicando 💪" : "Repasa el vocabulario y vuelve a intentarlo 📚";
  return `<section class="card prueba-final">
      <p class="prueba-puntos">${P.aciertos} / ${total}</p>
      <div class="progress"><div style="width:${pct}%"></div></div>
      <p class="prueba-msg">${pct}% · ${msg}</p>
    </section>
    ${P.fallas.length ? `<h3 class="piel-sub">Palabras para repasar</h3>
      <div class="prueba-fallas">${P.fallas
        .map((w) => `<div class="valet-word"><div><b>🇺🇸 ${esc(w.en)}</b><br><span>🇲🇽 ${esc(w.es)}</span></div><div class="row">${speakButtons(w.en)}</div></div>`)
        .join("")}</div>` : ""}
    <button id="prueba-repetir" class="btn full center">🔁 Repetir la prueba</button>
    <a class="btn ghost full center" href="#/practica/${P.cat.id}/${otro}">${MODOS[otro].icono} Hacer la prueba de ${MODOS[otro].nombre}</a>
    <a class="btn ghost full center" href="#/${P.cat.id}">← Volver a ${esc(P.cat.title)}</a>`;
}

function responderPrueba(ok, datos) {
  const P = prueba, w = P.preguntas[P.i].w;
  P.respondida = { ok, ...datos };
  if (ok) P.aciertos++;
  else {
    P.fallas.push(w);
    USO.track("miss", { item: w.en, category: P.cat.title });
  }
  if (P.modo === "listening") speak(w.en);
  pintarPrueba();
}

function pintarPrueba() {
  const P = prueba;
  $("#prueba").innerHTML = pruebaHtml();
  if (P.i >= P.preguntas.length) {
    $("#prueba-repetir").onclick = () => {
      prueba = nuevaPrueba(P.cat, P.modo);
      pintarPrueba();
    };
    return;
  }
  const sig = $("#prueba-sig");
  if (sig) {
    sig.onclick = () => {
      P.i++;
      P.respondida = null;
      if (P.i >= P.preguntas.length) {
        const r = { aciertos: P.aciertos, total: P.preguntas.length };
        guardarMejor(P.clave, r);
        USO.track("quiz", { category: P.cat.title, item: MODOS[P.modo].nombre, score: r.aciertos, total: r.total });
      }
      pintarPrueba();
      window.scrollTo(0, 0);
      if (P.modo === "listening" && P.i < P.preguntas.length) speak(P.preguntas[P.i].w.en);
    };
    sig.focus();
  }
  const { w } = P.preguntas[P.i];
  document.querySelectorAll(".prueba-opcion").forEach(
    (b) => (b.onclick = () => {
      const elegida = P.preguntas[P.i].opciones[+b.dataset.opcion].en;
      responderPrueba(elegida === w.en, { elegida });
    })
  );
  const input = $("#prueba-texto");
  if (input && !P.respondida) {
    const revisar = () => {
      if (!input.value.trim()) return input.focus();
      const res = revisarEscrita(input.value, w.en);
      responderPrueba(res !== "mal", { escrito: input.value, casi: res === "casi" });
    };
    $("#prueba-revisar").onclick = revisar;
    input.onkeydown = (e) => e.key === "Enter" && revisar();
    $("#prueba-pista").onclick = () => {
      $("#prueba-pista-txt").textContent = `Empieza con "${w.en.charAt(0)}" y tiene ${w.en.replace(/[^A-Za-z]/g, "").length} letras: ${w.en.replace(/[A-Za-z]/g, (c, k) => (k === 0 ? c : "_"))}`;
    };
    input.focus();
  }
}

// ---------- Vocabularios: todas las categorías y los vocabularios de las secciones ----------
function viewVocabularios() {
  const tarjeta = (href, icono, titulo, sub) =>
    `<a class="prueba-boton" href="${href}"><span class="prueba-icono">${icono}</span><span><b>${titulo}</b><small>${sub}</small></span></a>`;
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">${vidFondo("vocabularios")}
      <div class="script-hero-text"><p class="script-kicker">Inglés / Español · Audio e imágenes</p>
        <h1>📚 Vocabularios</h1><p>${VOCAB.length} categorías con audio, ejemplos e imágenes. Toca una para estudiarla.</p></div>
    </section>
    <div class="inicio-grid">
      ${ANAT.length ? `<a class="script-banner" href="#/anatomia" style="background-image:url('images/anatomia/musculos.jpg')">
        <span class="script-banner-text"><b>🫀 Anatomía del cuerpo humano</b><span>${ANAT.length} láminas con partes numeradas</span></span></a>` : ""}
      ${PIEL_D ? `<a class="script-banner piel-banner" href="#/la-piel" style="background-image:url('images/anatomia/piel.jpg')">
        <span class="script-banner-text"><b>🖐️ La piel</b><span>Capas, tipos, colores y ${PIEL_D.afecciones.length} afecciones</span></span></a>` : ""}
    </div>
    <input id="search" class="search" type="search" placeholder="Buscar una palabra en inglés o español…" autocomplete="off">
    <div id="word-list">${menu()}</div>
    <h2 class="section-title">Vocabularios de las secciones</h2>
    <div class="prueba-botones">
      ${VALET_VOC.length ? tarjeta("#/vocab-valet", "🧺", "Valet de spa", `${VALET_VOC.length} palabras: servicio y artículos del spa`) : ""}
      ${GYM_VOC.length ? tarjeta("#/gym", "🏋️", "Gym del spa", `${GYM_VOC.length + GYM_GRP.reduce((n, g) => n + g.words.length, 0)} palabras: equipo, ejercicios, verbos y calentamiento`) : ""}
      ${CONC_VOC.length ? tarjeta("#/vocab-concierge", "🛎️", "Spa Concierge", `${CONC_VOC.reduce((n, g) => n + g.words.length, 0)} palabras de ventas y técnicas de masaje`) : ""}
      ${tarjeta("#/pruebas", "🎧✍️", "Pruebas de listening y writing", "Practica cada vocabulario")}
    </div>
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

function viewVocabSeccion(cual) {
  const valet = cual === "valet";
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/vocabularios">← Vocabularios</a>
    <h2 class="section-title">${valet ? "🧺 Vocabulario esencial · Valet de spa" : "🛎️ Vocabulario del Spa Concierge"}</h2>
    ${valet
      ? `<p class="muted">${VALET_VOC.length} palabras. Toca la foto para verla en grande y escucharla.</p>${vocabFilas(VALET_VOC)}`
      : CONC_VOC.map((g) => `<h3 class="piel-sub">${esc(g.titleEs)} · ${g.words.length}</h3><p class="muted">🇺🇸 ${esc(g.title)}</p>${vocabFilas(g.words)}`).join("")}
    <a class="btn ghost full center" href="#/vocabularios">← Volver a Vocabularios</a>`;
}

// ---------- Productos de belleza · Venta (ampolletas BABOR y Natura Bissé) ----------
function viewProductos() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Inicio</a>
    <section class="script-hero con-video">
      <video class="banner-video" src="videos/productos/ampolletas.mp4" poster="videos/productos/ampolletas.jpg" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>
      <div class="script-hero-text">
        <p class="script-kicker">BABOR · Natura Bissé · Español / English</p>
        <h1>Productos de belleza · Venta</h1>
        <p>Fichas de producto en español e inglés y scripts para recomendar y vender a los huéspedes.</p>
      </div>
    </section>
    <div class="inicio-grid">
    ${AMPS.length ? `<a class="script-banner" href="#/ampolletas" style="background-image:url('images/ampolletas/portada.jpg')">
      <span class="script-banner-text"><small>BABOR Ampoule Bar 2026 · Español / English</small><b>Venta de ampolletas</b><span>${AMPS.length} productos con ficha y script de venta</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${NB.products.length ? `<a class="script-banner" href="#/natura" style="background-image:url('images/natura-portada/portada.jpg')">
      <span class="script-banner-text"><small>Natura Bissé · Retail México · Español / English</small><b>Guía de producto</b><span>${NB.products.length} productos con beneficios e ingredientes</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    </div>
    <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
}

function view(catId) {
  const [ruta0, clave0] = catId.split("/");
  if (catId === "pruebas") return viewPruebas();
  if (catId === "vocabularios") return viewVocabularios();
  if (catId === "vocab-valet") return viewVocabSeccion("valet");
  if (catId === "vocab-concierge") return viewVocabSeccion("concierge");
  if (ruta0 === "practica") return viewPrueba(clave0, catId.split("/")[2]);
  if (PROGRAMAS[ruta0] && PROGRAMAS[ruta0].stages.length) return viewScript(clave0, ruta0);
  if (catId === "valet") return viewValet();
  if (catId === "concierge") return viewConcierge();
  if (catId === "gym") return viewGym();
  if (["gym-equipo", "gym-instrucciones", "gym-cuerpo", "gym-vocab"].includes(catId)) return viewGymSub(catId.slice(4));
  if (catId === "anatomia") return viewAnatomia();
  if (catId === "la-piel" && PIEL_D) return viewPiel();
  if (catId.startsWith("anatomia/")) return viewLamina(catId.split("/")[1]);
  if (catId === "productos-belleza") return viewProductos();
  if (catId === "ampolletas") return viewAmpolletas();
  if (catId.startsWith("ampolletas/")) return viewAmpolleta(catId.split("/")[1]);
  if (catId.startsWith("material/")) return viewMaterial(catId.split("/")[1]);
  if (catId === "natura") return viewNatura();
  if (catId.startsWith("natura/")) return viewNaturaProducto(catId.split("/")[1]);
  const cat = VOCAB.find((c) => c.id === catId);
  currentWords = cat ? cat.words : [];
  const search = `<input id="search" class="search" type="search" placeholder="Buscar en inglés o español…" autocomplete="off">`;
  if (cat) {
    const learned = cat.words.filter((w) => known.has(w.en)).length;
    return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/vocabularios">← Vocabularios</a>
    ${search}
    <h2 class="section-title cat-head" style="color:${colorCategoria(cat.id)}">${catIcon(cat, "md", colorCategoria(cat.id))}<span>${esc(cat.title)} <span class="muted">· ${learned} de ${cat.words.length}</span></span></h2>
    ${botonesPrueba(cat)}
    <div id="word-list">${wordList(cat.words)}</div>
    <a class="btn ghost full center" href="#/vocabularios">← Volver a Vocabularios</a>
    <a class="float-back" href="#/vocabularios" aria-label="Volver a Vocabularios">← Vocabularios</a>`;
  }
  const pct = Math.round((known.size / ALL_WORDS.length) * 100);
  return `${BRANDS}
    ${USO.badge()}
    <section class="hero con-video app-hero">${vidFondo("app")}
      ${catIcon({ id: "spa", icon: "🪷" }, "hero-icon")}
      <div>
        <h1>SPA Service Excellence App</h1>
        <p>Inglés y servicio de excelencia para el equipo del spa.</p>
      </div>
    </section>

    <section class="card">
      <div class="progress"><div style="width:${pct}%"></div></div>
      <p class="muted">${known.size} de ${ALL_WORDS.length} palabras marcadas como aprendidas</p>
    </section>

    <div class="inicio-grid">
    <a class="script-banner vocab-banner con-video" href="#/vocabularios">${vidFondo("vocabularios")}
      <span class="script-banner-text"><small>Inglés / Español · Audio e imágenes</small><b>📚 Vocabularios</b><span>${VOCAB.length} categorías · ${ALL_WORDS.length} palabras, más el vocabulario del Valet y del Spa Concierge</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>
    ${STAGES.length ? `<a class="script-banner con-video" href="#/script">${vidFondo("script")}
      <span class="script-banner-text"><small>Programa de servicio · Estándares AAA</small><b>Script de servicio Terapeuta</b><span>De la bienvenida a la despedida · ${STAGES.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${AMPS.length || NB.products.length ? `<a class="script-banner con-video" href="#/productos-belleza">
      <video class="banner-video" src="videos/productos/ampolletas.mp4" poster="videos/productos/ampolletas.jpg" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>
      <span class="script-banner-text"><small>BABOR · Natura Bissé · Español / English</small><b>Productos de belleza · Venta</b><span>${AMPS.length} ampolletas con script de venta y ${NB.products.length} productos Natura Bissé</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${PROGRAMAS["valet-script"].stages.length ? `<a class="script-banner con-video" href="#/valet">${vidFondo("valet")}
      <span class="script-banner-text"><small>Spa Valet · Estándares AAA</small><b>Valet de spa</b><span>Script de ${PROGRAMAS["valet-script"].stages.length} pasos, vocabulario y material</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${PROGRAMAS["concierge-script"].stages.length ? `<a class="script-banner con-video" href="#/concierge">${vidFondo("concierge")}
      <span class="script-banner-text"><small>Spa Concierge · Ventas y bienestar</small><b>Spa Concierge</b><span>Script de ${PROGRAMAS["concierge-script"].stages.length} pasos, vocabulario de ventas y KPI</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${GYM_VOC.length ? `<a class="script-banner con-video" href="#/gym">${vidFondo("gym")}
      <span class="script-banner-text"><small>Gym Trainer · Estándares AAA</small><b>Gym del spa</b><span>Script de ${PROGRAMAS["gym-script"].stages.length} pasos, ${GYM_VOC.length + GYM_GRP.reduce((n, g) => n + g.words.length, 0)} palabras y material</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    <a class="script-banner inicio-pruebas con-video" href="#/pruebas">${vidFondo("pruebas")}
      <span class="script-banner-text"><small>Listening · Writing</small><b>🎧✍️ Pruebas</b><span>Escucha y elige, o escribe en inglés</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>
    </div>
`;
}

function render() {
  const catId = location.hash.replace(/^#\/?/, "");
  const id = decodeURIComponent(catId);
  $("#app").innerHTML = view(id);
  if (id.startsWith("practica/")) {
    if (VOCAB.some((c) => c.id === id.split("/")[1])) {
      prueba = nuevaPrueba(VOCAB.find((c) => c.id === id.split("/")[1]), id.split("/")[2]);
      pintarPrueba();
    }
    return;
  }
  if (id === "pruebas") return;
  const viewed = VOCAB.find((c) => c.id === id);
  if (viewed) USO.track("category", { category: viewed.title });
  window.scrollTo(0, 0);
  const [programa, etapa] = id.split("/");
  if (PROGRAMAS[programa] && PROGRAMAS[programa].stages.length) {
    const st = PROGRAMAS[programa].stages.find((x) => x.id === etapa);
    if (!st) return; // menú de los pasos
    USO.track("script", { category: programa === "script" ? `Script de servicio: ${st.titleEs}` : `${PROGRAMAS[programa].titulo}: ${st.titleEs}` });
    $("#play-stage").onclick = () => speakAll(st.lines.map((l) => l.en));
    $("#practice-toggle").onchange = (e) => {
      practiceScript = e.target.checked;
      $(".dialogue").classList.toggle("practice", practiceScript);
    };
    return;
  }
  if (id === "la-piel") {
    USO.track("category", { category: "La piel: tipos, colores y afecciones" });
    let nivel = "";
    const pintar = () => {
      const q = $("#piel-buscar").value.trim().toLowerCase();
      $("#piel-af-lista").innerHTML = afeccionesLista(
        PIEL_D.afecciones.filter((a) => (!nivel || a.nivel === nivel) && (!q || `${a.en} ${a.es}`.toLowerCase().includes(q)))
      );
    };
    $("#piel-buscar").oninput = pintar;
    document.querySelectorAll(".piel-filtros button").forEach(
      (b) =>
        (b.onclick = () => {
          nivel = b.dataset.nivel;
          document.querySelectorAll(".piel-filtros button").forEach((x) => x.classList.toggle("on", x === b));
          pintar();
        })
    );
    document.querySelectorAll("[data-ir]").forEach((b) => (b.onclick = () => document.getElementById(b.dataset.ir).scrollIntoView({ behavior: "smooth" })));
    return;
  }
  if (id === "anatomia" || id.startsWith("anatomia/")) {
    const l = ANAT.find((x) => x.id === id.split("/")[1]);
    USO.track("category", { category: l ? `Anatomía: ${l.titulo}` : "Anatomía del cuerpo humano" });
    const z = $("#anat-zoom");
    if (z)
      z.onclick = () => {
        const on = $(".anat-scroll").classList.toggle("zoom");
        z.textContent = on ? "↩︎ Ver la imagen completa" : "🔍 Ampliar la imagen";
      };
    document.querySelectorAll(".anat-pin").forEach((b) => (b.onclick = () => marcarParte(+b.dataset.pin)));
    document.querySelectorAll(".anat-lista li").forEach((li) => (li.onclick = (e) => !e.target.closest("button") && marcarParte(+li.dataset.fila, true)));
    return;
  }
  if (id.startsWith("gym-") && !id.startsWith("gym-script")) {
    USO.track("category", { category: `Gym del spa: ${{ "gym-equipo": "Equipo", "gym-instrucciones": "Instrucciones de uso", "gym-cuerpo": "Partes del cuerpo", "gym-vocab": "Vocabulario" }[id]}` });
    return;
  }
  if (id === "valet" || id === "concierge" || id === "gym" || id === "productos-belleza") {
    USO.track("category", { category: { valet: "Valet de spa", concierge: "Spa Concierge", gym: "Gym del spa", "productos-belleza": "Productos de belleza" }[id] });
    return;
  }
  if (id === "natura" || id.startsWith("natura/")) {
    const p = NB.products.find((x) => x.id === id.split("/")[1]);
    USO.track("category", { category: p ? `Natura Bissé: ${titulo(p.name)}` : "Natura Bissé" });
    const s = $("#nb-search");
    if (s)
      s.oninput = () => {
        const q = s.value.trim().toLowerCase();
        const hit = (p) => [p.name, ...p.benefits.flatMap((b) => [b.es, b.en]), ...p.ingredients.flatMap((g) => [g.es, g.en])].some((t) => t.toLowerCase().includes(q));
        $("#nb-list").innerHTML = nbLista(q ? NB.products.filter(hit) : NB.products);
      };
    return;
  }
  if (id === "ampolletas" || id.startsWith("ampolletas/") || id.startsWith("material/")) {
    const [ruta, clave] = id.split("/");
    const a = ruta === "ampolletas" ? AMPS.find((x) => x.id === clave) : null;
    USO.track("category", {
      category: ruta === "material" ? `Material: ${(MATERIAL[clave] || {}).title || clave}` : a ? `Venta de ampolletas: ${a.name}` : "Venta de ampolletas",
    });
    if (a) {
      $("#play-stage").onclick = () => speakAll(a.script.map((l) => l.en));
      $("#practice-toggle").onchange = (e) => {
        practiceScript = e.target.checked;
        $(".dialogue").classList.toggle("practice", practiceScript);
      };
    }
    return;
  }
  if (id === "vocabularios" || id.startsWith("vocab-")) USO.track("category", { category: id === "vocabularios" ? "Vocabularios" : `Vocabularios: ${id === "vocab-valet" ? "Valet de spa" : "Spa Concierge"}` });
  if (!$("#search")) return;
  const onMenu = !VOCAB.some((c) => c.id === id);
  $("#search").oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q && onMenu) return ($("#word-list").innerHTML = menu());
    const matches = q ? ALL_WORDS.filter((w) => w.en.toLowerCase().includes(q) || w.es.toLowerCase().includes(q)) : currentWords;
    $("#word-list").innerHTML = wordList(matches);
  };
}

// Clics delegados para los botones que se repiten en toda la página
document.addEventListener("click", (e) => {
  const speakBtn = e.target.closest("[data-speak]");
  if (speakBtn) {
    if (playQueue) playQueue.stop = true;
    return speak(speakBtn.dataset.speak, speakBtn.hasAttribute("data-slow"));
  }

  const hidden = e.target.closest(".practice .line");
  if (hidden && !e.target.closest("button")) hidden.classList.toggle("revealed");

  // Foto de una palabra: tarjeta con la foto, la palabra, su pronunciación y su traducción; suena la palabra.
  const foto = e.target.closest("[data-foto]");
  if (foto) {
    const { en, es, pron } = foto.dataset;
    const box = document.createElement("div");
    box.className = "lightbox tarjeta-foto";
    box.innerHTML = `<div class="tarjeta"><img src="${esc(foto.dataset.foto)}" alt="">
      <p class="en">${esc(en)}</p>${pron ? `<p class="pron">${esc(pron)}</p>` : ""}<p class="es">${esc(es)}</p>
      <div class="row">${speakButtons(en)}</div><p class="cerrar">Toca fuera de la tarjeta para cerrar</p></div>`;
    box.onclick = (ev) => !ev.target.closest(".tarjeta") && box.remove();
    document.body.appendChild(box);
    speak(en);
    return;
  }

  const zoom = e.target.closest("[data-zoom]");
  if (zoom) {
    const w = ALL_WORDS.find((x) => x.en === zoom.dataset.zoom);
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img src="${esc(PHOTOS[w.en].src)}" alt=""><p>🇺🇸 ${esc(w.en)}</p><p class="es">${esc(w.es)}</p>`;
    box.onclick = () => box.remove();
    document.body.appendChild(box);
    speak(w.en);
    return;
  }

  // Ficha técnica completa: se ve a lo ancho de la pantalla; al tocarla se amplía a tamaño real para leer la letra chica.
  const sheetBtn = e.target.closest("[data-sheet]");
  if (sheetBtn) {
    const view = document.createElement("div");
    view.className = "sheet-view";
    view.innerHTML = `
      <div class="sheet-bar"><span>${esc(sheetBtn.dataset.title)} · toca la ficha para ampliar</span><button class="icon-btn" aria-label="Cerrar">✕</button></div>
      <img src="${esc(sheetBtn.dataset.sheet)}" alt="Ficha técnica: ${esc(sheetBtn.dataset.title)}">`;
    view.querySelector("button").onclick = () => view.remove();
    view.querySelector("img").onclick = () => view.classList.toggle("zoomed");
    document.body.appendChild(view);
    return;
  }

  const knownBtn = e.target.closest("[data-known]");
  if (knownBtn) {
    toggleKnown(knownBtn.dataset.known);
    const isKnown = known.has(knownBtn.dataset.known);
    knownBtn.textContent = isKnown ? "✅" : "⬜";
    knownBtn.closest(".word").classList.toggle("is-known", isKnown);
  }
});

// El botón flotante para volver a las categorías aparece al bajar por la lista de palabras.
window.addEventListener("scroll", () => {
  const btn = $(".float-back");
  const nearEnd = window.scrollY + window.innerHeight > document.body.scrollHeight - 160; // ahí ya se ve el botón del final
  if (btn) btn.classList.toggle("show", window.scrollY > 500 && !nearEnd);
});

window.addEventListener("hashchange", render);

// Modo sin internet (sw.js): solo en la app publicada con https (o en localhost para probar).
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
USO.start({ knownWords: () => [...known].map((en) => ({ item: en, category: categoryOf(en) })) });
window.addEventListener("uso-login", render); // muestra el nombre del colega en cuanto entra
render();
