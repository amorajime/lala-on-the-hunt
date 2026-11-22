(function () {
  const assetBase = document.body.dataset.assetBase || "../assets";

  function el(id) {
    return document.getElementById(id);
  }

  function showApp() {
    el("gate").hidden = true;
    el("amigas-app").hidden = false;
    renderItinerary();
  }

  function renderItinerary() {
    const host = el("itinerary");
    host.innerHTML = "";

    const start = document.createElement("article");
    start.className = "leg";
    start.innerHTML = `
      <div class="stop-code">Salida</div>
      <h2>${window.LALA_META.startAddress}</h2>
      <p class="address">~13:15 · sorpresa + briefing · dividir en dos coches</p>
      <p class="clue">${window.LALA_META.convoyNote}</p>
      <p class="host-tip">Lala empieza en Coche 1. WhatsApp de anfitrionas (sin Lala) para “salimos / llegamos / cambio”.</p>
      <div class="actions">
        <a class="btn btn-maps btn-small" target="_blank" rel="noopener"
           href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(window.LALA_META.startMapsQuery)}">Abrir en Maps</a>
      </div>
    `;
    host.appendChild(start);

    window.LALA_STOPS.forEach((stop, i) => {
      if (i > 0) {
        const rail = document.createElement("div");
        rail.className = "timeline";
        rail.innerHTML =
          '<div class="timeline-line"></div><div class="timeline-dot"></div><div class="timeline-line"></div>';
        host.appendChild(rail);
      } else {
        const rail = document.createElement("div");
        rail.className = "timeline";
        rail.innerHTML =
          '<div class="timeline-dot"></div><div class="timeline-line"></div>';
        host.appendChild(rail);
      }

      const article = document.createElement("article");
      article.className = "leg";
      const verify = stop.needsVerify
        ? `<p class="verify-flag">⚠️ Ana: verificar pin / aparcamiento / acceso público (${stop.lat}, ${stop.lng})</p>`
        : "";
      const swap = stop.swapNote
        ? `<p class="swap-note">${stop.swapNote}</p>`
        : "";
      article.innerHTML = `
        <div class="stop-code">${stop.code}</div>
        <h2>${stop.title}</h2>
        <p class="address">${stop.address}</p>
        <p class="clue">${stop.clue}</p>
        <p class="task">${stop.task}</p>
        <div class="gary-box">
          <p class="slot-label">${stop.garySlot}</p>
          <p>${stop.garyPlaceholder}</p>
        </div>
        ${swap}
        ${verify}
        <p class="host-tip"><strong>Tip anfitriona:</strong> ${stop.hostTip}</p>
        <div class="actions">
          <a class="btn btn-maps btn-small" target="_blank" rel="noopener"
             href="${window.LalaProgress.mapsUrl(stop)}">Abrir en Maps</a>
        </div>
      `;
      host.appendChild(article);
    });
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

    el("gate-form")?.addEventListener("submit", onSubmit);
    el("btn-lock")?.addEventListener("click", onLock);

    if (window.LalaAuth.isUnlocked()) showApp();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
