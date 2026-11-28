(function () {
  function createProgress(getKey) {
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

    function KEY() {
      return typeof getKey === "function" ? getKey() : getKey;
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

    function moodMeta(moodId) {
      return (window.LALA_MOODS || []).find((x) => x.id === moodId) || null;
    }

    function moodEmoji(moodId) {
      const m = moodMeta(moodId);
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

    function moodReceiptHtml() {
      const { moods, completed } = read();
      const used = window.LALA_STOPS.filter(
        (s) => completed.includes(s.id) && moods[s.id]
      );
      if (!used.length) return "";

      const byMood = new Map();
      used.forEach((s) => {
        const moodId = moods[s.id];
        if (!byMood.has(moodId)) byMood.set(moodId, []);
        byMood.get(moodId).push(s.shortTitle || s.code);
      });

      const total = used.length;
      const moodOrder = (window.LALA_MOODS || []).map((m) => m.id);
      const groups = [...byMood.entries()]
        .map(([moodId, stops]) => {
          const m = moodMeta(moodId);
          return {
            moodId,
            emoji: m ? m.emoji : "",
            label: m ? m.label : moodId,
            stops,
            count: stops.length,
            pct: Math.round((stops.length / total) * 100),
            order: moodOrder.indexOf(moodId),
          };
        })
        .sort((a, b) => b.count - a.count || a.order - b.order);

      const rows = groups.map((g) => {
        const places = g.stops.join(" · ");
        return `<div class="mood-receipt-row">
        <div class="mood-receipt-line">
          <span class="mood-receipt-emoji" aria-hidden="true">${g.emoji}</span>
          <span class="mood-receipt-pct">${g.pct}%</span>
        </div>
        <p class="mood-receipt-stops">${places}</p>
      </div>`;
      });

      return `<div class="mood-receipt" role="table" aria-label="Reparto de moods">${rows.join("")}</div>`;
    }

    return {
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
      moodReceiptHtml,
    };
  }

  window.createLalaProgress = createProgress;
  window.LalaProgress = createProgress(() => window.LALA_META.storageKey);
})();
