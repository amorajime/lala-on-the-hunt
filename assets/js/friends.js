(function () {
  const assetBase = document.body.dataset.assetBase || "../assets";
  const PHASE_KEY = "lala-friends-phase";
  const PHASE_STOP_KEY = "lala-friends-phase-stop";
  const Progress = window.createLalaProgress(
    () => window.LALA_META.friendsStorageKey
  );

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

  function friendsCopy() {
    return window.LALA_FRIENDS_COPY || {};
  }

  function hideAllExtras() {
    [
      "start-quiz",
      "soundtrack-box",
      "mood-box",
      "wait-box",
      "finale-quiz",
      "finale-letter",
      "gary-box",
      "btn-maps",
      "btn-start-maps",
    ].forEach((id) => {
      const node = el(id);
      if (node) node.hidden = true;
    });
  }

  function showMaps(stop) {
    const maps = el("btn-maps");
    if (!maps || !stop) return;
    maps.hidden = false;
    maps.href = Progress.mapsUrl(stop);
    maps.textContent = "Abrir en Google Maps";
  }

  function renderMarkers() {
    const host = el("path-markers");
    if (!host || !window.LalaMap) return;
    host.innerHTML = "";
    window.LALA_STOPS.forEach((stop) => {
      const pos = window.LalaMap.positions[stop.id];
      if (!pos) return;
      const status = Progress.statusFor(stop.id);
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
    host.innerHTML = Progress.moodTrailHtml();
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

  /** Multiple-choice quiz — only advances on the correct option. */
  function renderMcqQuiz(containerId, quiz, onPass) {
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
      const choices = q.choices || [];
      const note = quiz.friendsNote || "";
      box.innerHTML = `
        <p class="slot-label">${quiz.title}</p>
        <p class="quiz-prompt">${q.prompt}</p>
        ${note ? `<p class="ana-note">${note}</p>` : ""}
        <div class="quiz-options" role="group" aria-label="Opciones"></div>
        <p class="quiz-error" hidden></p>
      `;
      const host = box.querySelector(".quiz-options");
      const err = box.querySelector(".quiz-error");
      choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn quiz-option";
        btn.textContent = choice;
        btn.addEventListener("click", () => {
          if (answerMatches(choice, q.answers)) {
            err.hidden = true;
            index += 1;
            paint();
          } else {
            err.hidden = false;
            err.textContent = "Esa no es. Probad otra.";
            btn.classList.add("quiz-option-wrong");
          }
        });
        host.appendChild(btn);
      });
    }

    paint();
  }

  function clearPanelChrome() {
    el("btn-done").hidden = true;
    el("btn-continue").hidden = true;
    const maps = el("btn-maps");
    if (maps) maps.hidden = true;
  }

  function setSuccessChrome(on) {
    const hide = Boolean(on);
    ["hero", "map-stage", "mood-trail-host", "start-banner"].forEach((id) => {
      const node = el(id);
      if (node) node.hidden = hide;
    });
    document.querySelectorAll(".quest-head, .footer-tools").forEach((node) => {
      node.hidden = hide;
    });
  }

  function showStartGate() {
    const startBanner = el("start-banner");
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    doneAll.hidden = true;
    panel.hidden = true;
    setSuccessChrome(false);
    if (startBanner) startBanner.hidden = false;

    hideAllExtras();
    const startMaps = el("btn-start-maps");
    if (startMaps) {
      startMaps.hidden = false;
      startMaps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        window.LALA_META.startMapsQuery
      )}`;
    }

    renderMcqQuiz("start-quiz", window.LALA_QUIZ.start, () => {
      Progress.markStartQuizPassed();
      Progress.start();
      setPhase(null);
      render();
    });
    renderMarkers();
    renderMoodTrail();
  }

  function setupSoundtrack(active) {
    const box = el("soundtrack-box");
    const st = window.LALA_SOUNDTRACK;
    const needsSong =
      active && st && active.id === st.stopId && active.soundtrack;
    if (!needsSong) {
      box.hidden = true;
      return;
    }
    box.hidden = false;
    const link = el("soundtrack-link");
    link.hidden = false;
    link.href = st.url;
    link.textContent = st.linkText || "Abrir canción en Spotify";
  }

  function showStop(active) {
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    const startBanner = el("start-banner");
    if (startBanner) startBanner.hidden = true;
    doneAll.hidden = true;
    setSuccessChrome(false);
    panel.hidden = false;
    hideAllExtras();

    el("stop-code").textContent = active.code;
    el("stop-title").textContent = active.title;
    el("stop-address").textContent = active.address;
    el("stop-clue").textContent = active.friendsClue || active.clue;
    el("stop-task").hidden = false;
    el("stop-task").textContent = active.friendsTask || active.task;

    el("btn-done").hidden = false;
    el("btn-done").disabled = false;
    el("btn-done").textContent = "Hecho!";
    el("btn-continue").hidden = true;
    showMaps(active);
    setupSoundtrack(active);
    renderMarkers();
    renderMoodTrail();
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
    el("stop-clue").textContent = "Elegid un mood para esta parada (vosotras).";
    el("stop-task").textContent = "";
    el("stop-task").hidden = true;

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
        Progress.setMood(stop.id, mood.id);
        if (stop.isFinale) {
          setPhase(null);
          showComplete();
        } else if (hasNextStop(stop)) {
          setPhase("wait", stop.id);
          render();
        } else {
          setPhase(null);
          render();
        }
      });
      picks.appendChild(btn);
    });

    renderMarkers();
    renderMoodTrail();
  }

  function showWait(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    const copy = friendsCopy();
    const idx = window.LALA_STOPS.findIndex((s) => s.id === stop.id);
    const next = window.LALA_STOPS[idx + 1];

    el("stop-code").textContent = "Cambio de coche";
    el("stop-title").textContent = copy.waitTitle || "Cambio de coche";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent =
      copy.waitLead || "Lala está girando la ruleta para su próximo asiento.";
    el("stop-task").hidden = true;

    const box = el("wait-box");
    box.hidden = false;
    box.innerHTML = `
      <p class="wait-body">${
        copy.waitBody ||
        "Esperad a que Lala termine la ruleta en su pantalla."
      }</p>
      <div class="wait-visual" aria-hidden="true">
        <span class="wait-spin">A</span>
        <span class="wait-spin delay">B</span>
      </div>
    `;

    if (next) showMaps(next);

    el("btn-continue").hidden = false;
    el("btn-continue").textContent = next
      ? `Siguiente · ${next.shortTitle}`
      : "Seguir";

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
      "Haced la pregunta a Lala y elegid la respuesta correcta aquí.";
    el("stop-task").textContent = "";
    el("stop-task").hidden = true;

    renderMcqQuiz("finale-quiz", window.LALA_QUIZ.finale, () => {
      Progress.markFinaleQuizPassed();
      setPhase("finale-letter", stop.id);
      render();
    });

    renderMarkers();
    renderMoodTrail();
  }

  function showFinaleLetterPrompt(stop) {
    const panel = el("stop-panel");
    panel.hidden = false;
    el("all-done").hidden = true;
    el("start-banner").hidden = true;
    hideAllExtras();
    clearPanelChrome();

    const copy = friendsCopy();
    el("stop-code").textContent = "Grand Finale · carta";
    el("stop-title").textContent =
      copy.letterPromptTitle || "La carta de Gary";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent = "";
    el("stop-task").textContent = "";
    el("stop-task").hidden = true;

    const box = el("finale-letter");
    box.hidden = false;
    box.innerHTML = `<p class="letter-body friends-letter-prompt"></p>`;
    box.querySelector(".letter-body").textContent =
      copy.letterPrompt ||
      "Pedidle a Lala que lea la carta de Gary en voz alta.";

    el("btn-continue").hidden = false;
    el("btn-continue").textContent = "Seguir al mood";

    renderMarkers();
    renderMoodTrail();
  }

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
    el("stop-clue").textContent = "";
    el("stop-task").textContent = "";
    el("stop-task").hidden = true;

    const gary = el("gary-box");
    gary.hidden = false;
    el("gary-slot").textContent = stop.garySlot;
    el("gary-text").textContent = stop.garyPlaceholder;

    el("btn-continue").hidden = false;
    el("btn-continue").textContent = "Seguir al mood";

    renderMarkers();
    renderMoodTrail();
  }

  function burstConfetti() {
    const canvas = el("confetti-canvas");
    const screen = el("all-done");
    if (!canvas || !screen) return;
    const ctx = canvas.getContext("2d");
    const rect = screen.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width;
    const h = rect.height;
    const colors = ["#c94b6a", "#f3a8b8", "#4f6f52", "#f0a45c", "#9bb896", "#fff6ee"];
    const pieces = Array.from({ length: 110 }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * h * 0.35,
      r: 3 + Math.random() * 5,
      vy: 2.2 + Math.random() * 3.4,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.2 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    let frames = 0;
    const maxFrames = 120;
    function frame() {
      frames += 1;
      ctx.clearRect(0, 0, w, h);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        }
        ctx.restore();
      });
      if (frames < maxFrames) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  function showComplete() {
    el("stop-panel").hidden = true;
    const done = el("all-done");
    done.hidden = false;
    hideAllExtras();
    setSuccessChrome(true);

    const title = el("success-title");
    const lead = el("success-lead");
    if (title) title.textContent = window.LALA_META.successTitle;
    if (lead) {
      lead.textContent =
        friendsCopy().successLead || window.LALA_META.successLead;
    }

    const trail = el("all-done-mood");
    if (trail) {
      const html = Progress.moodReceiptHtml();
      trail.innerHTML = html
        ? `<div class="success-mood-card">${html}</div>`
        : `<div class="success-mood-card"><p class="success-mood-empty">Sin moods guardados en este teléfono — igual habéis ganado.</p></div>`;
    }
  }

  function render() {
    const progress = Progress.read();
    const { phase, stopId } = getPhase();

    if (!progress.started || !progress.startQuizPassed) {
      showStartGate();
      return;
    }

    if (phase === "finale-quiz" && stopId) {
      showFinaleQuiz(stopById(stopId));
      return;
    }
    if (phase === "finale-letter" && stopId) {
      showFinaleLetterPrompt(stopById(stopId));
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
    if (phase === "wait" && stopId) {
      showWait(stopById(stopId));
      return;
    }

    const active = Progress.activeStop();
    if (!active) {
      showComplete();
      return;
    }
    showStop(active);
  }

  function onDone() {
    const active = Progress.activeStop();
    if (!active) return;
    Progress.markDone(active.id);
    if (active.isFinale) {
      setPhase("finale-quiz", active.id);
    } else {
      setPhase("gary", active.id);
    }
    render();
  }

  function onContinue() {
    const { phase, stopId } = getPhase();
    const stop = stopById(stopId);
    if (phase === "finale-letter" && stop) {
      setPhase("mood", stop.id);
      render();
      return;
    }
    if (phase === "gary" && stop) {
      setPhase("mood", stop.id);
      render();
      return;
    }
    if (phase === "wait") {
      setPhase(null);
      render();
      return;
    }
    setPhase(null);
    render();
  }

  function onReset() {
    if (!confirm("¿Reiniciar el progreso de las amigas en este teléfono?"))
      return;
    Progress.reset();
    setPhase(null);
    setSuccessChrome(false);
    const done = el("all-done");
    if (done) done.hidden = true;
    const task = el("stop-task");
    if (task) task.hidden = false;
    render();
  }

  function showApp() {
    el("gate").hidden = true;
    el("amigas-app").hidden = false;
    const stage = el("map-stage");
    if (stage && window.LalaMap && !stage.dataset.mapReady) {
      stage.insertAdjacentHTML("afterbegin", window.LalaMap.renderSvg());
      stage.dataset.mapReady = "1";
    }
    render();
  }

  async function onSubmit(e) {
    e.preventDefault();
    const input = el("password");
    const err = el("gate-error");
    err.textContent = "";
    const ok = await window.LalaAuth.tryPassword(input.value);
    if (!ok) {
      err.textContent = "Contraseña incorrecta. Preguntad a Ana.";
      input.select();
      return;
    }
    showApp();
  }

  function onLock() {
    window.LalaAuth.setUnlocked(false);
    el("amigas-app").hidden = true;
    el("gate").hidden = false;
    el("password").value = "";
    el("gate-error").textContent = "";
  }

  function init() {
    const duck = el("duckies-img");
    if (duck) duck.src = `${assetBase}/lala-duckies.png`;
    const heroDuck = el("duckies-hero");
    if (heroDuck) heroDuck.src = `${assetBase}/lala-duckies.png`;

    el("gate-form")?.addEventListener("submit", onSubmit);
    el("btn-lock")?.addEventListener("click", onLock);
    el("btn-done")?.addEventListener("click", onDone);
    el("btn-continue")?.addEventListener("click", onContinue);
    el("btn-reset")?.addEventListener("click", onReset);
    el("btn-success-reset")?.addEventListener("click", onReset);
    el("btn-finish-ok")?.addEventListener("click", () => {
      burstConfetti();
    });

    if (window.LalaAuth.isUnlocked()) showApp();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
