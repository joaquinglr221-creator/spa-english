// Joyería y accesorios: vocabulario del PDF "English Vocabulary · Jewelry & Fashion Accessories" (en, pronunciación
// aproximada y español) con una frase de ejemplo en el spa; solo los 50 términos que tienen imagen de Canva. Es una categoría
// del vocabulario (con sus pruebas) y el PDF original es su material ("joyeria").

const JOYERIA_VOCAB = [
  // 1. Jewelry – Joyería en general
  { en: "jewelry", es: "joyería", pron: "yú-el-ri", ex: "Please leave your jewelry in the locker before your massage.", exEs: "Por favor, deje su joyería en el casillero antes de su masaje." },
  { en: "costume jewelry", es: "bisutería", pron: "kós-tum yú-el-ri", ex: "Even costume jewelry can be damaged by the massage oil.", exEs: "Incluso la bisutería se puede dañar con el aceite de masaje." },
  { en: "gold jewelry", es: "joyería de oro", pron: "góuld yú-el-ri", ex: "Please remove your gold jewelry before entering the sauna.", exEs: "Por favor, quítese su joyería de oro antes de entrar al sauna." },
  { en: "silver jewelry", es: "joyería de plata", pron: "síl-ver yú-el-ri", ex: "Silver jewelry can darken in the steam room.", exEs: "La joyería de plata se puede oscurecer en el cuarto de vapor." },
  { en: "handmade jewelry", es: "joyería artesanal", pron: "jánd-méid yú-el-ri", ex: "Our boutique sells handmade jewelry from local artists.", exEs: "Nuestra boutique vende joyería artesanal de artistas locales." },
  // 2. Necklaces – Collares y cadenas
  { en: "necklace", es: "collar", pron: "nék-lis", ex: "May I help you remove your necklace before the facial?", exEs: "¿Le ayudo a quitarse el collar antes del facial?" },
  { en: "chain", es: "cadena", pron: "chéin", ex: "Please take off your chain so I can massage your neck.", exEs: "Por favor, quítese la cadena para que pueda masajear su cuello." },
  { en: "gold chain", es: "cadena de oro", pron: "góuld chéin", ex: "Your gold chain is safe in the locker.", exEs: "Su cadena de oro está segura en el casillero." },
  { en: "silver chain", es: "cadena de plata", pron: "síl-ver chéin", ex: "I found a silver chain in the locker room.", exEs: "Encontré una cadena de plata en el vestidor." },
  { en: "pendant", es: "dije / Colgante", pron: "pén-dant", ex: "What a lovely pendant. Is it a gift?", exEs: "Qué lindo dije. ¿Es un regalo?" },
  { en: "locket", es: "relicario", pron: "ló-kit", ex: "Please keep your locket in this jewelry pouch.", exEs: "Por favor, guarde su relicario en esta bolsa para joyería." },
  { en: "choker", es: "gargantilla", pron: "chóu-ker", ex: "Could you remove your choker for the neck massage?", exEs: "¿Podría quitarse la gargantilla para el masaje de cuello?" },
  { en: "pearl necklace", es: "collar de perlas", pron: "pérl nék-lis", ex: "Pearls are delicate, so please keep your pearl necklace away from the oil.", exEs: "Las perlas son delicadas; por favor, mantenga su collar de perlas lejos del aceite." },
  { en: "beaded necklace", es: "collar de cuentas", pron: "bí-did nék-lis", ex: "Your beaded necklace is very colorful.", exEs: "Su collar de cuentas es muy colorido." },
  { en: "statement necklace", es: "collar llamativo", pron: "stéit-ment nék-lis", ex: "That statement necklace looks beautiful with your dress.", exEs: "Ese collar llamativo se ve hermoso con su vestido." },
  { en: "layered necklace", es: "collar de varias capas", pron: "léi-erd nék-lis", ex: "Let me help you with your layered necklace so it does not get tangled.", exEs: "Permítame ayudarle con su collar de varias capas para que no se enrede." },
  { en: "long necklace", es: "collar largo", pron: "lóng nék-lis", ex: "Please remove your long necklace before lying face down.", exEs: "Por favor, quítese el collar largo antes de recostarse boca abajo." },
  { en: "short necklace", es: "collar corto", pron: "shórt nék-lis", ex: "A short necklace can bother you in the face cradle.", exEs: "Un collar corto le puede molestar en el reposacabeza." },
  { en: "cross necklace", es: "collar con cruz", pron: "krós nék-lis", ex: "I will place your cross necklace here, next to your watch.", exEs: "Pondré su collar con cruz aquí, junto a su reloj." },
  { en: "heart necklace", es: "collar con corazón", pron: "járt nék-lis", ex: "Your heart necklace is in the jewelry tray.", exEs: "Su collar con corazón está en la charola de joyería." },
  // 3. Earrings – Aretes / Pendientes
  { en: "earrings", es: "aretes / Pendientes", pron: "ír-rings", ex: "Would you like to remove your earrings for the facial?", exEs: "¿Le gustaría quitarse los aretes para el facial?" },
  { en: "stud earrings", es: "aretes pequeños", pron: "stád ír-rings", ex: "You can keep your stud earrings on during the massage.", exEs: "Puede dejarse los aretes pequeños durante el masaje." },
  { en: "hoop earrings", es: "arracadas", pron: "júp ír-rings", ex: "Please remove your hoop earrings before the scalp massage.", exEs: "Por favor, quítese las arracadas antes del masaje de cuero cabelludo." },
  { en: "drop earrings", es: "aretes colgantes", pron: "dróp ír-rings", ex: "Your drop earrings could get caught in the towel.", exEs: "Sus aretes colgantes se podrían atorar en la toalla." },
  { en: "dangle earrings", es: "aretes largos colgantes", pron: "dán-gol ír-rings", ex: "I recommend removing your dangle earrings for the jacuzzi.", exEs: "Le recomiendo quitarse los aretes largos para el jacuzzi." },
  { en: "diamond earrings", es: "aretes de diamantes", pron: "dái-mond ír-rings", ex: "Please keep your diamond earrings in the room safe.", exEs: "Por favor, guarde sus aretes de diamantes en la caja fuerte de la habitación." },
  { en: "pearl earrings", es: "aretes de perlas", pron: "pérl ír-rings", ex: "Your pearl earrings are beautiful.", exEs: "Sus aretes de perlas son hermosos." },
  { en: "ear cuff", es: "adorno para la oreja", pron: "ír kaf", ex: "Please remove your ear cuff for the head massage.", exEs: "Por favor, quítese el adorno de la oreja para el masaje de cabeza." },
  { en: "ear climbers", es: "aretes trepadores", pron: "ír klái-mers", ex: "Your ear climbers look very elegant.", exEs: "Sus aretes trepadores se ven muy elegantes." },
  { en: "ear studs", es: "broqueles", pron: "ír stáds", ex: "Small ear studs are fine during the treatment.", exEs: "Los broqueles pequeños están bien durante el tratamiento." },
  { en: "clip-on earrings", es: "aretes de presión", pron: "klíp-on ír-rings", ex: "Clip-on earrings are easy to take off before the facial.", exEs: "Los aretes de presión son fáciles de quitar antes del facial." },
  { en: "ear piercing", es: "perforación de oreja", pron: "ír pír-sing", ex: "Is your ear piercing new? I will be careful around it.", exEs: "¿Su perforación de oreja es nueva? Tendré cuidado alrededor." },
  // 4. Rings – Anillos
  { en: "engagement ring", es: "anillo de compromiso", pron: "en-géich-ment ring", ex: "Congratulations on your engagement ring!", exEs: "¡Felicidades por su anillo de compromiso!" },
  { en: "wedding band", es: "argolla matrimonial", pron: "wé-ding band", ex: "The massage oil can make your wedding band slip off.", exEs: "El aceite de masaje puede hacer que su argolla matrimonial se resbale." },
  { en: "signet ring", es: "anillo de sello", pron: "síg-net ring", ex: "Your signet ring is in the jewelry tray.", exEs: "Su anillo de sello está en la charola de joyería." },
  { en: "diamond ring", es: "anillo de diamante", pron: "dái-mond ring", ex: "Please keep your diamond ring in a safe place.", exEs: "Por favor, guarde su anillo de diamante en un lugar seguro." },
  // 5. Bracelets & Bangles – Pulseras y brazaletes
  { en: "cuff bracelet", es: "brazalete abierto", pron: "káf bréis-let", ex: "Please remove your cuff bracelet before the arm massage.", exEs: "Por favor, quítese el brazalete abierto antes del masaje de brazos." },
  { en: "charm bracelet", es: "pulsera de dijes", pron: "chárm bréis-let", ex: "Your charm bracelet has so many beautiful charms.", exEs: "Su pulsera de dijes tiene muchos dijes hermosos." },
  { en: "tennis bracelet", es: "pulsera de diamantes", pron: "té-nis bréis-let", ex: "Please keep your tennis bracelet in the room safe.", exEs: "Por favor, guarde su pulsera de diamantes en la caja fuerte de la habitación." },
  { en: "beaded bracelet", es: "pulsera de cuentas", pron: "bí-did bréis-let", ex: "Water can damage your beaded bracelet.", exEs: "El agua puede dañar su pulsera de cuentas." },
  { en: "anklet", es: "tobillera", pron: "ánk-let", ex: "Please remove your anklet before the foot massage.", exEs: "Por favor, quítese la tobillera antes del masaje de pies." },
  // 6. Watches – Relojes
  { en: "watch", es: "reloj de pulsera", pron: "wách", ex: "Please leave your watch in the locker.", exEs: "Por favor, deje su reloj en el casillero." },
  // 7. Women's Accessories – Accesorios para mujer
  { en: "handbag", es: "bolso de mano", pron: "jánd-bag", ex: "You can leave your handbag in the locker.", exEs: "Puede dejar su bolso de mano en el casillero." },
  { en: "coin purse", es: "monedero", pron: "kóin pérs", ex: "I found a coin purse in the relaxation lounge.", exEs: "Encontré un monedero en la sala de relajación." },
  // 8. Men's Accessories – Accesorios para hombre
  { en: "cardholder", es: "tarjetero", pron: "kárd-jóul-der", ex: "Is this your cardholder? It has your room key.", exEs: "¿Es su tarjetero? Tiene la llave de su habitación." },
  { en: "money clip", es: "clip para billetes", pron: "má-ni klip", ex: "Please keep your money clip in the locker.", exEs: "Por favor, guarde su clip para billetes en el casillero." },
  // 10. Other Fashion Accessories – Otros accesorios de moda
  { en: "keychain", es: "llavero", pron: "kí-chein", ex: "Your locker key is on this keychain.", exEs: "La llave de su casillero está en este llavero." },
  { en: "lanyard", es: "cordón para gafete", pron: "lán-yard", ex: "Our staff always wear a lanyard with their name.", exEs: "Nuestro personal siempre usa un cordón con su gafete." },
  { en: "ID badge holder", es: "portagafete", pron: "ái-dí badch jóul-der", ex: "Please show your ID badge holder at the staff entrance.", exEs: "Por favor, muestre su portagafete en la entrada del personal." },
  // 12. Jewelry Parts & Clasps – Partes y cierres de joyería
  { en: "charm", es: "dije", pron: "chárm", ex: "Your bracelet has a little shell charm.", exEs: "Su pulsera tiene un pequeño dije de concha." },
];

VOCAB.push({ id: "joyeria", title: "Joyería y accesorios", icon: "💍", words: JOYERIA_VOCAB, material: ["joyeria"] });
