# Lala on the Hunt

Static Spanish-language scavenger hunt site for Lala’s bachelorette in Valdetorres de Jarama.

**Format:** shared convoy (2 cars, same stops) · bride unlocks one stop at a time · friends see the full itinerary behind a password.

## Live URL

**https://amorajime.github.io/lala-on-the-hunt/**

| Route | Who | Notes |
|---|---|---|
| `/` or `/novia/` | Lala (bride) | Quiz start → challenge → mood → Gary note → car roulette; finale: quiz → mood → success (no digital letter) |
| `/amigas/` | Friends / hosts | Password-gated full itinerary + host tips + mood trail |

**Friends password:** `LalaMala1` (client-side SHA-256 check — fine for a party toy, not real security).

## Open locally

No build step. From the repo root:

```bash
python3 -m http.server 8080
```

Then open:

- http://127.0.0.1:8080/
- http://127.0.0.1:8080/novia/
- http://127.0.0.1:8080/amigas/

## GitHub Pages

Pages deploys from **branch `main` / root (`/`)**. Every push to `main` republishes.

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`.

## Edit stops, quiz, song & copy

**One config file:** [`assets/js/stops.js`](assets/js/stops.js)

### Stops / Maps / Gary notes

- Spanish clues / tasks → `clue`, `task`
- Gary English note slots → `garyPlaceholder` (after **Hecho** on the bride path)
- Friends tips → `hostTip`
- Maps pin → `lat`, `lng`, `mapsQuery`, `address`

### Couple quiz

Edit `window.LALA_COUPLE_QUESTIONS` in `stops.js`:

| Gate | Question | Answer |
|---|---|---|
| **Start** (`LALA_QUIZ.start`) | ¿Cuál fue el primer concierto al que fuiste con Gary? | **Rammstein** |
| **Finale** (`LALA_QUIZ.finale`) | ¿Cómo se llama el grupo en el que hablaste con Gary por primera vez? | **Gossip Gang** |

Answers are free-text; case and accents are normalized (`Rammstein` / `rammstein` both work). One question per gate.

### Soundtrack stop 1

`window.LALA_SOUNDTRACK` in `stops.js`:

- Live song: https://open.spotify.com/intl-es/track/3Y1F4btGQxxMZhlBYaLR4N  
- Bride flow on parada 1: open Spotify → **Bailar 10s** → **Hecho**

### Mood meter

After each stop, bride picks 💚 / 😂 / 🥹. Stored in `localStorage` (`moods`). Bride + amigas show a mood trail (same browser).

### Car swap roulette

After **Hecho** on A1 / A2 / B3 (not finale): mood → Gary note → spin **Coche A** or **Coche B** (no names). Bride UI has no Maps buttons (amigas keeps Maps).

### Password hash

`LALA_META.passwordHash` — SHA-256 hex of the friends password:

```bash
printf '%s' 'YourNewPassword' | sha256sum
```

Duckies: `assets/lala-duckies.png` · Styles: `assets/css/styles.css`.

## Stops (shared route)

1. **A1** Parque Julián González Rodríguez — soundtrack dance / lip-sync only  
2. **A2** Ayuntamiento / Plaza de la Constitución — Pasapalabra / Alphabet Game for Lala  
3. **B3** Campo de fútbol — parking **Cam. de la Vega, 20** — Lala soccer-player pose  
4. **Finale** American Ribs, Pl. de José Antonio 5 — quiz → letter/gift + lunch ~14:30  

Start: Calle Jorge Manrique, 1 (Silillos).

## Ana — pins

| Stop | Pin | Status |
|---|---|---|
| Start | Calle Jorge Manrique 1 | Confirm Maps / Silillos |
| A1 | Parque @ ~40.694321, −3.512548 | Parking + flat access |
| A2 | Ayuntamiento @ ~40.69513, −3.51243 | Plaza for Pasapalabra; 2-car parking |
| **B3** | **Parking Cam. de la Vega, 20** | **Ana confirmed** |
| Finale | American Ribs · Pl. José Antonio 5 | Sunday lunch + reserve 7 @ ~14:30 |

## Privacy notes

- Optional selfies stay on the phone — no upload backend.  
- Bride progress / moods / car spins live in that browser’s `localStorage`.  
- Amigas unlock is also `localStorage` on that device.
