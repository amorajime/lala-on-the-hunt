(function () {
  let toastTimer = null;

  function ensureToastHost() {
    let host = document.getElementById("quiz-toast");
    if (host) return host;
    host = document.createElement("div");
    host.id = "quiz-toast";
    host.className = "quiz-toast";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    host.hidden = true;
    document.body.appendChild(host);
    return host;
  }

  function showToast(message, ms) {
    const host = ensureToastHost();
    host.textContent = message || "¡Correcto!";
    host.hidden = false;
    host.classList.remove("quiz-toast-out");
    host.classList.add("quiz-toast-in");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      host.classList.remove("quiz-toast-in");
      host.classList.add("quiz-toast-out");
      setTimeout(() => {
        host.hidden = true;
        host.classList.remove("quiz-toast-out");
      }, 220);
    }, ms || 900);
  }

  /** Retrigger sideways shake on an element (input or option button). */
  function shake(node) {
    if (!node) return;
    node.classList.remove("quiz-shake");
    void node.offsetWidth;
    node.classList.add("quiz-shake");
    const onEnd = () => {
      node.classList.remove("quiz-shake");
      node.removeEventListener("animationend", onEnd);
    };
    node.addEventListener("animationend", onEnd);
  }

  window.LalaQuizUi = { showToast, shake };
})();
