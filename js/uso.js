// Registro de uso para el reporte del sistema de evaluación de inglés.
// Solo se activa cuando la app se abre desde ese servidor (http://…/apps/<app>/); abierta como
// archivo, o en cualquier otra dirección, no registra nada. La primera vez pide el número de
// colaborador y a partir de ahí guarda la actividad en el celular y la envía en bloques
// (si no hay señal, la conserva y la reintenta después).
const USO = (() => {
  const match = location.pathname.match(/\/apps\/([a-z]+)\//);
  const APP = match ? match[1] : null;
  const ACTIVE = location.protocol.startsWith("http") && !!APP;
  const KEY_USER = "uso-colaborador";
  const KEY_QUEUE = "uso-pendientes";
  const load = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
  const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let user = load(KEY_USER, null);
  let queue = load(KEY_QUEUE, []);
  let lastInteraction = Date.now();
  let sending = false;
  let knownWords = () => [];

  function track(event, data = {}) {
    if (!ACTIVE || !user) return;
    queue.push({ event, t: new Date().toISOString(), u: user.employee_no, ...data });
    if (queue.length > 3000) queue = queue.slice(-3000);
    save(KEY_QUEUE, queue);
  }

  async function flush(withKnown = false) {
    if (!ACTIVE || sending || (!queue.length && !(withKnown && user))) return;
    sending = true;
    // Cada evento lleva el número de quien lo generó (un celular puede ser compartido):
    // se envía el bloque de eventos seguidos del mismo colaborador.
    const owner = queue.length ? queue[0].u : user.employee_no;
    let n = 0;
    while (n < queue.length && n < 400 && queue[n].u === owner) n++;
    const batch = queue.slice(0, n);
    const sendKnown = withKnown && user && user.employee_no === owner;
    try {
      const res = await fetch("/api/app-usage/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ app: APP, employee_no: owner, events: batch, known: sendKnown ? knownWords() : undefined }),
      });
      if (res.ok) {
        queue = queue.slice(batch.length);
        save(KEY_QUEUE, queue);
        // Si había pendientes de otro colega, las palabras del actual se mandan en el siguiente envío.
        if (withKnown && !sendKnown) setTimeout(() => flush(true), 0);
      }
    } catch {
      // sin conexión: se reintenta en el siguiente envío
    }
    sending = false;
  }

  function askEmployeeNumber() {
    const box = document.createElement("div");
    box.className = "uso-overlay";
    box.innerHTML = `
      <form class="uso-card">
        <h2>¡Bienvenido!</h2>
        <p>Escribe tu <b>número de colaborador</b> para guardar tu avance.</p>
        <input name="employee_no" inputmode="numeric" autocomplete="off" placeholder="Número de colaborador" required>
        <p class="uso-error" hidden></p>
        <button class="btn full" type="submit">Entrar</button>
        <p class="uso-note">Tu avance (palabras aprendidas, tiempo de estudio y resultados de práctica) se registra para el seguimiento de tu capacitación de inglés.</p>
      </form>`;
    document.body.appendChild(box);
    const form = box.querySelector("form");
    const error = box.querySelector(".uso-error");
    form.employee_no.focus();
    form.onsubmit = async (e) => {
      e.preventDefault();
      error.hidden = true;
      try {
        const res = await fetch("/api/app-usage/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_no: form.employee_no.value.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo validar el número.");
        user = { employee_no: data.employee_no, full_name: data.full_name };
        save(KEY_USER, user);
        box.remove();
        track("open");
        flush(true); // sube también las palabras que ya tenía marcadas en este celular
        window.dispatchEvent(new Event("uso-login"));
      } catch (err) {
        error.textContent = err.message === "Failed to fetch" ? "Sin conexión con el servidor. Intenta de nuevo." : err.message;
        error.hidden = false;
      }
    };
  }

  function start(options = {}) {
    if (!ACTIVE) return;
    if (options.knownWords) knownWords = options.knownWords;
    if (!user) askEmployeeNumber();
    else {
      track("open");
      flush();
    }
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach((ev) =>
      window.addEventListener(ev, () => (lastInteraction = Date.now()), { passive: true })
    );
    // Un "ping" por minuto mientras la app está visible y en uso = minutos de estudio.
    setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastInteraction < 3 * 60 * 1000) track("ping");
    }, 60 * 1000);
    setInterval(flush, 20 * 1000);
    document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  }

  // Nombre del colega en pantalla, con opción de cambiar de usuario (celular compartido).
  function badge() {
    if (!ACTIVE || !user) return "";
    return `<p class="uso-badge">👤 ${escape(user.full_name)} · <button type="button" data-uso-logout>No soy yo</button></p>`;
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-uso-logout]")) return;
    flush();
    user = null;
    save(KEY_USER, null);
    askEmployeeNumber();
  });

  return { active: ACTIVE, track, start, badge };
})();
