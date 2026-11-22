/**
 * Lala on the Hunt — shared stop data
 * Edit Spanish copy, Maps pins, and Gary note placeholders here.
 * B3: Campo de fútbol — parking/access pin confirmed by Ana: Cam. de la Vega, 20.
 */
window.LALA_STOPS = [
  {
    id: "a1",
    code: "A1",
    title: "Parque Julián González Rodríguez",
    shortTitle: "El parque",
    address: "C. del Calvario · Valdetorres de Jarama",
    lat: 40.694321,
    lng: -3.512548,
    mapsQuery: "Parque Julián González Rodríguez, Valdetorres de Jarama",
    clue:
      "Buscad un rincón con verde a vuestro alrededor. El pueblo os recibe con calma — respirad, reíd, y capturad el primer recuerdo juntas.",
    task: "Selfie de grupo con algo verde en el encuadre.",
    garySlot: "Gary EN · nota 1",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para el Parque. Aparece tras pulsar Hecho.]",
    hostTip:
      "Aparcamiento para dos coches cerca. Caminos llanos. Tras Hecho: cambio de coche — Lala pasa al Coche 2.",
    swapNote: "Tras esta parada: Lala cambia al Coche 2.",
  },
  {
    id: "a2",
    code: "A2",
    title: "Ayuntamiento / Plaza de la Constitución",
    shortTitle: "La plaza",
    address: "Plaza de la Constitución, 1",
    lat: 40.69513,
    lng: -3.51243,
    mapsQuery: "Plaza de la Constitución 1, Valdetorres de Jarama",
    clue:
      "El corazón del pueblo. Mirad la fachada del Ayuntamiento desde fuera — sin subir escaleras. Hoy el balcón es solo decorado: vosotras sois la historia.",
    task: "Foto de la fachada exterior del Ayuntamiento (todo el grupo en el encuadre si podéis).",
    garySlot: "Gary EN · nota 2",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para la Plaza / Ayuntamiento. Aparece tras pulsar Hecho.]",
    hostTip:
      "Solo exterior. Sin escaleras. Dos coches cerca de la plaza. Tras Hecho: Lala vuelve al Coche 1.",
    swapNote: "Tras esta parada: Lala cambia al Coche 1.",
  },
  {
    id: "b3",
    code: "B3",
    title: "Campo de fútbol",
    shortTitle: "El campo",
    address: "Aparcamiento · Cam. de la Vega, 20 · junto al campo",
    lat: 40.695747,
    lng: -3.51754,
    mapsQuery: "Cam. de la Vega 20, Valdetorres de Jarama",
    clue:
      "Hoy el partido sois vosotras. Encontrad el campo de hierba — un sitio amplio para celebrar en movimiento (sin pisar el césped si está cerrado).",
    task: "Lala posa imitando a su futbolista favorito delante del campo.",
    garySlot: "Gary EN · nota 3",
    garyPlaceholder:
      "[Gary — escribe aquí la nota en inglés para el campo de fútbol. Aparece tras pulsar Hecho.]",
    hostTip:
      "Parking/acceso confirmado por Ana: Cam. de la Vega, 20. Parada = campo de fútbol (Maps abre el pin de aparcamiento). Opcional: brindis de 30 s si hay energía.",
    swapNote: "Tras esta parada: Lala cambia al Coche 2 → American Ribs.",
  },
  {
    id: "finale",
    code: "Finale",
    title: "American Ribs",
    shortTitle: "La comida",
    address: "Pl. de José Antonio, 5",
    lat: 40.696003,
    lng: -3.513482,
    mapsQuery: "American Ribs, Plaza de José Antonio 5, Valdetorres de Jarama",
    clue:
      "Última parada. No abráis la carta ni el regalo hasta estar sentadas. La caza termina en la mesa — con risas, un brindis y la sorpresa de Gary.",
    task: "Sentaros juntas (~14:30). Foto de grupo · brindis · carta + regalo.",
    garySlot: "Gary EN · carta final + regalo",
    garyPlaceholder:
      "[Gary — aquí va la carta de amor en inglés + tema del regalo. Leer en la mesa.]",
    hostTip:
      "Reserva 7 · ~14:30–15:00. Carta y regalo los lleva la anfitriona. Confirmar horario domingo 20 dic.",
    swapNote: null,
    isFinale: true,
  },
];

window.LALA_META = {
  title: "Lala on the Hunt",
  tagline: "Dos coches, una historia",
  dateLine: "Domingo 20 de diciembre · Valdetorres de Jarama",
  startAddress: "Calle Jorge Manrique, 1 (Silillos)",
  startMapsQuery: "Calle Jorge Manrique 1, Valdetorres de Jarama",
  convoyNote:
    "Convoy compartido: mismas paradas, dos coches solo por asientos. Lala puede cambiar de coche entre paradas.",
  storageKey: "lala-on-the-hunt-progress-v1",
  authStorageKey: "lala-amigas-unlocked-v1",
  /* SHA-256 of the party password — not the plaintext */
  passwordHash:
    "32ed902afb2b16ed73c67d32f03480e95d2cb12c1dfa7e95bdfa6b8aa831d12e",
};
