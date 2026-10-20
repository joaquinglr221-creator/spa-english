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
const BRANDS = USO.hotel
  ? `
    <header class="brands">
      <img src="images/logos/secrets-riviera-cancun.png" alt="Secrets Riviera Cancún Resort & Spa">
      <img src="images/logos/breathless-riviera-cancun.png" alt="Breathless Riviera Cancún Resort & Spa">
      <img src="images/logos/world-of-hyatt-inclusive-collection.svg" alt="World of Hyatt Inclusive Collection">
    </header>`
  : "";

// ---------- Scripts de servicio por etapas ----------
// Script de servicio AAA (js/service-script.js), hidroterapia (js/hydro-script.js) y valet de spa
// (js/valet-script.js): mismas vistas, cada uno con su ruta, portada y textos.
const STAGES = typeof SERVICE_SCRIPT !== "undefined" ? SERVICE_SCRIPT : [];
const VIDEOS = typeof SCRIPT_VIDEOS !== "undefined" ? SCRIPT_VIDEOS : {}; // js/videos.js (solo el script de servicio)
let practiceScript = false;
const WHO = { therapist: "Therapist · Terapeuta", guest: "Guest · Huésped", valet: "Spa Valet · Valet de spa" };

const PROGRAMAS = {
  script: {
    stages: STAGES, icono: "script", portada: "images/script/portada.jpg", titulo: "Script de servicio",
    kicker: "Programa de servicio · Estándares AAA", standardsLabel: "⭐ Estándares AAA",
    desc: "La experiencia completa de la terapeuta con el huésped, de la bienvenida a la despedida.",
    flow: "Welcome → Recognize → Discover → Anticipate → Personalize → Deliver → Follow up → Farewell",
  },
  hidroterapia: {
    stages: typeof HYDRO_SCRIPT !== "undefined" ? HYDRO_SCRIPT : [], icono: "instalaciones", portada: "images/script/hidroterapia.jpg",
    titulo: "Script de hidroterapia", kicker: "Circuito de hidroterapia · Seguridad y servicio", standardsLabel: "⭐ Pautas y seguridad",
    desc: "Cómo recibir, orientar y cuidar al huésped en cada estación del circuito de hidroterapia.",
    flow: "Warm shower → Sauna → Cold shower → Steam room → Cold plunge → Vitality pool → Whirlpool → Relaxation lounge",
  },
  "valet-script": {
    stages: typeof VALET_SCRIPT !== "undefined" ? VALET_SCRIPT : [], icono: "amenidades", portada: "images/script/valet.jpg",
    titulo: "Script del valet de spa", kicker: "Spa Valet · Estándares AAA", standardsLabel: "⭐ Estándares AAA",
    desc: "El servicio del valet de spa: bienvenida, lockers, amenidades, áreas del spa y despedida.",
    flow: "Welcome → Recognize → Anticipate → Assist → Explain → Personalize → Follow up → Farewell",
    volver: "#/valet", volverTexto: "← Valet de spa",
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
    <a class="back" href="${P.volver || "#/"}">${P.volverTexto || "← Todas las categorías"}</a>
    <section class="script-hero" style="background-image:url('${P.portada}')">
      <div class="script-hero-text">
        <p class="script-kicker">${esc(P.kicker)}</p>
        <h1>${esc(P.titulo)}</h1>
        <p>${esc(P.desc)}</p>
      </div>
    </section>
    <div class="script-facts">
      <span><b>${S.length}</b> pasos</span>
      <span><b>${S.reduce((n, st) => n + st.lines.length, 0)}</b> frases con audio</span>
      <span><b>${S.reduce((n, st) => n + st.standards.length, 0)}</b> ${programa === "hidroterapia" ? "pautas" : "estándares AAA"}</span>
      ${videos ? `<span><b>${videos}</b> ${videos === 1 ? "video" : "videos"}</span>` : ""}
    </div>
    <p class="script-flow">${esc(P.flow)}</p>
    <a class="btn full center" href="#/${programa}/${S[0].id}">▶ Comenzar con el Paso 1</a>
    <h2 class="section-title">Los ${S.length} pasos</h2>
    <div class="grid menu">${S.map(
      (st, n) => `<a class="tile colored" style="--c:${colorPorIndice(n)}" href="#/${programa}/${st.id}">${stageIcon(st, "", programa)}<small class="step-num">Paso ${n + 1}</small><span class="tile-title">${esc(st.titleEs)}</span><small class="muted">${esc(st.title)}</small></a>`
    ).join("")}</div>
    <a class="btn ghost full center" href="${P.volver || "#/"}">${P.volverTexto || "← Volver a las categorías"}</a>`;
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

// Material original: páginas de los PDF convertidas en imágenes (images/material/).
const MATERIAL = {
  "ampoule-bar": { title: "BABOR Ampoule Bar 2026", subtitle: "Presentación de ampolletas para terapeutas", pages: 7 },
  "natura-bisse": { title: "Natura Bissé · Guía de producto", subtitle: "Retail México (en español)", pages: 26 },
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
    <a class="back" href="#/">← Todas las categorías</a>
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
    <a class="btn ghost full center" href="#/">← Volver a las categorías</a>`;
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
    <a class="back" href="#/">← Todas las categorías</a>
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
    <a class="btn ghost full center" href="#/">← Volver a las categorías</a>`;
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

function viewValet() {
  const V = PROGRAMAS["valet-script"], H = PROGRAMAS.hidroterapia;
  const m = MATERIAL["valet-spa"];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Todas las categorías</a>
    <section class="script-hero" style="background-image:url('images/script/valet.jpg')">
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
    <section class="card valet-vocab">${VALET_VOC.map(
      (w) => `<div class="valet-word"><div><b>${esc(w.en)}</b> <small class="muted">${esc(w.pron)}</small><br><span>🇲🇽 ${esc(w.es)}</span></div><div class="row">${speakButtons(w.en)}</div></div>`
    ).join("")}</section>` : ""}
    <h2 class="section-title">Material original</h2>
    <div class="amp-docs"><a class="amp-doc" href="#/material/valet-spa"><img src="images/material/valet-spa/p01.jpg" alt="" loading="lazy">
      <span><b>${esc(m.title)}</b><small>${esc(m.subtitle)} · ${m.pages} páginas</small></span></a></div>
    <a class="btn ghost full center" href="#/">← Volver a las categorías</a>`;
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

function view(catId) {
  const [ruta0, clave0] = catId.split("/");
  if (PROGRAMAS[ruta0] && PROGRAMAS[ruta0].stages.length) return viewScript(clave0, ruta0);
  if (catId === "valet") return viewValet();
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
    <a class="back" href="#/">← Todas las categorías</a>
    ${search}
    <h2 class="section-title cat-head" style="color:${colorCategoria(cat.id)}">${catIcon(cat, "md", colorCategoria(cat.id))}<span>${esc(cat.title)} <span class="muted">· ${learned} de ${cat.words.length}</span></span></h2>
    <div id="word-list">${wordList(cat.words)}</div>
    <a class="btn ghost full center" href="#/">← Volver a las categorías</a>
    <a class="float-back" href="#/" aria-label="Volver a las categorías">← Categorías</a>`;
  }
  const pct = Math.round((known.size / ALL_WORDS.length) * 100);
  return `${BRANDS}
    ${USO.badge()}
    <section class="hero">
      ${catIcon({ id: "spa", icon: "🪷" }, "hero-icon")}
      <div>
        <h1>English for Spa Therapists</h1>
        <p>Vocabulario de spa en inglés para estudiar a tu ritmo.</p>
      </div>
    </section>

    <section class="card">
      <div class="progress"><div style="width:${pct}%"></div></div>
      <p class="muted">${known.size} de ${ALL_WORDS.length} palabras marcadas como aprendidas</p>
    </section>

    ${search}
    ${STAGES.length ? `<a class="script-banner" href="#/script" style="background-image:url('images/script/portada.jpg')">
      <span class="script-banner-text"><small>Programa de servicio · Estándares AAA</small><b>Script de servicio</b><span>De la bienvenida a la despedida · ${STAGES.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${AMPS.length ? `<a class="script-banner" href="#/ampolletas" style="background-image:url('images/ampolletas/portada.jpg')">
      <span class="script-banner-text"><small>BABOR Ampoule Bar 2026 · Español / English</small><b>Venta de ampolletas</b><span>${AMPS.length} productos con ficha y script de venta</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${PROGRAMAS.hidroterapia.stages.length ? `<a class="script-banner" href="#/hidroterapia" style="background-image:url('images/script/hidroterapia.jpg')">
      <span class="script-banner-text"><small>Circuito de hidroterapia · Seguridad y servicio</small><b>Script de hidroterapia</b><span>Del recibimiento a la despedida · ${PROGRAMAS.hidroterapia.stages.length} pasos con audio</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${PROGRAMAS["valet-script"].stages.length ? `<a class="script-banner" href="#/valet" style="background-image:url('images/script/valet.jpg')">
      <span class="script-banner-text"><small>Spa Valet · Estándares AAA</small><b>Valet de spa</b><span>Script de ${PROGRAMAS["valet-script"].stages.length} pasos, vocabulario y material</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    ${NB.products.length ? `<a class="script-banner" href="#/natura" style="background-image:url('images/natura-portada/portada.jpg')">
      <span class="script-banner-text"><small>Natura Bissé · Retail México · Español / English</small><b>Guía de producto</b><span>${NB.products.length} productos con beneficios e ingredientes</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span>
    </a>` : ""}
    <h2 class="section-title">Categorías</h2>
    <div id="word-list">${menu()}</div>`;
}

function render() {
  const catId = location.hash.replace(/^#\/?/, "");
  const id = decodeURIComponent(catId);
  $("#app").innerHTML = view(id);
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
  if (id === "valet") {
    USO.track("category", { category: "Valet de spa" });
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
