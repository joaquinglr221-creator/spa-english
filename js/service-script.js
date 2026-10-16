// Service Script: guion de servicio de la terapeuta de spa, de la bienvenida a la despedida.
// Basado en "English for Spa Therapists – AAA Guest Service" (filosofía AAA: Welcome → Recognize →
// Discover → Anticipate → Personalize → Deliver → Follow up → Farewell; las 4 C: Cleanliness,
// Comfort, Cuisine, Consistency). who: "therapist" (terapeuta) o "guest" (huésped);
// avoid: la frase que NO se debe decir, en lugar de la correcta; video: su video corto
// (scripts/generar_videos.py).

const SERVICE_SCRIPT = [
  {
    id: "welcome", icon: "👋", title: "Welcome & Introduction", titleEs: "Bienvenida y presentación",
    video: "videos/script/welcome.mp4",
    standards: [
      "Recibir al huésped de pie, con contacto visual, una sonrisa y voz tranquila.",
      "Saludar según la hora del día y presentarse con su nombre y función.",
      "Usar el nombre del huésped en cuanto se conozca (Mr. / Mrs. / Ms. + apellido).",
      "Preguntar cómo se siente: desde el primer momento la experiencia es personal.",
    ],
    lines: [
      { who: "therapist", en: "Good afternoon. Welcome to our Spa.", es: "Buenas tardes. Bienvenida a nuestro spa." },
      { who: "therapist", en: "My name is Ana, and I will be your therapist today.", es: "Mi nombre es Ana y hoy seré su terapeuta." },
      { who: "guest", en: "Nice to meet you, Ana.", es: "Mucho gusto, Ana." },
      { who: "therapist", en: "It is a pleasure to have you with us. How are you feeling today?", es: "Es un placer tenerla con nosotros. ¿Cómo se siente hoy?" },
      { who: "guest", en: "A little tired, actually.", es: "Un poco cansada, la verdad." },
      { who: "therapist", en: "Then you came to the right place. We will take good care of you.", es: "Entonces llegó al lugar indicado. La vamos a cuidar muy bien." },
    ],
  },
  {
    id: "confirm", icon: "📋", title: "Confirming the Reservation", titleEs: "Confirmar la reservación",
    video: "videos/script/confirm.mp4",
    standards: [
      "Confirmar nombre, tratamiento, duración y hora antes de pasar a la cabina.",
      "Si hay un error en la reservación, resolverlo con calma y sin culpar al huésped.",
      "Acompañar al huésped a la cabina caminando a su paso; nunca señalar de lejos.",
    ],
    lines: [
      { who: "therapist", en: "May I have your name, please?", es: "¿Me permite su nombre, por favor?" },
      { who: "guest", en: "Smith. Laura Smith.", es: "Smith. Laura Smith." },
      { who: "therapist", en: "Thank you, Mrs. Smith. May I confirm your treatment?", es: "Gracias, señora Smith. ¿Me permite confirmar su tratamiento?" },
      { who: "therapist", en: "You are booked for a 60-minute relaxation massage at three o'clock. Is that correct?", es: "Tiene reservado un masaje relajante de 60 minutos a las tres. ¿Es correcto?" },
      { who: "guest", en: "Yes, that's right.", es: "Sí, así es." },
      { who: "therapist", en: "Wonderful. Please allow me to show you to the treatment room. Right this way, please.", es: "Excelente. Permítame acompañarla a la cabina. Por aquí, por favor." },
    ],
  },
  {
    id: "consultation", icon: "🩺", title: "Health & Wellness Consultation", titleEs: "Consulta de salud y bienestar",
    video: "videos/script/consultation.mp4",
    standards: [
      "Hacer siempre las preguntas de salud antes de comenzar (alergias, lesiones, embarazo, presión arterial, medicamentos).",
      "Preguntar en qué zonas quiere enfocarse y cuáles prefiere evitar.",
      "Escuchar sin interrumpir y confirmar lo que el huésped dijo.",
      "Seguir los protocolos y el cuestionario del spa: las contraindicaciones las decide el procedimiento profesional, no la terapeuta sola.",
    ],
    lines: [
      { who: "therapist", en: "Before we begin, may I ask you a few questions about your health?", es: "Antes de comenzar, ¿le puedo hacer unas preguntas sobre su salud?" },
      { who: "therapist", en: "Have you had a massage before?", es: "¿Ha recibido un masaje antes?" },
      { who: "guest", en: "Yes, a few times.", es: "Sí, algunas veces." },
      { who: "therapist", en: "Do you have any allergies or sensitivities?", es: "¿Tiene alguna alergia o sensibilidad?" },
      { who: "guest", en: "I'm allergic to nuts.", es: "Soy alérgica a las nueces." },
      { who: "therapist", en: "Thank you for letting me know. I will use a nut-free oil for your treatment.", es: "Gracias por decírmelo. Usaré un aceite sin nueces en su tratamiento." },
      { who: "therapist", en: "Do you have any injuries, or are you currently experiencing any pain?", es: "¿Tiene alguna lesión o siente algún dolor en este momento?" },
      { who: "therapist", en: "Are there any areas where you feel tension, or any areas you would like me to avoid?", es: "¿Hay zonas donde sienta tensión, o alguna zona que prefiera que evite?" },
      { who: "guest", en: "My shoulders are very tense. Please avoid my left knee.", es: "Tengo los hombros muy tensos. Por favor evite mi rodilla izquierda." },
      { who: "therapist", en: "Of course. I will focus on your shoulders and avoid your left knee.", es: "Claro. Me enfocaré en sus hombros y evitaré su rodilla izquierda." },
    ],
  },
  {
    id: "explain", icon: "💬", title: "Explaining the Treatment", titleEs: "Explicar el tratamiento",
    video: "videos/script/explain.mp4",
    standards: [
      "Explicar en orden: nombre del tratamiento → duración → procedimiento → beneficios → qué esperar.",
      "Presentar los productos que se usarán y para qué sirven.",
      "Usar frases cortas y claras; preguntar si tiene dudas antes de empezar.",
    ],
    lines: [
      { who: "therapist", en: "Today you will be having our 60-minute Relaxation Massage.", es: "Hoy recibirá nuestro masaje relajante de 60 minutos." },
      { who: "therapist", en: "The treatment includes gentle massage techniques designed to promote relaxation and release muscle tension.", es: "El tratamiento incluye técnicas suaves de masaje para favorecer la relajación y liberar la tensión muscular." },
      { who: "therapist", en: "We will begin with your back and shoulders, and then continue with your legs, arms and feet.", es: "Comenzaremos con la espalda y los hombros, y luego seguiremos con las piernas, los brazos y los pies." },
      { who: "therapist", en: "This massage oil contains essential oils with a relaxing aroma.", es: "Este aceite de masaje contiene aceites esenciales con un aroma relajante." },
      { who: "therapist", en: "Do you have any questions before we begin?", es: "¿Tiene alguna pregunta antes de comenzar?" },
      { who: "guest", en: "No, it sounds perfect.", es: "No, suena perfecto." },
    ],
  },
  {
    id: "personalize", icon: "🌸", title: "Personalizing the Experience", titleEs: "Personalizar la experiencia",
    video: "videos/script/personalize.mp4",
    standards: [
      "Ofrecer opciones en lugar de decidir por el huésped: presión, aroma, temperatura, música.",
      "Recomendar con base en lo que el huésped dijo en la consulta.",
      "Recordar y aplicar sus preferencias durante todo el servicio.",
    ],
    lines: [
      { who: "therapist", en: "Would you prefer light, medium or deep pressure?", es: "¿Prefiere presión ligera, media o profunda?" },
      { who: "guest", en: "Medium, please.", es: "Media, por favor." },
      { who: "therapist", en: "Do you prefer a floral, citrus or herbal aroma?", es: "¿Prefiere un aroma floral, cítrico o herbal?" },
      { who: "guest", en: "What do you recommend?", es: "¿Qué me recomienda?" },
      { who: "therapist", en: "Since you are feeling tired, I would recommend lavender. It is very relaxing.", es: "Como se siente cansada, le recomiendo lavanda. Es muy relajante." },
      { who: "therapist", en: "Would you like some soft music during your treatment?", es: "¿Le gustaría música suave durante su tratamiento?" },
    ],
  },
  {
    id: "prepare", icon: "🛏️", title: "Preparing the Guest", titleEs: "Preparación y privacidad",
    video: "videos/script/prepare.mp4",
    standards: [
      "Dar instrucciones claras y amables, siempre con \"please\".",
      "Explicar dónde dejar sus pertenencias y cómo colocarse en la camilla.",
      "Salir de la cabina para dar privacidad mientras el huésped se prepara; tocar antes de entrar.",
      "Cabina limpia, a temperatura agradable y lista antes de que llegue el huésped (Cleanliness y Comfort).",
    ],
    lines: [
      { who: "therapist", en: "Please place your belongings here, and use the robe and slippers provided for you.", es: "Por favor deje sus pertenencias aquí y use la bata y las pantuflas que le preparamos." },
      { who: "therapist", en: "Please lie face down on the massage table, with your face in the face cradle.", es: "Por favor recuéstese boca abajo en la camilla, con la cara en el cabezal." },
      { who: "therapist", en: "I will give you some privacy while you prepare. I will knock before I come back in.", es: "Le daré privacidad mientras se prepara. Tocaré antes de volver a entrar." },
      { who: "therapist", en: "May I come in?", es: "¿Puedo pasar?" },
      { who: "guest", en: "Yes, I'm ready.", es: "Sí, estoy lista." },
      { who: "therapist", en: "Please let me know when you are comfortable.", es: "Por favor avíseme cuando esté cómoda." },
    ],
  },
  {
    id: "during", icon: "💆", title: "During the Treatment", titleEs: "Durante el tratamiento",
    video: "videos/script/during.mp4",
    standards: [
      "Preguntar por la presión y la comodidad al inicio y en cada zona nueva, sin interrumpir la relajación.",
      "Hablar en voz baja y solo lo necesario; dejar que el huésped decida si quiere conversar.",
      "Avisar antes de cambiar de posición o de zona.",
      "Ajustar de inmediato la presión, la temperatura o la música cuando el huésped lo pida.",
    ],
    lines: [
      { who: "therapist", en: "How is the pressure?", es: "¿Cómo está la presión?" },
      { who: "guest", en: "It could be a little stronger on my shoulders.", es: "Podría ser un poco más fuerte en los hombros." },
      { who: "therapist", en: "Of course. Is this pressure more comfortable for you?", es: "Claro. ¿Esta presión es más cómoda para usted?" },
      { who: "therapist", en: "Take a deep breath in, and slowly breathe out.", es: "Inhale profundamente, y exhale despacio." },
      { who: "therapist", en: "Now, please turn over onto your back. I will hold the sheet for you.", es: "Ahora, por favor voltéese boca arriba. Yo le sostengo la sábana." },
      { who: "therapist", en: "Is the room temperature comfortable for you?", es: "¿La temperatura de la cabina es cómoda para usted?" },
      { who: "therapist", en: "Please relax and enjoy your treatment. Let me know if you need anything.", es: "Por favor relájese y disfrute su tratamiento. Avíseme si necesita algo." },
    ],
  },
  {
    id: "concern", icon: "🙏", title: "Handling a Concern", titleEs: "Atender una molestia",
    video: "videos/script/concern.mp4",
    standards: [
      "Método: escuchar → reconocer → disculparse → resolver → dar seguimiento.",
      "Nunca responder solo \"No\": ofrecer una alternativa o consultar al Spa Manager.",
      "Disculparse con sinceridad, sin justificarse ni culpar a otros.",
      "Confirmar que la solución funcionó.",
    ],
    lines: [
      { who: "guest", en: "Excuse me, the pressure is too strong.", es: "Disculpe, la presión está demasiado fuerte." },
      { who: "therapist", en: "I'm sorry about that. Let me reduce the pressure for you. Is this better?", es: "Disculpe. Permítame reducir la presión. ¿Así está mejor?" },
      { who: "guest", en: "Yes, much better, thank you.", es: "Sí, mucho mejor, gracias." },
      { who: "guest", en: "The room is a little cold.", es: "La cabina está un poco fría." },
      { who: "therapist", en: "I'm sorry. Let me adjust the temperature and bring you a warm blanket.", es: "Disculpe. Permítame ajustar la temperatura y traerle una cobija tibia." },
      { who: "guest", en: "Can you extend my massage for another thirty minutes?", es: "¿Puede extender mi masaje otros treinta minutos?" },
      { who: "therapist", avoid: "No, I can't.", en: "Let me check with my Spa Manager. I would be happy to find the best option for you.", es: "Permítame consultarlo con mi gerente de spa. Con gusto le busco la mejor opción." },
    ],
  },
  {
    id: "followup", icon: "🍵", title: "After the Treatment", titleEs: "Seguimiento después del tratamiento",
    video: "videos/script/followup.mp4",
    standards: [
      "Avisar que el tratamiento terminó y pedir que se incorpore despacio.",
      "Preguntar cómo se siente y si la presión fue adecuada.",
      "Ofrecer agua o té herbal y dar recomendaciones de cuidado (hidratarse, descansar).",
      "Acompañar al huésped a la sala de relajación o a la salida.",
    ],
    lines: [
      { who: "therapist", en: "Your treatment is now complete. Please take your time and sit up slowly.", es: "Su tratamiento ha terminado. Tómese su tiempo e incorpórese despacio." },
      { who: "therapist", en: "How are you feeling?", es: "¿Cómo se siente?" },
      { who: "guest", en: "Wonderful. So relaxed.", es: "De maravilla. Muy relajada." },
      { who: "therapist", en: "I'm so glad to hear that. Was the pressure comfortable for you?", es: "Me da mucho gusto. ¿La presión fue cómoda para usted?" },
      { who: "therapist", en: "Would you like some water or herbal tea?", es: "¿Le gustaría un poco de agua o té herbal?" },
      { who: "therapist", en: "Please remember to drink plenty of water today.", es: "Por favor recuerde tomar suficiente agua hoy." },
      { who: "therapist", en: "Please allow me to show you to our relaxation lounge.", es: "Permítame acompañarla a nuestra sala de relajación." },
    ],
  },
  {
    id: "recommend", icon: "✨", title: "Recommending Other Services", titleEs: "Recomendar otros servicios",
    video: "videos/script/recommend.mp4",
    standards: [
      "Recomendar con elegancia y solo lo que complementa la experiencia del huésped; nunca presionar.",
      "Conocer los servicios del spa (faciales, tratamientos corporales, hidroterapia) y del hotel.",
      "Ofrecer hacer la reservación con la recepción del spa.",
    ],
    lines: [
      { who: "therapist", en: "If you enjoyed your massage, you may also be interested in our facial treatments.", es: "Si disfrutó su masaje, también le pueden interesar nuestros faciales." },
      { who: "therapist", en: "Our hydrotherapy circuit includes a sauna, a steam room and a vitality pool.", es: "Nuestro circuito de hidroterapia incluye sauna, vapor y alberca de vitalidad." },
      { who: "guest", en: "That sounds lovely. Can I book it for tomorrow?", es: "Suena muy bien. ¿Lo puedo reservar para mañana?" },
      { who: "therapist", en: "Of course. Would you like me to arrange an appointment with our Spa Reception?", es: "Claro. ¿Le gustaría que le agende una cita con la recepción del spa?" },
      { who: "therapist", en: "Our Concierge team can also assist you with restaurant reservations and transportation.", es: "Nuestro equipo de concierge también le puede ayudar con reservaciones de restaurante y transporte." },
    ],
  },
  {
    id: "farewell", icon: "🌿", title: "Farewell", titleEs: "Despedida",
    video: "videos/script/farewell.mp4",
    standards: [
      "Despedirse usando el nombre del huésped.",
      "Agradecer la visita y expresar que fue un placer atenderle.",
      "Invitar a regresar y desearle un buen día según la hora.",
      "Acompañar hasta la salida del spa cuando sea posible.",
    ],
    lines: [
      { who: "therapist", en: "Is there anything else we can assist you with?", es: "¿Hay algo más en que le podamos ayudar?" },
      { who: "guest", en: "No, everything was perfect.", es: "No, todo estuvo perfecto." },
      { who: "therapist", en: "Thank you for visiting our Spa, Mrs. Smith. It was my pleasure taking care of you today.", es: "Gracias por visitar nuestro spa, señora Smith. Fue un placer atenderla hoy." },
      { who: "therapist", en: "I hope you enjoyed your treatment. We look forward to welcoming you back.", es: "Espero que haya disfrutado su tratamiento. Esperamos recibirla de nuevo." },
      { who: "therapist", en: "Have a wonderful afternoon.", es: "Que tenga una tarde maravillosa." },
    ],
  },
];
