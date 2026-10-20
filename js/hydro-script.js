// Script de hidroterapia: guion de la terapeuta durante el circuito de hidroterapia, en inglés y español.
// Fuente: "Hydrotherapy Spa Service Script" (Professional English Training · Luxury Spa Service).
// Mismo formato que js/service-script.js: standards = pautas y seguridad de cada etapa (en español).

const HYDRO_SCRIPT = [
  {
    id: "welcome", icon: "👋", title: "Welcome and Introduction", titleEs: "Bienvenida",
    standards: [
      "Saludar con calidez, presentarse con su nombre y explicar que le asistirá durante su experiencia de hidroterapia.",
      "Preguntar el nombre del huésped y si ha visitado el spa antes.",
      "Explicar que le guiará en cada etapa del circuito.",
    ],
    lines: [
      { who: "therapist", en: "Good morning, welcome to our Spa. My name is Ana, and I will be assisting you with your hydrotherapy experience today. It is a pleasure to have you with us.", es: "Buenos días, bienvenido(a) a nuestro spa. Mi nombre es Ana y hoy le asistiré durante su experiencia de hidroterapia. Es un placer recibirle." },
      { who: "therapist", en: "May I have your name, please?", es: "¿Me permite saber su nombre?" },
      { who: "guest", en: "Laura Smith.", es: "Laura Smith." },
      { who: "therapist", en: "Have you visited our Spa before?", es: "¿Ha visitado nuestro spa anteriormente?" },
      { who: "guest", en: "No, this is my first time.", es: "No, es mi primera vez." },
      { who: "therapist", en: "I will guide you through each step of the circuit.", es: "Le guiaré durante cada etapa del circuito." },
    ],
  },
  {
    id: "health", icon: "🩺", title: "Health Assessment", titleEs: "Evaluación de salud",
    standards: [
      "Hacer siempre las preguntas de salud antes de comenzar el circuito.",
      "Si el huésped reporta una condición relevante, no recomendar automáticamente sauna, vapor, inmersión fría o jacuzzi.",
      "Consultar el protocolo médico y de seguridad del spa y solicitar autorización médica cuando corresponda.",
    ],
    lines: [
      { who: "therapist", en: "Before we begin, I would like to ask you a few questions to ensure that your hydrotherapy experience is safe and comfortable.", es: "Antes de comenzar, me gustaría hacerle algunas preguntas para asegurar que su experiencia de hidroterapia sea segura y cómoda." },
      { who: "therapist", en: "Have you ever used a hydrotherapy circuit before?", es: "¿Ha utilizado un circuito de hidroterapia anteriormente?" },
      { who: "therapist", en: "Do you have high blood pressure or any heart conditions?", es: "¿Tiene presión arterial alta o alguna afección cardíaca?" },
      { who: "therapist", en: "Are you pregnant or could you be pregnant?", es: "¿Está embarazada o existe la posibilidad de que lo esté?" },
      { who: "therapist", en: "Have you had any recent surgeries or injuries?", es: "¿Ha tenido alguna cirugía o lesión reciente?" },
      { who: "therapist", en: "Do you have diabetes or any circulation problems?", es: "¿Tiene diabetes o problemas de circulación?" },
      { who: "therapist", en: "Are you taking any medication that may affect your circulation or heat tolerance?", es: "¿Toma algún medicamento que pueda afectar su circulación o tolerancia al calor?" },
      { who: "therapist", en: "Are you feeling well today?", es: "¿Se siente bien el día de hoy?" },
      { who: "therapist", en: "Thank you for sharing that information. If you have any medical concerns, I will consult our spa protocol before recommending the appropriate areas of the circuit.", es: "Gracias por compartir esa información. Si tiene alguna inquietud médica, consultaré nuestro protocolo del spa antes de recomendarle las áreas adecuadas del circuito." },
    ],
  },
  {
    id: "circuit", icon: "💧", title: "Explanation of the Hydrotherapy Circuit", titleEs: "Explicación del circuito",
    standards: [
      "Explicar que el circuito combina experiencias de agua y calor para la relajación y el bienestar.",
      "Explicar cómo usar cada área y la secuencia recomendada.",
    ],
    lines: [
      { who: "therapist", en: "Our hydrotherapy circuit combines different water and heat experiences designed to promote relaxation and well-being. I will explain how to use each area and guide you through the recommended sequence.", es: "Nuestro circuito de hidroterapia combina diferentes experiencias de agua y calor diseñadas para favorecer la relajación y el bienestar. Le explicaré cómo utilizar cada área y le guiaré por la secuencia recomendada." },
    ],
  },
  {
    id: "warm-shower", icon: "🚿", title: "Warm Shower", titleEs: "Ducha tibia",
    standards: [
      "Tiempo orientativo: 2 a 3 minutos, de acuerdo con el protocolo del spa.",
      "Confirmar que la temperatura del agua sea agradable para el huésped.",
    ],
    lines: [
      { who: "therapist", en: "We will begin with a warm shower to help you feel refreshed and prepare your body for the circuit. Please make sure the water temperature feels comfortable.", es: "Comenzaremos con una ducha tibia para refrescarse y preparar su cuerpo para el circuito. Por favor, asegúrese de que la temperatura del agua sea agradable." },
    ],
  },
  {
    id: "sauna", icon: "🔥", title: "Sauna — Dry Heat", titleEs: "Sauna (calor seco)",
    standards: [
      "Tiempo orientativo: 8 a 15 minutos, solo si es adecuado para el huésped y conforme al protocolo. No es una duración obligatoria.",
      "Indicar que salga de inmediato si siente mareo, debilidad, náuseas o incomodidad.",
    ],
    lines: [
      { who: "therapist", en: "This is our dry sauna. Please take a seat and relax. Start with a short session and leave immediately if you feel dizzy, weak, nauseated, or uncomfortable. Please let me know if you need any assistance.", es: "Esta es nuestra sauna seca. Por favor, tome asiento y relájese. Comience con una sesión corta y salga inmediatamente si siente mareo, debilidad, náuseas o incomodidad. Avíseme si necesita ayuda." },
    ],
  },
  {
    id: "cold-shower", icon: "🧊", title: "Cold Shower", titleEs: "Ducha fría",
    standards: [
      "La ducha fría es opcional y breve.",
      "Evitar los cambios bruscos de temperatura si no son adecuados para el huésped; puede omitir este paso en cualquier momento.",
    ],
    lines: [
      { who: "therapist", en: "If you feel comfortable, you may take a brief cool shower. Please avoid sudden temperature changes if they are not suitable for you. You can skip this step at any time.", es: "Si se siente cómodo(a), puede tomar una ducha fresca breve. Evite los cambios bruscos de temperatura si no son adecuados para usted. Puede omitir este paso en cualquier momento." },
    ],
  },
  {
    id: "steam", icon: "♨️", title: "Steam Room", titleEs: "Baño de vapor",
    standards: [
      "Tiempo orientativo: 8 a 12 minutos, solo si es tolerado y permitido por el protocolo; reducirlo u omitirlo cuando corresponda.",
      "Indicar que salga si siente demasiado calor o malestar.",
    ],
    lines: [
      { who: "therapist", en: "Welcome to our steam room. The warm, humid environment can be relaxing. Please remain seated if you prefer, breathe comfortably, and leave if you feel overheated or unwell.", es: "Bienvenido(a) a nuestro baño de vapor. El ambiente cálido y húmedo puede resultar relajante. Puede permanecer sentado(a), respirar cómodamente y salir si siente demasiado calor o malestar." },
    ],
  },
  {
    id: "cold-plunge", icon: "❄️", title: "Cold Plunge Pool", titleEs: "Piscina de inmersión fría",
    standards: [
      "La inmersión fría es opcional y puede no ser adecuada para todos; no presionar al huésped.",
      "Seguir el protocolo y supervisar según las normas del spa. Evitar que sumerja la cabeza.",
      "Interrumpir ante síntomas preocupantes y activar el procedimiento de emergencia.",
    ],
    lines: [
      { who: "therapist", en: "This is our cold plunge pool. Cold immersion is optional and may not be suitable for everyone. Please enter only if it is safe for you, follow my instructions, and avoid putting your head underwater. You may skip this experience at any time.", es: "Esta es nuestra piscina de inmersión fría. La inmersión en agua fría es opcional y puede no ser adecuada para todos. Entre únicamente si es seguro para usted, siga mis indicaciones y evite sumergir la cabeza. Puede omitir esta experiencia en cualquier momento." },
    ],
  },
  {
    id: "vitality-pool", icon: "🌊", title: "Vitality Pool", titleEs: "Piscina de vitalidad",
    standards: [
      "Indicar que entre con cuidado y use el pasamanos si lo necesita.",
      "Preguntar si la temperatura o los chorros le resultan cómodos.",
    ],
    lines: [
      { who: "therapist", en: "This is our vitality pool, where you can enjoy gentle water jets. Please enter carefully, hold the handrail if needed, and choose a position that feels comfortable. Let me know if the water temperature or jets feel uncomfortable.", es: "Esta es nuestra piscina de vitalidad, donde puede disfrutar de suaves chorros de agua. Entre con cuidado, sujétese del pasamanos si lo necesita y elija una posición cómoda. Avíseme si la temperatura o los chorros le resultan incómodos." },
    ],
  },
  {
    id: "whirlpool", icon: "🛁", title: "Whirlpool / Jacuzzi", titleEs: "Hidromasaje (jacuzzi)",
    standards: [
      "Respetar la temperatura y los límites de tiempo recomendados.",
      "Indicar que salga del agua e informe si siente demasiado calor, mareo o incomodidad.",
    ],
    lines: [
      { who: "therapist", en: "You may now enjoy our whirlpool, subject to the recommended temperature and time limits. Please enter and exit carefully. If you begin to feel too warm, dizzy, or uncomfortable, please leave the water and inform me.", es: "Ahora puede disfrutar de nuestro jacuzzi, respetando la temperatura y los límites de tiempo recomendados. Entre y salga con cuidado. Si comienza a sentir demasiado calor, mareo o incomodidad, salga del agua e infórmeme." },
    ],
  },
  {
    id: "lounge", icon: "🛋️", title: "Relaxation Lounge", titleEs: "Área de relajación",
    standards: [
      "Tiempo orientativo: 15 a 30 minutos, según las preferencias del huésped y el protocolo del spa.",
      "Invitar al huésped a tomarse su tiempo y relajarse.",
    ],
    lines: [
      { who: "therapist", en: "We have now completed the main stages of your hydrotherapy experience. Please make yourself comfortable in our relaxation lounge. Take your time, relax, and allow yourself to unwind.", es: "Hemos completado las principales etapas de su experiencia de hidroterapia. Por favor, póngase cómodo(a) en nuestra sala de relajación. Tómese su tiempo, relájese y disfrute de este momento de tranquilidad." },
    ],
  },
  {
    id: "hydration", icon: "🍵", title: "Hydration Service", titleEs: "Servicio de hidratación",
    standards: [
      "Ofrecer agua o té herbal: hidratarse es importante después de los ambientes cálidos.",
      "Preguntar si necesita algo más.",
    ],
    lines: [
      { who: "therapist", en: "May I offer you some water or herbal tea? Staying hydrated is important, especially after spending time in warm environments. Please let me know if there is anything else I can bring you.", es: "¿Puedo ofrecerle agua o una infusión de hierbas? Mantenerse hidratado es importante, especialmente después de pasar tiempo en ambientes cálidos. Por favor, dígame si puedo traerle algo más." },
      { who: "guest", en: "Some water, please.", es: "Agua, por favor." },
    ],
  },
  {
    id: "farewell", icon: "🌿", title: "Closing and Farewell", titleEs: "Despedida",
    standards: [
      "Agradecer la visita y desear que se sienta relajado(a) y renovado(a).",
      "Invitar a tomarse su tiempo para prepararse y a regresar pronto.",
    ],
    lines: [
      { who: "therapist", en: "Thank you for choosing our Spa. I hope you enjoyed your hydrotherapy experience and feel relaxed and refreshed. It was a pleasure assisting you today. Please take your time getting ready, and we look forward to welcoming you back soon. Have a wonderful day!", es: "Gracias por elegir nuestro spa. Espero que haya disfrutado su experiencia de hidroterapia y se sienta relajado(a) y renovado(a). Fue un placer atenderle el día de hoy. Tómese su tiempo para prepararse y esperamos recibirle nuevamente pronto. ¡Que tenga un excelente día!" },
    ],
  },
  {
    id: "expressions", icon: "💬", title: "Essential Service Expressions", titleEs: "Expresiones esenciales",
    standards: [
      "Dominar el saludo, la explicación de cada estación, las preguntas de salud, la supervisión segura, la hidratación y la despedida.",
      "Los tiempos y las temperaturas se ajustan a las condiciones del huésped y al protocolo aprobado del spa; no son indicaciones universales.",
      "Si el huésped presenta dolor en el pecho, dificultad para respirar, confusión o mareo intenso, detener la actividad y activar el procedimiento de emergencia.",
    ],
    lines: [
      { who: "therapist", en: "Please follow me.", es: "Por favor, sígame." },
      { who: "therapist", en: "Right this way.", es: "Por aquí, por favor." },
      { who: "therapist", en: "Please watch your step.", es: "Por favor, tenga cuidado al caminar." },
      { who: "therapist", en: "Take your time.", es: "Tómese su tiempo." },
      { who: "therapist", en: "Are you feeling comfortable?", es: "¿Se siente cómodo(a)?" },
      { who: "therapist", en: "Would you like some assistance?", es: "¿Le gustaría recibir ayuda?" },
      { who: "therapist", en: "Please let me know if you need anything.", es: "Por favor, avíseme si necesita algo." },
      { who: "therapist", en: "Your comfort and safety are our priority.", es: "Su comodidad y seguridad son nuestra prioridad." },
      { who: "therapist", en: "Is there anything else I can assist you with?", es: "¿Hay algo más en lo que pueda ayudarle?" },
      { who: "therapist", en: "Enjoy the rest of your day.", es: "Disfrute el resto de su día." },
    ],
  },
];
