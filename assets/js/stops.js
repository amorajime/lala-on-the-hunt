/**
 * Lala on the Hunt — shared stop + party config
 * Edit Spanish copy, Maps pins, Gary notes, quiz Q&A, and song URL here.
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
      "Buscad un rincón con verde a vuestro alrededor. El pueblo os recibe con calma — respirad, reíd, y capturad el primer recuerdo juntas.",
    task: "Selfie de grupo con algo verde en el encuadre.",
    garySlot: "Gary · nota 1",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para el Parque. Aparece tras pulsar Hecho.]",
    hostTip:
      "Aparcamiento para dos coches cerca. Caminos llanos. Tras Hecho: ruleta Coche A / Coche B.",
    swapNote: "Tras esta parada: ruleta de coches (A o B).",
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
      "El corazón del pueblo. Mirad la fachada del Ayuntamiento desde fuera — sin subir escaleras. Hoy el balcón es solo decorado: vosotras sois la historia.",
    task: "Foto de la fachada exterior del Ayuntamiento (todo el grupo en el encuadre si podéis).",
    garySlot: "Gary · nota 2",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para la Plaza / Ayuntamiento. Aparece tras pulsar Hecho.]",
    hostTip:
      "Solo exterior. Sin escaleras. Dos coches cerca de la plaza. Tras Hecho: ruleta Coche A / Coche B.",
    swapNote: "Tras esta parada: ruleta de coches (A o B).",
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
      "Hoy el partido sois vosotras. Encontrad el campo de hierba — un sitio amplio para celebrar en movimiento (sin pisar el césped si está cerrado).",
    task: "Lala posa imitando a su futbolista favorito delante del campo.",
    garySlot: "Gary · nota 3",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para el campo de fútbol. Aparece tras pulsar Hecho.]",
    hostTip:
      "Parking/acceso confirmado por Ana: Cam. de la Vega, 20. Tras Hecho: ruleta Coche A / Coche B → American Ribs. Opcional: brindis de 30 s.",
    swapNote: "Tras esta parada: ruleta de coches (A o B) → American Ribs.",
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
      "Última parada. No abráis la carta ni el regalo hasta estar sentadas. La caza termina en la mesa — con risas, un brindis y la sorpresa de Gary.",
    task: "Sentaros juntas (~14:30). Foto de grupo · brindis · carta + regalo.",
    garySlot: "Gary · carta final + regalo",
    garyPlaceholder:
      "[Gary — aquí va la carta de amor en inglés + tema del regalo. Leer en la mesa.]",
    hostTip:
      "Reserva 7 · ~14:30–15:00. La carta y el regalo los lleva Gus. Se desbloquean con el quiz final.",
    swapNote: null,
    isFinale: true,
  },
];

/** Shared couple questions — start gate + finale confirm (same two). */
window.LALA_COUPLE_QUESTIONS = [
  {
    id: "q-concert",
    prompt: "¿Cuál fue el primer concierto al que fuiste con Gary?",
    /* Accepted after normalize (case/accents/spaces) */
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
    questions: window.LALA_COUPLE_QUESTIONS,
    anaNote: "Escribid las respuestas (mayúsculas/minúsculas da igual).",
  },
  finale: {
    id: "finale",
    title: "Quiz de pareja · confirmar carta y regalo",
    questions: window.LALA_COUPLE_QUESTIONS,
    anaNote: "Misma confirmación que al inicio — desbloquea carta + regalo.",
  },
};

window.LALA_SOUNDTRACK = {
  stopId: "a1",
  url: "https://open.spotify.com/intl-es/track/3Y1F4btGQxxMZhlBYaLR4N",
  label: "Canción de Gary · parada 1 (Spotify)",
  danceSeconds: 10,
  title: "Banda sonora · parada 1",
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
    "Convoy compartido: mismas paradas, dos coches solo por asientos. Tras cada Hecho, la ruleta elige Coche A o Coche B.",
  storageKey: "lala-on-the-hunt-progress-v2",
  authStorageKey: "lala-amigas-unlocked-v1",
  /* SHA-256 of the party password — not the plaintext */
  passwordHash:
    "32ed902afb2b16ed73c67d32f03480e95d2cb12c1dfa7e95bdfa6b8aa831d12e",
  cars: ["A", "B"],
};
