// Script del valet de spa: guion del Spa Valet / Spa Attendant con el huésped, en inglés y español.
// Fuente: "English for Spa Valet – AAA Guest Service" (filosofía AAA: Welcome → Recognize → Anticipate →
// Assist → Explain → Personalize → Follow up → Farewell; principio clave: "Everything has been taken care of").
// Mismo formato que js/service-script.js. who: "valet" o "guest".

const VALET_SCRIPT = [
  {
    id: "welcome", icon: "👋", title: "Welcome", titleEs: "Bienvenida",
    standards: [
      "Saludar con una sonrisa y contacto visual, según la hora del día.",
      "Ofrecer asistencia de inmediato, sin esperar a que el huésped la pida.",
      "Ofrecer ayuda con sus pertenencias y mostrarle el spa.",
    ],
    lines: [
      { who: "valet", en: "Good morning. Welcome to our Spa.", es: "Buenos días. Bienvenido(a) a nuestro spa." },
      { who: "valet", en: "It is a pleasure to have you with us.", es: "Es un placer tenerle con nosotros." },
      { who: "valet", en: "How may I assist you today?", es: "¿En qué puedo ayudarle hoy?" },
      { who: "guest", en: "I have a massage at eleven.", es: "Tengo un masaje a las once." },
      { who: "valet", en: "May I assist you with your belongings?", es: "¿Puedo ayudarle con sus pertenencias?" },
      { who: "valet", en: "Please allow me to show you around the Spa.", es: "Permítame mostrarle el spa." },
    ],
  },
  {
    id: "anticipate", icon: "✨", title: "Recognize and Anticipate", titleEs: "Reconocer y anticiparse",
    standards: [
      "Anticiparse: ofrecer bata, sandalias, toalla y agua antes de que el huésped lo pida.",
      "Ofrecer mostrarle el área de lockers y la sala de relajación.",
    ],
    lines: [
      { who: "valet", en: "May I prepare a robe and slippers for you?", es: "¿Puedo prepararle una bata y unas sandalias?" },
      { who: "valet", en: "Would you like me to show you the locker area?", es: "¿Le gustaría que le muestre el área de lockers?" },
      { who: "valet", en: "Would you like a towel?", es: "¿Le gustaría una toalla?" },
      { who: "valet", en: "May I offer you some water?", es: "¿Puedo ofrecerle un poco de agua?" },
      { who: "valet", en: "Would you like me to show you the relaxation area?", es: "¿Le gustaría que le muestre el área de relajación?" },
    ],
  },
  {
    id: "locker", icon: "🔐", title: "The Locker", titleEs: "Explicar el locker",
    standards: [
      "Mostrar el locker y explicar cómo usarlo.",
      "Pedir que se asegure de cerrarlo bien; sus pertenencias quedan dentro mientras disfruta del spa.",
    ],
    lines: [
      { who: "valet", en: "Your locker is located over here. This is your locker.", es: "Su locker está aquí. Este es su locker." },
      { who: "valet", en: "You can place your personal belongings inside.", es: "Puede guardar sus pertenencias personales adentro." },
      { who: "valet", en: "May I show you how to use the locker?", es: "¿Le muestro cómo usar el locker?" },
      { who: "guest", en: "Yes, please.", es: "Sí, por favor." },
      { who: "valet", en: "Please make sure the locker is securely closed.", es: "Por favor, asegúrese de que el locker quede bien cerrado." },
      { who: "valet", en: "Your belongings will remain inside the locker while you enjoy the Spa.", es: "Sus pertenencias se quedarán en el locker mientras disfruta del spa." },
    ],
  },
  {
    id: "amenities", icon: "🧺", title: "Amenities", titleEs: "Entregar amenidades",
    standards: [
      "Entregar bata, sandalias y toallas en persona.",
      "Explicar dónde están el shampoo, el acondicionador, el gel de ducha, la loción, el peine, la secadora y las amenidades del tocador.",
    ],
    lines: [
      { who: "valet", en: "Here is your robe.", es: "Aquí tiene su bata." },
      { who: "valet", en: "Here are your slippers and towels.", es: "Aquí tiene sus sandalias y toallas." },
      { who: "valet", en: "You will find shampoo, conditioner and body lotion in the shower area.", es: "Encontrará shampoo, acondicionador y loción corporal en el área de regaderas." },
      { who: "valet", en: "Please let me know if you need anything else.", es: "Por favor, avíseme si necesita algo más." },
    ],
  },
  {
    id: "showers", icon: "🚿", title: "The Shower Area", titleEs: "Área de regaderas",
    standards: [
      "Indicar dónde están las regaderas e invitar a usarlas antes del área de hidroterapia.",
      "Mostrar dónde hay toallas limpias y ofrecer más si las necesita.",
    ],
    lines: [
      { who: "valet", en: "The showers are located just over here.", es: "Las regaderas están justo aquí." },
      { who: "valet", en: "You are welcome to use the shower before entering the hydrotherapy area.", es: "Con gusto puede usar la regadera antes de entrar al área de hidroterapia." },
      { who: "valet", en: "Fresh towels are available here.", es: "Aquí hay toallas limpias." },
      { who: "valet", en: "Please let us know if you need additional towels.", es: "Por favor, avísenos si necesita más toallas." },
    ],
  },
  {
    id: "heat", icon: "🔥", title: "Sauna and Steam Room", titleEs: "Sauna y vapor",
    standards: [
      "Explicar que la sauna es calor seco y el vapor un ambiente cálido y húmedo.",
      "Pedir que sigan las indicaciones de seguridad publicadas y se mantengan hidratados.",
      "Si se siente incómodo, debe salir e informar al equipo del spa.",
    ],
    lines: [
      { who: "valet", en: "Our sauna is located in the wet area. The sauna provides a dry heat experience.", es: "Nuestra sauna está en el área húmeda. La sauna ofrece una experiencia de calor seco." },
      { who: "valet", en: "The steam room is located next to the sauna. It provides a warm and humid environment.", es: "El vapor está junto a la sauna. Ofrece un ambiente cálido y húmedo." },
      { who: "valet", en: "Please follow the posted safety guidelines, and please stay hydrated.", es: "Por favor, siga las indicaciones de seguridad publicadas y manténgase hidratado(a)." },
      { who: "valet", en: "If you feel uncomfortable, please leave the sauna and inform our Spa team.", es: "Si se siente incómodo(a), por favor salga de la sauna e informe a nuestro equipo del spa." },
    ],
  },
  {
    id: "pools", icon: "🌊", title: "Cold Plunge, Vitality Pool and Whirlpool", titleEs: "Inmersión fría, vitalidad e hidromasaje",
    standards: [
      "Explicar cada alberca y su uso: inmersión fría, alberca de vitalidad con chorros y jacuzzi tibio.",
      "Pedir que respeten los tiempos y las indicaciones de seguridad.",
      "Si se siente incómodo en la inmersión fría, debe salir y avisar al equipo del spa.",
    ],
    lines: [
      { who: "valet", en: "This is our cold plunge pool. The water temperature is kept cold as part of the hydrotherapy experience.", es: "Esta es nuestra alberca de inmersión fría. El agua se mantiene fría como parte de la experiencia de hidroterapia." },
      { who: "valet", en: "If you feel uncomfortable, please exit the pool and notify our Spa team.", es: "Si se siente incómodo(a), por favor salga de la alberca y avise a nuestro equipo del spa." },
      { who: "valet", en: "This is our vitality pool. It features water jets designed to provide a relaxing experience.", es: "Esta es nuestra alberca de vitalidad. Tiene chorros de agua diseñados para una experiencia relajante." },
      { who: "valet", en: "Our whirlpool is located over here. It provides a warm hydrotherapy experience.", es: "Nuestro jacuzzi está aquí. Ofrece una experiencia de hidroterapia tibia." },
      { who: "valet", en: "Please follow the posted guidelines regarding time and use.", es: "Por favor, siga las indicaciones publicadas sobre el tiempo y el uso." },
    ],
  },
  {
    id: "lounge", icon: "🛋️", title: "Relaxation Lounge", titleEs: "Sala de relajación",
    standards: [
      "Invitar a relajarse antes o después del tratamiento.",
      "Pedir con amabilidad que se hable en voz baja en esta área.",
      "Ofrecer el té herbal y el agua disponibles.",
    ],
    lines: [
      { who: "valet", en: "This is our relaxation lounge.", es: "Esta es nuestra sala de relajación." },
      { who: "valet", en: "You are welcome to relax here before or after your treatment.", es: "Con gusto puede relajarse aquí antes o después de su tratamiento." },
      { who: "valet", en: "We kindly ask our guests to keep their voices low in this area.", es: "Amablemente pedimos a nuestros huéspedes hablar en voz baja en esta área." },
      { who: "valet", en: "Herbal tea and water are available for you.", es: "Tiene té herbal y agua a su disposición." },
    ],
  },
  {
    id: "circuit", icon: "💧", title: "The Hydrotherapy Circuit", titleEs: "Circuito de hidroterapia",
    standards: [
      "Secuencia: regadera tibia → sauna → regadera fría → vapor → inmersión fría → vitalidad → jacuzzi → sala de relajación.",
      "Ofrecer explicar la secuencia y pedir que sigan los tiempos y las indicaciones de seguridad del spa.",
    ],
    lines: [
      { who: "valet", en: "Our hydrotherapy circuit includes several thermal experiences designed to promote relaxation and wellness.", es: "Nuestro circuito de hidroterapia incluye varias experiencias térmicas diseñadas para favorecer la relajación y el bienestar." },
      { who: "valet", en: "I would be happy to explain the sequence to you.", es: "Con gusto le explico la secuencia." },
      { who: "guest", en: "Yes, please.", es: "Sí, por favor." },
      { who: "valet", en: "You will begin with a warm shower, followed by the sauna and then a cooling experience.", es: "Empezará con una regadera tibia, después la sauna y luego una experiencia de enfriamiento." },
      { who: "valet", en: "Please follow the Spa's recommended times and safety guidelines.", es: "Por favor, siga los tiempos recomendados y las indicaciones de seguridad del spa." },
    ],
  },
  {
    id: "hours", icon: "🕗", title: "Hours and Treatments", titleEs: "Horarios y tratamientos",
    standards: [
      "Usar siempre los horarios reales del hotel (los de este guion son un ejemplo).",
      "Explicar que los tratamientos son con cita y ofrecer contactar a la recepción del spa.",
    ],
    lines: [
      { who: "guest", en: "What time does the Spa close?", es: "¿A qué hora cierra el spa?" },
      { who: "valet", en: "The Spa is open from 8:00 a.m. to 10:00 p.m.", es: "El spa abre de 8:00 a.m. a 10:00 p.m." },
      { who: "valet", en: "The hydrotherapy area closes at 9:00 p.m.", es: "El área de hidroterapia cierra a las 9:00 p.m." },
      { who: "valet", en: "Our Spa offers massages, facials and body treatments. Treatments are available by appointment.", es: "Nuestro spa ofrece masajes, faciales y tratamientos corporales. Los tratamientos son con cita." },
      { who: "valet", en: "Would you like me to connect you with Spa Reception?", es: "¿Le gustaría que le comunique con la recepción del spa?" },
    ],
  },
  {
    id: "hotel", icon: "🏨", title: "Hotel Services and Directions", titleEs: "Servicios del hotel e indicaciones",
    standards: [
      "Conocer los servicios del hotel: restaurantes, bar, room service, concierge, alberca, gimnasio, club infantil y transporte.",
      "Dar indicaciones claras o acompañar al huésped: \"Please follow me\".",
    ],
    lines: [
      { who: "guest", en: "Where can I have lunch after my treatment?", es: "¿Dónde puedo comer después de mi tratamiento?" },
      { who: "valet", en: "Our Concierge team can assist you with restaurant reservations.", es: "Nuestro equipo de concierge le puede ayudar con reservaciones en restaurantes." },
      { who: "valet", en: "The Fitness Center is located next to the Spa.", es: "El gimnasio está junto al spa." },
      { who: "valet", en: "The locker room is to your left, and the sauna is on your right.", es: "Los vestidores están a su izquierda y la sauna a su derecha." },
      { who: "valet", en: "It is across from the relaxation lounge. Please follow me.", es: "Está frente a la sala de relajación. Por favor, sígame." },
    ],
  },
  {
    id: "hydration", icon: "🍵", title: "Offering Hydration", titleEs: "Ofrecer hidratación",
    standards: [
      "Ofrecer agua de forma proactiva y recordar la importancia de hidratarse.",
      "Mencionar el té herbal de la sala de relajación.",
    ],
    lines: [
      { who: "valet", en: "May I offer you some water?", es: "¿Puedo ofrecerle un poco de agua?" },
      { who: "valet", en: "Please stay hydrated. Water is available here.", es: "Por favor, manténgase hidratado(a). Aquí hay agua disponible." },
      { who: "valet", en: "We also offer herbal tea in the relaxation lounge.", es: "También ofrecemos té herbal en la sala de relajación." },
    ],
  },
  {
    id: "requests", icon: "🙋", title: "Requests and Questions", titleEs: "Solicitudes y preguntas",
    standards: [
      "Responder a las solicitudes con disposición: \"Certainly\", \"Absolutely\", \"Let me take care of that for you\".",
      "Nunca decir \"I don't know\": ofrecer verificar la información con la recepción del spa.",
    ],
    lines: [
      { who: "guest", en: "Could I have an extra pillow in the lounge?", es: "¿Me podría dar una almohada extra en la sala?" },
      { who: "valet", en: "Certainly. I'll be happy to assist you. Let me take care of that for you.", es: "Claro. Con gusto le ayudo. Permítame encargarme de eso." },
      { who: "guest", en: "Is there a yoga class tomorrow?", es: "¿Hay clase de yoga mañana?" },
      { who: "valet", avoid: "I don't know.", en: "Allow me to verify that information for you. Let me check with our Spa Reception team.", es: "Permítame verificar esa información. Lo consultaré con nuestro equipo de recepción del spa." },
      { who: "valet", en: "Please allow me a moment.", es: "Permítame un momento, por favor." },
    ],
  },
  {
    id: "complaints", icon: "🙏", title: "Handling Complaints", titleEs: "Manejo de quejas",
    standards: [
      "Método: escuchar → reconocer → disculparse → resolver → dar seguimiento.",
      "Resolver de inmediato y agradecer al huésped por avisar.",
    ],
    lines: [
      { who: "guest", en: "There are no towels in the locker room.", es: "No hay toallas en los vestidores." },
      { who: "valet", en: "I'm very sorry about that. I'll bring fresh towels immediately.", es: "Lo siento mucho. Le traigo toallas limpias de inmediato." },
      { who: "valet", en: "Thank you for letting me know.", es: "Gracias por avisarme." },
      { who: "valet", en: "Please let me know if there is anything else you need.", es: "Por favor, avíseme si necesita algo más." },
    ],
  },
  {
    id: "privacy", icon: "🤫", title: "Privacy and Discretion", titleEs: "Privacidad y discreción",
    standards: [
      "Atender con discreción y en privado cuando el huésped lo necesite.",
      "No dar información de otros huéspedes; canalizar con el departamento correspondiente.",
    ],
    lines: [
      { who: "valet", en: "Of course. I'll take care of that discreetly.", es: "Por supuesto. Me encargaré de eso con discreción." },
      { who: "valet", en: "For your privacy, I'll be happy to assist you privately.", es: "Para su privacidad, con gusto le atiendo en privado." },
      { who: "guest", en: "Can you tell me which room my friend is staying in?", es: "¿Me puede decir en qué habitación está mi amiga?" },
      { who: "valet", en: "I'm sorry, but I cannot provide that information. Let me contact the appropriate department for you.", es: "Lo siento, pero no puedo dar esa información. Permítame contactar al departamento correspondiente." },
    ],
  },
  {
    id: "followup", icon: "✅", title: "Follow-up", titleEs: "Seguimiento",
    standards: [
      "Preguntar si todo está cómodo y si encontró lo que necesitaba.",
      "Ofrecer ayuda durante toda la visita.",
    ],
    lines: [
      { who: "valet", en: "Is everything comfortable for you?", es: "¿Está todo cómodo para usted?" },
      { who: "valet", en: "Did you find everything you needed?", es: "¿Encontró todo lo que necesitaba?" },
      { who: "guest", en: "Yes, everything is perfect.", es: "Sí, todo está perfecto." },
      { who: "valet", en: "Please let us know if you need anything during your visit.", es: "Por favor, avísenos si necesita algo durante su visita." },
    ],
  },
  {
    id: "farewell", icon: "🌿", title: "Farewell", titleEs: "Despedida",
    standards: [
      "Despedirse usando el nombre del huésped.",
      "Agradecer la visita, desear que haya disfrutado e invitar a regresar.",
      "Principio clave: \"Everything has been taken care of\" (todo está atendido).",
    ],
    lines: [
      { who: "valet", en: "Thank you for visiting our Spa, Mr. Smith.", es: "Gracias por visitar nuestro spa, señor Smith." },
      { who: "valet", en: "It was a pleasure assisting you today. We hope you enjoyed your Spa experience.", es: "Fue un placer atenderle hoy. Esperamos que haya disfrutado su experiencia en el spa." },
      { who: "valet", en: "We look forward to welcoming you back. Have a wonderful afternoon.", es: "Esperamos recibirle de nuevo. Que tenga una tarde maravillosa." },
    ],
  },
];

// Vocabulario esencial del valet (en, pronunciación, es).
const VALET_VOCAB = [
  {"en": "Spa Attendant", "pron": "/spa a-tén-dant/", "es": "Asistente de Spa"},
  {"en": "Spa Valet", "pron": "/spa va-léi/", "es": "Valet de Spa"},
  {"en": "Guest", "pron": "/guest/", "es": "Huésped"},
  {"en": "Locker", "pron": "/ló-ker/", "es": "Casillero"},
  {"en": "Locker room", "pron": "/ló-ker rum/", "es": "Vestidor"},
  {"en": "Changing room", "pron": "/chéin-ying rum/", "es": "Vestidor"},
  {"en": "Robe", "pron": "/róub/", "es": "Bata"},
  {"en": "Slippers", "pron": "/slí-pers/", "es": "Sandalias"},
  {"en": "Towel", "pron": "/táu-el/", "es": "Toalla"},
  {"en": "Hand towel", "pron": "/jand táu-el/", "es": "Toalla de manos"},
  {"en": "Bath towel", "pron": "/baz táu-el/", "es": "Toalla de baño"},
  {"en": "Amenities", "pron": "/a-mé-ni-tiz/", "es": "Amenidades"},
  {"en": "Shower", "pron": "/sháu-er/", "es": "Regadera"},
  {"en": "Shower gel", "pron": "/sháu-er yel/", "es": "Gel de ducha"},
  {"en": "Shampoo", "pron": "/sham-pú/", "es": "Shampoo"},
  {"en": "Conditioner", "pron": "/kon-dí-sho-ner/", "es": "Acondicionador"},
  {"en": "Body lotion", "pron": "/bá-di lóu-shon/", "es": "Loción corporal"},
  {"en": "Comb", "pron": "/kóum/", "es": "Peine"},
  {"en": "Hair dryer", "pron": "/jer drái-er/", "es": "Secadora"},
  {"en": "Vanity", "pron": "/vá-ni-ti/", "es": "Tocador"},
  {"en": "Sauna", "pron": "/só-na/", "es": "Sauna"},
  {"en": "Steam room", "pron": "/stim rum/", "es": "Vapor"},
  {"en": "Hydrotherapy", "pron": "/jai-dro-zé-ra-pi/", "es": "Hidroterapia"},
  {"en": "Vitality pool", "pron": "/vai-tá-li-ti pul/", "es": "Alberca de vitalidad"},
  {"en": "Whirlpool", "pron": "/uérl-pul/", "es": "Hidromasaje"},
  {"en": "Jacuzzi", "pron": "/ya-kú-zi/", "es": "Jacuzzi"},
  {"en": "Cold plunge", "pron": "/kóuld plansh/", "es": "Inmersión fría"},
  {"en": "Relaxation lounge", "pron": "/ri-lak-séi-shon láunch/", "es": "Sala de relajación"},
  {"en": "Treatment room", "pron": "/trít-ment rum/", "es": "Cabina de tratamiento"},
  {"en": "Massage", "pron": "/ma-sásh/", "es": "Masaje"},
  {"en": "Facial", "pron": "/féi-shal/", "es": "Facial"},
  {"en": "Body treatment", "pron": "/bá-di trít-ment/", "es": "Tratamiento corporal"},
  {"en": "Hydrotherapy circuit", "pron": "/jai-dro-zé-ra-pi sér-kit/", "es": "Circuito de hidroterapia"},
  {"en": "Temperature", "pron": "/tém-per-a-cher/", "es": "Temperatura"},
  {"en": "Wet area", "pron": "/uet é-ria/", "es": "Área húmeda"},
  {"en": "Dry area", "pron": "/drai é-ria/", "es": "Área seca"},
  {"en": "Relaxation area", "pron": "/ri-lak-séi-shon é-ria/", "es": "Área de relajación"},
  {"en": "Quiet area", "pron": "/kuái-et é-ria/", "es": "Área silenciosa"},
  {"en": "Hydration", "pron": "/jai-dréi-shon/", "es": "Hidratación"},
  {"en": "Herbal tea", "pron": "/ér-bal ti/", "es": "Té herbal"},
  {"en": "Water", "pron": "/uó-ter/", "es": "Agua"},
  {"en": "Privacy", "pron": "/prái-va-si/", "es": "Privacidad"},
  {"en": "Safety", "pron": "/séi-f-ti/", "es": "Seguridad"},
  {"en": "Assistance", "pron": "/a-sís-tens/", "es": "Asistencia"},
  {"en": "Reservation", "pron": "/re-ser-véi-shon/", "es": "Reservación"},
  {"en": "Appointment", "pron": "/a-póint-ment/", "es": "Cita"},
  {"en": "Available", "pron": "/a-véi-la-bol/", "es": "Disponible"},
  {"en": "Occupied", "pron": "/ó-kiu-paid/", "es": "Ocupado"},
];
