// Instrucciones: expresiones para dar indicaciones a los huéspedes, empezando por los avisos de seguridad de
// hidroterapia (material "avisos-hidroterapia", el PDF original). Es una categoría del vocabulario (con sus pruebas);
// las imágenes se hacen en Canva con scripts/lista_imagenes_valet.py --seccion instrucciones.
// Para agregar expresiones, ponlas al final de su grupo.

const INSTRUCCIONES_VOCAB = [
  // Seguridad en hidroterapia (avisos del PDF)
  { en: "watch your step", es: "fíjese dónde pisa / tenga cuidado al pisar", pron: "uách yur step", ex: "Before entering, please watch your step when using the stairs.", exEs: "Antes de entrar, por favor tenga cuidado al pisar cuando use las escaleras." },
  { en: "suction drain", es: "coladera de succión", pron: "sák-shon dréin", ex: "Please do not step on or cover the white suction drain.", exEs: "Por favor, no pise ni cubra la coladera de succión blanca." },
  { en: "suction grate", es: "rejilla de succión", pron: "sák-shon gréit", ex: "Please do not step on the white suction grate.", exEs: "Por favor, no pise la rejilla blanca de succión." },
  { en: "keep your feet away", es: "mantenga los pies alejados", pron: "kip yur fit a-uéi", ex: "For your safety, keep your feet away from the grate.", exEs: "Por su seguridad, mantenga los pies alejados de la rejilla." },
  { en: "keep clear of", es: "manténgase alejado de", pron: "kip klir ov", ex: "Please keep clear of the white suction drain.", exEs: "Por favor, manténgase alejado de la coladera de succión blanca." },
  { en: "do not step on it", es: "no la pise", pron: "du nat step on it", ex: "This is the suction drain. Do not step on it.", exEs: "Esta es la coladera de succión. No la pise." },
  { en: "at the bottom of the pool", es: "en el fondo de la alberca", pron: "at de bá-tom ov de pul", ex: "Please avoid the white drain at the bottom of the pool.", exEs: "Por favor, evite la coladera blanca en el fondo de la alberca." },
  { en: "safety precaution", es: "medida de seguridad", pron: "séif-ti pri-kó-shon", ex: "It is a safety precaution for all our guests.", exEs: "Es una medida de seguridad para todos nuestros huéspedes." },
  { en: "for your safety", es: "por su seguridad", pron: "for yur séif-ti", ex: "For your safety, please hold the handrail.", exEs: "Por su seguridad, por favor sujétese del pasamanos." },
  { en: "hold the handrail", es: "sujétese del pasamanos", pron: "jould de jánd-reil", ex: "Please hold the handrail when you go down the stairs.", exEs: "Por favor, sujétese del pasamanos cuando baje las escaleras." },
  { en: "the floor is slippery", es: "el piso está resbaloso", pron: "de flor is slí-pe-ri", ex: "Be careful, the floor is slippery around the pool.", exEs: "Tenga cuidado, el piso está resbaloso alrededor de la alberca." },
  { en: "please do not run", es: "por favor, no corra", pron: "pliis du nat ran", ex: "Please do not run in the wet area.", exEs: "Por favor, no corra en el área húmeda." },
  { en: "thank you for your cooperation", es: "gracias por su cooperación", pron: "zank iu for yur kou-a-pe-réi-shon", ex: "Please keep your feet away from the grate. Thank you for your cooperation.", exEs: "Por favor, mantenga los pies alejados de la rejilla. Gracias por su cooperación." },

  // Durante el circuito
  { en: "take a shower first", es: "dúchese primero", pron: "téik a sháu-er ferst", ex: "Please take a shower first before you enter the pool.", exEs: "Por favor, dúchese primero antes de entrar a la alberca." },
  { en: "no more than ten minutes", es: "no más de diez minutos", pron: "nou mor dan ten mí-nits", ex: "Please stay in the sauna no more than ten minutes.", exEs: "Por favor, no permanezca más de diez minutos en el sauna." },
  { en: "drink some water", es: "tome un poco de agua", pron: "drink sam uó-ter", ex: "Please drink some water between each station.", exEs: "Por favor, tome un poco de agua entre cada estación." },
  { en: "if you feel dizzy", es: "si se siente mareado", pron: "if iu fiil dí-si", ex: "If you feel dizzy, please step out and rest.", exEs: "Si se siente mareado, por favor salga y descanse." },
  { en: "step in slowly", es: "entre despacio", pron: "step in slóu-li", ex: "The water is very cold, so please step in slowly.", exEs: "El agua está muy fría, así que por favor entre despacio." },
  { en: "step out slowly", es: "salga despacio", pron: "step áut slóu-li", ex: "When you finish, please step out slowly.", exEs: "Cuando termine, por favor salga despacio." },
  { en: "press the button", es: "presione el botón", pron: "pres de bá-ton", ex: "Press the button to start the jets.", exEs: "Presione el botón para encender los chorros." },
  { en: "no glass in this area", es: "no se permite vidrio en esta área", pron: "nou glas in dis é-ri-a", ex: "For your safety, there is no glass in this area.", exEs: "Por su seguridad, no se permite vidrio en esta área." },

  // Para guiar al huésped en el spa
  { en: "this way, please", es: "por aquí, por favor", pron: "dis uéi pliis", ex: "This way, please. The relaxation lounge is ahead.", exEs: "Por aquí, por favor. La sala de relajación está adelante." },
  { en: "please allow me to escort you", es: "por favor, permítame acompañarle", pron: "pliis a-láu mi tu es-kórt iu", ex: "Please allow me to escort you to the locker room.", exEs: "Por favor, permítame acompañarle al vestidor." },
  { en: "on your left", es: "a su izquierda", pron: "on yur left", ex: "The steam room is on your left.", exEs: "El cuarto de vapor está a su izquierda." },
  { en: "on your right", es: "a su derecha", pron: "on yur ráit", ex: "The showers are on your right.", exEs: "Las regaderas están a su derecha." },
  { en: "at the end of the hallway", es: "al final del pasillo", pron: "at de end ov de jól-uei", ex: "The restrooms are at the end of the hallway.", exEs: "Los baños están al final del pasillo." },
  { en: "next to", es: "junto a", pron: "nekst tu", ex: "The cold plunge is next to the sauna.", exEs: "La tina de agua fría está junto al sauna." },
  { en: "please wait here", es: "espere aquí, por favor", pron: "pliis uéit jir", ex: "Please wait here. Your therapist will come for you.", exEs: "Espere aquí, por favor. Su terapeuta vendrá por usted." },
  { en: "have a seat", es: "tome asiento", pron: "jav a siit", ex: "Please have a seat and enjoy a cup of tea.", exEs: "Por favor, tome asiento y disfrute una taza de té." },
  { en: "put on your robe", es: "póngase la bata", pron: "put on yur róub", ex: "Please put on your robe and slippers.", exEs: "Por favor, póngase la bata y las pantuflas." },
  { en: "store your belongings", es: "guarde sus pertenencias", pron: "stor yur bi-lóng-ings", ex: "Please store your belongings in the locker.", exEs: "Por favor, guarde sus pertenencias en el casillero." },
  { en: "keep your phone on silent", es: "mantenga su celular en silencio", pron: "kip yur fóun on sái-lent", ex: "Please keep your phone on silent in the spa.", exEs: "Por favor, mantenga su celular en silencio en el spa." },
  { en: "speak softly", es: "hable en voz baja", pron: "spiik sóft-li", ex: "Please speak softly in the relaxation lounge.", exEs: "Por favor, hable en voz baja en la sala de relajación." },
  { en: "arrive fifteen minutes early", es: "llegue quince minutos antes", pron: "a-ráiv fif-tín mí-nits ér-li", ex: "Please arrive fifteen minutes early for your treatment.", exEs: "Por favor, llegue quince minutos antes de su tratamiento." },
  { en: "let me know", es: "avíseme", pron: "let mi nou", ex: "Let me know if you need anything.", exEs: "Avíseme si necesita algo." },
  { en: "the exit is over there", es: "la salida está por allá", pron: "di ék-sit is óu-ver der", ex: "When you finish, the exit is over there.", exEs: "Cuando termine, la salida está por allá." },

  // El circuito de hidroterapia paso a paso (del inglés del Valet Spa Script 2024, corregido)
  { en: "wear a bathing suit", es: "use traje de baño", pron: "uér a béi-ding sut", ex: "To enjoy the spa facilities, it is necessary to wear a bathing suit.", exEs: "Para disfrutar de las instalaciones del spa, es necesario usar traje de baño." },
  { en: "would you like to use the restroom?", es: "¿le gustaría usar el baño?", pron: "uud iu láik tu iuus de rést-rum", ex: "Would you like to use the restroom before starting the hydrotherapy circuit?", exEs: "¿Le gustaría usar el baño antes de comenzar el circuito de hidroterapia?" },
  { en: "take your sandals off", es: "quítese las sandalias", pron: "téik yur sán-dols of", ex: "Please take your sandals off and leave them here.", exEs: "Por favor, quítese las sandalias y déjelas aquí." },
  { en: "may I help you with your towel?", es: "¿le ayudo con su toalla?", pron: "méi ái jelp iu uid yur táu-el", ex: "Mr. Jackson, may I help you with your towel?", exEs: "Sr. Jackson, ¿le ayudo con su toalla?" },
  { en: "sit down or lie down", es: "sentarse o acostarse", pron: "sit dáun or lái dáun", ex: "Would you like to sit down or lie down?", exEs: "¿Le gustaría sentarse o acostarse?" },
  { en: "let's start with the sauna", es: "empecemos con el sauna", pron: "lets start uid de só-na", ex: "Let's start with the sauna for five to ten minutes.", exEs: "Empecemos con el sauna durante cinco a diez minutos." },
  { en: "how long would you like to stay?", es: "¿cuánto tiempo le gustaría quedarse?", pron: "jáu long uud iu láik tu stéi", ex: "How long would you like to stay inside?", exEs: "¿Cuánto tiempo le gustaría quedarse adentro?" },
  { en: "I will be back in five minutes", es: "regreso en cinco minutos", pron: "ái uil bi bak in fáiv mí-nits", ex: "Enjoy it. I will be back in five minutes.", exEs: "Disfrútelo. Regreso en cinco minutos." },
  { en: "take a quick shower", es: "dese una ducha rápida", pron: "téik a kuik sháu-er", ex: "Before using the steam room, please take a quick shower.", exEs: "Antes de usar el cuarto de vapor, por favor dese una ducha rápida." },
  { en: "pull down the chain", es: "jale la cadena hacia abajo", pron: "pul dáun de chéin", ex: "Please pull down the chain to start the shower.", exEs: "Por favor, jale la cadena hacia abajo para abrir la regadera." },
  { en: "a cool towel", es: "una toalla fría", pron: "a kul táu-el", ex: "Let me give you a cool towel to refresh your face.", exEs: "Permítame darle una toalla fría para refrescar su cara." },
  { en: "it helps to open the pores", es: "ayuda a abrir los poros", pron: "it jelps tu óu-pen de pors", ex: "The steam room helps to open and oxygenate the pores.", exEs: "El cuarto de vapor ayuda a abrir y oxigenar los poros." },
  { en: "let's continue with the cold plunge", es: "continuemos con la tina de agua fría", pron: "lets kon-tí-niu uid de kould planch", ex: "Let's continue with the cold plunge. It helps to close the pores.", exEs: "Continuemos con la tina de agua fría. Ayuda a cerrar los poros." },
  { en: "get in and out", es: "entre y salga", pron: "guet in and áut", ex: "Please get in and out of the cold plunge quickly.", exEs: "Por favor, entre y salga rápido de la tina de agua fría." },
  { en: "lie down on the bubble bed", es: "acuéstese en la cama de burbujas", pron: "lái dáun on de bá-bol bed", ex: "First, lie down on the bubble bed for five minutes.", exEs: "Primero, acuéstese en la cama de burbujas durante cinco minutos." },
  { en: "stand under the pressure jets", es: "párese bajo los chorros a presión", pron: "stand án-der de pré-sher yets", ex: "Stand under the pressure jets to relax your neck, shoulders and back.", exEs: "Párese bajo los chorros a presión para relajar el cuello, los hombros y la espalda." },
  { en: "stand on the bubble horseshoe", es: "párese sobre la herradura de burbujas", pron: "stand on de bá-bol jórs-shu", ex: "Stand on the bubble horseshoe to relax your feet.", exEs: "Párese sobre la herradura de burbujas para relajar los pies." },
  { en: "the last part of your circuit", es: "la última parte de su circuito", pron: "de last part ov yur sér-kit", ex: "The last part of your circuit is the relaxing hot jacuzzi.", exEs: "La última parte de su circuito es el relajante jacuzzi caliente." },
  { en: "sit down inside the jacuzzi", es: "siéntese dentro del jacuzzi", pron: "sit dáun in-sáid de ya-kú-si", ex: "Please sit down inside the jacuzzi for ten minutes.", exEs: "Por favor, siéntese dentro del jacuzzi durante diez minutos." },
  { en: "relax on the spa daybed", es: "relájese en el camastro", pron: "ri-láks on de spa déi-bed", ex: "Finally, relax for ten minutes on the spa daybed.", exEs: "Por último, relájese durante diez minutos en el camastro." },
  { en: "I will escort you", es: "lo acompañaré", pron: "ái uil es-kórt iu", ex: "I will be back in a moment to escort you to the locker area.", exEs: "Regreso en un momento para acompañarlo al área de casilleros." },
  { en: "electronic devices are not allowed", es: "no se permiten aparatos electrónicos", pron: "i-lek-trá-nik di-vái-ses ar nat a-láud", ex: "Electronic devices are not allowed inside the sauna or the steam room.", exEs: "No se permiten aparatos electrónicos dentro del sauna ni del cuarto de vapor." },
  { en: "no food in the hydrotherapy area", es: "no se permite comer en el área de hidroterapia", pron: "nou fud in de jái-dro-zé-ra-pi é-ri-a", ex: "There is no food in the hydrotherapy area. You can eat after your treatment.", exEs: "No se permite comer en el área de hidroterapia. Puede comer después de su tratamiento." },
];

VOCAB.push({ id: "instrucciones", title: "Instrucciones", icon: "🪧", words: INSTRUCCIONES_VOCAB, material: ["avisos-hidroterapia"] });
