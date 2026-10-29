// Tareas asignadas por el instructor.
// - El instructor (entra con su enlace/QR, ver scripts/qr_instructor.py) asigna tareas y califica las entregas.
// - Cada colaborador ve "Mis tareas" en el inicio, las resuelve en la app y las entrega.
// Todo se guarda en una hoja de Google del instructor (hojas "Tareas", "Entregas" y "Grupos"), por medio de un
// Apps Script con el mismo código del registro de uso (scripts/google-apps-script/registro-uso.gs, función tareas_).
// Usa funciones de js/app.js (esc, speak, speakButtons, toggleKnown, VOCAB, PROGRAMAS…), que se cargan después.
const TAREAS = (() => {
  // App web de Apps Script de las tareas (un proyecto aparte del registro de uso; mismo código, registro-uso.gs).
  const URL_TAREAS = "https://script.google.com/macros/s/AKfycbwcWG8fq1A4pbNZvqrHGBhNL6SYdNR3jJPTi6QKB_DhFRnDOUH8Vy4ogMXD55TccE4lFQ/exec";
  const TIPOS = {
    vocab: { icono: "📚", nombre: "Estudiar vocabulario" },
    prueba: { icono: "🎧", nombre: "Prueba de listening / writing" },
    script: { icono: "🎭", nombre: "Practicar el script" },
    voz: { icono: "🎙️", nombre: "Grabar tu voz" },
    pregunta: { icono: "✍️", nombre: "Pregunta abierta" },
  };
  const leer = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  };
  const guardar = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
  const yo = () => (typeof USO !== "undefined" && USO.active ? USO.usuario() : null);
  const esInstructor = () => !!(yo() && yo().instructor);
  const hoy = () => new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en la hora del celular
  const fecha = (f) => (f ? new Date(`${f}T12:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "");

  // Con apóstrofo al inicio, la hoja de Google guarda el texto tal cual (si no, "10/10" se vuelve fecha y "1001,1002" número).
  const plano = (s) => (s ? `'${s}` : s);

  async function enviar(datos) {
    // Si la hoja no contesta en 30 s, se avisa (en vez de quedarse "cargando" para siempre).
    const corte = new AbortController(), reloj = setTimeout(() => corte.abort(), 30000);
    let r;
    try {
      const res = await fetch(URL_TAREAS, { method: "POST", body: JSON.stringify(datos), signal: corte.signal });
      r = await res.json();
    } catch (err) {
      throw new Error(err.name === "AbortError" ? "La hoja de tareas tardó demasiado en responder." : "Sin conexión.");
    } finally {
      clearTimeout(reloj);
    }
    if (!r.ok && /candado|bloqueo|lock/i.test(r.error || "")) throw new Error("La hoja de tareas está ocupada en este momento.");
    if (!r.ok) throw new Error(r.error || "No se pudo completar.");
    return r;
  }

  function aviso(texto) {
    const d = document.createElement("div");
    d.className = "tareas-toast";
    d.textContent = texto;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2800);
  }

  // ---------- Contenido que se puede asignar ----------
  function listasVocab() {
    const l = VOCAB.map((c) => ({ id: `cat:${c.id}`, titulo: c.title, words: c.words }));
    if (VALET_VOC.length) l.push({ id: "valet", titulo: "Valet de spa", words: VALET_VOC });
    CONC_VOC.forEach((g, i) => l.push({ id: `concierge:${i}`, titulo: `Spa Concierge · ${g.titleEs || g.title}`, words: g.words }));
    if (GYM_VOC.length) l.push({ id: "gym", titulo: "Gym del spa", words: GYM_VOC });
    return l;
  }
  const listaVocab = (id) => listasVocab().find((l) => l.id === id);
  function pasosScript() {
    return Object.entries(PROGRAMAS)
      .filter(([, P]) => P.stages.length)
      .flatMap(([k, P]) => P.stages.map((st, n) => ({ id: `${k}/${st.id}`, titulo: `${P.titulo} · Paso ${n + 1}: ${st.titleEs}`, st })));
  }
  const pasoScript = (id) => pasosScript().find((p) => p.id === id);

  // ---------- Colaborador: tareas guardadas en el celular (se actualizan al abrir la app) ----------
  const claveCache = () => `tareas-mias-${yo().employee_no}`;
  const datos = () => (yo() && !esInstructor() ? leer(claveCache(), { tareas: [], entregas: [] }) : { tareas: [], entregas: [] });
  const entregaDe = (id) => datos().entregas.find((e) => e.tarea === id);
  const pendientes = () => datos().tareas.filter((t) => !entregaDe(t.id)).length;
  let cargando = null, ultimaCarga = 0;

  function cargar(forzar = false) {
    const u = yo();
    if (!u || u.instructor || cargando || (!forzar && Date.now() - ultimaCarga < 60 * 1000)) return cargando;
    cargando = enviar({ accion: "mias", employee_no: u.employee_no })
      .then((r) => {
        guardar(claveCache(), { tareas: r.tareas, entregas: r.entregas });
        ultimaCarga = Date.now();
        actualizarGlobos();
        if (/^#\/tareas/.test(location.hash)) window.dispatchEvent(new HashChangeEvent("hashchange"));
      })
      .catch(() => {}) // sin conexión: se queda lo guardado
      .finally(() => (cargando = null));
    return cargando;
  }

  function actualizarGlobos() {
    const n = pendientes();
    document.querySelectorAll("[data-tareas-globo]").forEach((g) => {
      g.textContent = n;
      g.hidden = !n;
    });
    document.querySelectorAll("[data-tareas-sub]").forEach((s) => (s.textContent = textoPendientes(n)));
  }
  const textoPendientes = (n) => (n ? `Tienes ${n} ${n === 1 ? "tarea pendiente" : "tareas pendientes"}` : "¡Estás al día! Aquí verás las tareas de tu instructor");

  function estado(t) {
    const e = entregaDe(t.id);
    if (e && e.calificacion) return ["cal", "⭐ Calificada"];
    if (e) return ["ent", "✅ Entregada"];
    if (t.limite && t.limite < hoy()) return ["ven", "⚠️ Vencida"];
    return ["pend", "⏳ Pendiente"];
  }

  async function entregar(t, resultado, extra = {}) {
    const u = yo();
    await enviar({ accion: "entregar", employee_no: u.employee_no, tarea: t.id, ...extra, resultado: plano(resultado), respuesta: plano(extra.respuesta) });
    const d = datos();
    d.entregas = d.entregas.filter((e) => e.tarea !== t.id);
    d.entregas.push({ tarea: t.id, num: u.employee_no, recibido: new Date().toISOString(), resultado, respuesta: extra.respuesta || "", audio: extra.audio ? "1" : "", calificacion: "", comentario: "" });
    guardar(claveCache(), d);
    USO.track("task", { item: t.titulo, category: TIPOS[t.tipo].nombre, result: resultado });
    aviso("✅ Tarea entregada. Tu instructor ya la puede ver.");
  }

  // Al terminar una prueba (js/app.js), se entrega sola la tarea pendiente de esa prueba.
  function alTerminarPrueba(catId, modo, r) {
    if (!yo() || esInstructor()) return;
    const pct = Math.round((100 * r.aciertos) / r.total);
    datos()
      .tareas.filter((t) => t.tipo === "prueba" && !entregaDe(t.id) && t.contenido.split("/")[0] === catId && (!t.contenido.split("/")[1] || t.contenido.split("/")[1] === modo))
      .forEach((t) => entregar(t, `${r.aciertos}/${r.total} (${pct} %) · ${modo === "listening" ? "Listening" : "Writing"}`).catch(() => aviso("No se pudo entregar la tarea. Revisa tu conexión.")));
  }

  // ---------- Recuadro del inicio ----------
  function recuadro() {
    if (!yo()) return "";
    if (esInstructor())
      return `<a class="script-banner con-video" href="#/tareas-instructor">${vidFondo("tareas")}
        <span class="script-banner-text"><small>Instructor</small><b>👩‍🏫 Tareas del equipo</b><span>Asigna tareas, revisa entregas y califica</span></span>
        <span class="script-banner-go" aria-hidden="true">→</span></a>`;
    cargar();
    const n = pendientes();
    return `<a class="script-banner con-video" href="#/tareas">${vidFondo("tareas")}
      <span class="tareas-globo" data-tareas-globo ${n ? "" : "hidden"}>${n}</span>
      <span class="script-banner-text"><small>De tu instructor de inglés</small><b>📋 Mis tareas</b><span data-tareas-sub>${textoPendientes(n)}</span></span>
      <span class="script-banner-go" aria-hidden="true">→</span></a>`;
  }

  // ---------- Vistas ----------
  const portada = (titulo, kicker, texto) => `<section class="script-hero con-video">${vidFondo("tareas")}
    <div class="script-hero-text"><p class="script-kicker">${kicker}</p><h1>${titulo}</h1><p>${texto}</p></div></section>`;
  function view(ruta) {
    if (!yo()) return `${BRANDS}<a class="back" href="#/">← Inicio</a><p class="muted">Entra a la app con tu número y PIN para ver tus tareas.</p>`;
    if (ruta === "tareas-instructor") return esInstructor() ? viewInstructor() : view("tareas");
    if (esInstructor()) return viewInstructor();
    const id = ruta.split("/")[1];
    const t = id && datos().tareas.find((x) => x.id === id);
    return t ? viewTarea(t) : viewLista();
  }

  function viewLista() {
    const lista = [...datos().tareas].sort((a, b) => (a.limite || "9").localeCompare(b.limite || "9"));
    return `${BRANDS}
      ${USO.badge()}
      <a class="back" href="#/">← Inicio</a>
      ${portada("📋 Mis tareas", "De tu instructor de inglés", "Las tareas que te asigna tu instructor. Resuélvelas aquí y se entregan solas.")}
      ${lista.length ? lista.map((t) => {
        const [c, txt] = estado(t);
        return `<a class="card tarea-item" href="#/tareas/${esc(t.id)}"><span class="tarea-ic">${TIPOS[t.tipo].icono}</span>
          <span class="tarea-txt"><b>${esc(t.titulo)}</b><small>${TIPOS[t.tipo].nombre}${t.limite ? ` · vence ${fecha(t.limite)}` : ""}</small></span>
          <span class="tarea-estado e-${c}">${txt}</span></a>`;
      }).join("") : `<section class="card"><p class="muted">No tienes tareas por ahora. 🎉</p></section>`}
      <button class="btn ghost full center" id="tareas-actualizar">🔄 Buscar tareas nuevas</button>
      <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
  }

  function viewTarea(t) {
    const e = entregaDe(t.id), T = TIPOS[t.tipo];
    let cuerpo = "";
    if (t.tipo === "vocab") {
      const l = listaVocab(t.contenido);
      cuerpo = l ? `<p class="muted">Escucha cada palabra y márcala cuando ya la sepas. Al marcarlas todas, entrega la tarea.</p>
        <section class="card">${l.words.map((w, i) => `<div class="tarea-palabra"><div><b>🇺🇸 ${esc(w.en)}</b><span>🇲🇽 ${esc(w.es)}</span></div>
          <div class="row">${speakButtons(w.en)}<button class="tarea-chk${known.has(w.en) ? " on" : ""}" data-chk="${i}">✓ La sé</button></div></div>`).join("")}</section>
        <button class="btn full center" id="tarea-entregar" disabled>Entregar tarea</button>` : `<p class="muted">Este vocabulario ya no está en la app.</p>`;
    }
    if (t.tipo === "prueba") {
      const [cat, modo] = t.contenido.split("/"), c = VOCAB.find((x) => x.id === cat);
      cuerpo = c ? `<p class="muted">Haz la prueba de <b>${esc(c.title)}</b>. Al terminarla, tu resultado se entrega solo.</p>
        <div class="prueba-botones">${Object.entries(MODOS).filter(([m]) => !modo || m === modo).map(([m, M]) =>
          `<a class="prueba-boton" href="#/practica/${c.id}/${m}"><span class="prueba-icono">${M.icono}</span><span><b>Prueba de ${M.nombre}</b><small>${M.desc}</small></span></a>`).join("")}</div>`
        : `<p class="muted">Este vocabulario ya no está en la app.</p>`;
    }
    if (t.tipo === "script") {
      const p = pasoScript(t.contenido);
      cuerpo = p ? `<p class="muted">Escucha el diálogo, repítelo en voz alta y márcalo como practicado.</p>
        <section class="card">${p.st.lines.map((l) => `<div class="tarea-linea ${l.who}"><small>${WHO[l.who] || ""}</small><b>${esc(l.en)}</b><span>${esc(l.es)}</span><div class="row">${speakButtons(l.en)}</div></div>`).join("")}</section>
        <a class="btn ghost full center" href="#/${p.id}">Abrir el paso completo en el script</a>
        <button class="btn full center" id="tarea-practicado">✓ Ya lo practiqué</button>` : `<p class="muted">Este paso ya no está en la app.</p>`;
    }
    if (t.tipo === "voz")
      cuerpo = `<p class="muted">Escucha el modelo y luego graba tu voz diciendo la frase. Puedes escucharte antes de enviarla.</p>
        <section class="card"><p class="tarea-frase">${esc(t.contenido)}</p><div class="row">${speakButtons(t.contenido)}</div>
          <button class="tarea-grabar" id="tarea-grabar" aria-label="Grabar">🎙️</button>
          <p class="muted center" id="tarea-g-estado">Toca el micrófono para grabar</p>
          <audio id="tarea-g-audio" controls hidden></audio></section>
        <button class="btn full center" id="tarea-g-enviar" disabled>Enviar mi grabación</button>`;
    if (t.tipo === "pregunta")
      cuerpo = `<section class="card"><p class="tarea-frase">${esc(t.contenido)}</p>
        <textarea id="tarea-resp" class="search tarea-texto" placeholder="Write your answer in English…">${esc(e ? e.respuesta : "")}</textarea></section>
        <button class="btn full center" id="tarea-enviar-resp">Enviar respuesta</button>`;
    return `${BRANDS}
      ${USO.badge()}
      <a class="back" href="#/tareas">← Mis tareas</a>
      <h2 class="section-title">${T.icono} ${esc(t.titulo)}</h2>
      <p class="muted">${T.nombre}${t.limite ? ` · vence ${fecha(t.limite)}` : ""}</p>
      ${t.indicacion ? `<div class="tarea-nota">📝 <b>Indicación de tu instructor:</b> ${esc(t.indicacion)}</div>` : ""}
      ${e ? `<section class="card tarea-hecha"><b>✅ Entregada el ${fecha(e.recibido.slice(0, 10))}</b><span class="muted">Resultado: ${esc(e.resultado)}</span>
        ${e.calificacion ? `<div class="tarea-nota">⭐ <b>Calificación: ${esc(e.calificacion)}</b>${e.comentario ? `<br>💬 ${esc(e.comentario)}` : ""}</div>` : `<span class="muted">Tu instructor todavía no la califica.</span>`}
        <span class="muted">Puedes volver a hacerla; se reemplaza tu entrega.</span></section>` : ""}
      ${cuerpo}`;
  }

  // ---------- Instructor ----------
  let panel = null, panelError = "";
  const claveInstructor = () => leer("tareas-clave-instructor", "");
  async function cargarPanel() {
    panelError = "";
    try {
      panel = await enviar({ accion: "panel", clave: claveInstructor() });
    } catch (err) {
      panelError = `${err.message} Intenta de nuevo.`;
    }
    if (location.hash === "#/tareas-instructor") window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  const nombreDe = (num) => ((panel && panel.personas.find((p) => p.num === num)) || {}).nombre || `Colaborador ${num}`;
  const paraTexto = (para) => (para === "Todos" ? "Todos" : panel && panel.personas.some((p) => p.grupo === para) ? `Grupo ${para}` : para.split(",").map((n) => nombreDe(n.trim())).join(", "));
  const leToca = (t, p) => t.para === "Todos" || t.para === p.grupo || t.para.split(",").map((x) => x.trim()).includes(p.num);

  function viewInstructor() {
    if (!claveInstructor())
      return `${BRANDS}${USO.badge()}<a class="back" href="#/">← Inicio</a><h2 class="section-title">👩‍🏫 Tareas del equipo</h2>
        <section class="card"><p>Para asignar tareas, abre una vez más tu <b>enlace o QR de instructor</b> en este celular.</p></section>`;
    if (!panel && !panelError) {
      cargarPanel();
      return `${BRANDS}${USO.badge()}<a class="back" href="#/">← Inicio</a><h2 class="section-title">👩‍🏫 Tareas del equipo</h2><p class="muted">Cargando las tareas… (puede tardar unos segundos)</p>`;
    }
    if (panelError)
      return `${BRANDS}${USO.badge()}<a class="back" href="#/">← Inicio</a><h2 class="section-title">👩‍🏫 Tareas del equipo</h2>
        <section class="card"><p>No se pudieron cargar las tareas: ${esc(panelError)}</p><button class="btn" id="ti-reintentar">Intentar de nuevo</button></section>`;
    const grupos = [...new Set(panel.personas.map((p) => p.grupo))].filter(Boolean).sort();
    const activas = panel.tareas.filter((t) => t.activa).reverse();
    const porRevisar = panel.entregas.filter((e) => !e.calificacion).reverse();
    const tituloDe = (id) => (panel.tareas.find((t) => t.id === id) || {}).titulo || "Tarea";
    return `${BRANDS}
      ${USO.badge()}
      <a class="back" href="#/">← Inicio</a>
      ${portada("👩‍🏫 Tareas del equipo", "Instructor", "Asigna tareas, revisa las entregas y califica.")}
      <section class="card tareas-form">
        <h3>Asignar una tarea</h3>
        <label>Para</label>
        <select id="ti-para"><option value="Todos">Todos (${panel.personas.length} personas)</option>
          ${grupos.map((g) => `<option value="${esc(g)}">Grupo: ${esc(g)} (${panel.personas.filter((p) => p.grupo === g).length})</option>`).join("")}
          ${panel.personas.slice().sort((a, b) => a.nombre.localeCompare(b.nombre)).map((p) => `<option value="${esc(p.num)}">${esc(p.nombre)} · ${esc(p.grupo)}</option>`).join("")}</select>
        <label>Tipo de tarea</label>
        <select id="ti-tipo">${Object.entries(TIPOS).map(([k, T]) => `<option value="${k}">${T.icono} ${T.nombre}</option>`).join("")}</select>
        <div id="ti-contenido"></div>
        <label>Fecha límite</label><input id="ti-limite" type="date" class="search" value="${new Date(Date.now() + 7 * 864e5).toLocaleDateString("en-CA")}">
        <label>Indicación (opcional)</label><input id="ti-indicacion" class="search" placeholder="Ej. Mínimo 80 %">
        <button class="btn full center" id="ti-asignar">📤 Asignar tarea</button>
      </section>

      <h3 class="piel-sub">📊 Tareas activas · ${activas.length}</h3>
      ${activas.length ? avanceGeneral(activas) : ""}
      ${activas.map((t) => {
        const A = avance(t), hechas = panel.entregas.filter((e) => e.tarea === t.id);
        return `<details class="card tarea-avance"><summary>
            <div class="avance-fila">${anillo(A.pct)}
              <div class="avance-info"><b>${TIPOS[t.tipo].icono} ${esc(t.titulo)}</b>
                <span class="muted">${esc(paraTexto(t.para))}${t.limite ? ` · vence ${fecha(t.limite)}` : ""}</span>
                ${barraAvance(A)}</div></div></summary>
          ${t.indicacion ? `<p class="muted">📝 ${esc(t.indicacion)}</p>` : ""}
          ${hechas.map((e) => entregaHtml(e)).join("")}
          ${A.faltan.length ? `<p class="muted"><b>Faltan:</b> ${A.faltan.map((p) => esc(p.nombre)).join(", ")}</p>` : ""}
          <button class="btn ghost small" data-archivar="${esc(t.id)}">Quitar la tarea</button></details>`;
      }).join("") || `<p class="muted">Aún no hay tareas.</p>`}

      <h3 class="piel-sub">📥 Entregas por calificar · ${porRevisar.length}</h3>
      ${porRevisar.length ? porRevisar.map((e) => entregaHtml(e, tituloDe(e.tarea))).join("") : `<p class="muted">No hay entregas pendientes de calificar.</p>`}
      <button class="btn ghost full center" id="ti-recargar">🔄 Actualizar</button>
      <a class="btn ghost full center" href="#/">← Volver al inicio</a>`;
  }

  // Avance de una tarea: de las personas a quienes les toca, cuántas ya la entregaron (y cuántas están calificadas).
  function avance(t) {
    const quienes = panel.personas.filter((p) => leToca(t, p));
    const entregas = panel.entregas.filter((e) => e.tarea === t.id && quienes.some((p) => p.num === e.num));
    const cal = entregas.filter((e) => e.calificacion).length;
    return { total: quienes.length, cal, porCal: entregas.length - cal, entregadas: entregas.length,
      faltan: quienes.filter((p) => !entregas.some((e) => e.num === p.num)), pct: quienes.length ? Math.round((100 * entregas.length) / quienes.length) : 0 };
  }

  // Anillo de 0 % a 100 % (entregadas sobre asignadas).
  function anillo(pct, grande = false) {
    const r = grande ? 34 : 24, w = grande ? 9 : 7, c = 2 * Math.PI * r, lado = 2 * (r + w);
    return `<svg class="avance-anillo${grande ? " grande" : ""}" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}" role="img" aria-label="${pct} % entregado">
      <circle cx="${lado / 2}" cy="${lado / 2}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${w}"/>
      ${pct ? `<circle cx="${lado / 2}" cy="${lado / 2}" r="${r}" fill="none" stroke="var(--accent)" stroke-width="${w}" stroke-linecap="round"
        stroke-dasharray="${(c * Math.min(pct, 100)) / 100} ${c}" transform="rotate(-90 ${lado / 2} ${lado / 2})"/>` : ""}
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">${pct}%</text></svg>`;
  }

  // Barra dividida: calificadas · por calificar · faltan (con sus números, no solo el color).
  function barraAvance(A) {
    const seg = (n, cls, txt) => (n ? `<span class="${cls}" style="flex:${n}" title="${txt}: ${n} de ${A.total}"></span>` : "");
    return `<span class="avance-barra">${seg(A.cal, "s-cal", "Calificadas")}${seg(A.porCal, "s-ent", "Por calificar")}${seg(A.faltan.length, "s-falta", "Faltan")}</span>
      <span class="avance-leyenda"><span><i class="s-cal"></i>${A.cal} ${A.cal === 1 ? "calificada" : "calificadas"}</span><span><i class="s-ent"></i>${A.porCal} por calificar</span><span><i class="s-falta"></i>${A.faltan.length} ${A.faltan.length === 1 ? "falta" : "faltan"}</span></span>`;
  }

  function avanceGeneral(activas) {
    const T = activas.map(avance).reduce((s, A) => ({ total: s.total + A.total, cal: s.cal + A.cal, porCal: s.porCal + A.porCal, faltan: [...s.faltan, ...A.faltan] }), { total: 0, cal: 0, porCal: 0, faltan: [] });
    const pct = T.total ? Math.round((100 * (T.cal + T.porCal)) / T.total) : 0;
    return `<section class="card avance-general"><div class="avance-fila">${anillo(pct, true)}
      <div class="avance-info"><b>Avance general</b><span class="muted">${T.cal + T.porCal} de ${T.total} entregas en ${activas.length} ${activas.length === 1 ? "tarea" : "tareas"}</span>
      ${barraAvance(T)}</div></div></section>`;
  }

  function entregaHtml(e, titulo) {
    return `<div class="card tarea-entrega" data-fila="${e.fila}">
      <div class="row between"><b>${esc(e.nombre || nombreDe(e.num))}</b><small class="muted">${fecha(e.recibido.slice(0, 10))}</small></div>
      ${titulo ? `<small class="muted">${esc(titulo)}</small>` : ""}
      <p>Resultado: <b>${esc(e.resultado)}</b></p>
      ${e.respuesta ? `<p class="tarea-respuesta">“${esc(e.respuesta)}”</p>` : ""}
      ${e.audio ? `<a class="btn ghost small" href="${esc(e.audio)}" target="_blank" rel="noopener">▶ Escuchar la grabación (Drive)</a>` : ""}
      <div class="tarea-calificar"><input class="search" data-cal placeholder="Calificación (ej. 9/10)" value="${esc(e.calificacion)}">
        <input class="search" data-com placeholder="Comentario (opcional)" value="${esc(e.comentario)}">
        <button class="btn small" data-guardar-cal>${e.calificacion ? "Actualizar" : "Calificar"}</button></div></div>`;
  }

  function contenidoForm(tipo) {
    if (tipo === "vocab")
      return `<label>Vocabulario</label><select id="ti-cont">${listasVocab().map((l) => `<option value="${esc(l.id)}">${esc(l.titulo)} (${l.words.length})</option>`).join("")}</select>`;
    if (tipo === "prueba")
      return `<label>Vocabulario de la prueba</label><select id="ti-cont">${VOCAB.map((c) => `<option value="${esc(c.id)}">${esc(c.title)}</option>`).join("")}</select>
        <label>Tipo de prueba</label><select id="ti-modo"><option value="">Listening o writing</option><option value="listening">🎧 Listening</option><option value="writing">✍️ Writing</option></select>`;
    if (tipo === "script")
      return `<label>Paso del script</label><select id="ti-cont">${pasosScript().map((p) => `<option value="${esc(p.id)}">${esc(p.titulo)}</option>`).join("")}</select>`;
    if (tipo === "voz")
      return `<label>Frase que deben grabar (en inglés)</label><textarea id="ti-cont" class="search tarea-texto" placeholder="Good afternoon, Mrs. Smith. Welcome to the spa…"></textarea>
        <label>Título (opcional)</label><input id="ti-titulo" class="search" placeholder="Ej. Bienvenida al huésped">`;
    return `<label>Pregunta</label><textarea id="ti-cont" class="search tarea-texto" placeholder="A guest arrives 15 minutes late. What do you say?"></textarea>
      <label>Título (opcional)</label><input id="ti-titulo" class="search" placeholder="Ej. Huésped que llega tarde">`;
  }

  // ---------- Eventos (después de pintar la vista) ----------
  function montar(ruta) {
    if (!yo()) return;
    if (esInstructor()) return montarInstructor();
    USO.track("category", { category: "Mis tareas" });
    const act = document.getElementById("tareas-actualizar");
    if (act) act.onclick = () => { act.textContent = "Buscando…"; cargar(true).then(() => (act.textContent = "🔄 Buscar tareas nuevas")); };
    const id = ruta.split("/")[1], t = id && datos().tareas.find((x) => x.id === id);
    if (!t) return cargar();
    const fallo = (b, txt) => (err) => { b.disabled = false; b.textContent = txt; aviso(`No se pudo enviar: ${err.message} Intenta de nuevo.`); };
    const listo = () => (location.hash = "#/tareas");
    if (t.tipo === "vocab") {
      const l = listaVocab(t.contenido), b = document.getElementById("tarea-entregar");
      if (!l) return;
      const revisar = () => (b.disabled = document.querySelectorAll(".tarea-chk.on").length < l.words.length);
      document.querySelectorAll("[data-chk]").forEach((c) => (c.onclick = () => {
        const w = l.words[+c.dataset.chk];
        c.classList.toggle("on");
        if (c.classList.contains("on") !== known.has(w.en)) toggleKnown(w.en); // también cuenta como palabra aprendida
        revisar();
      }));
      revisar();
      b.onclick = () => { b.disabled = true; b.textContent = "Enviando…"; entregar(t, `${l.words.length} de ${l.words.length} palabras`).then(listo, fallo(b, "Entregar tarea")); };
    }
    if (t.tipo === "script") {
      const b = document.getElementById("tarea-practicado");
      if (b) b.onclick = () => { b.disabled = true; b.textContent = "Enviando…"; entregar(t, "Diálogo practicado").then(listo, fallo(b, "✓ Ya lo practiqué")); };
    }
    if (t.tipo === "pregunta") {
      const b = document.getElementById("tarea-enviar-resp");
      b.onclick = () => {
        const r = document.getElementById("tarea-resp").value.trim();
        if (!r) return aviso("Escribe tu respuesta primero.");
        b.disabled = true; b.textContent = "Enviando…";
        entregar(t, "Respuesta escrita", { respuesta: r }).then(listo, fallo(b, "Enviar respuesta"));
      };
    }
    if (t.tipo === "voz") grabadora(t, listo, fallo);
  }

  function grabadora(t, listo, fallo) {
    let rec = null, blob = null;
    const boton = document.getElementById("tarea-grabar"), est = document.getElementById("tarea-g-estado");
    const audio = document.getElementById("tarea-g-audio"), env = document.getElementById("tarea-g-enviar");
    boton.onclick = async () => {
      if (rec && rec.state === "recording") return rec.stop();
      try {
        const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
        const partes = [];
        rec = new MediaRecorder(flujo);
        rec.ondataavailable = (e) => partes.push(e.data);
        rec.onstop = () => {
          flujo.getTracks().forEach((x) => x.stop());
          clearTimeout(rec.limite);
          blob = new Blob(partes, { type: rec.mimeType || "audio/webm" });
          audio.src = URL.createObjectURL(blob);
          audio.hidden = false;
          env.disabled = false;
          boton.classList.remove("on");
          boton.textContent = "🎙️";
          est.textContent = "Escúchate. Si no te gustó, vuelve a grabar.";
        };
        rec.start();
        rec.limite = setTimeout(() => rec.state === "recording" && rec.stop(), 90 * 1000); // máximo 90 s
        boton.classList.add("on");
        boton.textContent = "⏹";
        est.textContent = "Grabando… toca para terminar";
      } catch {
        est.textContent = "No se pudo usar el micrófono. Revisa el permiso de la app o del navegador.";
      }
    };
    env.onclick = () => {
      if (!blob) return;
      env.disabled = true;
      env.textContent = "Enviando…";
      const lector = new FileReader();
      lector.onload = () =>
        entregar(t, "Grabación de voz", { audio: { b64: String(lector.result).split(",")[1], mime: blob.type } }).then(listo, fallo(env, "Enviar mi grabación"));
      lector.readAsDataURL(blob);
    };
  }

  function montarInstructor() {
    const r = document.getElementById("ti-reintentar") || document.getElementById("ti-recargar");
    if (r) r.onclick = () => { panel = null; cargarPanel(); r.textContent = "Cargando…"; };
    const tipo = document.getElementById("ti-tipo");
    if (!tipo) return;
    const pintarContenido = () => (document.getElementById("ti-contenido").innerHTML = contenidoForm(tipo.value));
    tipo.onchange = pintarContenido;
    pintarContenido();
    const asignar = document.getElementById("ti-asignar");
    asignar.onclick = async () => {
      const v = (id) => ((document.getElementById(id) || {}).value || "").trim();
      const tp = tipo.value;
      let contenido = v("ti-cont"), titulo = v("ti-titulo");
      if (!contenido) return aviso("Escribe el contenido de la tarea.");
      if (tp === "vocab") titulo = listaVocab(contenido).titulo;
      if (tp === "prueba") {
        titulo = `Prueba de ${v("ti-modo") || "listening o writing"}: ${VOCAB.find((c) => c.id === contenido).title}`;
        if (v("ti-modo")) contenido += `/${v("ti-modo")}`;
      }
      if (tp === "script") titulo = pasoScript(contenido).titulo;
      if (!titulo) titulo = contenido.length > 60 ? `${contenido.slice(0, 57)}…` : contenido;
      asignar.disabled = true;
      asignar.textContent = "Asignando…";
      try {
        await enviar({ accion: "asignar", clave: claveInstructor(), para: plano(v("ti-para")), tipo: tp, contenido: plano(contenido), titulo: plano(titulo), limite: v("ti-limite"), indicacion: plano(v("ti-indicacion")) });
        aviso("📤 Tarea asignada. Ya aparece en la app de cada colaborador.");
        panel = null;
        cargarPanel();
      } catch (err) {
        asignar.disabled = false;
        asignar.textContent = "📤 Asignar tarea";
        aviso(err.message);
      }
    };
    document.querySelectorAll("[data-guardar-cal]").forEach((b) => (b.onclick = async () => {
      const caja = b.closest("[data-fila]");
      const calificacion = caja.querySelector("[data-cal]").value.trim();
      if (!calificacion) return aviso("Escribe la calificación.");
      b.disabled = true;
      try {
        await enviar({ accion: "calificar", clave: claveInstructor(), fila: caja.dataset.fila, calificacion: plano(calificacion), comentario: plano(caja.querySelector("[data-com]").value.trim()) });
        aviso("⭐ Calificación guardada.");
        panel = null;
        cargarPanel();
      } catch (err) {
        b.disabled = false;
        aviso(err.message);
      }
    }));
    document.querySelectorAll("[data-archivar]").forEach((b) => (b.onclick = async () => {
      if (!confirm("¿Quitar esta tarea? Ya no la verán los colaboradores; sus entregas se conservan en la hoja.")) return;
      try {
        await enviar({ accion: "archivar", clave: claveInstructor(), id: b.dataset.archivar });
        panel = null;
        cargarPanel();
      } catch (err) {
        aviso(err.message);
      }
    }));
  }

  window.addEventListener("uso-login", () => cargar(true));
  return { recuadro, view, montar, cargar, alTerminarPrueba };
})();
