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
  { en: "no more than fifteen minutes", es: "no más de quince minutos", pron: "nou mor dan fif-tín mí-nits", ex: "Please stay in the sauna no more than fifteen minutes.", exEs: "Por favor, no permanezca más de quince minutos en el sauna." },
  { en: "drink some water", es: "tome un poco de agua", pron: "drink sam uó-ter", ex: "Please drink some water between each station.", exEs: "Por favor, tome un poco de agua entre cada estación." },
  { en: "if you feel dizzy", es: "si se siente mareado", pron: "if iu fiil dí-si", ex: "If you feel dizzy, please step out and rest.", exEs: "Si se siente mareado, por favor salga y descanse." },
  { en: "step in slowly", es: "entre despacio", pron: "step in slóu-li", ex: "The water is very cold, so please step in slowly.", exEs: "El agua está muy fría, así que por favor entre despacio." },
  { en: "step out slowly", es: "salga despacio", pron: "step áut slóu-li", ex: "When you finish, please step out slowly.", exEs: "Cuando termine, por favor salga despacio." },
  { en: "press the button", es: "presione el botón", pron: "pres de bá-ton", ex: "Press the button to start the jets.", exEs: "Presione el botón para encender los chorros." },
  { en: "no glass in this area", es: "no se permite vidrio en esta área", pron: "nou glas in dis é-ri-a", ex: "For your safety, there is no glass in this area.", exEs: "Por su seguridad, no se permite vidrio en esta área." },

  // Para guiar al huésped en el spa
  { en: "this way, please", es: "por aquí, por favor", pron: "dis uéi pliis", ex: "This way, please. The relaxation lounge is ahead.", exEs: "Por aquí, por favor. La sala de relajación está adelante." },
  { en: "follow me, please", es: "sígame, por favor", pron: "fá-lou mi pliis", ex: "Follow me, please. I will show you the locker room.", exEs: "Sígame, por favor. Le mostraré el vestidor." },
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
];

VOCAB.push({ id: "instrucciones", title: "Instrucciones", icon: "🪧", words: INSTRUCCIONES_VOCAB, material: ["avisos-hidroterapia"] });
