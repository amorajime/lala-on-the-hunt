(function () {
  const KEY = () => window.LALA_META.storageKey;

  function read() {
    try {
      const raw = localStorage.getItem(KEY());
      if (!raw) return { completed: [], started: false };
      const data = JSON.parse(raw);
      return {
        completed: Array.isArray(data.completed) ? data.completed : [],
        started: Boolean(data.started),
      };
    } catch {
      return { completed: [], started: false };
    }
  }

  function write(data) {
    localStorage.setItem(KEY(), JSON.stringify(data));
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
    return (
      window.LALA_STOPS.find((s) => !completed.includes(s.id)) || null
    );
  }

  function start() {
    const data = read();
    data.started = true;
    write(data);
  }

  function markDone(id) {
    const data = read();
    data.started = true;
    if (!data.completed.includes(id)) data.completed.push(id);
    write(data);
  }

  function reset() {
    localStorage.removeItem(KEY());
  }

  function mapsUrl(stop) {
    const q = encodeURIComponent(stop.mapsQuery || stop.address);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  window.LalaProgress = {
    read,
    write,
    statusFor,
    activeStop,
    start,
    markDone,
    reset,
    mapsUrl,
  };
})();
