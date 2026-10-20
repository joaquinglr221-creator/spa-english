// Spa Concierge: script de ventas y bienestar, en inglés y español.
// Fuente: "SPA CONCIERGE – Professional Sales & Guest Experience Script" (English for Luxury Hospitality).
// Mismo formato que js/service-script.js. who: "concierge" o "guest".
// Los precios, duraciones y horarios de las frases son ejemplos: siempre se usan los del menú vigente del spa.

const CONCIERGE_SCRIPT = [
  {
    id: "welcome", icon: "👋", title: "Professional Welcome", titleEs: "Bienvenida profesional",
    standards: [
      "Crear un ambiente acogedor, presentarse con su nombre y presentar la experiencia del spa.",
      "Preguntar qué tipo de experiencia busca: relajación, alivio de tensión muscular, cuidado de la piel o un momento de tranquilidad.",
      "Ofrecer dos opciones según sus preferencias y explicar las diferencias.",
    ],
    lines: [
      { who: "concierge", en: "Good morning, and welcome to our Spa. It is a pleasure to assist you today. My name is Ana, and I will be happy to help you explore our treatments and wellness experiences.", es: "Buenos días y bienvenido(a) a nuestro spa. Es un placer atenderle hoy. Mi nombre es Ana y con gusto le ayudaré a conocer nuestros tratamientos y experiencias de bienestar." },
      { who: "concierge", en: "Our Spa offers a carefully curated selection of massages, body treatments, facials, hydrotherapy experiences, and personalized wellness rituals, all designed to enhance your relaxation and overall well-being.", es: "Nuestro spa ofrece una cuidada selección de masajes, tratamientos corporales, faciales, experiencias de hidroterapia y rituales de bienestar personalizados, todos diseñados para favorecer su relajación y su bienestar general." },
      { who: "concierge", en: "May I ask what type of experience you are looking for today? Are you interested in relaxation, muscle tension relief, skincare, or simply enjoying some peaceful time for yourself?", es: "¿Puedo preguntarle qué tipo de experiencia busca hoy? ¿Le interesa relajarse, aliviar la tensión muscular, el cuidado de la piel o simplemente disfrutar de un momento de tranquilidad?" },
      { who: "guest", en: "I would like to relax. I have been feeling very stressed lately.", es: "Me gustaría relajarme. Últimamente me he sentido muy estresado(a)." },
      { who: "concierge", en: "Absolutely. I would be delighted to recommend a treatment that suits your preferences. We offer several massage experiences, including Swedish massage, aromatherapy massage, hot stone massage, and deep tissue massage.", es: "Por supuesto. Con mucho gusto le recomiendo un tratamiento de acuerdo con sus preferencias. Ofrecemos varias experiencias de masaje, como el masaje sueco, el de aromaterapia, el de piedras calientes y el de tejido profundo." },
      { who: "concierge", en: "May I ask whether you prefer gentle, flowing movements or firmer pressure to address areas of muscle tension?", es: "¿Puedo preguntarle si prefiere movimientos suaves y fluidos o una presión más firme para trabajar las zonas de tensión muscular?" },
      { who: "guest", en: "I prefer something relaxing, with medium pressure.", es: "Prefiero algo relajante, con presión media." },
      { who: "concierge", en: "Based on your preferences, I would recommend our Swedish massage or aromatherapy massage. Both can provide a relaxing experience, and we can tailor the pressure to your comfort. May I briefly explain the differences so you can choose the treatment that best suits you?", es: "Según sus preferencias, le recomendaría nuestro masaje sueco o el de aromaterapia. Ambos ofrecen una experiencia relajante y podemos adaptar la presión a su comodidad. ¿Me permite explicarle brevemente las diferencias para que elija el tratamiento que mejor le convenga?" },
    ],
  },
  {
    id: "needs", icon: "🔎", title: "Needs Assessment", titleEs: "Evaluación de necesidades",
    standards: [
      "Identificar lo que el huésped desea sin diagnosticar condiciones médicas ni prometer resultados terapéuticos.",
      "Preguntar la motivación, la presión, las zonas de enfoque y la duración (60 o 90 minutos).",
      "Preguntar si hay algo de su salud o comodidad que la terapeuta deba saber, para la valoración profesional.",
    ],
    lines: [
      { who: "concierge", en: "What would you like to achieve from your spa experience?", es: "¿Qué le gustaría lograr con su experiencia en el spa?" },
      { who: "concierge", en: "Are you looking for relaxation or muscle tension relief?", es: "¿Busca relajación o alivio de la tensión muscular?" },
      { who: "concierge", en: "Do you prefer light, medium, or firm pressure?", es: "¿Prefiere presión ligera, media o firme?" },
      { who: "concierge", en: "Are there any areas you would like us to focus on?", es: "¿Hay alguna zona en la que le gustaría que nos enfoquemos?" },
      { who: "concierge", en: "Would you prefer a 60-minute or 90-minute treatment?", es: "¿Prefiere un tratamiento de 60 o de 90 minutos?" },
      { who: "concierge", en: "Would you be interested in combining your massage with a hydrotherapy experience?", es: "¿Le interesaría combinar su masaje con una experiencia de hidroterapia?" },
      { who: "concierge", en: "Is there anything about your health or comfort that our therapist should know before your treatment?", es: "¿Hay algo sobre su salud o su comodidad que nuestra terapeuta deba saber antes de su tratamiento?" },
      { who: "concierge", en: "Thank you for sharing your preferences. Based on what you have told me, I can recommend two options that may be a good fit for your experience.", es: "Gracias por compartir sus preferencias. De acuerdo con lo que me ha comentado, puedo recomendarle dos opciones que pueden ser ideales para su experiencia." },
    ],
  },
  {
    id: "swedish", icon: "💆", title: "Swedish Massage", titleEs: "Masaje sueco",
    standards: [
      "Técnicas: deslizamientos largos (effleurage), amasamiento (petrissage), fricción suave y movimientos rítmicos.",
      "Beneficios: favorece la relajación, puede ayudar a aliviar la tensión muscular cotidiana y ofrece una experiencia reconfortante de cuerpo completo.",
      "Huésped ideal: quien busca relajación general o su primer masaje.",
    ],
    lines: [
      { who: "concierge", en: "Our Swedish massage is an excellent choice if you are looking to unwind and disconnect from your daily routine.", es: "Nuestro masaje sueco es una excelente opción si busca relajarse y desconectarse de su rutina diaria." },
      { who: "concierge", en: "It combines long, flowing movements with gentle kneading to create a deeply relaxing experience. We can adjust the pressure to your preference.", es: "Combina movimientos largos y fluidos con un amasamiento suave para crear una experiencia profundamente relajante. Podemos ajustar la presión a su gusto." },
    ],
  },
  {
    id: "deep-tissue", icon: "💪", title: "Deep Tissue Massage", titleEs: "Masaje de tejido profundo",
    standards: [
      "Técnicas: presión lenta y sostenida, fricción focalizada y trabajo en capas musculares profundas, según la tolerancia del huésped.",
      "Beneficios: puede ayudar a aliviar la rigidez muscular persistente y mejorar la sensación de movilidad.",
      "Huésped ideal: quien prefiere trabajo focalizado en zonas de tensión, sujeto a la valoración de la terapeuta.",
    ],
    lines: [
      { who: "concierge", en: "If you experience persistent muscle tightness, our deep tissue massage may be a suitable option.", es: "Si tiene rigidez muscular persistente, nuestro masaje de tejido profundo puede ser una opción adecuada." },
      { who: "concierge", en: "This treatment uses slower, more focused pressure on selected areas. It is not necessarily more effective simply because it feels stronger, and your comfort is always our priority.", es: "Este tratamiento usa una presión más lenta y focalizada en zonas específicas. No es necesariamente más efectivo solo porque se sienta más fuerte, y su comodidad siempre es nuestra prioridad." },
    ],
  },
  {
    id: "aromatherapy", icon: "🌸", title: "Aromatherapy Massage", titleEs: "Masaje de aromaterapia",
    standards: [
      "Técnicas: movimientos de masaje relajantes combinados con aceites o mezclas aromáticas seleccionadas.",
      "Beneficios: crea una experiencia sensorial tranquilizante y puede favorecer la relajación y el manejo del estrés.",
      "Preguntar por sus aromas preferidos y por cualquier sensibilidad.",
    ],
    lines: [
      { who: "concierge", en: "Our aromatherapy massage combines soothing massage techniques with carefully selected aromatic oils to create a personalized sensory experience.", es: "Nuestro masaje de aromaterapia combina técnicas de masaje relajantes con aceites aromáticos cuidadosamente seleccionados para crear una experiencia sensorial personalizada." },
      { who: "concierge", en: "Would you prefer a fresh, floral, citrus, or more grounding aroma? We can review suitable options based on your preferences and any sensitivities.", es: "¿Prefiere un aroma fresco, floral, cítrico o uno más terroso? Podemos revisar las opciones adecuadas según sus preferencias y cualquier sensibilidad." },
    ],
  },
  {
    id: "hot-stone", icon: "🪨", title: "Hot Stone Massage", titleEs: "Masaje con piedras calientes",
    standards: [
      "Técnicas: piedras lisas a temperatura controlada combinadas con movimientos de masaje, según el protocolo del spa.",
      "Beneficios: calor reconfortante que favorece la relajación y alivia la sensación de rigidez muscular.",
      "La terapeuta verifica que el tratamiento sea adecuado y que la temperatura sea cómoda.",
    ],
    lines: [
      { who: "concierge", en: "For a more indulgent experience, I would recommend our hot stone massage.", es: "Para una experiencia más consentidora, le recomendaría nuestro masaje con piedras calientes." },
      { who: "concierge", en: "The gentle warmth of the stones is combined with flowing massage movements to create a comforting and relaxing ritual. Our therapist will verify that this treatment is appropriate for you and ensure the temperature remains comfortable.", es: "El calor suave de las piedras se combina con movimientos de masaje fluidos para crear un ritual reconfortante y relajante. Nuestra terapeuta verificará que este tratamiento sea adecuado para usted y que la temperatura sea cómoda." },
    ],
  },
  {
    id: "prenatal", icon: "🤰", title: "Prenatal Massage", titleEs: "Masaje prenatal",
    standards: [
      "Técnicas: masaje suave y adaptado, con posiciones y soportes adecuados, por una terapeuta capacitada.",
      "Beneficios: puede aliviar molestias musculares cotidianas y favorecer la relajación durante el embarazo, cuando sea clínicamente apropiado.",
      "Antes de recomendarlo, confirmar la etapa del embarazo y las precauciones del protocolo del spa.",
    ],
    lines: [
      { who: "concierge", en: "We offer a specialized prenatal massage designed around comfort and appropriate positioning.", es: "Ofrecemos un masaje prenatal especializado, diseñado para su comodidad y con la posición adecuada." },
      { who: "concierge", en: "Before recommending this treatment, our team will confirm the relevant pregnancy stage and any precautions required by our spa protocol. We want to ensure that the service is suitable for you.", es: "Antes de recomendarle este tratamiento, nuestro equipo confirmará la etapa del embarazo y las precauciones que exige nuestro protocolo. Queremos asegurarnos de que el servicio sea adecuado para usted." },
    ],
  },
  {
    id: "reflexology", icon: "🦶", title: "Reflexology", titleEs: "Reflexología",
    standards: [
      "Técnicas: presión focalizada con pulgares y dedos en zonas específicas de los pies o las manos.",
      "Beneficios: atención focalizada en pies o manos que puede favorecer la relajación y una sensación de bienestar.",
      "Huésped ideal: quien quiere un tratamiento de pies o una sesión de bienestar más corta.",
    ],
    lines: [
      { who: "concierge", en: "If you prefer a treatment that focuses on your feet rather than a full-body massage, reflexology may be a wonderful option.", es: "Si prefiere un tratamiento enfocado en los pies en lugar de un masaje de cuerpo completo, la reflexología puede ser una opción maravillosa." },
      { who: "concierge", en: "It uses targeted pressure on specific areas of the feet to create a focused, relaxing experience.", es: "Utiliza presión dirigida en zonas específicas de los pies para crear una experiencia focalizada y relajante." },
    ],
  },
  {
    id: "head-neck", icon: "🙆", title: "Head, Neck and Shoulder Massage", titleEs: "Cabeza, cuello y hombros",
    standards: [
      "Técnicas: amasamiento suave, movimientos circulares y presión controlada en zonas seleccionadas.",
      "Beneficios: puede aliviar la tensión cotidiana de cuello y hombros; es una pausa de relajación práctica.",
      "Huésped ideal: viajeros de negocios, huéspedes con poco tiempo y quien busca un tratamiento focalizado.",
    ],
    lines: [
      { who: "concierge", en: "If you spend long hours working, travelling or sitting at a desk, our head, neck and shoulder massage could be an excellent choice.", es: "Si pasa muchas horas trabajando, viajando o sentado(a) frente a un escritorio, nuestro masaje de cabeza, cuello y hombros puede ser una excelente opción." },
      { who: "concierge", en: "It focuses on commonly tense areas and is ideal when you would like to relax without booking a full-body treatment.", es: "Se enfoca en las zonas que suelen tensarse y es ideal cuando quiere relajarse sin reservar un tratamiento de cuerpo completo." },
    ],
  },
  {
    id: "thai", icon: "🧘", title: "Thai Massage", titleEs: "Masaje tailandés",
    standards: [
      "Técnicas: estiramientos asistidos, compresión rítmica y movimientos guiados, según la formación de la terapeuta y la movilidad del huésped.",
      "Beneficios: puede favorecer la sensación de flexibilidad, movimiento y relajación física.",
      "Huésped ideal: quien busca una experiencia activa y se siente cómodo con los estiramientos asistidos.",
    ],
    lines: [
      { who: "concierge", en: "Our Thai massage offers a different experience from a traditional oil massage.", es: "Nuestro masaje tailandés ofrece una experiencia distinta a la de un masaje tradicional con aceite." },
      { who: "concierge", en: "It combines rhythmic pressure with assisted stretching and guided movements. If you enjoy a more active treatment, this may be an interesting option for you.", es: "Combina presión rítmica con estiramientos asistidos y movimientos guiados. Si le gusta un tratamiento más activo, puede ser una opción interesante para usted." },
    ],
  },
  {
    id: "lymphatic", icon: "💧", title: "Lymphatic Drainage Massage", titleEs: "Drenaje linfático",
    standards: [
      "Técnicas: movimientos muy suaves y rítmicos para estimular el movimiento del líquido linfático.",
      "Beneficios: puede ayudar a la circulación linfática cuando está indicado y lo realiza un profesional calificado.",
      "Requiere valoración previa; no es un tratamiento general para bajar de peso ni de desintoxicación.",
    ],
    lines: [
      { who: "concierge", en: "Our lymphatic drainage treatment uses very gentle, rhythmic movements.", es: "Nuestro tratamiento de drenaje linfático utiliza movimientos muy suaves y rítmicos." },
      { who: "concierge", en: "Because this technique has specific indications and precautions, our trained professional will first determine whether it is appropriate for you and explain what you can reasonably expect from the session.", es: "Como esta técnica tiene indicaciones y precauciones específicas, nuestro profesional capacitado determinará primero si es adecuada para usted y le explicará qué puede esperar razonablemente de la sesión." },
    ],
  },
  {
    id: "services", icon: "🧴", title: "Additional Spa Services", titleEs: "Otros servicios del spa",
    standards: [
      "Conocer los demás servicios para recomendar el más adecuado: masaje deportivo, en pareja, de autor, exfoliación, envoltura, faciales y rituales.",
      "Confirmar siempre la disponibilidad de cabina y terapeutas antes de ofrecer un servicio en pareja.",
    ],
    lines: [
      { who: "concierge", en: "Our sports massage uses focused techniques selected for physical activity and muscle recovery preferences.", es: "Nuestro masaje deportivo utiliza técnicas focalizadas, elegidas para la actividad física y la recuperación muscular." },
      { who: "concierge", en: "In our couples massage, two guests receive their treatments together, subject to room and therapist availability.", es: "En nuestro masaje en pareja, dos huéspedes reciben su tratamiento juntos, sujeto a la disponibilidad de cabina y terapeutas." },
      { who: "concierge", en: "Our signature massage combines techniques, aromas and rituals that are unique to our Spa.", es: "Nuestro masaje de autor combina técnicas, aromas y rituales exclusivos de nuestro spa." },
      { who: "concierge", en: "A body scrub removes surface dead skin cells and leaves the skin feeling smoother.", es: "La exfoliación corporal elimina las células muertas de la superficie y deja la piel más suave." },
      { who: "concierge", en: "A body wrap uses products such as mineral-rich mud, clay or hydrating formulas, depending on our menu.", es: "La envoltura corporal utiliza productos como lodo rico en minerales, arcilla o fórmulas hidratantes, según nuestro menú." },
      { who: "concierge", en: "Our facial treatments include cleansing, exfoliation, masks and hydration tailored to your skin's needs.", es: "Nuestros faciales incluyen limpieza, exfoliación, mascarillas e hidratación adaptadas a las necesidades de su piel." },
      { who: "concierge", en: "Our foot ritual combines foot cleansing, exfoliation, massage and moisturizing.", es: "Nuestro ritual de pies combina limpieza, exfoliación, masaje e hidratación de los pies." },
      { who: "concierge", en: "Our couples wellness ritual is a coordinated experience that combines treatments and selected amenities for two guests.", es: "Nuestro ritual de bienestar en pareja es una experiencia coordinada que combina tratamientos y amenidades seleccionadas para dos huéspedes." },
    ],
  },
  {
    id: "hydrotherapy", icon: "♨️", title: "Hydrotherapy Sales Script", titleEs: "Venta de hidroterapia",
    standards: [
      "Presentar el circuito y sus áreas: alberca de vitalidad, jacuzzi, sauna, vapor, regaderas de experiencia, inmersión fría y sala de relajación.",
      "Ofrecer la combinación de masaje e hidroterapia, respetando la secuencia recomendada y las indicaciones de seguridad.",
      "Si pregunta el precio: decir qué incluye el paquete, su duración y su precio real, y ofrecer revisar horarios.",
    ],
    lines: [
      { who: "concierge", en: "Our Spa also offers a hydrotherapy experience, which allows you to enjoy a selection of water-based wellness facilities in a relaxing environment.", es: "Nuestro spa también ofrece una experiencia de hidroterapia, que le permite disfrutar de una selección de instalaciones de bienestar con agua en un ambiente relajante." },
      { who: "concierge", en: "Your experience may feature a vitality pool, whirlpool, sauna, steam room, experience showers and a relaxation lounge.", es: "Su experiencia puede incluir alberca de vitalidad, jacuzzi, sauna, vapor, regaderas de experiencia y sala de relajación." },
      { who: "concierge", en: "Many guests enjoy combining hydrotherapy with a massage because it creates a more complete spa visit. I would be happy to explain our available packages and help you choose the option that best fits your schedule.", es: "Muchos huéspedes disfrutan combinar la hidroterapia con un masaje porque hace su visita al spa más completa. Con gusto le explico nuestros paquetes disponibles y le ayudo a elegir la opción que mejor se adapte a su horario." },
      { who: "concierge", en: "If you have enough time, I would recommend considering our massage and hydrotherapy combination, subject to our recommended sequence and safety guidelines.", es: "Si tiene tiempo suficiente, le recomendaría considerar nuestra combinación de masaje e hidroterapia, siguiendo nuestra secuencia recomendada y las indicaciones de seguridad." },
      { who: "concierge", en: "Would you prefer a 60-minute massage with hydrotherapy access, or would you like me to explain our longer wellness packages?", es: "¿Prefiere un masaje de 60 minutos con acceso a la hidroterapia, o le gustaría que le explique nuestros paquetes de bienestar más largos?" },
      { who: "guest", en: "How much is the package?", es: "¿Cuánto cuesta el paquete?" },
      { who: "concierge", en: "It is a convenient way to enjoy both our wellness facilities and a personalized treatment in one visit. Shall I check the available times for you?", es: "Es una forma práctica de disfrutar de nuestras instalaciones de bienestar y de un tratamiento personalizado en una sola visita. ¿Le reviso los horarios disponibles?" },
    ],
  },
  {
    id: "upselling", icon: "📈", title: "Upselling and Cross-selling", titleEs: "Venta superior y complementaria",
    standards: [
      "Venta según necesidades: la recomendación sigue la preferencia del huésped, no una mejora arbitraria.",
      "Mejora de duración: explicar la diferencia y pedir permiso antes de hablar del precio.",
      "Venta complementaria: ofrecer un servicio relevante sin presionar.",
      "Paquetes: comparar precios e inclusiones reales, sin prometer ahorros no verificados.",
      "Ocasiones especiales: conectar la oferta con la celebración y ser honesto con la disponibilidad.",
    ],
    lines: [
      { who: "guest", en: "I would like a relaxing massage.", es: "Me gustaría un masaje relajante." },
      { who: "concierge", en: "Certainly. To help me recommend the most suitable option, may I ask whether you prefer a gentle, relaxing massage or a treatment with more focused pressure?", es: "Claro. Para recomendarle la opción más adecuada, ¿puedo preguntarle si prefiere un masaje suave y relajante o un tratamiento con presión más focalizada?" },
      { who: "guest", en: "I would like a 60-minute massage.", es: "Quisiera un masaje de 60 minutos." },
      { who: "concierge", en: "Our 60-minute massage is an excellent option. If you would like additional time to unwind, we also offer a 90-minute version. Would you like me to explain the price difference?", es: "Nuestro masaje de 60 minutos es una excelente opción. Si desea más tiempo para relajarse, también tenemos la versión de 90 minutos. ¿Le gustaría que le explique la diferencia de precio?" },
      { who: "concierge", en: "To complement your massage, you may also enjoy our hydrotherapy facilities, if they are included in your selected package and suitable for you. Would you like to hear about the available options?", es: "Para complementar su masaje, también puede disfrutar de nuestras instalaciones de hidroterapia, si están incluidas en su paquete y son adecuadas para usted. ¿Le gustaría conocer las opciones disponibles?" },
      { who: "concierge", en: "We have individual treatments as well as wellness packages. I can compare the total price, duration and included services so you can decide which option offers the best value for your preferences.", es: "Tenemos tratamientos individuales y también paquetes de bienestar. Puedo compararle el precio total, la duración y los servicios incluidos para que decida qué opción le ofrece el mejor valor." },
      { who: "concierge", en: "If you are celebrating a special occasion, we can explore our signature treatments or couples experiences. Depending on availability, we may be able to arrange additional touches to make your visit more memorable.", es: "Si está celebrando una ocasión especial, podemos ver nuestros tratamientos de autor o las experiencias en pareja. Según la disponibilidad, podríamos preparar algunos detalles adicionales para que su visita sea más memorable." },
    ],
  },
  {
    id: "objections", icon: "🤝", title: "Handling Sales Objections", titleEs: "Manejo de objeciones",
    standards: [
      "Responder con empatía, ofrecer alternativas y nunca presionar.",
      "Nunca garantizar un resultado de salud: la terapeuta explica el tratamiento y valora si es adecuado.",
    ],
    lines: [
      { who: "guest", en: "That is too expensive.", es: "Eso es demasiado caro." },
      { who: "concierge", en: "I completely understand. We also offer other treatments at different price points. May I suggest an option that better matches your budget?", es: "Lo entiendo perfectamente. También tenemos otros tratamientos con distintos precios. ¿Puedo sugerirle una opción que se ajuste mejor a su presupuesto?" },
      { who: "guest", en: "I don't have enough time.", es: "No tengo suficiente tiempo." },
      { who: "concierge", en: "Of course. We can explore our shorter treatments and check the available appointment times.", es: "Por supuesto. Podemos ver nuestros tratamientos más cortos y revisar los horarios disponibles." },
      { who: "guest", en: "I don't know which massage to choose.", es: "No sé qué masaje elegir." },
      { who: "concierge", en: "I'd be happy to help. Are you primarily looking for relaxation, focused muscle work or a sensory experience with aromatic oils?", es: "Con gusto le ayudo. ¿Busca principalmente relajación, un trabajo muscular focalizado o una experiencia sensorial con aceites aromáticos?" },
      { who: "guest", en: "I already have a massage booked elsewhere.", es: "Ya tengo un masaje reservado en otro lugar." },
      { who: "concierge", en: "Certainly. In that case, you might be interested in exploring our facials, body treatments or hydrotherapy facilities instead.", es: "Claro. En ese caso, quizás le interese conocer nuestros faciales, tratamientos corporales o las instalaciones de hidroterapia." },
      { who: "guest", en: "I need to think about it.", es: "Necesito pensarlo." },
      { who: "concierge", en: "Absolutely. Please take your time. I can provide the treatment details and prices so you can review them at your convenience.", es: "Por supuesto. Tómese su tiempo. Puedo darle los detalles y precios de los tratamientos para que los revise cuando guste." },
      { who: "guest", en: "Can you guarantee that this massage will relieve my pain?", es: "¿Me puede garantizar que este masaje me quitará el dolor?" },
      { who: "concierge", en: "Every guest responds differently. Our therapist can explain the treatment approach and assess whether it is appropriate for you, but we cannot guarantee a particular result.", es: "Cada huésped responde de manera diferente. Nuestra terapeuta puede explicarle el tratamiento y valorar si es adecuado para usted, pero no podemos garantizar un resultado específico." },
    ],
  },
  {
    id: "closing", icon: "📅", title: "Closing the Sale", titleEs: "Cierre y confirmación",
    standards: [
      "Confirmar tratamiento, duración, precio (con impuestos o cargos), fecha, hora y servicios adicionales antes de reservar.",
      "No prometer terapeuta, cabina, horario ni amenidad especial hasta verificar la disponibilidad.",
      "Indicar con cuánta anticipación debe llegar e informar la política de cancelación.",
      "El tratamiento, el precio y los horarios de este diálogo son ejemplos: usar siempre los del menú vigente del spa.",
    ],
    lines: [
      { who: "concierge", en: "Based on your preferences, I would recommend our aromatherapy massage, which lasts 60 minutes.", es: "Según sus preferencias, le recomendaría nuestro masaje de aromaterapia, que dura 60 minutos." },
      { who: "concierge", en: "We currently have 3:00 p.m. available. Would you prefer that appointment, or would another time be more convenient?", es: "En este momento tenemos disponible a las 3:00 p.m. ¿Prefiere ese horario o le convendría otro?" },
      { who: "guest", en: "Three o'clock is perfect.", es: "A las tres está perfecto." },
      { who: "concierge", en: "Before confirming, let me review the details with you: the treatment, the duration, the price with applicable taxes, the date and time, and any additional services.", es: "Antes de confirmar, permítame revisar los detalles con usted: el tratamiento, la duración, el precio con impuestos aplicables, la fecha y la hora, y los servicios adicionales." },
      { who: "concierge", en: "Would you like me to proceed with the reservation?", es: "¿Desea que proceda con la reservación?" },
      { who: "guest", en: "Yes, please.", es: "Sí, por favor." },
      { who: "concierge", en: "Wonderful. Your appointment has been confirmed for today at 3:00 p.m. We recommend arriving 30 minutes before your treatment to allow sufficient time for check-in and any required consultation.", es: "Excelente. Su cita quedó confirmada para hoy a las 3:00 p.m. Le recomendamos llegar 30 minutos antes de su tratamiento para tener tiempo suficiente para el registro y la consulta necesaria." },
      { who: "concierge", en: "If you have any questions before your visit, please do not hesitate to contact us. Thank you for choosing our Spa. We look forward to welcoming you and providing you with a memorable wellness experience.", es: "Si tiene alguna pregunta antes de su visita, no dude en contactarnos. Gracias por elegir nuestro spa. Esperamos recibirle y brindarle una experiencia de bienestar memorable." },
    ],
  },
  {
    id: "safety", icon: "🛡️", title: "Safety and Service Standards", titleEs: "Seguridad y estándares",
    standards: [
      "Nunca diagnosticar una condición médica ni garantizar un resultado de salud.",
      "Canalizar con el profesional calificado las preguntas sobre embarazo, lesiones, problemas cardiovasculares, alergias y otras contraindicaciones.",
      "Nunca recomendar calor, inmersión fría o masaje si el huésped no ha completado la evaluación de seguridad.",
      "Confirmar consentimiento, preferencia de presión y sensibilidades con el proceso aprobado.",
      "Proteger la privacidad del huésped y manejar su información de salud de forma confidencial.",
      "Ofrecer mejoras y servicios adicionales de forma ética, según las necesidades y el presupuesto del huésped.",
    ],
    lines: [
      { who: "concierge", en: "Subject to professional assessment, our therapist will confirm whether this treatment is suitable for you.", es: "Sujeto a valoración profesional, nuestra terapeuta confirmará si este tratamiento es adecuado para usted." },
      { who: "concierge", en: "Before your treatment, we will ask you to complete a brief health questionnaire.", es: "Antes de su tratamiento, le pediremos que llene un breve cuestionario de salud." },
      { who: "concierge", en: "Your health information will be handled confidentially.", es: "Su información de salud se manejará de forma confidencial." },
      { who: "concierge", en: "Let me verify availability before confirming your therapist and treatment room.", es: "Permítame verificar la disponibilidad antes de confirmar su terapeuta y su cabina." },
    ],
  },
  {
    id: "roleplay", icon: "🎭", title: "Final Role-play", titleEs: "Role-play final",
    standards: [
      "Escenario: un huésped quiere relajarse, tiene un presupuesto de 200 dólares y no sabe si reservar hidroterapia.",
      "Lista de práctica: saludar con calidez, hacer preguntas abiertas y escuchar, explicar al menos dos masajes, describir beneficios sin promesas médicas.",
      "Ofrecer una mejora o servicio complementario sin presionar, manejar al menos dos objeciones y confirmar todos los detalles de la reservación.",
      "Reconocer cuándo una pregunta de salud debe canalizarse con un profesional y mantener un tono tranquilo y profesional.",
    ],
    lines: [
      { who: "concierge", en: "Good afternoon, and welcome to our Spa. It would be my pleasure to help you choose the right experience. May I ask whether you are primarily looking for relaxation, muscle tension relief or a combination of wellness treatments?", es: "Buenas tardes y bienvenido(a) a nuestro spa. Será un placer ayudarle a elegir la experiencia adecuada. ¿Puedo preguntarle si busca principalmente relajación, alivio de la tensión muscular o una combinación de tratamientos de bienestar?" },
      { who: "guest", en: "I want to relax, but I don't want to spend more than 200 dollars.", es: "Quiero relajarme, pero no quiero gastar más de 200 dólares." },
      { who: "concierge", en: "Certainly. We can work within your budget. I would be happy to compare our relaxation massage options and check whether any hydrotherapy packages fit your price range. Do you prefer a 60-minute treatment, or would you consider a shorter experience?", es: "Claro. Podemos ajustarnos a su presupuesto. Con gusto le comparo nuestras opciones de masaje relajante y reviso si algún paquete de hidroterapia entra en su presupuesto. ¿Prefiere un tratamiento de 60 minutos o consideraría una experiencia más corta?" },
      { who: "guest", en: "I would prefer 60 minutes.", es: "Preferiría 60 minutos." },
      { who: "concierge", en: "Wonderful. Let me check the current prices and availability. I will present the options that fit your budget, including any applicable hydrotherapy access, so you can make an informed decision.", es: "Excelente. Permítame revisar los precios y la disponibilidad actuales. Le presentaré las opciones que se ajustan a su presupuesto, incluido el acceso a la hidroterapia si aplica, para que decida con toda la información." },
      { who: "guest", en: "That sounds good.", es: "Me parece bien." },
      { who: "concierge", en: "Excellent. I will review the details with you, including the duration, total price and what is included, before we confirm your appointment.", es: "Perfecto. Revisaré los detalles con usted, incluida la duración, el precio total y lo que incluye, antes de confirmar su cita." },
    ],
  },
];

// Vocabulario profesional de ventas (en, pronunciación IPA, es).
const CONCIERGE_VOCAB = [
  {
    title: "Sales and revenue management", titleEs: "Ventas e ingresos",
    words: [
      { en: "Sales consultation", pron: "/seɪlz ˌkɑːnsəlˈteɪʃən/", es: "Consulta de venta" },
      { en: "Guest needs assessment", pron: "/ɡest niːdz əˈsesmənt/", es: "Evaluación de necesidades" },
      { en: "Treatment recommendation", pron: "/ˈtriːtmənt ˌrekəmənˈdeɪʃən/", es: "Recomendación de tratamiento" },
      { en: "Upselling", pron: "/ˈʌpˌselɪŋ/", es: "Venta de una opción superior" },
      { en: "Cross-selling", pron: "/ˈkrɔːsˌselɪŋ/", es: "Venta complementaria" },
      { en: "Add-on service", pron: "/ˈæd ɑːn ˈsɜːrvɪs/", es: "Servicio adicional" },
      { en: "Treatment upgrade", pron: "/ˈtriːtmənt ˈʌpɡreɪd/", es: "Mejora del tratamiento" },
      { en: "Package deal", pron: "/ˈpækɪdʒ diːl/", es: "Paquete de servicios" },
      { en: "Average transaction value", pron: "/ˈævərɪdʒ trænˈzækʃən ˈvæljuː/", es: "Valor promedio por transacción" },
      { en: "Conversion rate", pron: "/kənˈvɜːrʒən reɪt/", es: "Tasa de conversión" },
      { en: "Revenue per treatment", pron: "/ˈrevənuː pər ˈtriːtmənt/", es: "Ingreso por tratamiento" },
      { en: "Booking confirmation", pron: "/ˈbʊkɪŋ ˌkɑːnfərˈmeɪʃən/", es: "Confirmación de reservación" },
      { en: "Availability", pron: "/əˌveɪləˈbɪləti/", es: "Disponibilidad" },
      { en: "Cancellation policy", pron: "/ˌkænsəˈleɪʃən ˈpɑːləsi/", es: "Política de cancelación" },
      { en: "Repeat booking", pron: "/rɪˈpiːt ˈbʊkɪŋ/", es: "Reservación recurrente" },
    ],
  },
  {
    title: "Massage techniques and benefits", titleEs: "Técnicas y beneficios del masaje",
    words: [
      { en: "Effleurage", pron: "/ˌefləˈrɑːʒ/", es: "Deslizamientos largos" },
      { en: "Petrissage", pron: "/ˌpetrɪˈsɑːʒ/", es: "Amasamiento" },
      { en: "Friction", pron: "/ˈfrɪkʃən/", es: "Fricción" },
      { en: "Compression", pron: "/kəmˈpreʃən/", es: "Compresión" },
      { en: "Percussion", pron: "/pərˈkʌʃən/", es: "Percusión" },
      { en: "Assisted stretching", pron: "/əˈsɪstɪd ˈstretʃɪŋ/", es: "Estiramiento asistido" },
      { en: "Light pressure", pron: "/laɪt ˈpreʃər/", es: "Presión ligera" },
      { en: "Medium pressure", pron: "/ˈmiːdiəm ˈpreʃər/", es: "Presión media" },
      { en: "Firm pressure", pron: "/fɜːrm ˈpreʃər/", es: "Presión firme" },
      { en: "Muscle tension", pron: "/ˈmʌsəl ˈtenʃən/", es: "Tensión muscular" },
      { en: "Relaxation", pron: "/ˌriːlækˈseɪʃən/", es: "Relajación" },
      { en: "Range of motion", pron: "/reɪndʒ əv ˈmoʊʃən/", es: "Amplitud de movimiento" },
      { en: "Aromatic oils", pron: "/ˌærəˈmætɪk ɔɪlz/", es: "Aceites aromáticos" },
      { en: "Skin exfoliation", pron: "/skɪn ˌekˌsfoʊliˈeɪʃən/", es: "Exfoliación de la piel" },
      { en: "Hydration", pron: "/haɪˈdreɪʃən/", es: "Hidratación" },
      { en: "Personalized treatment", pron: "/ˈpɜːrsənəlaɪzd ˈtriːtmənt/", es: "Tratamiento personalizado" },
    ],
  },
  {
    title: "Professional benefit phrases", titleEs: "Frases profesionales de beneficio",
    words: [
      { en: "Designed to promote relaxation", es: "Diseñado para favorecer la relajación" },
      { en: "May help ease muscle tension", es: "Puede ayudar a aliviar la tensión muscular" },
      { en: "Tailored to your preferences", es: "Adaptado a sus preferencias" },
      { en: "A soothing wellness experience", es: "Una experiencia de bienestar reconfortante" },
      { en: "A more targeted treatment", es: "Un tratamiento más focalizado" },
      { en: "A full-body relaxation experience", es: "Una experiencia de relajación de cuerpo completo" },
      { en: "Subject to professional assessment", es: "Sujeto a valoración profesional" },
      { en: "Available in different durations", es: "Disponible en distintas duraciones" },
      { en: "A complementary wellness experience", es: "Una experiencia de bienestar complementaria" },
      { en: "Let me explain the differences", es: "Permítame explicarle las diferencias" },
    ],
  },
];

// Indicadores de desempeño en ventas (KPI) con su fórmula de referencia.
const CONCIERGE_KPIS = [
  { en: "Conversion Rate", es: "Tasa de conversión", formula: "Reservaciones confirmadas ÷ consultas calificadas × 100" },
  { en: "Upselling Rate", es: "Tasa de venta superior", formula: "Reservaciones con mejora ÷ reservaciones elegibles × 100" },
  { en: "Cross-selling Rate", es: "Tasa de venta complementaria", formula: "Reservaciones con servicio adicional ÷ reservaciones elegibles × 100" },
  { en: "Average Transaction Value", es: "Valor promedio por transacción", formula: "Ingresos totales por ventas ÷ número de transacciones" },
  { en: "Revenue per Available Treatment Hour", es: "Ingreso por hora de tratamiento disponible", formula: "Ingresos por tratamientos ÷ horas de tratamiento disponibles" },
  { en: "Guest Satisfaction Score", es: "Índice de satisfacción del huésped", formula: "Respuestas de satisfacción positivas ÷ total de respuestas válidas × 100" },
];
