(function () {
  const KEY = () => window.LALA_META.storageKey;

  function empty() {
    return {
      completed: [],
      started: false,
      startQuizPassed: false,
      finaleQuizPassed: false,
      soundtrackDone: false,
      moods: {},
      carSwaps: {},
    };
  }

  function read() {
    try {
      const raw = localStorage.getItem(KEY());
      if (!raw) return empty();
      const data = JSON.parse(raw);
      return {
        completed: Array.isArray(data.completed) ? data.completed : [],
        started: Boolean(data.started),
        startQuizPassed: Boolean(data.startQuizPassed),
        finaleQuizPassed: Boolean(data.finaleQuizPassed),
        soundtrackDone: Boolean(data.soundtrackDone),
        moods: data.moods && typeof data.moods === "object" ? data.moods : {},
        carSwaps:
          data.carSwaps && typeof data.carSwaps === "object"
            ? data.carSwaps
            : {},
      };
    } catch {
      return empty();
    }
  }

  function write(data) {
    localStorage.setItem(KEY(), JSON.stringify(data));
  }

  function patch(partial) {
    write(Object.assign(read(), partial));
  }

  function stopIndex(id) {
    return window.LALA_STOPS.findIndex((s) => s.id === id);
  }

  /** Status for a stop: locked | active | completed */
  function statusFor(id) {
    const { completed, started } = read();
    const idx = stopIndex(id);
    if (idx < 0) return "locked";
    if (completed.includes(id)) return "completed";
    if (!started) return idx === 0 ? "active" : "locked";
    const firstIncomplete = window.LALA_STOPS.find(
      (s) => !completed.includes(s.id)
    );
    if (firstIncomplete && firstIncomplete.id === id) return "active";
    return "locked";
  }

  function activeStop() {
    const { completed, started } = read();
    if (!started) return window.LALA_STOPS[0];
    return window.LALA_STOPS.find((s) => !completed.includes(s.id)) || null;
  }

  function start() {
    patch({ started: true, startQuizPassed: true });
  }

  function markStartQuizPassed() {
    patch({ startQuizPassed: true });
  }

  function markFinaleQuizPassed() {
    patch({ finaleQuizPassed: true });
  }

  function markSoundtrackDone() {
    patch({ soundtrackDone: true });
  }

  function markDone(id) {
    const data = read();
    data.started = true;
    if (!data.completed.includes(id)) data.completed.push(id);
    write(data);
  }

  function setMood(stopId, moodId) {
    const data = read();
    data.moods[stopId] = moodId;
    write(data);
  }

  function setCarSwap(stopId, car) {
    const data = read();
    data.carSwaps[stopId] = car;
    write(data);
  }

  function reset() {
    localStorage.removeItem(KEY());
  }

  function mapsUrl(stop) {
    const q = encodeURIComponent(stop.mapsQuery || stop.address);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function moodEmoji(moodId) {
    const m = (window.LALA_MOODS || []).find((x) => x.id === moodId);
    return m ? m.emoji : "";
  }

  function moodTrailHtml() {
    const { moods, completed } = read();
    const parts = window.LALA_STOPS.filter(
      (s) => completed.includes(s.id) && moods[s.id]
    ).map((s) => {
      const emoji = moodEmoji(moods[s.id]);
      return `<span class="mood-chip" title="${s.shortTitle}">${emoji}<span class="mood-chip-code">${s.code}</span></span>`;
    });
    if (!parts.length) return "";
    return `<div class="mood-trail" aria-label="Medidor de mood"><span class="mood-trail-label">Mood</span>${parts.join("")}</div>`;
  }

  window.LalaProgress = {
    read,
    write,
    patch,
    statusFor,
    activeStop,
    start,
    markStartQuizPassed,
    markFinaleQuizPassed,
    markSoundtrackDone,
    markDone,
    setMood,
    setCarSwap,
    reset,
    mapsUrl,
    moodEmoji,
    moodTrailHtml,
  };
})();
