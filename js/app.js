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
  const saved = store.get("voice", null);
  englishVoice = englishVoices.find((v) => v.voiceURI === saved) || englishVoices[0] || null;
  const picker = $("#voice");
  if (picker) picker.outerHTML = voicePicker();
}
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Audios pregrabados con la voz Ava (Premium); los genera scripts/generar_audios.py.
const RECORDED = typeof AUDIO_FILES !== "undefined" ? AUDIO_FILES : {};
const HAS_RECORDED = Object.keys(RECORDED).length > 0;
let useRecorded = HAS_RECORDED && store.get("voice", "recorded") === "recorded";
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

function voicePicker() {
  const usable = englishVoices.filter((v) => voiceScore(v) > -1000);
  const list = usable.length ? usable : englishVoices;
  if (!list.length && !HAS_RECORDED) return `<p class="muted" id="voice">No se encontraron voces en inglés en este dispositivo.</p>`;
  return `
    <select id="voice">
      ${HAS_RECORDED ? `<option value="recorded" ${useRecorded ? "selected" : ""}>Ava · voz grabada (recomendada)</option>` : ""}
      ${list
        .map((v) => `<option value="${esc(v.voiceURI)}" ${!useRecorded && v === englishVoice ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`)
        .join("")}
    </select>`;
}

function speak(text, slow = false) {
  if (text) USO.track("audio", { item: text.slice(0, 120) });
  const clean = spokenText(text);
  if (currentAudio) currentAudio.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  const key = audioKey(clean);
  if (useRecorded && RECORDED[key]) {
    currentAudio = new Audio(`audio/${RECORDED[key]}/${key}.m4a`);
    currentAudio.playbackRate = slow ? 0.7 : 1;
    currentAudio.play().catch(() => speakWithDevice(clean, slow));
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
const catIcon = (c, size = "") =>
  `<span class="cat-icon ${size}" aria-hidden="true">${
    CAT_ICONS[c.id] ? `<svg viewBox="0 0 24 24">${CAT_ICONS[c.id]}</svg>` : c.icon
  }</span>`;

// Secciones del menú de inicio; una categoría nueva que no esté aquí aparece en "Otras".
const MENU_GROUPS = [
  { title: "Spa y cabina", ids: ["cuerpo", "tratamientos", "masajes", "tecnicas", "verbos", "posiciones", "productos", "aromas", "instalaciones", "amenidades", "bienestar"] },
  { title: "Salud y seguridad", ids: ["salud", "encuesta", "malestares", "piel"] },
  { title: "Salón y barbería", ids: ["barberia", "peinados", "coloracion"] },
  { title: "Recepción y hotel", ids: ["recepcion", "hotel"] },
];

function menuTile(c) {
  const learned = c.words.filter((w) => known.has(w.en)).length;
  const pct = Math.round((learned / c.words.length) * 100);
  return `<a class="tile ${pct === 100 ? "is-done" : ""}" href="#/${c.id}">${catIcon(c)}<span class="tile-title">${esc(c.title)}</span><small class="muted">${learned} de ${c.words.length}</small><span class="cat-bar"><span style="width:${pct}%"></span></span></a>`;
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

// ---------- Script de servicio (js/service-script.js) ----------
const STAGES = typeof SERVICE_SCRIPT !== "undefined" ? SERVICE_SCRIPT : [];
let practiceScript = false;
const WHO = { therapist: "Therapist · Terapeuta", guest: "Guest · Huésped" };

const stageIcon = (st, size) => catIcon({ id: `st-${st.id}`, icon: st.icon }, size);

// Sin etapa: las 11 etapas en recuadros, como el menú de categorías.
function viewScriptMenu() {
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Todas las categorías</a>
    <h2 class="section-title cat-head">${catIcon({ id: "script", icon: "📜" }, "md")}<span>Script de servicio AAA</span></h2>
    <p class="muted">Guion de la terapeuta, de la bienvenida a la despedida. Elige un paso; cada uno tiene los estándares AAA y el diálogo con audio.</p>
    <div class="grid menu">${STAGES.map(
      (st, n) => `<a class="tile" href="#/script/${st.id}">${stageIcon(st)}<small class="step-num">Paso ${n + 1}</small><span class="tile-title">${esc(st.titleEs)}</span><small class="muted">${esc(st.title)}</small></a>`
    ).join("")}</div>
    <a class="btn ghost full center" href="#/">← Volver a las categorías</a>`;
}

function viewScript(stageId) {
  if (!stageId) return viewScriptMenu();
  const i = Math.max(0, STAGES.findIndex((st) => st.id === stageId));
  const st = STAGES[i];
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
  const prev = STAGES[i - 1], next = STAGES[i + 1];
  return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/script">← Los 11 pasos del script</a>
    <section class="card">
      <div class="cat-head">${stageIcon(st, "md")}<div>
        <p class="label">Paso ${i + 1} de ${STAGES.length}</p>
        <h2 class="stage-title">${esc(st.title)}</h2>
        <p class="muted">${esc(st.titleEs)}</p>
      </div></div>
      <div class="standards">
        <p class="label">⭐ Estándares AAA</p>
        <ul>${st.standards.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>
    </section>
    ${st.video ? `<video class="stage-video" controls playsinline preload="metadata" src="${esc(st.video)}#t=0.5"></video>` : ""}
    <div class="row between">
      <button class="btn small" id="play-stage">▶ Escuchar todo el diálogo</button>
      <label class="toggle"><input type="checkbox" id="practice-toggle" ${practiceScript ? "checked" : ""}> Modo práctica (ocultar inglés)</label>
    </div>
    <div class="dialogue ${practiceScript ? "practice" : ""}">${lines}</div>
    <div class="row between stage-nav">
      ${prev ? `<a class="btn ghost small" href="#/script/${prev.id}">← ${esc(prev.titleEs)}</a>` : "<span></span>"}
      ${next ? `<a class="btn small" href="#/script/${next.id}">${esc(next.titleEs)} →</a>` : `<a class="btn small" href="#/script">Terminar ✓</a>`}
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

function view(catId) {
  if (catId === "script" || catId.startsWith("script/")) return viewScript(catId.split("/")[1]);
  const cat = VOCAB.find((c) => c.id === catId);
  currentWords = cat ? cat.words : [];
  const search = `<input id="search" class="search" type="search" placeholder="Buscar en inglés o español…" autocomplete="off">`;
  if (cat) {
    const learned = cat.words.filter((w) => known.has(w.en)).length;
    return `${BRANDS}
    ${USO.badge()}
    <a class="back" href="#/">← Todas las categorías</a>
    ${search}
    <h2 class="section-title cat-head">${catIcon(cat, "md")}<span>${esc(cat.title)} <span class="muted">· ${learned} de ${cat.words.length}</span></span></h2>
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
      <details class="settings">
        <summary>🔊 Voz de los audios</summary>
        <div class="field">${voicePicker()}</div>
      </details>
    </section>

    ${search}
    ${STAGES.length ? `<a class="script-cta" href="#/script">${catIcon({ id: "script", icon: "📜" })}<span><b>Script de servicio AAA</b><small>Guion de la bienvenida a la despedida, con audio y modo práctica</small></span><span class="script-cta-go">→</span></a>` : ""}
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
  if (id === "script" || id.startsWith("script/")) {
    const st = STAGES.find((x) => x.id === id.split("/")[1]);
    if (!st) return; // menú de los 11 pasos
    USO.track("script", { category: `Script de servicio: ${st.titleEs}` });
    $("#play-stage").onclick = () => speakAll(st.lines.map((l) => l.en));
    $("#practice-toggle").onchange = (e) => {
      practiceScript = e.target.checked;
      $(".dialogue").classList.toggle("practice", practiceScript);
    };
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

document.addEventListener("change", (e) => {
  if (e.target.id !== "voice") return;
  useRecorded = e.target.value === "recorded";
  englishVoice = englishVoices.find((v) => v.voiceURI === e.target.value) || englishVoice;
  store.set("voice", e.target.value);
  speak("Welcome to our spa.");
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
