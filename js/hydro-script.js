// Script de hidroterapia: guion del valet de spa durante el circuito de hidroterapia, en inglés y español.
// Sigue la secuencia de servicio del spa del hotel (Valet Spa Script 2024: bienvenida, casilleros, sauna,
// vapor, tina fría, alberca dinámica, jacuzzi, descanso, cambio y entrega a la terapeuta), con el inglés corregido,
// más las preguntas de salud y las pautas de seguridad del "Hydrotherapy Spa Service Script".
// Mismo formato que js/service-script.js: standards = pautas y seguridad de cada etapa (en español). who: "valet" o "guest".

const HYDRO_SCRIPT = [
  {
    id: "welcome", icon: "👋", title: "Welcome", titleEs: "Bienvenida",
    standards: [
      "Saludar según la hora del día, con una sonrisa y contacto visual, y presentarse con su nombre.",
      "Llamar al huésped por su apellido (Mr. / Mrs. / Ms.) durante todo el servicio.",
      "Confirmar el horario de su cita y si su masaje es antes o después de la hidroterapia.",
    ],
    lines: [
      { who: "valet", en: "Good morning, welcome to Relax Spa. Let me introduce myself: my name is Carlos, and I will be your valet today.", es: "Buenos días, bienvenido a Relax Spa. Permítame presentarme: mi nombre es Carlos y seré su valet el día de hoy." },
      { who: "guest", en: "Good morning, Carlos. Nice to meet you.", es: "Buenos días, Carlos. Mucho gusto." },
      { who: "valet", en: "Mr. Jackson, this way, please. You have a massage and hydrotherapy at nine o'clock, right?", es: "Sr. Jackson, por aquí, por favor. Tiene un masaje e hidroterapia a las nueve, ¿cierto?" },
      { who: "guest", en: "Yes, that's right.", es: "Sí, así es." },
      { who: "valet", en: "Excuse me, is your massage before or after the hydrotherapy?", es: "Disculpe, ¿su masaje es antes o después de la hidroterapia?" },
      { who: "guest", en: "After the hydrotherapy.", es: "Después de la hidroterapia." },
      { who: "valet", en: "Perfect. Then we will start with the hydrotherapy circuit.", es: "Perfecto. Entonces comenzaremos con el circuito de hidroterapia." },
    ],
  },
  {
    id: "gentlemen-area", icon: "🚻", title: "Gentlemen's Area", titleEs: "Área de caballeros",
    standards: [
      "Mostrar el área de caballeros (o de damas) y señalar las amenidades, los baños y las regaderas.",
      "Caminar al lado o un paso adelante del huésped e indicar con la mano abierta.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, welcome to the gentlemen's area. This is the amenities counter, and here are the restrooms and the showers.", es: "Sr. Jackson, bienvenido al área de caballeros. Este es el mostrador de amenidades, y aquí están los baños y las regaderas." },
      { who: "guest", en: "Great, thank you.", es: "Excelente, gracias." },
      { who: "valet", en: "You will find shampoo, conditioner, body lotion and a hairdryer here, for after your treatment.", es: "Aquí encontrará shampoo, acondicionador, crema corporal y secadora de cabello, para después de su tratamiento." },
    ],
  },
  {
    id: "locker", icon: "🔐", title: "Locker Room", titleEs: "Área de casilleros",
    standards: [
      "Indicar el número de casillero y lo que hay adentro: bata, sandalias y toalla.",
      "Explicar que para el circuito se usan sandalias, toalla y traje de baño.",
      "Si el huésped no trae traje de baño, explicar con amabilidad que es necesario para usar las instalaciones.",
      "Explicar cómo programar el código del casillero y ofrecer privacidad para cambiarse.",
      "Recomendar dejar las alhajas y los artículos personales dentro del casillero durante el circuito.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, this is the locker room. Your locker is number twelve. Inside the locker, you will find a robe, sandals and a towel.", es: "Sr. Jackson, esta es el área de casilleros. Su casillero es el número doce. Dentro del casillero encontrará una bata, sandalias y una toalla." },
      { who: "valet", en: "For the hydrotherapy circuit, you will need your sandals, your towel and your bathing suit.", es: "Para el circuito de hidroterapia, necesitará sus sandalias, su toalla y su traje de baño." },
      { who: "guest", en: "I'm sorry, I didn't bring my bathing suit.", es: "Disculpe, no traje mi traje de baño." },
      { who: "valet", en: "Mr. Jackson, to enjoy the spa facilities, it is necessary to wear a bathing suit. We invite you to bring one.", es: "Sr. Jackson, para disfrutar de las instalaciones del spa es necesario usar traje de baño. Le invitamos a traer uno." },
      { who: "valet", en: "Allow me to explain how to use the locker. First, choose four numbers for your security code. Then turn the knob to the right, and finally scramble the numbers.", es: "Permítame explicarle cómo usar el casillero. Primero, elija cuatro números para su código de seguridad. Luego gire la perilla a la derecha y, por último, revuelva los números." },
      { who: "valet", en: "We recommend leaving your jewelry and any personal items inside the locker, for your comfort during the hydrotherapy circuit.", es: "Le recomendamos dejar sus alhajas y cualquier artículo personal dentro del casillero, para su mayor comodidad durante el circuito de hidroterapia." },
      { who: "guest", en: "Four numbers, then turn and scramble. Got it. I'll leave my watch inside.", es: "Cuatro números, luego girar y revolver. Entendido. Dejaré mi reloj adentro." },
      { who: "valet", en: "You can use the dressing room, or if you prefer, you can change here.", es: "Puede usar el vestidor o, si lo prefiere, puede cambiarse aquí." },
      { who: "valet", en: "To give you some privacy, I will be waiting for you outside.", es: "Para darle privacidad, lo estaré esperando afuera." },
    ],
  },
  {
    id: "before", icon: "🩺", title: "Before the Circuit", titleEs: "Antes de comenzar",
    standards: [
      "Ofrecer el baño antes de comenzar el circuito, con discreción: dar la información sin preguntar directamente.",
      "Hacer siempre las preguntas de salud. Si el huésped reporta una condición relevante, no recomendar automáticamente sauna, vapor, tina fría o jacuzzi: consultar el protocolo médico y de seguridad del spa.",
      "Explicar las reglas: no se permiten aparatos electrónicos en el sauna ni en el vapor, ni alimentos dentro del área de hidroterapia.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, before we begin the circuit, the restroom is right here, should you need it.", es: "Sr. Jackson, antes de comenzar el circuito, el baño está aquí mismo, por si lo necesita." },
      { who: "guest", en: "Thank you, I'm fine.", es: "Gracias, estoy bien." },
      { who: "valet", en: "Before we begin, may I ask you a few questions to make sure the circuit is safe and comfortable for you?", es: "Antes de comenzar, ¿me permite hacerle algunas preguntas para asegurarnos de que el circuito sea seguro y cómodo para usted?" },
      { who: "valet", en: "Do you have high blood pressure or any heart condition?", es: "¿Tiene presión arterial alta o alguna afección cardíaca?" },
      { who: "valet", en: "Have you had any recent surgeries or injuries?", es: "¿Ha tenido alguna cirugía o lesión reciente?" },
      { who: "valet", en: "Are you taking any medication that may affect your circulation or heat tolerance?", es: "¿Toma algún medicamento que pueda afectar su circulación o su tolerancia al calor?" },
      { who: "guest", en: "No, I'm in good health.", es: "No, estoy bien de salud." },
      { who: "valet", en: "Thank you. Please remember that electronic devices are not allowed inside the sauna or the steam room. They can cause a short circuit and an injury.", es: "Gracias. Por favor, recuerde que no se permiten aparatos electrónicos dentro del sauna ni del cuarto de vapor. Pueden provocar un cortocircuito y una lesión." },
      { who: "valet", en: "Also, meals are not allowed in the hydrotherapy area. You can have them after your treatment.", es: "Además, no se permite comer en el área de hidroterapia. Podrá hacerlo al terminar su tratamiento." },
    ],
  },
  {
    id: "sauna", icon: "🔥", title: "Sauna", titleEs: "Sauna",
    standards: [
      "Pedir que deje las sandalias afuera y ofrecer ayuda con la toalla.",
      "Tiempo del spa: de 5 a 10 minutos. Preguntar cuánto tiempo desea quedarse y regresar a los 5 minutos.",
      "Indicar que salga de inmediato si siente mareo, debilidad, náuseas o incomodidad.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, please take your sandals off and leave them here.", es: "Sr. Jackson, por favor quítese las sandalias y déjelas aquí." },
      { who: "valet", en: "May I help you with your towel?", es: "¿Le ayudo con su toalla?" },
      { who: "guest", en: "Yes, thank you.", es: "Sí, gracias." },
      { who: "valet", en: "Let's start with the sauna for five to ten minutes. Would you like to sit down or lie down?", es: "Empecemos con el sauna durante cinco a diez minutos. ¿Le gustaría sentarse o acostarse?" },
      { who: "guest", en: "I'd like to lie down.", es: "Me gustaría acostarme." },
      { who: "valet", en: "Please lie down on the bench. How long would you like to stay inside?", es: "Por favor, acuéstese en la banca. ¿Cuánto tiempo le gustaría quedarse adentro?" },
      { who: "guest", en: "About eight minutes.", es: "Unos ocho minutos." },
      { who: "valet", en: "Perfect. If you feel dizzy or uncomfortable, please come out right away. Enjoy it, I will be back in five minutes.", es: "Perfecto. Si se siente mareado o incómodo, por favor salga de inmediato. Disfrútelo, regreso en cinco minutos." },
    ],
  },
  {
    id: "ice-breaking", icon: "💬", title: "Breaking the Ice", titleEs: "Rompiendo el hielo",
    standards: [
      "Al regresar, preguntar cómo se siente y hacer plática ligera, sin interrumpir la relajación.",
      "Usar lo que el huésped cuente para personalizar el resto del servicio.",
    ],
    lines: [
      { who: "valet", en: "How do you feel?", es: "¿Cómo se siente?" },
      { who: "guest", en: "Very relaxed, thank you.", es: "Muy relajado, gracias." },
      { who: "valet", en: "Where do you come from?", es: "¿De dónde nos visita?" },
      { who: "guest", en: "From Chicago.", es: "De Chicago." },
      { who: "valet", en: "Is this your first time at the hotel?", es: "¿Es su primera vez en el hotel?" },
      { who: "guest", en: "Yes, it is.", es: "Sí, lo es." },
      { who: "valet", en: "Have you visited a spa before?", es: "¿Ha visitado un spa antes?" },
      { who: "guest", en: "Yes, but never a hydrotherapy circuit.", es: "Sí, pero nunca un circuito de hidroterapia." },
      { who: "valet", en: "Then you will love it. I will guide you through every step.", es: "Entonces le va a encantar. Lo guiaré en cada paso." },
    ],
  },
  {
    id: "spa-bar", icon: "🍵", title: "The Spa Bar", titleEs: "Spa Bar",
    standards: [
      "Presentar el Spa Bar y ofrecer bebidas y snacks: hidratarse es importante entre los ambientes calientes.",
      "Mencionar las opciones disponibles del día.",
    ],
    lines: [
      { who: "valet", en: "This is our Lush Spa Bar. Would you like something to drink? We have chlorophyll water, alkaline water, and cold or hot tea.", es: "Este es nuestro Lush Spa Bar. ¿Le gustaría algo de beber? Tenemos agua de clorofila, agua alcalina y té frío o caliente." },
      { who: "guest", en: "Some alkaline water, please.", es: "Agua alcalina, por favor." },
      { who: "valet", en: "Certainly. We also have oatmeal cookies, dried fruit and fresh fruit.", es: "Con gusto. También tenemos galletas de avena, frutos secos y fruta natural." },
    ],
  },
  {
    id: "steam", icon: "♨️", title: "Steam Room", titleEs: "Cuarto de vapor",
    standards: [
      "Antes del vapor, pedir una ducha rápida: se jala la cadena hacia abajo.",
      "Ofrecer una toalla fría para refrescar la cara.",
      "Indicar que salga si siente demasiado calor o malestar.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, may I help you with your towel?", es: "Sr. Jackson, ¿le ayudo con su toalla?" },
      { who: "valet", en: "Before using the steam room, please take a quick shower. Just pull down the chain.", es: "Antes de usar el cuarto de vapor, por favor dese una ducha rápida. Solo jale la cadena hacia abajo." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "valet", en: "Yes, exactly. Let me give you a cool towel to refresh your face.", es: "Sí, exacto. Permítame darle una toalla fría para refrescar su cara." },
      { who: "valet", en: "The steam room helps to open and oxygenate the pores. If you feel too hot, please come out.", es: "El cuarto de vapor ayuda a abrir y oxigenar los poros. Si siente demasiado calor, por favor salga." },
    ],
  },
  {
    id: "cold-plunge", icon: "❄️", title: "Cold Plunge", titleEs: "Tina de agua fría",
    standards: [
      "La tina fría es opcional y breve: entrar y salir. No presionar al huésped.",
      "Explicar el beneficio: ayuda a regular la circulación y a cerrar los poros.",
      "Evitar que sumerja la cabeza. Ante síntomas preocupantes, detener y activar el procedimiento de emergencia.",
    ],
    lines: [
      { who: "valet", en: "Let's continue with the cold plunge. It helps to regulate your circulation and to close the pores.", es: "Continuemos con la tina de agua fría. Ayuda a regular la circulación y a cerrar los poros." },
      { who: "guest", en: "Is it very cold?", es: "¿Está muy fría?" },
      { who: "valet", en: "Yes, it is very cold, so please get in and out quickly. Hold the handrail, and please keep your head above the water.", es: "Sí, está muy fría, así que por favor entre y salga rápido. Sujétese del pasamanos y mantenga la cabeza fuera del agua." },
      { who: "valet", en: "It is optional, so you can skip it at any time.", es: "Es opcional, así que puede omitirla en cualquier momento." },
    ],
  },
  {
    id: "dynamic-pool", icon: "🌊", title: "Dynamic Pool", titleEs: "Alberca dinámica",
    standards: [
      "Explicar que en la alberca dinámica recibe un masaje con los chorros dentro del agua.",
      "Orden del spa: cama de burbujas (5 minutos), chorros a presión para cuello, hombros y espalda, y herradura de burbujas para los pies.",
      "Recordar que no pise ni cubra la rejilla blanca de succión del fondo.",
    ],
    lines: [
      { who: "valet", en: "We will continue with the dynamic pool, where you will receive a massage with the water jets.", es: "Continuaremos con la alberca dinámica, donde recibirá un masaje con los chorros de agua." },
      { who: "valet", en: "First, lie down on the bubble bed for five minutes.", es: "Primero, acuéstese en la cama de burbujas durante cinco minutos." },
      { who: "valet", en: "Then, stand under the pressure jets to relax your neck, shoulders and back.", es: "Después, párese bajo los chorros a presión para relajar el cuello, los hombros y la espalda." },
      { who: "valet", en: "Finally, stand on the bubble horseshoe to relax your feet.", es: "Por último, párese sobre la herradura de burbujas para relajar los pies." },
      { who: "valet", en: "Please do not step on or cover the white suction drain at the bottom of the pool.", es: "Por favor, no pise ni cubra la coladera blanca de succión en el fondo de la alberca." },
      { who: "guest", en: "This feels amazing.", es: "Esto se siente increíble." },
    ],
  },
  {
    id: "jacuzzi", icon: "🛁", title: "Hot Jacuzzi", titleEs: "Jacuzzi caliente",
    standards: [
      "Anunciar que es la última parte del circuito.",
      "Tiempo del spa: 10 minutos sentado dentro del jacuzzi. Indicar que salga si siente demasiado calor o mareo.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, we will continue with the last part of your hydrotherapy experience: the relaxing hot jacuzzi.", es: "Sr. Jackson, continuaremos con la última parte de su experiencia de hidroterapia: el relajante jacuzzi caliente." },
      { who: "valet", en: "Please sit down inside for ten minutes. If you feel too warm or dizzy, please step out slowly.", es: "Por favor, siéntese adentro durante diez minutos. Si siente demasiado calor o mareo, por favor salga despacio." },
      { who: "guest", en: "Thank you.", es: "Gracias." },
    ],
  },
  {
    id: "relax", icon: "🛋️", title: "Relaxation", titleEs: "Descanso",
    standards: [
      "Tiempo del spa: 10 minutos en el camastro o en las zonas de relajación.",
      "Avisar que regresará para acompañarlo al área de casilleros.",
    ],
    lines: [
      { who: "valet", en: "Finally, relax for ten minutes on the spa daybed or in the relaxation areas.", es: "Por último, relájese durante diez minutos en el camastro o en las zonas de relajación." },
      { who: "valet", en: "I will be back in a moment to escort you to the locker area.", es: "Regreso en un momento para acompañarlo al área de casilleros." },
      { who: "guest", en: "Perfect, thank you.", es: "Perfecto, gracias." },
    ],
  },
  {
    id: "change", icon: "👘", title: "Getting Ready for the Massage", titleEs: "Cambio para el masaje",
    standards: [
      "Pedir que se quite el traje de baño mojado y se ponga su ropa interior y la bata, para estar cómodo en el masaje.",
      "Esperar afuera para darle privacidad.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, to make sure you are comfortable during your massage, please remove your wet bathing suit and put on your underwear and robe.", es: "Sr. Jackson, para que esté cómodo durante su masaje, por favor quítese el traje de baño mojado y póngase su ropa interior y la bata." },
      { who: "guest", en: "Sure.", es: "Claro." },
      { who: "valet", en: "Take your time. I will be waiting for you outside.", es: "Tómese su tiempo. Lo espero afuera." },
    ],
  },
  {
    id: "handoff", icon: "🤝", title: "Meeting the Therapist", titleEs: "Entrega a la terapeuta",
    standards: [
      "Acompañar al huésped al área de relajación y presentarle a su terapeuta por su nombre.",
      "Si la terapeuta todavía no llega, avisar que llegará en un momento.",
    ],
    lines: [
      { who: "valet", en: "Mr. Jackson, allow me to escort you to the relaxation area for your massage.", es: "Sr. Jackson, permítame acompañarlo al área de relajación para su masaje." },
      { who: "valet", en: "Mr. Jackson, this is Maria, your therapist today.", es: "Sr. Jackson, ella es María, su terapeuta de hoy." },
      { who: "valet", en: "Your therapist will be here in a moment.", es: "Su terapeuta llegará en un momento." },
    ],
  },
  {
    id: "invitation", icon: "🌿", title: "Tea and Snacks", titleEs: "Invitación: té y snack",
    standards: [
      "Mientras espera, ofrecer té y snacks, mencionando las opciones y un beneficio.",
      "Confirmar el pedido y regresar enseguida.",
    ],
    lines: [
      { who: "valet", en: "Would you like some tea? We have pure green tea, chamomile, cranberry and apple, vanilla, mango and strawberry, and mint tea.", es: "¿Le gustaría un té? Tenemos té verde puro, manzanilla, arándano con manzana, vainilla, mango con fresa y té de menta." },
      { who: "guest", en: "Yes, I'll have vanilla tea.", es: "Sí, tomaré té de vainilla." },
      { who: "valet", en: "Certainly, I'll be right back.", es: "Con gusto, regreso enseguida." },
      { who: "valet", en: "Would you like to try an amaranth bar? It has honey, almonds, raisins and chocolate. It improves your mood and gives you energy.", es: "¿Le gustaría probar una barra de amaranto? Tiene miel, almendras, pasas y chocolate. Mejora el estado de ánimo y le da energía." },
      { who: "guest", en: "That sounds delicious, thank you.", es: "Suena delicioso, gracias." },
    ],
  },
  {
    id: "farewell", icon: "👋", title: "Farewell (hydrotherapy only)", titleEs: "Despedida (solo hidroterapia)",
    standards: [
      "Si el huésped solo tomó la hidroterapia: agradecer, desear que se sienta relajado y renovado, e invitarlo a regresar.",
      "Recordarle que se tome su tiempo para cambiarse.",
    ],
    lines: [
      { who: "valet", en: "Thank you for visiting Relax Spa, Mr. Jackson. I hope you enjoyed your hydrotherapy experience and feel relaxed and refreshed.", es: "Gracias por visitar Relax Spa, Sr. Jackson. Espero que haya disfrutado su experiencia de hidroterapia y se sienta relajado y renovado." },
      { who: "valet", en: "Please take your time getting ready. It was a pleasure assisting you. Have a wonderful day!", es: "Por favor, tómese su tiempo para arreglarse. Fue un placer atenderle. ¡Que tenga un excelente día!" },
      { who: "guest", en: "Thank you, Carlos. See you next time.", es: "Gracias, Carlos. Nos vemos la próxima vez." },
    ],
  },
  {
    id: "expressions", icon: "💬", title: "Essential Service Expressions", titleEs: "Expresiones esenciales",
    standards: [
      "Los tiempos de cada área son los del spa del hotel; se ajustan a las condiciones del huésped y al protocolo aprobado.",
      "Si el huésped presenta dolor en el pecho, dificultad para respirar, confusión o mareo intenso, detener la actividad y activar el procedimiento de emergencia.",
    ],
    lines: [
      { who: "valet", en: "This way, please.", es: "Por aquí, por favor." },
      { who: "valet", en: "Please follow me.", es: "Por favor, sígame." },
      { who: "valet", en: "Please watch your step. The floor is slippery.", es: "Por favor, tenga cuidado al pisar. El piso está resbaloso." },
      { who: "valet", en: "Take your time.", es: "Tómese su tiempo." },
      { who: "valet", en: "How do you feel?", es: "¿Cómo se siente?" },
      { who: "valet", en: "Would you like some water?", es: "¿Le gustaría un poco de agua?" },
      { who: "valet", en: "Please let me know if you need anything.", es: "Por favor, avíseme si necesita algo." },
      { who: "valet", en: "Your comfort and safety are our priority.", es: "Su comodidad y seguridad son nuestra prioridad." },
      { who: "valet", en: "Enjoy the rest of your day.", es: "Disfrute el resto de su día." },
    ],
  },
];
