/**
 * Stylized Valdetorres quest map (illustrated SVG, OSM-inspired layout).
 * Marker positions are relative % for the progression path UI.
 */
window.LalaMap = {
  /** Approximate layout positions for markers on the illustrated map */
  positions: {
    a1: { left: "28%", top: "62%" },
    a2: { left: "48%", top: "48%" },
    b3: { left: "22%", top: "32%" },
    finale: { left: "68%", top: "40%" },
  },

  renderSvg() {
    return `
<svg class="map-svg" viewBox="0 0 320 340" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="fields" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c8d9b8"/>
      <stop offset="100%" stop-color="#a8c49a"/>
    </linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8dcc8"/>
      <stop offset="100%" stop-color="#d4c4a8"/>
    </linearGradient>
  </defs>
  <!-- soft town blocks -->
  <rect x="0" y="0" width="320" height="340" fill="url(#fields)"/>
  <ellipse cx="250" cy="70" rx="70" ry="45" fill="#b5c9a8" opacity="0.7"/>
  <ellipse cx="60" cy="280" rx="80" ry="50" fill="#b8cfb0" opacity="0.65"/>
  <!-- Jarama hint strip -->
  <path d="M0 300 Q80 270 160 295 T320 275 L320 340 L0 340 Z" fill="#9ec4c0" opacity="0.55"/>
  <!-- streets (stylized) -->
  <path d="M40 310 L95 220 L140 160 L190 120 L250 95" stroke="url(#road)" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M95 220 L180 200 L260 180" stroke="#ddd0b8" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.9"/>
  <path d="M140 160 L90 100 L70 60" stroke="#ddd0b8" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.85"/>
  <path d="M190 120 L230 160 L270 150" stroke="#ddd0b8" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>
  <!-- plaza block -->
  <rect x="145" y="145" width="42" height="36" rx="4" fill="#f0e4d2" stroke="#c9b89a" stroke-width="1.5"/>
  <rect x="155" y="152" width="22" height="14" rx="2" fill="#c94b6a" opacity="0.35"/>
  <!-- park canopy -->
  <circle cx="95" cy="215" r="22" fill="#6a9a6e" opacity="0.55"/>
  <circle cx="78" cy="228" r="14" fill="#5c7a5a" opacity="0.45"/>
  <circle cx="112" cy="230" r="12" fill="#5c7a5a" opacity="0.4"/>
  <!-- pitch -->
  <rect x="48" y="78" width="48" height="32" rx="3" fill="#4f6f52" opacity="0.55"/>
  <rect x="54" y="84" width="36" height="20" rx="2" fill="none" stroke="#dff0d8" stroke-width="1.2" opacity="0.7"/>
  <!-- ribs plaza hint -->
  <rect x="210" y="125" width="36" height="28" rx="4" fill="#f3a8b8" opacity="0.45"/>
  <text x="16" y="28" fill="#3d4f44" font-size="11" font-family="Figtree, sans-serif" font-weight="700" opacity="0.55">Valdetorres</text>
  <text x="16" y="42" fill="#3d4f44" font-size="9" font-family="Figtree, sans-serif" opacity="0.45">mapa ilustrado · no a escala</text>
  <!-- quest path dashed -->
  <path id="quest-path" d="M95 215 C110 190, 130 175, 165 160 S 90 120, 72 95 S 200 140, 228 138"
        fill="none" stroke="#c94b6a" stroke-width="3.5" stroke-dasharray="7 6" stroke-linecap="round" opacity="0.75"/>
</svg>`;
  },

  checkIcon() {
    return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  },

  lockIcon() {
    return `<svg class="lock-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 7V5.2a2.5 2.5 0 015 0V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  },
};
