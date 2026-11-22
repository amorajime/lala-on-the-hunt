(function () {
  const assetBase = document.body.dataset.assetBase || "../assets";
  const PHASE_KEY = "lala-phase";
  const PHASE_STOP_KEY = "lala-phase-stop";

  function el(id) {
    return document.getElementById(id);
  }

  function getPhase() {
    return {
      phase: sessionStorage.getItem(PHASE_KEY),
      stopId: sessionStorage.getItem(PHASE_STOP_KEY),
    };
  }

  function setPhase(phase, stopId) {
    if (!phase) {
      sessionStorage.removeItem(PHASE_KEY);
      sessionStorage.removeItem(PHASE_STOP_KEY);
      return;
    }
    sessionStorage.setItem(PHASE_KEY, phase);
    sessionStorage.setItem(PHASE_STOP_KEY, stopId || "");
  }

  function stopById(id) {
    return window.LALA_STOPS.find((s) => s.id === id);
  }

  function hasNextStop(stop) {
    const idx = window.LALA_STOPS.findIndex((s) => s.id === stop.id);
    return idx >= 0 && idx < window.LALA_STOPS.length - 1;
  }

  function hideMaps() {
    const maps = el("btn-maps");
    if (maps) maps.hidden = true;
    const startMaps = el("btn-start-maps");
    if (startMaps) startMaps.hidden = true;
  }

  function hideAllExtras() {
    [
      "start-quiz",
      "soundtrack-box",
      "mood-box",
      "roulette-box",
      "finale-quiz",
      "gary-box",
    ].forEach((id) => {
      const node = el(id);
      if (node) node.hidden = true;
    });
    hideMaps();
  }

  function renderMarkers() {
    const host = el("path-markers");
    if (!host) return;
    host.innerHTML = "";
    window.LALA_STOPS.forEach((stop) => {
      const pos = window.LalaMap.positions[stop.id];
      if (!pos) return;
      const status = window.LalaProgress.statusFor(stop.id);
      const m = document.createElement("div");
      m.className = `marker ${status}`;
      m.style.left = pos.left;
      m.style.top = pos.top;
      m.title = stop.shortTitle;
      m.setAttribute("aria-label", `${stop.shortTitle}: ${status}`);
      if (status === "completed") m.innerHTML = window.LalaMap.checkIcon();
      else if (status === "locked") m.innerHTML = window.LalaMap.lockIcon();
      else {
        const labels = { a1: "1", a2: "2", b3: "3", finale: "★" };
        m.textContent = labels[stop.id] || "•";
      }
      host.appendChild(m);
    });
  }

  function renderMoodTrail() {
    const host = el("mood-trail-host");
    if (!host) return;
    host.innerHTML = window.LalaProgress.moodTrailHtml();
  }

  function normalizeAnswer(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function answerMatches(input, accepted) {
    const got = normalizeAnswer(input);
    const gotTight = got.replace(/\s+/g, "");
    return (accepted || []).some((ans) => {
      const want = normalizeAnswer(ans);
      return got === want || gotTight === want.replace(/\s+/g, "");
    });
  }

  function renderQuiz(containerId, quiz, onPass) {
    const box = el(containerId);
    if (!box || !quiz) return;
    const questions = quiz.questions || [];
    let index = 0;
    box.hidden = false;

    function paint() {
      const q = questions[index];
      if (!q) {
        onPass();
        return;
      }
      box.innerHTML = `
        <p class="slot-label">${quiz.title} · ${index + 1}/${questions.length}</p>
        <p class="quiz-prompt">${q.prompt}</p>
        <p class="ana-note">${quiz.anaNote || ""}</p>
        <form class="quiz-form" autocomplete="off">
          <input
            class="quiz-input"
            type="text"
            name="answer"
            inputmode="text"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            placeholder="Escribid la respuesta"
            required
          />
          <button class="btn btn-primary" type="submit">Comprobar</button>
        </form>
        <p class="quiz-error" hidden></p>
      `;
      const form = box.querySelector(".quiz-form");
      const input = box.querySelector(".quiz-input");
      const err = box.querySelector(".quiz-error");
      input.focus();
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (answerMatches(input.value, q.answers)) {
          err.hidden = true;
          index += 1;
          paint();
        } else {
          err.hidden = false;
          err.textContent = "Casi… probad otra vez.";
          input.select();
        }
      });
    }

    paint();
  }

  function clearPanelChrome() {
    el("verify-flag").hidden = true;
    el("swap-note").hidden = true;
    el("selfie-note").hidden = true;
    el("btn-done").hidden = true;
    el("btn-continue").hidden = true;
    hideMaps();
  }

  function showStartGate() {
    const startBanner = el("start-banner");
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    doneAll.hidden = true;
    panel.hidden = true;
    if (startBanner) startBanner.hidden = false;

    hideAllExtras();
    el("btn-start").hidden = true;
    renderQuiz("start-quiz", window.LALA_QUIZ.start, () => {
      window.LalaProgress.markStartQuizPassed();
      window.LalaProgress.start();
      setPhase(null);
      render();
    });
    renderMarkers();
    renderMoodTrail();
  }

  function showStop(active) {
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    const startBanner = el("start-banner");
    if (startBanner) startBanner.hidden = true;
    doneAll.hidden = true;
    panel.hidden = false;
    hideAllExtras();

    el("stop-code").textContent = active.code;
    el("stop-title").textContent = active.title;
    el("stop-address").textContent = active.address;
    el("stop-clue").textContent = active.clue;
    el("stop-task").hidden = false;
    el("stop-task").textContent = active.task;

    const verify = el("verify-flag");
    if (active.needsVerify) {
      verify.hidden = false;
      verify.textContent =
        "Pin provisional — Ana debe verificar ubicación y acceso.";
    } else {
      verify.hidden = true;
    }

    const swap = el("swap-note");
    if (active.swapNote && !active.isFinale) {
      swap.hidden = false;
      swap.textContent = active.swapNote;
    } else {
      swap.hidden = true;
    }

    el("selfie-note").hidden = true;
    el("btn-done").hidden = false;
    el("btn-continue").hidden = true;
    hideMaps();

    setupSoundtrack(active);

    renderMarkers();
    renderMoodTrail();
  }

  function setupSoundtrack(active) {
    const box = el("soundtrack-box");
    const st = window.LALA_SOUNDTRACK;
    const progress = window.LalaProgress.read();
    const needsSong =
      active && st && active.id === st.stopId && active.soundtrack;

    if (!needsSong) {
      box.hidden = true;
      el("btn-done").disabled = false;
      return;
    }

    box.hidden = false;
    el("soundtrack-title").textContent = st.title;
    el("soundtrack-label").textContent = st.label;
    el("soundtrack-link").href = st.url;
    el("soundtrack-link").textContent = "Abrir canción (Spotify / YouTube)";
    el("dance-status").textContent = progress.soundtrackDone
      ? "¡Listas! Ya podéis pulsar Hecho."
      : `Pulsad «Bailar ${st.danceSeconds}s» después de poner la canción.`;

    const danceBtn = el("btn-dance");
    danceBtn.textContent = `Bailar ${st.danceSeconds}s`;
    danceBtn.hidden = progress.soundtrackDone;
    el("btn-done").disabled = !progress.soundtrackDone;

    danceBtn.onclick = () => {
      if (danceBtn.dataset.running === "1") return;
      danceBtn.dataset.running = "1";
      let left = st.danceSeconds;
      danceBtn.disabled = true;
      const tick = () => {
        el("dance-status").textContent = `Bailando… ${left}s`;
        if (left <= 0) {
          window.LalaProgress.markSoundtrackDone();
          danceBtn.hidden = true;
          danceBtn.dataset.running = "0";
          el("dance-status").textContent = "¡Listas! Ya podéis pulsar Hecho.";
          el("btn-done").disabled = false;
          return;
        }
        left -= 1;
        setTimeout(tick, 1000);
      };
      tick();
    };
  }

  function showMood(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    el("stop-code").textContent = stop.code + " · mood";
    el("stop-title").textContent = "¿Cómo os sentís?";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent = "Elegid un mood para esta parada.";
    el("stop-task").textContent = "";

    const box = el("mood-box");
    box.hidden = false;
    box.innerHTML = `<div class="mood-picks" role="group" aria-label="Mood"></div>`;
    const picks = box.querySelector(".mood-picks");
    window.LALA_MOODS.forEach((mood) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mood-pick";
      btn.setAttribute("aria-label", mood.label);
      btn.innerHTML = `<span class="mood-emoji">${mood.emoji}</span><span>${mood.label}</span>`;
      btn.addEventListener("click", () => {
        window.LalaProgress.setMood(stop.id, mood.id);
        if (stop.isFinale) {
          setPhase(null);
          showComplete();
        } else {
          setPhase("gary", stop.id);
          render();
        }
      });
      picks.appendChild(btn);
    });

    renderMarkers();
    renderMoodTrail();
  }

  function showRoulette(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    el("stop-code").textContent = "Cambio de coche";
    el("stop-title").textContent = "Ruleta · Coche A o B";
    el("stop-address").textContent = "¿Dónde va Lala?";
    el("stop-clue").textContent =
      "Girad la ruleta. Solo Coche A o Coche B — sin nombres.";
    el("stop-task").textContent = "";

    const box = el("roulette-box");
    box.hidden = false;
    const existing = window.LalaProgress.read().carSwaps[stop.id];
    box.innerHTML = `
      <div class="roulette-wheel" id="roulette-wheel" aria-hidden="true">
        <div class="roulette-half a">A</div>
        <div class="roulette-half b">B</div>
        <div class="roulette-pointer"></div>
      </div>
      <p class="roulette-result" id="roulette-result">${
        existing ? `Lala → <strong>Coche ${existing}</strong>` : "Pulsad girar"
      }</p>
      <button type="button" class="btn btn-primary" id="btn-spin" ${
        existing ? "hidden" : ""
      }>Girar</button>
      <button type="button" class="btn btn-done" id="btn-roulette-next" ${
        existing ? "" : "hidden"
      }>Siguiente parada</button>
    `;

    const wheel = box.querySelector("#roulette-wheel");
    const result = box.querySelector("#roulette-result");
    const spinBtn = box.querySelector("#btn-spin");
    const nextBtn = box.querySelector("#btn-roulette-next");

    spinBtn?.addEventListener("click", () => {
      spinBtn.disabled = true;
      const cars = window.LALA_META.cars;
      const pick = cars[Math.floor(Math.random() * cars.length)];
      const turns = 4 + Math.floor(Math.random() * 3);
      const end = turns * 360 + (pick === "A" ? 90 : 270);
      wheel.style.transition = "transform 2.4s cubic-bezier(0.15, 0.85, 0.25, 1)";
      wheel.style.transform = `rotate(${end}deg)`;
      setTimeout(() => {
        window.LalaProgress.setCarSwap(stop.id, pick);
        result.innerHTML = `Lala → <strong>Coche ${pick}</strong>`;
        nextBtn.hidden = false;
        spinBtn.hidden = true;
      }, 2500);
    });

    nextBtn?.addEventListener("click", () => {
      setPhase(null);
      render();
    });

    renderMarkers();
    renderMoodTrail();
  }

  function showFinaleQuiz(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    el("stop-code").textContent = "Grand Finale · quiz";
    el("stop-title").textContent = "Una pregunta más";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent =
      "Responded para revelar la última sorpresa (la carta está en la mesa).";
    el("stop-task").textContent = "";

    renderQuiz("finale-quiz", window.LALA_QUIZ.finale, () => {
      window.LalaProgress.markFinaleQuizPassed();
      setPhase("mood", stop.id);
      render();
    });

    renderMarkers();
    renderMoodTrail();
  }

  /** Gary note for non-finale stops only — no task text. */
  function showGary(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    el("stop-code").textContent = stop.code + " · hecho";
    el("stop-title").textContent = "¡Parada completada!";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent = "Una nota de Gary para Lala:";
    el("stop-task").textContent = "";
    el("stop-task").hidden = true;

    const gary = el("gary-box");
    gary.hidden = false;
    el("gary-slot").textContent = stop.garySlot;
    el("gary-text").textContent = stop.garyPlaceholder;

    el("btn-continue").hidden = false;
    el("btn-continue").textContent = hasNextStop(stop)
      ? "Ruleta de coches"
      : "Seguir";

    renderMarkers();
    renderMoodTrail();
  }

  function showComplete() {
    el("stop-panel").hidden = true;
    el("start-banner").hidden = true;
    el("all-done").hidden = false;
    hideAllExtras();
    const trail = el("all-done-mood");
    if (trail) trail.innerHTML = window.LalaProgress.moodTrailHtml();
    renderMarkers();
    renderMoodTrail();
  }

  function render() {
    const progress = window.LalaProgress.read();
    const { phase, stopId } = getPhase();

    if (!progress.started || !progress.startQuizPassed) {
      showStartGate();
      return;
    }

    if (phase === "finale-quiz" && stopId) {
      showFinaleQuiz(stopById(stopId));
      return;
    }
    if (phase === "mood" && stopId) {
      showMood(stopById(stopId));
      return;
    }
    if (phase === "gary" && stopId) {
      showGary(stopById(stopId));
      return;
    }
    if (phase === "roulette" && stopId) {
      showRoulette(stopById(stopId));
      return;
    }

    const active = window.LalaProgress.activeStop();
    if (!active) {
      showComplete();
      return;
    }
    showStop(active);
  }

  function onDone() {
    const active = window.LalaProgress.activeStop();
    if (!active) return;
    const st = window.LALA_SOUNDTRACK;
    if (
      active.soundtrack &&
      st &&
      active.id === st.stopId &&
      !window.LalaProgress.read().soundtrackDone
    ) {
      return;
    }
    window.LalaProgress.markDone(active.id);
    /* Finale: quiz before mood. Other stops: mood → Gary → roulette. */
    if (active.isFinale) {
      setPhase("finale-quiz", active.id);
    } else {
      setPhase("mood", active.id);
    }
    render();
  }

  function onContinue() {
    const { phase, stopId } = getPhase();
    const stop = stopById(stopId);
    if (phase === "gary" && stop && hasNextStop(stop)) {
      setPhase("roulette", stop.id);
      render();
      return;
    }
    setPhase(null);
    if (stop && stop.isFinale) {
      showComplete();
      return;
    }
    render();
  }

  function onReset() {
    if (!confirm("¿Reiniciar el progreso de Lala en este teléfono?")) return;
    window.LalaProgress.reset();
    setPhase(null);
    const task = el("stop-task");
    if (task) task.hidden = false;
    render();
  }

  function init() {
    const stage = el("map-stage");
    if (stage) {
      stage.insertAdjacentHTML("afterbegin", window.LalaMap.renderSvg());
    }

    const duck = el("duckies-img");
    if (duck) duck.src = `${assetBase}/lala-duckies.png`;

    el("btn-done")?.addEventListener("click", onDone);
    el("btn-continue")?.addEventListener("click", onContinue);
    el("btn-reset")?.addEventListener("click", onReset);
    el("btn-finish-ok")?.addEventListener("click", () => {
      el("all-done")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    hideMaps();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
