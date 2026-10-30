// Cabina de masaje: todo lo que hay dentro de la cabina y los artículos que usa la terapeuta.
// Es una categoría del vocabulario (con sus pruebas); las imágenes se hacen en Canva con la lista de
// scripts/lista_imagenes_valet.py --seccion cabina. Para agregar palabras, ponlas al final de su grupo.

const CABINA_VOCAB = [
  // Mobiliario y equipo
  { en: "massage table", es: "camilla de masaje", pron: "ma-sásh téi-bol", ex: "Please lie face down on the massage table.", exEs: "Por favor, acuéstese boca abajo en la camilla de masaje." },
  { en: "face cradle", es: "reposacabeza (para estar boca abajo)", pron: "féis kréi-dol", ex: "Rest your face in the face cradle and breathe deeply.", exEs: "Apoye la cara en el reposacabeza y respire profundo." },
  { en: "arm rest", es: "apoyabrazos de la camilla", pron: "árm rest", ex: "You can rest your arms on the arm rest under the table.", exEs: "Puede apoyar los brazos en el apoyabrazos debajo de la camilla." },
  { en: "table warmer", es: "calentador de camilla", pron: "téi-bol uór-mer", ex: "The table warmer is on, so the bed will feel cozy.", exEs: "El calentador de la camilla está encendido, así que la cama se sentirá calientita." },
  { en: "massage chair", es: "silla de masaje", pron: "ma-sásh cher", ex: "For this treatment, please sit on the massage chair.", exEs: "Para este tratamiento, por favor siéntese en la silla de masaje." },
  { en: "step stool", es: "banquito / escalón", pron: "step stul", ex: "Please use the step stool to get on the table.", exEs: "Por favor, use el banquito para subir a la camilla." },
  { en: "rolling stool", es: "banco con ruedas (de la terapeuta)", pron: "róu-ling stul", ex: "I will sit on my rolling stool for your foot massage.", exEs: "Me sentaré en mi banco con ruedas para su masaje de pies." },
  { en: "trolley", es: "carrito auxiliar", pron: "trá-li", ex: "All the products for your treatment are ready on the trolley.", exEs: "Todos los productos de su tratamiento están listos en el carrito." },
  { en: "tray", es: "charola", pron: "tréi", ex: "I prepare your products on this tray.", exEs: "Preparo sus productos en esta charola." },
  { en: "hot stone heater", es: "calentador de piedras", pron: "jat stóun jí-ter", ex: "The stones are warming up in the hot stone heater.", exEs: "Las piedras se están calentando en el calentador." },
  { en: "oil warmer", es: "calentador de aceite", pron: "óil uór-mer", ex: "Your oil is in the oil warmer, so it will feel warm on your skin.", exEs: "Su aceite está en el calentador, así que lo sentirá tibio en la piel." },
  { en: "towel warmer", es: "calentador de toallas", pron: "táu-el uór-mer", ex: "I have warm towels ready in the towel warmer.", exEs: "Tengo toallas tibias listas en el calentador de toallas." },
  { en: "facial steamer", es: "vaporizador facial", pron: "féi-shal stí-mer", ex: "The facial steamer will open your pores.", exEs: "El vaporizador facial le abrirá los poros." },
  { en: "magnifying lamp", es: "lámpara de aumento (lupa)", pron: "mág-ni-fai-ing lamp", ex: "I will look at your skin with the magnifying lamp.", exEs: "Voy a revisar su piel con la lámpara de aumento." },
  { en: "aroma diffuser", es: "difusor de aromas", pron: "a-róu-ma di-fiú-ser", ex: "The aroma diffuser releases a soft lavender scent.", exEs: "El difusor libera un suave aroma a lavanda." },
  { en: "dimmer switch", es: "regulador de luz", pron: "dí-mer suich", ex: "I can lower the lights with the dimmer switch.", exEs: "Puedo bajar la luz con el regulador." },
  { en: "speaker", es: "bocina", pron: "spí-ker", ex: "Would you like me to turn down the speaker?", exEs: "¿Le gustaría que le bajara a la bocina?" },
  { en: "thermostat", es: "termostato", pron: "zér-mo-stat", ex: "If you feel cold, I can adjust the thermostat.", exEs: "Si siente frío, puedo ajustar el termostato." },
  { en: "sink", es: "lavabo", pron: "sink", ex: "I will wash my hands at the sink before we begin.", exEs: "Me lavaré las manos en el lavabo antes de empezar." },
  { en: "mirror", es: "espejo", pron: "mí-rror", ex: "There is a mirror here if you want to fix your hair.", exEs: "Aquí hay un espejo por si quiere arreglarse el cabello." },
  { en: "clothes hook", es: "gancho de pared para la ropa", pron: "klóuds juk", ex: "You can hang your clothes on the hook behind the door.", exEs: "Puede colgar su ropa en el gancho detrás de la puerta." },
  { en: "hanger", es: "gancho / percha", pron: "ján-guer", ex: "Here is a hanger for your dress.", exEs: "Aquí tiene un gancho para su vestido." },
  { en: "basket", es: "canasta", pron: "bás-ket", ex: "Please put your belongings in this basket.", exEs: "Por favor, ponga sus pertenencias en esta canasta." },
  { en: "laundry hamper", es: "cesto de ropa sucia", pron: "lón-dri jám-per", ex: "I put the used towels in the laundry hamper.", exEs: "Pongo las toallas usadas en el cesto de ropa sucia." },
  { en: "trash can", es: "bote de basura", pron: "trash kan", ex: "The trash can is under the sink.", exEs: "El bote de basura está debajo del lavabo." },

  // Blancos
  { en: "fitted sheet", es: "sábana ajustable", pron: "fí-ted shit", ex: "I change the fitted sheet after every guest.", exEs: "Cambio la sábana ajustable después de cada huésped." },
  { en: "flat sheet", es: "sábana plana (para cubrir)", pron: "flat shit", ex: "Please lie down under the flat sheet.", exEs: "Por favor, acuéstese debajo de la sábana plana." },
  { en: "face cradle cover", es: "funda del reposacabeza", pron: "féis kréi-dol ká-ver", ex: "The face cradle cover is clean and soft.", exEs: "La funda del reposacabeza está limpia y suave." },
  { en: "pillow", es: "almohada", pron: "pí-lou", ex: "Would you like a pillow under your knees?", exEs: "¿Desea una almohada debajo de las rodillas?" },
  { en: "pillowcase", es: "funda de almohada", pron: "pí-lou-keis", ex: "I put a fresh pillowcase on the pillow.", exEs: "Le puse una funda limpia a la almohada." },
  { en: "bolster", es: "cojín de apoyo", pron: "bóul-ster", ex: "I will place a bolster under your ankles.", exEs: "Le colocaré un cojín de apoyo debajo de los tobillos." },
  { en: "eye pillow", es: "almohadilla para ojos", pron: "ái pí-lou", ex: "This eye pillow will help you relax.", exEs: "Esta almohadilla para ojos le ayudará a relajarse." },
  { en: "blanket", es: "cobija / manta", pron: "blán-ket", ex: "Would you like a blanket over the sheet?", exEs: "¿Le gustaría una cobija encima de la sábana?" },
  { en: "thermal blanket", es: "manta térmica", pron: "zér-mal blán-ket", ex: "I will wrap you in a thermal blanket for the body wrap.", exEs: "La envolveré en una manta térmica para la envoltura." },
  { en: "plastic wrap", es: "plástico para envolver", pron: "plás-tik rap", ex: "The plastic wrap keeps the mask warm on your skin.", exEs: "El plástico mantiene la mascarilla caliente en su piel." },
  { en: "towel", es: "toalla", pron: "táu-el", ex: "I will cover your back with a towel.", exEs: "Le cubriré la espalda con una toalla." },
  { en: "hand towel", es: "toalla de manos", pron: "jand táu-el", ex: "Here is a hand towel to dry your hands.", exEs: "Aquí tiene una toalla de manos para secarse." },
  { en: "bath towel", es: "toalla de baño", pron: "baz táu-el", ex: "There is a bath towel for you after the shower.", exEs: "Hay una toalla de baño para usted después de la regadera." },
  { en: "hot towel", es: "toalla caliente", pron: "jat táu-el", ex: "I will remove the oil with a hot towel.", exEs: "Le retiraré el aceite con una toalla caliente." },

  // Artículos para el huésped
  { en: "robe", es: "bata", pron: "róub", ex: "Please use the robe provided for you.", exEs: "Por favor, use la bata que le preparamos." },
  { en: "slippers", es: "pantuflas", pron: "slí-pers", ex: "Here are your robe and slippers.", exEs: "Aquí tiene su bata y sus pantuflas." },
  { en: "disposable underwear", es: "ropa interior desechable", pron: "dis-póu-sa-bol án-der-uer", ex: "Here is some disposable underwear for the treatment.", exEs: "Aquí tiene ropa interior desechable para el tratamiento." },
  { en: "hair band", es: "banda para el cabello", pron: "jer band", ex: "This hair band will keep the oil out of your hair.", exEs: "Esta banda evitará que el aceite le llegue al cabello." },
  { en: "hair clips", es: "pinzas para el cabello", pron: "jer klips", ex: "I will hold your hair back with these hair clips.", exEs: "Le sujetaré el cabello con estas pinzas." },
  { en: "tissues", es: "pañuelos desechables", pron: "tí-shus", ex: "Here are some tissues if you need them.", exEs: "Aquí tiene pañuelos, por si los necesita." },
  { en: "glass of water", es: "vaso de agua", pron: "glas ov uó-ter", ex: "Please drink this glass of water after your massage.", exEs: "Por favor, tome este vaso de agua después de su masaje." },
  { en: "footbath", es: "tina para pies", pron: "fút-baz", ex: "Please place your feet in the warm footbath.", exEs: "Por favor, ponga los pies en la tina de agua tibia." },

  // Herramientas del tratamiento
  { en: "basalt stones", es: "piedras de basalto", pron: "ba-sólt stóuns", ex: "These basalt stones keep the heat for a long time.", exEs: "Estas piedras de basalto conservan el calor por mucho tiempo." },
  { en: "bamboo sticks", es: "cañas de bambú", pron: "bam-bú stiks", ex: "I will roll the bamboo sticks along your back.", exEs: "Deslizaré las cañas de bambú por su espalda." },
  { en: "cupping cups", es: "ventosas", pron: "ká-ping kaps", ex: "The cupping cups create a gentle suction.", exEs: "Las ventosas crean una succión suave." },
  { en: "gua sha", es: "gua sha (piedra para el rostro)", pron: "guá shá", ex: "I will use the gua sha along your jawline.", exEs: "Usaré el gua sha a lo largo de su mandíbula." },
  { en: "jade roller", es: "rodillo de jade", pron: "yéid róu-ler", ex: "The jade roller feels cool and reduces puffiness.", exEs: "El rodillo de jade se siente fresco y desinflama." },
  { en: "herbal compress", es: "compresa de hierbas (saquito)", pron: "ér-bal kóm-pres", ex: "The warm herbal compress relaxes your muscles.", exEs: "La compresa tibia de hierbas relaja sus músculos." },
  { en: "singing bowl", es: "cuenco tibetano", pron: "sín-ging bóul", ex: "I will start your session with the singing bowl.", exEs: "Comenzaré su sesión con el cuenco tibetano." },
  { en: "body brush", es: "cepillo corporal", pron: "bá-di brash", ex: "I will use a dry body brush before the scrub.", exEs: "Usaré un cepillo corporal en seco antes del exfoliante." },
  { en: "exfoliating mitt", es: "guante exfoliante", pron: "ex-fóu-li-ei-ting mit", ex: "The exfoliating mitt removes dead skin.", exEs: "El guante exfoliante quita la piel muerta." },
  { en: "mixing bowl", es: "tazón para mezclar", pron: "míx-ing bóul", ex: "I mix your mask in this mixing bowl.", exEs: "Preparo su mascarilla en este tazón." },
  { en: "spatula", es: "espátula", pron: "spá-chu-la", ex: "I use a spatula to take the cream from the jar.", exEs: "Uso una espátula para sacar la crema del frasco." },
  { en: "mask brush", es: "brocha para mascarilla", pron: "mask brash", ex: "I apply the mask with a soft mask brush.", exEs: "Aplico la mascarilla con una brocha suave." },
  { en: "sponges", es: "esponjas", pron: "spán-yes", ex: "I will remove the mask with warm sponges.", exEs: "Retiraré la mascarilla con esponjas tibias." },
  { en: "cotton pads", es: "discos de algodón", pron: "ká-ton pads", ex: "I clean your eyes with cotton pads.", exEs: "Le limpio los ojos con discos de algodón." },
  { en: "cotton swabs", es: "hisopos", pron: "ká-ton suabs", ex: "I use cotton swabs for the small areas.", exEs: "Uso hisopos para las zonas pequeñas." },
  { en: "pump bottle", es: "botella dosificadora", pron: "pamp bá-tol", ex: "The massage oil is in this pump bottle.", exEs: "El aceite de masaje está en esta botella dosificadora." },
  { en: "oil holster", es: "portaaceite (cinturón de la terapeuta)", pron: "óil jóul-ster", ex: "I keep the oil in my holster so I never stop the massage.", exEs: "Llevo el aceite en mi portaaceite para no detener el masaje." },
  { en: "spray bottle", es: "atomizador", pron: "spréi bá-tol", ex: "I will refresh your face with this spray bottle.", exEs: "Le refrescaré la cara con este atomizador." },
  { en: "timer", es: "temporizador", pron: "tái-mer", ex: "I will set the timer for ten minutes.", exEs: "Pondré el temporizador en diez minutos." },

  // Higiene
  { en: "disposable gloves", es: "guantes desechables", pron: "dis-póu-sa-bol glavs", ex: "I will wear disposable gloves for this treatment.", exEs: "Usaré guantes desechables para este tratamiento." },
  { en: "hand sanitizer", es: "gel antibacterial", pron: "jand sá-ni-tai-ser", ex: "I always use hand sanitizer before I touch you.", exEs: "Siempre uso gel antibacterial antes de tocarle." },
  { en: "disinfectant", es: "desinfectante", pron: "dis-in-fék-tant", ex: "I clean the table with disinfectant after every guest.", exEs: "Limpio la camilla con desinfectante después de cada huésped." },

  // Ambiente
  { en: "candles", es: "velas", pron: "kán-dols", ex: "The candles create a relaxing atmosphere.", exEs: "Las velas crean un ambiente relajante." },
  { en: "incense", es: "incienso", pron: "ín-sens", ex: "Are you comfortable with the smell of incense?", exEs: "¿Le agrada el olor del incienso?" },
  { en: "fresh flowers", es: "flores frescas", pron: "fresh fláu-ers", ex: "We put fresh flowers in every treatment room.", exEs: "Ponemos flores frescas en cada cabina." },
];

VOCAB.push({ id: "cabina", title: "Cabina de masaje: equipo y artículos", icon: "🛏️", words: CABINA_VOCAB });
