// Posturas del masaje: cómo pedirle al huésped que se acomode, en inglés y español.
// Cada postura: en/es/pron y la instrucción (ex/exEs) como en el vocabulario; un mini diálogo con el huésped
// (cabe en un clip de 10 s) y la escena (accion) para el prompt de Kling (scripts/prompts_posturas.py).
// lugar: "cabina" (camilla de masaje, por omisión), "silla" (silla de masaje) o "pedicura" (sillón de pedicura).
// También es la categoría de vocabulario "posturas" (al final del archivo), con sus pruebas de listening y writing.

const POSTURAS = [
  {
    id: "face-down", en: "face down", es: "boca abajo", pron: "féis dáun",
    ex: "Please lie face down, with your face in the face cradle.", exEs: "Por favor, recuéstese boca abajo, con el rostro en la cabecera.",
    dialogo: [
      { who: "therapist", en: "Please lie face down, with your face in the face cradle.", es: "Por favor, recuéstese boca abajo, con el rostro en la cabecera." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Perfect. Just relax.", es: "Perfecto. Solo relájese." },
    ],
    accion: "Mrs. Smith lies face down on the massage table and rests her face in the padded face cradle; Ana gently straightens the white sheet over her back and smiles.",
  },
  {
    id: "face-up", en: "face up", es: "boca arriba", pron: "féis ap",
    ex: "Please lie face up, with your head on the pillow.", exEs: "Por favor, recuéstese boca arriba, con la cabeza en la almohada.",
    dialogo: [
      { who: "therapist", en: "Please lie face up, with your head on the pillow.", es: "Por favor, recuéstese boca arriba, con la cabeza en la almohada." },
      { who: "guest", en: "Okay.", es: "De acuerdo." },
      { who: "therapist", en: "Are you comfortable?", es: "¿Está cómoda?" },
    ],
    accion: "Mrs. Smith lies face up on the massage table with her head on a soft white pillow; Ana kindly checks on her with a caring look.",
  },
  {
    id: "side-lying", en: "lying on your side", es: "acostado de lado", pron: "lái-ing on yur sáid",
    ex: "Please lie on your left side, facing the wall.", exEs: "Por favor, acuéstese sobre su lado izquierdo, mirando hacia la pared.",
    dialogo: [
      { who: "therapist", en: "Please lie on your left side, facing the wall.", es: "Por favor, acuéstese sobre su lado izquierdo, mirando hacia la pared." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Yes. Bend your knees a little.", es: "Sí. Doble un poco las rodillas." },
    ],
    accion: "Mrs. Smith lies on her left side on the massage table, facing the wall, and gently bends her knees; Ana nods and smiles.",
  },
  {
    id: "sitting-up", en: "sitting up", es: "sentado", pron: "sí-ting ap",
    ex: "Please sit up on the edge of the table.", exEs: "Por favor, siéntese en la orilla de la camilla.",
    dialogo: [
      { who: "therapist", en: "Please sit up on the edge of the table.", es: "Por favor, siéntese en la orilla de la camilla." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Yes. Keep your feet on the floor.", es: "Sí. Mantenga los pies en el piso." },
    ],
    accion: "Mrs. Smith, in her white robe, sits on the edge of the massage table with her feet resting on the floor; Ana stands beside her and gestures kindly.",
  },
  {
    id: "turn-over", en: "turn over", es: "darse la vuelta", pron: "tern óu-ver",
    ex: "Whenever you're ready, please turn over onto your back.", exEs: "Cuando esté lista, por favor, dese la vuelta y quede boca arriba.",
    dialogo: [
      { who: "therapist", en: "Whenever you're ready, please turn over onto your back.", es: "Cuando esté lista, por favor, dese la vuelta y quede boca arriba." },
      { who: "therapist", en: "I'll hold the sheet for you.", es: "Yo le sostengo la sábana." },
    ],
    accion: "Ana lifts and holds the white sheet like a privacy tent while Mrs. Smith slowly turns over from face down to face up under it.",
  },
  {
    id: "sit-up-slowly", en: "sit up slowly", es: "incorporarse despacio", pron: "sit ap slóu-li",
    ex: "When you're ready, roll onto your side and sit up slowly.", exEs: "Cuando esté lista, gírese de lado e incorpórese despacio.",
    dialogo: [
      { who: "therapist", en: "When you're ready, roll onto your side and sit up slowly.", es: "Cuando esté lista, gírese de lado e incorpórese despacio." },
      { who: "therapist", en: "Take your time.", es: "Tómese su tiempo." },
    ],
    accion: "At the end of the massage, Mrs. Smith rolls onto her side and slowly sits up on the table, holding the sheet; Ana offers a steadying hand.",
  },
  {
    id: "scoot-up", en: "scoot up", es: "recorrerse hacia arriba", pron: "skut ap",
    ex: "Could you scoot up a little toward the headrest?", exEs: "¿Podría recorrerse un poco hacia la cabecera?",
    dialogo: [
      { who: "therapist", en: "Could you scoot up a little toward the headrest?", es: "¿Podría recorrerse un poco hacia la cabecera?" },
      { who: "guest", en: "Is this better?", es: "¿Así está mejor?" },
      { who: "therapist", en: "Yes, perfect.", es: "Sí, perfecto." },
    ],
    accion: "Mrs. Smith, lying face up, slides a little up the massage table toward the headrest; Ana gestures upward with her hand and smiles.",
  },
  {
    id: "scoot-down", en: "scoot down", es: "recorrerse hacia abajo", pron: "skut dáun",
    ex: "Please scoot down a little, toward me.", exEs: "Por favor, recórrase un poco hacia abajo, hacia mí.",
    dialogo: [
      { who: "therapist", en: "Please scoot down a little, toward me.", es: "Por favor, recórrase un poco hacia abajo, hacia mí." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "That's great.", es: "Excelente." },
    ],
    accion: "Ana stands at the foot of the massage table and gestures toward herself; Mrs. Smith, lying face up, slides a little down the table.",
  },
  {
    id: "head-to-the-side", en: "turn your head to the side", es: "girar la cabeza hacia un lado", pron: "tern yur jed tu de sáid",
    ex: "Please turn your head to the right side.", exEs: "Por favor, gire la cabeza hacia el lado derecho.",
    dialogo: [
      { who: "therapist", en: "Please turn your head to the right side.", es: "Por favor, gire la cabeza hacia el lado derecho." },
      { who: "guest", en: "Okay.", es: "De acuerdo." },
      { who: "therapist", en: "Is your neck comfortable?", es: "¿Está cómodo su cuello?" },
    ],
    accion: "Mrs. Smith, lying face up, slowly turns her head to the right on the pillow; Ana gently supports her head with both hands.",
  },
  {
    id: "tuck-your-chin", en: "tuck your chin", es: "meter la barbilla", pron: "tak yur chin",
    ex: "Please tuck your chin slightly toward your chest.", exEs: "Por favor, meta un poco la barbilla hacia el pecho.",
    dialogo: [
      { who: "therapist", en: "Please tuck your chin slightly toward your chest.", es: "Por favor, meta un poco la barbilla hacia el pecho." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Perfect.", es: "Perfecto." },
    ],
    accion: "Mrs. Smith, lying face up, gently tucks her chin toward her chest; Ana, standing at the head of the table, nods approvingly.",
  },
  {
    id: "lift-your-head", en: "lift your head", es: "levantar la cabeza", pron: "lift yur jed",
    ex: "Please lift your head for a moment, so I can adjust the pillow.", exEs: "Por favor, levante la cabeza un momento para acomodar la almohada.",
    dialogo: [
      { who: "therapist", en: "Please lift your head for a moment, so I can adjust the pillow.", es: "Por favor, levante la cabeza un momento para acomodar la almohada." },
      { who: "guest", en: "Sure.", es: "Claro." },
    ],
    accion: "Mrs. Smith lifts her head slightly from the pillow; Ana quickly fluffs and adjusts the white pillow, then helps her rest her head again.",
  },
  {
    id: "arms-by-your-sides", en: "arms by your sides", es: "brazos a los costados", pron: "arms bái yur sáids",
    ex: "Please rest your arms by your sides.", exEs: "Por favor, deje descansar los brazos a los costados.",
    dialogo: [
      { who: "therapist", en: "Please rest your arms by your sides.", es: "Por favor, deje descansar los brazos a los costados." },
      { who: "therapist", en: "Let them feel heavy and relaxed.", es: "Déjelos pesados y relajados." },
    ],
    accion: "Mrs. Smith, lying face up under the sheet, rests her arms along her sides; Ana gently places one of her arms in a relaxed position.",
  },
  {
    id: "palms-up", en: "palms up", es: "palmas hacia arriba", pron: "páms ap",
    ex: "Please turn your palms up.", exEs: "Por favor, ponga las palmas hacia arriba.",
    dialogo: [
      { who: "therapist", en: "Please turn your palms up.", es: "Por favor, ponga las palmas hacia arriba." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Yes. That relaxes your shoulders.", es: "Sí. Eso relaja sus hombros." },
    ],
    accion: "Mrs. Smith, lying face up with her arms by her sides, turns her palms up; Ana nods and smiles.",
  },
  {
    id: "palms-down", en: "palms down", es: "palmas hacia abajo", pron: "páms dáun",
    ex: "Now, please turn your palms down.", exEs: "Ahora, por favor, ponga las palmas hacia abajo.",
    dialogo: [
      { who: "therapist", en: "Now, please turn your palms down.", es: "Ahora, por favor, ponga las palmas hacia abajo." },
      { who: "guest", en: "Okay.", es: "De acuerdo." },
      { who: "therapist", en: "Thank you.", es: "Gracias." },
    ],
    accion: "Mrs. Smith, lying face up, turns her palms down on the table; Ana begins a gentle hand massage.",
  },
  {
    id: "let-your-arm-go", en: "let your arm go", es: "soltar el brazo", pron: "let yur arm góu",
    ex: "Let your arm go, and let me hold its weight.", exEs: "Suelte el brazo y déjeme sostener su peso.",
    dialogo: [
      { who: "therapist", en: "Let your arm go, and let me hold its weight.", es: "Suelte el brazo y déjeme sostener su peso." },
      { who: "guest", en: "Sorry, I keep helping!", es: "¡Perdón, sigo ayudando!" },
      { who: "therapist", en: "That's okay. Just relax.", es: "No se preocupe. Solo relájese." },
    ],
    accion: "Ana lifts Mrs. Smith's arm by the wrist and elbow; Mrs. Smith laughs softly and lets her arm go limp in Ana's hands.",
  },
  {
    id: "bend-your-knees", en: "bend your knees", es: "doblar las rodillas", pron: "bend yur nis",
    ex: "Please bend your knees and keep your feet flat on the table.", exEs: "Por favor, doble las rodillas y mantenga los pies apoyados en la camilla.",
    dialogo: [
      { who: "therapist", en: "Please bend your knees and keep your feet flat on the table.", es: "Por favor, doble las rodillas y mantenga los pies apoyados en la camilla." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
    ],
    accion: "Mrs. Smith, lying face up under the sheet, bends her knees with her feet flat on the table; Ana adjusts the sheet over her knees.",
  },
  {
    id: "straighten-your-legs", en: "straighten your legs", es: "estirar las piernas", pron: "stréi-ten yur legs",
    ex: "Now, please straighten your legs slowly.", exEs: "Ahora, por favor, estire las piernas despacio.",
    dialogo: [
      { who: "therapist", en: "Now, please straighten your legs slowly.", es: "Ahora, por favor, estire las piernas despacio." },
      { who: "guest", en: "Okay.", es: "De acuerdo." },
      { who: "therapist", en: "Very good.", es: "Muy bien." },
    ],
    accion: "Mrs. Smith, lying face up, slowly straightens her legs under the sheet; Ana smooths the sheet over them.",
  },
  {
    id: "bolster-under-your-knees", en: "bolster under your knees", es: "cojín bajo las rodillas", pron: "bóul-ster án-der yur nis",
    ex: "I'll place a bolster under your knees to support your lower back.", exEs: "Le pondré un cojín bajo las rodillas para apoyar su espalda baja.",
    dialogo: [
      { who: "therapist", en: "I'll place a bolster under your knees to support your lower back.", es: "Le pondré un cojín bajo las rodillas para apoyar su espalda baja." },
      { who: "guest", en: "Oh, that feels better.", es: "Ay, así se siente mejor." },
    ],
    accion: "Ana slides a round white bolster under Mrs. Smith's knees as she lies face up; Mrs. Smith sighs with relief.",
  },
  {
    id: "bolster-under-your-ankles", en: "bolster under your ankles", es: "cojín bajo los tobillos", pron: "bóul-ster án-der yur án-kols",
    ex: "I'm placing a bolster under your ankles to relax your feet.", exEs: "Le pongo un cojín bajo los tobillos para relajar sus pies.",
    dialogo: [
      { who: "therapist", en: "I'm placing a bolster under your ankles to relax your feet.", es: "Le pongo un cojín bajo los tobillos para relajar sus pies." },
      { who: "guest", en: "Thank you.", es: "Gracias." },
    ],
    accion: "Mrs. Smith lies face down; Ana places a round white bolster under her ankles over the sheet.",
  },
  {
    id: "pillow-between-your-knees", en: "pillow between your knees", es: "almohada entre las rodillas", pron: "pí-lou bi-tuín yur nis",
    ex: "I'll put a pillow between your knees for comfort.", exEs: "Le pondré una almohada entre las rodillas para que esté cómoda.",
    dialogo: [
      { who: "therapist", en: "I'll put a pillow between your knees for comfort.", es: "Le pondré una almohada entre las rodillas para que esté cómoda." },
      { who: "guest", en: "That's much better.", es: "Así está mucho mejor." },
    ],
    accion: "Mrs. Smith lies on her side with her knees bent; Ana places a soft white pillow between her knees.",
  },
  {
    id: "lift-your-hips", en: "lift your hips", es: "levantar la cadera", pron: "lift yur jips",
    ex: "Could you lift your hips a little, so I can adjust the sheet?", exEs: "¿Podría levantar un poco la cadera para acomodar la sábana?",
    dialogo: [
      { who: "therapist", en: "Could you lift your hips a little, so I can adjust the sheet?", es: "¿Podría levantar un poco la cadera para acomodar la sábana?" },
      { who: "guest", en: "Sure.", es: "Claro." },
    ],
    accion: "Mrs. Smith, lying face up with her knees bent, lifts her hips slightly; Ana smooths the white sheet underneath.",
  },
  {
    id: "lie-still", en: "lie still", es: "quedarse quieto", pron: "lái stil",
    ex: "Please lie still while the mask sets.", exEs: "Por favor, quédese quieta mientras actúa la mascarilla.",
    dialogo: [
      { who: "therapist", en: "Please lie still while the mask sets.", es: "Por favor, quédese quieta mientras actúa la mascarilla." },
      { who: "guest", en: "Okay.", es: "De acuerdo." },
      { who: "therapist", en: "I'll be right here.", es: "Aquí estaré." },
    ],
    accion: "Mrs. Smith lies face up with a white facial mask on her face and her eyes closed; Ana sits calmly beside her.",
  },
  {
    id: "relax-your-shoulders", en: "relax your shoulders", es: "relajar los hombros", pron: "ri-láks yur shóul-ders",
    ex: "Please relax your shoulders and let them drop.", exEs: "Por favor, relaje los hombros y déjelos caer.",
    dialogo: [
      { who: "therapist", en: "Please relax your shoulders and let them drop.", es: "Por favor, relaje los hombros y déjelos caer." },
      { who: "guest", en: "I didn't know they were so tense!", es: "¡No sabía que estaban tan tensos!" },
    ],
    accion: "Ana rests her hands lightly on Mrs. Smith's shoulders as she lies face up; Mrs. Smith exhales and her shoulders drop.",
  },
  {
    id: "uncross-your-legs", en: "uncross your legs", es: "descruzar las piernas", pron: "an-krós yur legs",
    ex: "Please uncross your legs, so your circulation can flow.", exEs: "Por favor, descruce las piernas para que circule bien la sangre.",
    dialogo: [
      { who: "therapist", en: "Please uncross your legs, so your circulation can flow.", es: "Por favor, descruce las piernas para que circule bien la sangre." },
      { who: "guest", en: "Oh, okay.", es: "Ah, de acuerdo." },
    ],
    accion: "Mrs. Smith, lying face up, uncrosses her ankles under the sheet; Ana smiles and nods.",
  },
  {
    id: "lean-forward", en: "lean forward", es: "inclinarse hacia adelante", pron: "lin fór-uard",
    ex: "Please lean forward and rest your face on the cushion.", exEs: "Por favor, inclínese hacia adelante y apoye el rostro en el cojín.",
    lugar: "silla",
    dialogo: [
      { who: "therapist", en: "Please lean forward and rest your face on the cushion.", es: "Por favor, inclínese hacia adelante y apoye el rostro en el cojín." },
      { who: "guest", en: "Like this?", es: "¿Así?" },
      { who: "therapist", en: "Perfect.", es: "Perfecto." },
    ],
    accion: "Mrs. Smith, in her robe, sits on a padded massage chair and leans forward, resting her face on the face cushion; Ana stands behind her.",
  },
  {
    id: "reclined-position", en: "reclined position", es: "posición reclinada", pron: "ri-kláind po-sí-shon",
    ex: "I'll recline the chair so you can relax during your pedicure.", exEs: "Reclinaré el sillón para que se relaje durante su pedicura.",
    lugar: "pedicura",
    dialogo: [
      { who: "therapist", en: "I'll recline the chair so you can relax during your pedicure.", es: "Reclinaré el sillón para que se relaje durante su pedicura." },
      { who: "guest", en: "That's very comfortable.", es: "Qué cómodo." },
    ],
    accion: "Mrs. Smith sits in a plush pedicure chair; Ana reclines the backrest and Mrs. Smith leans back comfortably with her feet in a warm footbath.",
  },
  {
    id: "pregnancy-position", en: "pregnancy position", es: "posición para embarazadas", pron: "prég-nan-si po-sí-shon",
    ex: "You'll lie on your side, with pillows for support.", exEs: "Se acostará de lado, con almohadas de apoyo.",
    dialogo: [
      { who: "therapist", en: "You'll lie on your side, with pillows for support.", es: "Se acostará de lado, con almohadas de apoyo." },
      { who: "guest", en: "Thank you. That's perfect.", es: "Gracias. Así está perfecto." },
    ],
    accion: "A visibly pregnant Mrs. Smith lies comfortably on her side on the massage table, supported by soft white pillows under her head, belly and between her knees; Ana adjusts a pillow.",
  },
  {
    id: "stand-up-slowly", en: "stand up slowly", es: "levantarse despacio", pron: "stand ap slóu-li",
    ex: "Please stand up slowly. You may feel a little dizzy.", exEs: "Por favor, levántese despacio. Puede sentir un poco de mareo.",
    dialogo: [
      { who: "therapist", en: "Please stand up slowly. You may feel a little dizzy.", es: "Por favor, levántese despacio. Puede sentir un poco de mareo." },
      { who: "guest", en: "Thank you.", es: "Gracias." },
    ],
    accion: "Mrs. Smith, wrapped in her white robe, stands up slowly from the massage table; Ana holds her elbow and offers her the white slippers.",
  },
];

// Categoría de vocabulario: las posturas con sus pruebas de listening y writing.
VOCAB.push({
  id: "posturas", title: "Posturas del masaje", icon: "🧘",
  words: POSTURAS.map(({ en, es, pron, ex, exEs }) => ({ en, es, pron, ex, exEs })),
});
