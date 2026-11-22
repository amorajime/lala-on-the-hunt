(function () {
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function isUnlocked() {
    try {
      return localStorage.getItem(window.LALA_META.authStorageKey) === "1";
    } catch {
      return false;
    }
  }

  function setUnlocked(on) {
    if (on) localStorage.setItem(window.LALA_META.authStorageKey, "1");
    else localStorage.removeItem(window.LALA_META.authStorageKey);
  }

  async function tryPassword(input) {
    const hash = await sha256Hex(String(input || "").trim());
    const ok = hash === window.LALA_META.passwordHash;
    if (ok) setUnlocked(true);
    return ok;
  }

  window.LalaAuth = { tryPassword, isUnlocked, setUnlocked, sha256Hex };
})();
