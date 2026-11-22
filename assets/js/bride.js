(function () {
  const assetBase = document.body.dataset.assetBase || "../assets";

  function el(id) {
    return document.getElementById(id);
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

  function renderPanel() {
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    const startBanner = el("start-banner");
    const progress = window.LalaProgress.read();
    const active = window.LalaProgress.activeStop();

    if (startBanner) {
      startBanner.hidden = progress.started || progress.completed.length > 0;
    }

    if (!active) {
      panel.hidden = true;
      doneAll.hidden = false;
      renderMarkers();
      return;
    }

    doneAll.hidden = true;
    panel.hidden = false;

    el("stop-code").textContent = active.code;
    el("stop-title").textContent = active.title;
    el("stop-address").textContent = active.address;
    el("stop-clue").textContent = active.clue;
    el("stop-task").textContent = active.task;

    const maps = el("btn-maps");
    maps.href = window.LalaProgress.mapsUrl(active);

    const verify = el("verify-flag");
    if (active.needsVerify) {
      verify.hidden = false;
      verify.textContent =
        "Pin provisional — Ana debe verificar ubicación y acceso.";
    } else {
      verify.hidden = true;
    }

    const swap = el("swap-note");
    if (active.swapNote) {
      swap.hidden = false;
      swap.textContent = active.swapNote;
    } else {
      swap.hidden = true;
    }

    const gary = el("gary-box");
    const revealId = sessionStorage.getItem("lala-reveal-gary");
    if (revealId === active.id || progress.completed.includes(active.id)) {
      /* shouldn't show on active incomplete */
    }
    /* Reveal flow handled separately */
    const pendingReveal = sessionStorage.getItem("lala-reveal-gary");
    if (pendingReveal) {
      const revealed = window.LALA_STOPS.find((s) => s.id === pendingReveal);
      if (revealed) {
        showReveal(revealed);
        return;
      }
    }

    gary.hidden = true;
    el("btn-done").hidden = false;
    el("btn-continue").hidden = true;
    el("selfie-note").hidden = false;

    renderMarkers();
  }

  function showReveal(stop) {
    const panel = el("stop-panel");
    const doneAll = el("all-done");
    doneAll.hidden = true;
    panel.hidden = false;

    el("stop-code").textContent = stop.code + " · hecho";
    el("stop-title").textContent = "¡Parada completada!";
    el("stop-address").textContent = stop.title;
    el("stop-clue").textContent = "Una nota de Gary para Lala:";
    el("stop-task").textContent = stop.task;
    el("verify-flag").hidden = true;

    const gary = el("gary-box");
    gary.hidden = false;
    el("gary-slot").textContent = stop.garySlot;
    el("gary-text").textContent = stop.garyPlaceholder;

    const swap = el("swap-note");
    if (stop.swapNote) {
      swap.hidden = false;
      swap.textContent = stop.swapNote;
    } else {
      swap.hidden = true;
    }

    el("btn-done").hidden = true;
    el("btn-continue").hidden = false;
    el("selfie-note").hidden = true;
    el("btn-maps").href = window.LalaProgress.mapsUrl(stop);

    renderMarkers();
  }

  function onDone() {
    const active = window.LalaProgress.activeStop();
    if (!active) return;
    window.LalaProgress.markDone(active.id);
    sessionStorage.setItem("lala-reveal-gary", active.id);
    renderPanel();
  }

  function onContinue() {
    sessionStorage.removeItem("lala-reveal-gary");
    renderPanel();
  }

  function onStart() {
    window.LalaProgress.start();
    el("start-banner").hidden = true;
    renderPanel();
  }

  function onReset() {
    if (!confirm("¿Reiniciar el progreso de Lala en este teléfono?")) return;
    window.LalaProgress.reset();
    sessionStorage.removeItem("lala-reveal-gary");
    renderPanel();
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
    el("btn-start")?.addEventListener("click", onStart);
    el("btn-reset")?.addEventListener("click", onReset);

    renderPanel();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
