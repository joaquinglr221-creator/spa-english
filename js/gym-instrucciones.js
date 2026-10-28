// Gym del spa: phrasal verbs para dar instrucciones, cómo usar cada equipo (pasos y beneficios) y partes del
// cuerpo que se trabajan en el gimnasio. En inglés y español; las frases en inglés tienen audio en la app.

// Phrasal verbs que usa el entrenador para dar instrucciones (verbo, traducción, ejemplo y su traducción).
const GYM_PHRASAL = [
  { en: "Set up", es: "Preparar / ajustar", ex: "Let me set up the machine for you.", exEs: "Permítame ajustar la máquina para usted." },
  { en: "Turn on", es: "Encender", ex: "Press here to turn on the treadmill.", exEs: "Presione aquí para encender la caminadora." },
  { en: "Turn off", es: "Apagar", ex: "Turn off the machine when you finish.", exEs: "Apague la máquina cuando termine." },
  { en: "Step on", es: "Subirse (a una plataforma)", ex: "Step on the side rails first.", exEs: "Primero súbase a los rieles laterales." },
  { en: "Step off", es: "Bajarse", ex: "Step off carefully when the belt stops.", exEs: "Bájese con cuidado cuando la banda se detenga." },
  { en: "Get on", es: "Subirse (a una bicicleta o máquina)", ex: "Get on the bike and hold the handlebars.", exEs: "Súbase a la bicicleta y sujete el manubrio." },
  { en: "Get off", es: "Bajarse (de una bicicleta o máquina)", ex: "Slow down before you get off the bike.", exEs: "Baje la velocidad antes de bajarse de la bicicleta." },
  { en: "Speed up", es: "Acelerar", ex: "You can speed up little by little.", exEs: "Puede acelerar poco a poco." },
  { en: "Slow down", es: "Bajar la velocidad", ex: "Please slow down for the last minute.", exEs: "Por favor, baje la velocidad en el último minuto." },
  { en: "Warm up", es: "Calentar", ex: "Let's warm up for five minutes.", exEs: "Calentemos durante cinco minutos." },
  { en: "Cool down", es: "Enfriarse / bajar el ritmo", ex: "Walk slowly to cool down.", exEs: "Camine despacio para enfriarse." },
  { en: "Hold on to", es: "Sujetarse de", ex: "Hold on to the handrails at the start.", exEs: "Sujétese de los pasamanos al empezar." },
  { en: "Sit down", es: "Sentarse", ex: "Sit down with your back against the pad.", exEs: "Siéntese con la espalda contra el respaldo." },
  { en: "Lie down", es: "Acostarse", ex: "Lie down on the bench with your feet on the floor.", exEs: "Acuéstese en el banco con los pies en el piso." },
  { en: "Stand up", es: "Ponerse de pie", ex: "Stand up straight and relax your shoulders.", exEs: "Póngase de pie, derecho, y relaje los hombros." },
  { en: "Lean back", es: "Inclinarse hacia atrás", ex: "Lean back slightly and pull the bar to your chest.", exEs: "Inclínese un poco hacia atrás y jale la barra hacia el pecho." },
  { en: "Lean forward", es: "Inclinarse hacia adelante", ex: "Don't lean forward too much on the stair climber.", exEs: "No se incline demasiado hacia adelante en la escaladora." },
  { en: "Pull down", es: "Jalar hacia abajo", ex: "Pull down the bar slowly.", exEs: "Jale la barra hacia abajo despacio." },
  { en: "Push up", es: "Empujar hacia arriba", ex: "Push up the handles without locking your elbows.", exEs: "Empuje las manijas hacia arriba sin trabar los codos." },
  { en: "Push away", es: "Empujar hacia adelante / alejar", ex: "Push away the platform with your heels.", exEs: "Empuje la plataforma con los talones." },
  { en: "Lift up", es: "Levantar", ex: "Lift up the dumbbells to shoulder height.", exEs: "Levante las mancuernas a la altura de los hombros." },
  { en: "Put down", es: "Bajar / dejar en el piso", ex: "Put down the weights gently.", exEs: "Deje las pesas en el piso con cuidado." },
  { en: "Pick up", es: "Recoger / tomar", ex: "Bend your knees to pick up the kettlebell.", exEs: "Doble las rodillas para tomar la pesa rusa." },
  { en: "Put back", es: "Regresar a su lugar", ex: "Please put back the dumbbells on the rack.", exEs: "Por favor, regrese las mancuernas al rack." },
  { en: "Strap in", es: "Asegurar con las correas", ex: "Strap in your feet on the rowing machine.", exEs: "Asegure los pies con las correas en la máquina de remo." },
  { en: "Bend over", es: "Inclinarse (doblando la cadera)", ex: "Bend over slightly with your back straight.", exEs: "Inclínese un poco con la espalda recta." },
  { en: "Breathe in", es: "Inhalar", ex: "Breathe in as you lower the weight.", exEs: "Inhale al bajar el peso." },
  { en: "Breathe out", es: "Exhalar", ex: "Breathe out as you push.", exEs: "Exhale al empujar." },
  { en: "Stretch out", es: "Estirar", ex: "Stretch out your legs after the workout.", exEs: "Estire las piernas después del entrenamiento." },
  { en: "Loosen up", es: "Aflojar / soltar los músculos", ex: "Use the foam roller to loosen up your muscles.", exEs: "Use el rodillo de espuma para aflojar los músculos." },
  { en: "Wipe down", es: "Limpiar (con una toalla o toallita)", ex: "Please wipe down the machine after use.", exEs: "Por favor, limpie la máquina después de usarla." },
  { en: "Work out", es: "Entrenar / hacer ejercicio", ex: "How often do you work out?", exEs: "¿Con qué frecuencia hace ejercicio?" },
  { en: "Build up", es: "Aumentar poco a poco", ex: "We'll build up the weight gradually.", exEs: "Iremos aumentando el peso poco a poco." },
  { en: "Burn off", es: "Quemar (calorías)", ex: "Cardio helps you burn off calories.", exEs: "El cardio le ayuda a quemar calorías." },
];

// Cómo usar cada equipo: pasos (con phrasal verbs) y beneficios. "foto" = palabra del vocabulario con su imagen.
const GYM_EQUIPOS = [
  {
    foto: "Treadmill", en: "Treadmill", es: "Caminadora",
    pasos: [
      { en: "Step on the side rails and clip the safety key to your shirt.", es: "Súbase a los rieles laterales y enganche la llave de seguridad a su playera." },
      { en: "Turn on the treadmill and start at a slow speed.", es: "Encienda la caminadora y empiece a baja velocidad." },
      { en: "Step on the belt and hold on to the handrails for a moment.", es: "Pase a la banda y sujétese de los pasamanos un momento." },
      { en: "Speed up gradually, and use the incline if you want more intensity.", es: "Acelere poco a poco y use la inclinación si quiere más intensidad." },
      { en: "Slow down for two minutes to cool down before you step off.", es: "Baje la velocidad dos minutos para enfriarse antes de bajarse." },
    ],
    beneficios: [
      { en: "Improves cardiovascular endurance.", es: "Mejora la resistencia cardiovascular." },
      { en: "Burns calories and strengthens the legs.", es: "Quema calorías y fortalece las piernas." },
    ],
  },
  {
    foto: "Stationary bike", en: "Stationary bike", es: "Bicicleta estacionaria",
    pasos: [
      { en: "Let me set up the seat at the height of your hip.", es: "Permítame ajustar el asiento a la altura de su cadera." },
      { en: "Get on the bike and put your feet in the pedal straps.", es: "Súbase a la bicicleta y meta los pies en las correas de los pedales." },
      { en: "Warm up for five minutes at a low resistance.", es: "Caliente cinco minutos con resistencia baja." },
      { en: "Turn the knob to the right to increase the resistance.", es: "Gire la perilla a la derecha para aumentar la resistencia." },
      { en: "Slow down before you get off the bike.", es: "Baje la velocidad antes de bajarse de la bicicleta." },
    ],
    beneficios: [
      { en: "Low-impact cardio that is gentle on the knees.", es: "Cardio de bajo impacto, suave para las rodillas." },
      { en: "Strengthens the legs and glutes.", es: "Fortalece las piernas y los glúteos." },
    ],
  },
  {
    foto: "Elliptical", en: "Elliptical", es: "Elíptica",
    pasos: [
      { en: "Step on the pedals and hold on to the moving handles.", es: "Súbase a los pedales y sujétese de las manijas móviles." },
      { en: "Push and pull the handles while your legs move forward.", es: "Empuje y jale las manijas mientras las piernas avanzan." },
      { en: "Keep your posture upright and don't lean forward.", es: "Mantenga la postura erguida y no se incline hacia adelante." },
      { en: "Slow down gradually to cool down.", es: "Baje la velocidad poco a poco para enfriarse." },
    ],
    beneficios: [
      { en: "Works the upper and lower body at the same time.", es: "Trabaja la parte superior e inferior del cuerpo al mismo tiempo." },
      { en: "Low impact on the joints.", es: "Bajo impacto en las articulaciones." },
    ],
  },
  {
    foto: "Rowing machine", en: "Rowing machine", es: "Máquina de remo",
    pasos: [
      { en: "Sit down on the seat and strap in your feet.", es: "Siéntese en el asiento y asegure los pies con las correas." },
      { en: "Hold the handle with both hands and keep your arms straight.", es: "Tome la manija con ambas manos y mantenga los brazos rectos." },
      { en: "Push away with your legs first, then lean back slightly and pull the handle to your chest.", es: "Empuje primero con las piernas, luego inclínese un poco hacia atrás y jale la manija hacia el pecho." },
      { en: "Return slowly: arms, then body, then legs.", es: "Regrese despacio: brazos, luego cuerpo, luego piernas." },
    ],
    beneficios: [
      { en: "Full-body workout: legs, back, arms and core.", es: "Entrenamiento de cuerpo completo: piernas, espalda, brazos y abdomen." },
      { en: "Improves endurance and posture.", es: "Mejora la resistencia y la postura." },
    ],
  },
  {
    foto: "Stair climber", en: "Stair climber", es: "Escaladora",
    pasos: [
      { en: "Step on the first stair and hold on to the side rails.", es: "Súbase al primer escalón y sujétese de los rieles laterales." },
      { en: "Turn on the machine at a slow speed.", es: "Encienda la máquina a velocidad baja." },
      { en: "Stand up straight and don't lean forward on the rails.", es: "Manténgase derecho y no se recargue hacia adelante en los rieles." },
      { en: "Slow down before you step off.", es: "Baje la velocidad antes de bajarse." },
    ],
    beneficios: [
      { en: "Strengthens the legs and glutes.", es: "Fortalece las piernas y los glúteos." },
      { en: "Burns many calories in a short time.", es: "Quema muchas calorías en poco tiempo." },
    ],
  },
  {
    foto: "Dumbbells", en: "Dumbbells", es: "Mancuernas",
    pasos: [
      { en: "Pick up a pair of light dumbbells from the rack.", es: "Tome un par de mancuernas ligeras del rack." },
      { en: "Stand up straight with your feet shoulder-width apart.", es: "Póngase de pie, derecho, con los pies al ancho de los hombros." },
      { en: "Lift up the dumbbells slowly and breathe out.", es: "Levante las mancuernas despacio y exhale." },
      { en: "Lower them with control and breathe in.", es: "Bájelas con control e inhale." },
      { en: "Put back the dumbbells on the rack when you finish.", es: "Regrese las mancuernas al rack cuando termine." },
    ],
    beneficios: [
      { en: "Builds strength in the arms, shoulders and chest.", es: "Desarrolla fuerza en brazos, hombros y pecho." },
      { en: "Improves balance and coordination.", es: "Mejora el equilibrio y la coordinación." },
    ],
  },
  {
    foto: "Barbell", en: "Barbell and bench press", es: "Barra y press de banca",
    pasos: [
      { en: "Lie down on the bench with your feet flat on the floor.", es: "Acuéstese en el banco con los pies apoyados en el piso." },
      { en: "Hold the bar a little wider than your shoulders.", es: "Tome la barra un poco más abierta que los hombros." },
      { en: "Lower the bar slowly to your chest and breathe in.", es: "Baje la barra despacio hacia el pecho e inhale." },
      { en: "Push up the bar and breathe out. I will spot you.", es: "Empuje la barra hacia arriba y exhale. Yo le asistiré." },
    ],
    beneficios: [
      { en: "Builds strength in the chest, shoulders and triceps.", es: "Desarrolla fuerza en pecho, hombros y tríceps." },
    ],
  },
  {
    foto: "Kettlebell", en: "Kettlebell", es: "Pesa rusa (kettlebell)",
    pasos: [
      { en: "Bend your knees and pick up the kettlebell with both hands.", es: "Doble las rodillas y tome la pesa rusa con ambas manos." },
      { en: "Bend over slightly from the hips with your back straight.", es: "Inclínese un poco desde la cadera con la espalda recta." },
      { en: "Push your hips forward to swing the kettlebell to chest height.", es: "Empuje la cadera hacia adelante para balancear la pesa a la altura del pecho." },
      { en: "Put down the kettlebell gently when you finish.", es: "Deje la pesa en el piso con cuidado cuando termine." },
    ],
    beneficios: [
      { en: "Strengthens the glutes, legs and core.", es: "Fortalece glúteos, piernas y abdomen." },
      { en: "Improves power and endurance.", es: "Mejora la potencia y la resistencia." },
    ],
  },
  {
    foto: "Leg press", en: "Leg press", es: "Prensa de piernas",
    pasos: [
      { en: "Sit down with your back against the pad.", es: "Siéntese con la espalda contra el respaldo." },
      { en: "Put your feet on the platform, shoulder-width apart.", es: "Ponga los pies en la plataforma, al ancho de los hombros." },
      { en: "Push away the platform with your heels and breathe out.", es: "Empuje la plataforma con los talones y exhale." },
      { en: "Bend your knees slowly to return, and don't lock your knees.", es: "Doble las rodillas despacio para regresar y no trabe las rodillas." },
    ],
    beneficios: [
      { en: "Strengthens the quadriceps, hamstrings and glutes.", es: "Fortalece cuádriceps, isquiotibiales y glúteos." },
      { en: "Supports the back, so it is safer than heavy squats.", es: "Apoya la espalda, por eso es más seguro que las sentadillas pesadas." },
    ],
  },
  {
    foto: "Lat pulldown machine", en: "Lat pulldown machine", es: "Máquina de jalón dorsal",
    pasos: [
      { en: "Sit down and adjust the knee pad to hold your legs.", es: "Siéntese y ajuste el soporte para sujetar las piernas." },
      { en: "Hold the bar with a wide grip.", es: "Tome la barra con un agarre abierto." },
      { en: "Lean back slightly and pull down the bar to your upper chest.", es: "Inclínese un poco hacia atrás y jale la barra hacia la parte alta del pecho." },
      { en: "Let the bar go up slowly with control.", es: "Deje subir la barra despacio y con control." },
    ],
    beneficios: [
      { en: "Strengthens the back and the biceps.", es: "Fortalece la espalda y los bíceps." },
      { en: "Improves posture.", es: "Mejora la postura." },
    ],
  },
  {
    foto: "Chest press machine", en: "Chest press machine", es: "Máquina de press de pecho",
    pasos: [
      { en: "Set up the seat so the handles are at chest height.", es: "Ajuste el asiento para que las manijas queden a la altura del pecho." },
      { en: "Sit down with your back against the pad.", es: "Siéntese con la espalda contra el respaldo." },
      { en: "Push away the handles and breathe out, without locking your elbows.", es: "Empuje las manijas al frente y exhale, sin trabar los codos." },
      { en: "Return slowly and breathe in.", es: "Regrese despacio e inhale." },
    ],
    beneficios: [
      { en: "Strengthens the chest, shoulders and triceps.", es: "Fortalece pecho, hombros y tríceps." },
      { en: "The machine guides the movement, so it is good for beginners.", es: "La máquina guía el movimiento; es buena para principiantes." },
    ],
  },
  {
    foto: "Shoulder press machine", en: "Shoulder press machine", es: "Máquina de press de hombro",
    pasos: [
      { en: "Sit down and set up the seat so the handles are at shoulder height.", es: "Siéntese y ajuste el asiento para que las manijas queden a la altura de los hombros." },
      { en: "Push up the handles and breathe out.", es: "Empuje las manijas hacia arriba y exhale." },
      { en: "Lower them slowly to shoulder height.", es: "Bájelas despacio a la altura de los hombros." },
    ],
    beneficios: [
      { en: "Strengthens the shoulders and triceps.", es: "Fortalece los hombros y los tríceps." },
    ],
  },
  {
    foto: "Cable machine", en: "Cable machine", es: "Máquina de poleas",
    pasos: [
      { en: "Let me set up the pulley at the right height and choose the handle.", es: "Permítame ajustar la polea a la altura correcta y elegir la manija." },
      { en: "Select a light weight by moving the pin.", es: "Elija un peso ligero moviendo el perno." },
      { en: "Pull the cable slowly and keep your core tight.", es: "Jale el cable despacio y mantenga el abdomen firme." },
      { en: "Return with control. Don't let the weights drop.", es: "Regrese con control. No deje caer las pesas." },
    ],
    beneficios: [
      { en: "Works almost every muscle with many different exercises.", es: "Trabaja casi todos los músculos con muchos ejercicios diferentes." },
      { en: "Keeps constant tension on the muscle.", es: "Mantiene tensión constante en el músculo." },
    ],
  },
  {
    foto: "Squat rack", en: "Squat rack", es: "Rack para sentadillas",
    pasos: [
      { en: "Set up the bar at shoulder height and the safety bars below.", es: "Ajuste la barra a la altura de los hombros y las barras de seguridad abajo." },
      { en: "Step under the bar and rest it on your upper back.", es: "Colóquese debajo de la barra y apóyela en la parte alta de la espalda." },
      { en: "Bend your knees and lower your hips, as if you sit down on a chair.", es: "Doble las rodillas y baje la cadera, como si se sentara en una silla." },
      { en: "Stand up and breathe out, then put back the bar on the hooks.", es: "Póngase de pie y exhale; luego regrese la barra a los ganchos." },
    ],
    beneficios: [
      { en: "Strengthens the legs, glutes and core.", es: "Fortalece piernas, glúteos y abdomen." },
    ],
  },
  {
    foto: "Leg extension machine", en: "Leg extension machine", es: "Máquina de extensión de piernas",
    pasos: [
      { en: "Sit down and put the pad on the front of your ankles.", es: "Siéntese y coloque el rodillo al frente de los tobillos." },
      { en: "Lift up your legs until they are straight.", es: "Levante las piernas hasta que queden rectas." },
      { en: "Lower them slowly with control.", es: "Bájelas despacio y con control." },
    ],
    beneficios: [
      { en: "Strengthens the quadriceps.", es: "Fortalece los cuádriceps." },
    ],
  },
  {
    foto: "Leg curl machine", en: "Leg curl machine", es: "Máquina de femoral",
    pasos: [
      { en: "Lie down on the machine with the pad behind your ankles.", es: "Acuéstese en la máquina con el rodillo detrás de los tobillos." },
      { en: "Bend your knees and pull the pad up toward your glutes.", es: "Doble las rodillas y jale el rodillo hacia los glúteos." },
      { en: "Lower your legs slowly.", es: "Baje las piernas despacio." },
    ],
    beneficios: [
      { en: "Strengthens the hamstrings and protects the knees.", es: "Fortalece los isquiotibiales y protege las rodillas." },
    ],
  },
  {
    foto: "Pull-up bar", en: "Pull-up bar", es: "Barra de dominadas",
    pasos: [
      { en: "Hold on to the bar with your palms facing away from you.", es: "Sujétese de la barra con las palmas hacia el frente." },
      { en: "Hang down with your arms straight.", es: "Cuélguese con los brazos rectos." },
      { en: "Pull up your body until your chin is above the bar.", es: "Suba el cuerpo hasta que la barbilla pase la barra." },
      { en: "Lower yourself down slowly.", es: "Baje despacio." },
    ],
    beneficios: [
      { en: "Strengthens the back, arms and grip.", es: "Fortalece la espalda, los brazos y el agarre." },
    ],
  },
  {
    foto: "Resistance bands", en: "Resistance bands", es: "Bandas de resistencia",
    pasos: [
      { en: "Step on the band with both feet.", es: "Párese sobre la banda con ambos pies." },
      { en: "Hold the ends and pull up slowly.", es: "Tome los extremos y jale hacia arriba despacio." },
      { en: "Lower your hands with control.", es: "Baje las manos con control." },
    ],
    beneficios: [
      { en: "Light, safe and good for beginners and rehabilitation.", es: "Ligeras, seguras y buenas para principiantes y rehabilitación." },
    ],
  },
  {
    foto: "Stability ball", en: "Stability ball", es: "Pelota de estabilidad",
    pasos: [
      { en: "Sit down on the ball with your feet flat on the floor.", es: "Siéntese en la pelota con los pies apoyados en el piso." },
      { en: "Walk your feet forward and lie down with the ball under your back.", es: "Camine con los pies hacia adelante y recuéstese con la pelota bajo la espalda." },
      { en: "Lift up your shoulders slowly to do a crunch.", es: "Levante los hombros despacio para hacer un abdominal." },
    ],
    beneficios: [
      { en: "Strengthens the core and improves balance.", es: "Fortalece el abdomen y mejora el equilibrio." },
    ],
  },
  {
    foto: "Foam roller", en: "Foam roller", es: "Rodillo de espuma",
    pasos: [
      { en: "Sit down on the floor and put the roller under your calves.", es: "Siéntese en el piso y coloque el rodillo bajo las pantorrillas." },
      { en: "Roll slowly up and down for thirty seconds.", es: "Ruede despacio hacia arriba y hacia abajo durante treinta segundos." },
      { en: "Use it to loosen up your muscles after the workout.", es: "Úselo para aflojar los músculos después del entrenamiento." },
    ],
    beneficios: [
      { en: "Relaxes tight muscles and helps recovery.", es: "Relaja los músculos tensos y ayuda a la recuperación." },
    ],
  },
  {
    foto: "Suspension trainer", en: "Suspension trainer (TRX)", es: "Entrenador de suspensión (TRX)",
    pasos: [
      { en: "Hold the handles and lean back with your arms straight.", es: "Tome las manijas e inclínese hacia atrás con los brazos rectos." },
      { en: "Pull your chest up toward the handles.", es: "Jale el pecho hacia las manijas." },
      { en: "Lower yourself slowly back to the start.", es: "Regrese despacio a la posición inicial." },
    ],
    beneficios: [
      { en: "Uses your own body weight to build strength and stability.", es: "Usa el peso de su propio cuerpo para ganar fuerza y estabilidad." },
    ],
  },
  {
    foto: "Medicine ball", en: "Medicine ball", es: "Balón medicinal",
    pasos: [
      { en: "Pick up the ball with both hands.", es: "Tome el balón con ambas manos." },
      { en: "Sit down, lean back slightly and twist your body from side to side.", es: "Siéntese, inclínese un poco hacia atrás y gire el torso de lado a lado." },
      { en: "Put down the ball gently when you finish.", es: "Deje el balón con cuidado cuando termine." },
    ],
    beneficios: [
      { en: "Strengthens the core and improves coordination.", es: "Fortalece el abdomen y mejora la coordinación." },
    ],
  },
  {
    foto: "Battle ropes", en: "Battle ropes", es: "Cuerdas de batalla",
    pasos: [
      { en: "Pick up one end of the rope in each hand.", es: "Tome un extremo de la cuerda en cada mano." },
      { en: "Bend your knees slightly and keep your back straight.", es: "Doble un poco las rodillas y mantenga la espalda recta." },
      { en: "Move your arms up and down quickly to make waves.", es: "Mueva los brazos arriba y abajo rápidamente para hacer ondas." },
    ],
    beneficios: [
      { en: "Intense cardio that strengthens the arms and shoulders.", es: "Cardio intenso que fortalece brazos y hombros." },
    ],
  },
  {
    foto: "Jump rope", en: "Jump rope", es: "Cuerda para saltar",
    pasos: [
      { en: "Hold the handles at hip height.", es: "Tome las manijas a la altura de la cadera." },
      { en: "Turn the rope with your wrists and jump on the balls of your feet.", es: "Gire la cuerda con las muñecas y salte con la punta de los pies." },
      { en: "Slow down and rest for thirty seconds between rounds.", es: "Baje el ritmo y descanse treinta segundos entre rondas." },
    ],
    beneficios: [
      { en: "Improves coordination and cardiovascular fitness.", es: "Mejora la coordinación y la condición cardiovascular." },
    ],
  },
  {
    foto: "Plyo box", en: "Plyo box", es: "Cajón pliométrico",
    pasos: [
      { en: "Stand in front of the box with your feet shoulder-width apart.", es: "Párese frente al cajón con los pies al ancho de los hombros." },
      { en: "Step up on the box, or jump up if you feel comfortable.", es: "Suba al cajón con un paso, o de un salto si se siente cómodo." },
      { en: "Step down carefully, one foot at a time.", es: "Baje con cuidado, un pie a la vez." },
    ],
    beneficios: [
      { en: "Builds power in the legs and improves agility.", es: "Desarrolla potencia en las piernas y mejora la agilidad." },
    ],
  },
];

// Partes del cuerpo y grupos musculares que se trabajan en el gym.
const GYM_CUERPO = [
  { en: "Head", pron: "/jed/", es: "Cabeza" },
  { en: "Neck", pron: "/nek/", es: "Cuello" },
  { en: "Shoulders", pron: "/shóul-ders/", es: "Hombros" },
  { en: "Chest", pron: "/chest/", es: "Pecho" },
  { en: "Back", pron: "/bak/", es: "Espalda" },
  { en: "Upper back", pron: "/á-per bak/", es: "Parte alta de la espalda" },
  { en: "Lower back", pron: "/lóu-er bak/", es: "Espalda baja" },
  { en: "Arms", pron: "/arms/", es: "Brazos" },
  { en: "Elbows", pron: "/él-bous/", es: "Codos" },
  { en: "Forearms", pron: "/fór-arms/", es: "Antebrazos" },
  { en: "Wrists", pron: "/rists/", es: "Muñecas" },
  { en: "Hands", pron: "/jands/", es: "Manos" },
  { en: "Abs", pron: "/abs/", es: "Abdominales" },
  { en: "Core", pron: "/kor/", es: "Zona abdominal (core)" },
  { en: "Waist", pron: "/uéist/", es: "Cintura" },
  { en: "Hips", pron: "/jips/", es: "Caderas" },
  { en: "Glutes", pron: "/gluts/", es: "Glúteos" },
  { en: "Legs", pron: "/legs/", es: "Piernas" },
  { en: "Thighs", pron: "/zais/", es: "Muslos" },
  { en: "Knees", pron: "/nis/", es: "Rodillas" },
  { en: "Calves", pron: "/kavs/", es: "Pantorrillas" },
  { en: "Ankles", pron: "/án-kels/", es: "Tobillos" },
  { en: "Feet", pron: "/fit/", es: "Pies" },
  { en: "Heels", pron: "/jils/", es: "Talones" },
  { en: "Biceps", pron: "/bái-seps/", es: "Bíceps" },
  { en: "Triceps", pron: "/trái-seps/", es: "Tríceps" },
  { en: "Deltoids", pron: "/dél-toids/", es: "Deltoides (hombros)" },
  { en: "Pecs", pron: "/peks/", es: "Pectorales" },
  { en: "Lats", pron: "/lats/", es: "Dorsales" },
  { en: "Traps", pron: "/traps/", es: "Trapecios" },
  { en: "Obliques", pron: "/o-blíks/", es: "Oblicuos" },
  { en: "Quadriceps", pron: "/kuá-dri-seps/", es: "Cuádriceps" },
  { en: "Hamstrings", pron: "/jám-strings/", es: "Isquiotibiales (femorales)" },
  { en: "Joints", pron: "/yoints/", es: "Articulaciones" },
  { en: "Muscles", pron: "/má-sols/", es: "Músculos" },
  { en: "Heart", pron: "/jart/", es: "Corazón" },
  { en: "Lungs", pron: "/langs/", es: "Pulmones" },
];
