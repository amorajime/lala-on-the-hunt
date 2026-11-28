/**
 * Lala on the Hunt — shared stop + party config
 * Edit Spanish challenges, Gary EN notes, quiz, song URL, finale letter here.
 * B3 parking/access: Cam. de la Vega, 20 (Ana confirmed).
 */
window.LALA_STOPS = [
  {
    id: "a1",
    code: "Primera Parada",
    title: "Parque Julián González Rodríguez",
    shortTitle: "El parque",
    address: "C. del Calvario · Valdetorres de Jarama",
    lat: 40.694321,
    lng: -3.512548,
    mapsQuery: "Parque Julián González Rodríguez, Valdetorres de Jarama",
    clue:
      "Gary ha seleccionado una canción. ¡Nosotras queremos verte bailar! Una vez que tengamos las pruebas (un vídeo), podemos continuar.",
    task: "Abrid la canción, grabad el baile o lip-sync, y pulsad Hecho.",
    garySlot: "Dancing is the poetry of the foot",
    garyPlaceholder:
      "Is the preceding line an absolute truth?\nWe can let tavern scholars debate over noon vermouth.\nThe vermouth may spill into a sobremesa,\nI would converse over empty plates forever with Teresa.\nYour first challenge has now concluded,\nMore to come with familiar conversation interluded.\nYour sister and friends are devout in their love for you,\nWhat a gift people take a lifetime to pursue.",
    hostTip:
      "Aparcamiento cerca. Reto: canción + vídeo del baile (sin botón Bailar en la web). Tras Hecho: mood → nota Gary → ruleta A/B.",
    swapNote: null,
    soundtrack: true,
  },
  {
    id: "a2",
    code: "Segunda Parada",
    title: "Ayuntamiento / Plaza de la Constitución",
    shortTitle: "La plaza",
    address: "Plaza de la Constitución, 1",
    lat: 40.69513,
    lng: -3.51243,
    mapsQuery: "Plaza de la Constitución 1, Valdetorres de Jarama",
    clue:
      "Hemos preparado un Pasapalabra: repasad las reglas principales y… ¡que empiece el rosco!",
    task: "Jugad al Pasapalabra con Lala en la plaza. Cuando terminéis, Hecho.",
    garySlot: "Pasapalabra",
    garyPlaceholder:
      "Here you have passed Pasapalabra,\nBut this challenge was easy for you,\nA silly gameshow, not advanced algebra.\nOn to the next challenge with your crew.\n\nThe succeeding challenge may be physical in nature.\nDoes Valdetorres have a field, a court, a pitch?\nThis author doesn't know all sporting nomenclature,\nIs this all a clue, or a simple bait and switch?",
    hostTip:
      "Rosco / fichas listos. Plaza llana, sin entrar al Ayuntamiento. Tras Hecho: mood → nota Gary → ruleta A/B.",
    swapNote: null,
  },
  {
    id: "b3",
    code: "Tercera Parada",
    title: "Campo de fútbol",
    shortTitle: "El campo",
    address: "Aparcamiento · Cam. de la Vega, 20 · junto al campo",
    lat: 40.695747,
    lng: -3.51754,
    mapsQuery: "Cam. de la Vega 20, Valdetorres de Jarama",
    clue:
      "Retamos a la novia a hacerse una sesión de fotos posando como su futbolista favorito.",
    task: "Sesión de fotos: Lala posa como su futbolista favorito delante del campo.",
    garySlot: "Atleti greats",
    garyPlaceholder:
      "You've now joined the fraternity of Atleti greats,\nKoke, Torres, Griezmann, and now Mora shoulder the weights.\nWell done and hats off to you for completing this task,\nPerhaps your next challenge will have you speaking Basque?\nI hope you had fun hanging out north of Madrid,\nYou deserve a statue in your honor, like that of El Cid.",
    hostTip:
      "Parking Cam. de la Vega, 20. Tras Hecho: mood → nota Gary → ruleta A/B → Ribs.",
    swapNote: null,
  },
  {
    id: "finale",
    code: "Grand Finale",
    title: "American Ribs",
    shortTitle: "La comida",
    address: "Pl. de José Antonio, 5",
    lat: 40.696003,
    lng: -3.513482,
    mapsQuery: "American Ribs, Plaza de José Antonio 5, Valdetorres de Jarama",
    clue:
      "La caza de Lala está casi terminada. Sentémonos, pidamos algo de beber y respondamos una pregunta para revelar la última sorpresa.",
    task: "Sentaros, pedid bebida y pulsad Hecho.",
    garySlot: "Mi Alma",
    garyPlaceholder: "",
    hostTip:
      "Reserva 7 · ~14:30. Flujo web: quiz → carta digital → mood → éxito.",
    swapNote: null,
    isFinale: true,
  },
];

window.LALA_COUPLE_QUESTIONS = [
  {
    id: "q-concert",
    prompt: "¿Cuál fue el primer concierto al que fuiste con Gary?",
    answers: ["rammstein"],
  },
  {
    id: "q-group",
    prompt: "¿Cómo se llama el grupo en el que hablaste con Gary por primera vez?",
    answers: ["gossip gang", "gossipgang"],
  },
];

window.LALA_QUIZ = {
  start: {
    id: "start",
    title: "Quiz de pareja · empezar",
    questions: [window.LALA_COUPLE_QUESTIONS[0]],
    anaNote: "Escribid la respuesta (mayúsculas/minúsculas da igual).",
  },
  finale: {
    id: "finale",
    title: "Quiz de pareja · última sorpresa",
    questions: [window.LALA_COUPLE_QUESTIONS[1]],
    anaNote: "Esta respuesta desbloquea la carta de Gary.",
  },
};

window.LALA_SOUNDTRACK = {
  stopId: "a1",
  url: "https://open.spotify.com/track/1JLn8RhQzHz3qDqsChcmBl?si=f29J7CKgRM-hlZ99QDOqKA",
  linkText: "Abrir canción en Spotify",
};

window.LALA_FINALE_LETTER = {
  title: "Carta de Gary",
  body:
    "Mi Alma,\n" +
    "Congratulations on your completion of the first (and hopefully last) bachelorette\n" +
    "scavenger “Hunt” of your life! I never doubted for a solitary moment that you couldn't do it. Shout\n" +
    "out to Gus for organizing this tantalizing hunt.\n" +
    "As for American Ribs, may I recommend the “American Cheese Fingers”, because I\n" +
    "don't know what an american cheese finger is. For dessert, the “brownie Kinder” seems right up\n" +
    "your alley.\n" +
    "When I was asked to write the final letter that would serve as a culmination of sorts to\n" +
    "this day, my first question to Gus was, “how much does this pay?” My second question asking\n" +
    "for details about your bachelorette weekend! It sounds like you girls had a rousing time eating\n" +
    "sushi, competing in the alcoholympics, and venturing through Valdetorres de Jarama in mad\n" +
    "scientist guises.\n" +
    "I was confident Gus and Las Chicas Cocodrilas would come through for you to throw you\n" +
    "a delightful bachelorette weekend, even if you are already technically wed under the eyes of the\n" +
    "law, both American and Felipe. I hope this weekend only invigorated your excitement for our\n" +
    "ceremony in April in Boadilla del Monte, and our planned “mini-moon” on one of the various\n" +
    "Greek Isles, perhaps Milos, Naxos, or Skiathos.\n" +
    "I hope you have a pleasant Christmas in Madrid. I wish I could be there by your side, but\n" +
    "but someone had to supervise Allison... I love you immensely with all my heart and I am eager\n" +
    "to hear all about this bachelorette weekend when you return stateside to your husband and\n" +
    "daughter in late December.\n" +
    "\n" +
    "All of my love and adoration,\n" +
    "Gary",
};

window.LALA_MOODS = [
  { id: "heart", emoji: "💚", label: "Amor" },
  { id: "laugh", emoji: "😂", label: "Risas" },
  { id: "tear", emoji: "🥹", label: "Emoción" },
];

window.LALA_META = {
  title: "Lala on the Hunt",
  tagline: "Dos coches, una historia",
  dateLine: "Domingo 20 de diciembre · Valdetorres de Jarama",
  startAddress: "Calle Jorge Manrique, 1 (Silillos)",
  startMapsQuery: "Calle Jorge Manrique 1, Valdetorres de Jarama",
  convoyNote:
    "Convoy compartido: mismas paradas, dos coches. Tras Hecho: mood → nota Gary → ruleta A/B.",
  storageKey: "lala-on-the-hunt-progress-v2",
  authStorageKey: "lala-amigas-unlocked-v1",
  passwordHash:
    "32ed902afb2b16ed73c67d32f03480e95d2cb12c1dfa7e95bdfa6b8aa831d12e",
  cars: ["A", "B"],
  successTitle: "The Hunt has been hunted",
  successLead:
    "Misión cumplida. Moods archivados, coches sorteados y Lala coronada. A comer.",
};
