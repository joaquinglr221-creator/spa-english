// Íconos de línea para el menú de categorías (contenido de un <svg viewBox="0 0 24 24">), por id de categoría.
// Se dibujan con el color del tema; si una categoría no tiene ícono aquí, la app usa su emoji.
const ICONS = {
  // flor de loto (encabezado de la app, no es categoría)
  spa: '<path d="M12 4.5c-2 2.6-2 7.2 0 11.5 2-4.3 2-8.9 0-11.5zM12 16c-1.4-3.2-4.4-5.8-7.8-6.3 0 3.7 3.2 6.3 7.8 6.3zM12 16c1.4-3.2 4.4-5.8 7.8-6.3 0 3.7-3.2 6.3-7.8 6.3zM3.5 19.5c1.4 0 1.4-.9 2.8-.9s1.4.9 2.9.9 1.4-.9 2.8-.9 1.4.9 2.9.9 1.4-.9 2.8-.9 1.4.9 2.8.9"/>',
  // silueta del cuerpo humano
  cuerpo: '<circle cx="12" cy="4.5" r="2.3"/><path d="M9.5 21v-6.5h-2V10A2.5 2.5 0 0 1 10 7.5h4a2.5 2.5 0 0 1 2.5 2.5v4.5h-2V21M12 15v6"/>',
  // persona boca abajo en la camilla, con ondas de relajación
  tratamientos: '<circle cx="5.5" cy="12.5" r="1.8"/><path d="M8 14.5h12M2 17h20M4 17v3M20 17v3M10.5 9.5c.8-.8 1.6.8 2.4 0s1.6.8 2.4 0 1.6.8 2.4 0"/>',
  // mano abierta
  tecnicas: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 6.5-6.5 6.5-2.4 0-4-1.1-5.3-3l-2-3.2a1.5 1.5 0 0 1 2.4-1.8L8 13.5"/>',
  // camilla de masaje con almohada y orificio para la cara
  posiciones: '<rect x="2.5" y="10" width="15" height="2.5" rx="1"/><rect x="4" y="7" width="4" height="2" rx="1"/><path d="M17.5 10.5h2.3a1.8 1.8 0 0 1 0 3.6h-1.3M5 12.5V20M15 12.5V20M5 16.5h10"/>',
  // frasco gotero con una gota
  productos: '<path d="M10 3h4v3h-4zM9 6h6l1 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9zM12 12.5c-1.2 1.4-1.6 2.3-1.6 3a1.6 1.6 0 0 0 3.2 0c0-.7-.4-1.6-1.6-3z"/>',
  // flor
  aromas: '<circle cx="12" cy="8.5" r="1.6"/><circle cx="12" cy="5" r="2.2"/><circle cx="15.5" cy="8.5" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="8.5" cy="8.5" r="2.2"/><path d="M12 14.2V21M12 18.5c-2 0-3.5-1-4-3M12 17.5c2 0 3.5-1 4-3"/>',
  // aguas termales con vapor
  instalaciones: '<path d="M3 14.5h18c0 3.3-4 5.5-9 5.5s-9-2.2-9-5.5zM8 11.5c-1-1.5 1-2.5 0-4.5M12 11.5c-1-1.5 1-2.5 0-4.5M16 11.5c-1-1.5 1-2.5 0-4.5"/>',
  // estetoscopio
  salud: '<path d="M5 3h2M13 3h2M6 3v5a4 4 0 0 0 8 0V3M10 12v3a5 5 0 0 0 10 0v-2.2"/><circle cx="20" cy="11" r="1.8"/>',
  // persona meditando
  bienestar: '<circle cx="12" cy="5.5" r="2"/><path d="M12 8.5v5M12 10c-2 0-3.5 1-4.5 3.5M12 10c2 0 3.5 1 4.5 3.5M5 17.5c2-1.8 4.5-2.5 7-2.5s5 .7 7 2.5c-2 1.5-4.5 2-7 2s-5-.5-7-2z"/>',
  // toallas enrolladas
  amenidades: '<circle cx="8" cy="16" r="3.5"/><circle cx="8" cy="16" r="1.2"/><circle cx="16" cy="16" r="3.5"/><circle cx="16" cy="16" r="1.2"/><circle cx="12" cy="9.5" r="3.5"/><circle cx="12" cy="9.5" r="1.2"/><path d="M3 20.5h18"/>',
  // calendario con palomita
  recepcion: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>',
  // campana de servicio
  hotel: '<path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 11V8.5M10 8.5h4M4 21h16"/>',
  // termómetro
  malestares: '<path d="M12 3a2 2 0 0 0-2 2v9.3a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2zM12 9v6.5M15.5 6h2M15.5 9h2"/><circle cx="12" cy="17.7" r="1.3"/>',
  // curita
  piel: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)"/><rect x="9" y="8.5" width="6" height="7" transform="rotate(-45 12 12)"/><path d="M11 11h.01M13 13h.01M13 11h.01M11 13h.01"/>',
  // tijeras
  barberia: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 12 12M20 4 8.1 15.9M14.8 14.8 20 20"/>',
  // secadora de cabello
  peinados: '<circle cx="9" cy="9" r="5"/><circle cx="9" cy="9" r="1.5"/><path d="M14 7.2 20 6v6l-6-1.2M8.5 14l1.5 7h2.5l-1-6.5"/>',
  // tazón de tinte y brocha
  coloracion: '<path d="M3 14h12c0 3.3-2.7 6-6 6s-6-2.7-6-6zM10.5 11.5 19 3M17 2.5l4.5 4.5M9 10l3 3"/>',
  // tabla con preguntas palomeadas
  encuesta: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.8h6V5.5H9zM8.5 10.5 10 12l2.5-2.5M14.5 11h2M8.5 16 10 17.5l2.5-2.5M14.5 16.5h2"/>',
  // globos de diálogo
  verbos: '<path d="M4 4h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5V14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM20 9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3.5-3H11M6 8h7M6 11h4"/>',
  // piedras calientes apiladas con vapor
  masajes: '<ellipse cx="12" cy="18" rx="7" ry="2.5"/><ellipse cx="12" cy="13.2" rx="5" ry="2"/><ellipse cx="12" cy="9.2" rx="3.3" ry="1.6"/><path d="M10 5.8c-.6-.8.6-1.5 0-2.4M14 5.8c-.6-.8.6-1.5 0-2.4"/>',
  // guion: hoja con diálogo (Script de servicio AAA, no es categoría)
  script: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 11h7M9 14.5h7M9 18h4"/>',
};

// Íconos de las 11 etapas del Script de servicio AAA (js/service-script.js): "st-<id de la etapa>".
// Varias reutilizan el dibujo de una categoría con el mismo tema.
Object.assign(ICONS, {
  // mano saludando
  "st-welcome": ICONS.tecnicas + '<path d="M18.5 3.5c1.2.9 1.9 2.2 2 3.7M20.5 2c1.5 1.3 2.4 3 2.5 5"/>',
  "st-confirm": ICONS.recepcion,
  "st-consultation": ICONS.salud,
  // globo de diálogo
  "st-explain": '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7 9h10M7 12.5h7"/>',
  "st-personalize": ICONS.aromas,
  "st-prepare": ICONS.posiciones,
  "st-during": ICONS.tratamientos,
  // corazón
  "st-concern": '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  // taza de té con vapor
  "st-followup": '<path d="M5 9.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5c-.6.8.6 1.6 0 2.5M12 3.5c-.6.8.6 1.6 0 2.5M4 21.5h13"/>',
  // estrella
  "st-recommend": '<path d="M12 3.5l2.4 5.1 5.6.7-4.1 3.9 1 5.5L12 16l-4.9 2.7 1-5.5L4 9.3l5.6-.7z"/>',
  // hoja
  "st-farewell": '<path d="M5 19.5C5 10.5 11 5 20 4c-1 9-6.5 15.5-15 15.5zM5 19.5l8.5-8.5"/>',
});

