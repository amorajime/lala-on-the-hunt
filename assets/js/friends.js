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

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderItinerary() {
    const host = el("itinerary");
    host.innerHTML = "";

    const trailHost = el("amigas-mood-trail");
    if (trailHost) {
      const html = window.LalaProgress.moodTrailHtml();
      trailHost.innerHTML =
        html ||
        `<p class="address">El medidor de mood aparecerá cuando Lala complete paradas en este teléfono (mismo navegador) o tras sincronizar a mano.</p>`;
    }

    const quizCard = document.createElement("article");
    quizCard.className = "leg";
    const startQ = window.LALA_QUIZ.start.questions[0];
    const finQ = window.LALA_QUIZ.finale.questions[0];
    quizCard.innerHTML = `
      <div class="stop-code">Quizzes</div>
      <h2>Preguntas de pareja</h2>
      <p class="clue"><strong>Inicio:</strong> ${escapeHtml(startQ.prompt)}<br><span class="host-tip">Respuesta: ${escapeHtml(
        (startQ.answers && startQ.answers[0]) || ""
      )}</span></p>
      <p class="clue"><strong>Finale (carta/regalo):</strong> ${escapeHtml(finQ.prompt)}<br><span class="host-tip">Respuesta: ${escapeHtml(
        (finQ.answers && finQ.answers[0]) || ""
      )}</span></p>
      <p class="host-tip">Editad <code>LALA_COUPLE_QUESTIONS</code> / <code>LALA_QUIZ</code> en <code>assets/js/stops.js</code>. Mayúsculas/tildes no importan.</p>
    `;
    host.appendChild(quizCard);

    const song = window.LALA_SOUNDTRACK;
    const songCard = document.createElement("article");
    songCard.className = "leg";
    songCard.innerHTML = `
      <div class="stop-code">Banda sonora</div>
      <h2>${escapeHtml(song.title)}</h2>
      <p class="ana-note">${escapeHtml(song.label)}</p>
      <p class="task">Tras abrir la canción: bailar ${song.danceSeconds}s → luego Hecho.</p>
      <div class="actions">
        <a class="btn btn-maps btn-small" target="_blank" rel="noopener" href="${escapeHtml(song.url)}">Abrir en Spotify</a>
      </div>
    `;
    host.appendChild(songCard);

    const start = document.createElement("article");
    start.className = "leg";
    start.innerHTML = `
      <div class="stop-code">Salida</div>
      <h2>${escapeHtml(window.LALA_META.startAddress)}</h2>
      <p class="address">~13:15 · quiz de pareja → briefing · dos coches (A / B)</p>
      <p class="clue">${escapeHtml(window.LALA_META.convoyNote)}</p>
      <p class="host-tip">Tras cada Hecho (excepto finale): mood 💚😂🥹 + ruleta Coche A/B.</p>
      <div class="actions">
        <a class="btn btn-maps btn-small" target="_blank" rel="noopener"
           href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(window.LALA_META.startMapsQuery)}">Abrir en Maps</a>
      </div>
    `;
    host.appendChild(start);

    const progress = window.LalaProgress.read();

    window.LALA_STOPS.forEach((stop, i) => {
      const rail = document.createElement("div");
      rail.className = "timeline";
      rail.innerHTML =
        i === 0
          ? '<div class="timeline-dot"></div><div class="timeline-line"></div>'
          : '<div class="timeline-line"></div><div class="timeline-dot"></div><div class="timeline-line"></div>';
      host.appendChild(rail);

      const article = document.createElement("article");
      article.className = "leg";
      const verify = stop.needsVerify
        ? `<p class="verify-flag">⚠️ Ana: verificar pin / aparcamiento / acceso público (${stop.lat}, ${stop.lng})</p>`
        : "";
      const swap = stop.swapNote
        ? `<p class="swap-note">${escapeHtml(stop.swapNote)}</p>`
        : "";
      const moodId = progress.moods[stop.id];
      const mood = moodId
        ? `<p class="mood-inline">Mood guardado: ${window.LalaProgress.moodEmoji(moodId)}</p>`
        : "";
      const car = progress.carSwaps[stop.id]
        ? `<p class="swap-note">Ruleta en este teléfono: Coche ${escapeHtml(progress.carSwaps[stop.id])}</p>`
        : "";
      const songNote =
        stop.soundtrack
          ? `<p class="task">Incluye banda sonora + baile ${window.LALA_SOUNDTRACK.danceSeconds}s antes de Hecho.</p>`
          : "";
      article.innerHTML = `
        <div class="stop-code">${escapeHtml(stop.code)}</div>
        <h2>${escapeHtml(stop.title)}</h2>
        <p class="address">${escapeHtml(stop.address)}</p>
        <p class="clue">${escapeHtml(stop.clue)}</p>
        <p class="task">${escapeHtml(stop.task)}</p>
        ${songNote}
        <div class="gary-box">
          <p class="slot-label">${escapeHtml(stop.garySlot)}</p>
          <p>${escapeHtml(stop.garyPlaceholder)}</p>
        </div>
        ${swap}
        ${car}
        ${mood}
        ${verify}
        <p class="host-tip"><strong>Tip anfitriona:</strong> ${escapeHtml(stop.hostTip)}</p>
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
