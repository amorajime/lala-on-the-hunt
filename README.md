# Lala on the Hunt

Static Spanish-language scavenger hunt site for Lala’s bachelorette in Valdetorres de Jarama.

**Format:** shared convoy (2 cars, same stops) · bride unlocks one stop at a time · friends run a parallel open play mode.

## Live URL

**https://amorajime.github.io/lala-on-the-hunt/**

| Route | Who | Notes |
|---|---|---|
| `/` or `/novia/` | Lala (bride) | Free-text quiz → challenge → Gary note → mood → roulette; finale: quiz → letter → mood → success |
| `/amigas/` | Friends / hosts | Open **play mode** (no password): 4-option quizzes, Maps on every challenge, friend-facing challenge copy, Gary notes, wait card (bride spins), letter prompt (no full text), moods → success |

**Amigas live:** https://amorajime.github.io/lala-on-the-hunt/amigas/

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

- Bride Spanish clues / tasks → `clue`, `task`
- Friends Spanish instructions → `friendsClue`, `friendsTask`
- Gary English note slots → `garyPlaceholder` (after **Hecho**)
- Maps pin → `lat`, `lng`, `mapsQuery`, `address`

### Couple quiz

Edit `window.LALA_COUPLE_QUESTIONS` in `stops.js`:

| Gate | Question | Answer | Amigas choices |
|---|---|---|---|
| **Start** | ¿Cuál fue el primer concierto…? | **Rammstein** | Calvin Harris · Ed Sheeran · Rammstein · Hootie & the Blowfish |
| **Finale** | ¿Cómo se llama el grupo…? | **Gossip Gang** | The Cool Gang · Gossip Gang · The Beastie Boys · Boston Girlies |

- **Bride:** free-text (case/accents normalized).
- **Amigas:** tap one of four options; only the correct choice advances.

### Soundtrack stop 1

`window.LALA_SOUNDTRACK` in `stops.js`:

- Live song: https://open.spotify.com/track/1JLn8RhQzHz3qDqsChcmBl  
- Bride: open Spotify link + film dance/lip-sync → **Hecho!** (no on-page countdown)

### Finale letter

`window.LALA_FINALE_LETTER` in `stops.js` — full text on the **bride** path after finale quiz.

Amigas see only `LALA_FRIENDS_COPY.letterPrompt` (“ask Lala to read the letter out loud”) — no letter body.

### Mood meter

After each stop, pick 💚 / 😂 / 🥹. Bride uses `storageKey`; amigas play mode uses `friendsStorageKey` (separate phones / progress).

### Car swap

- **Bride:** Gary note → mood → spin **Coche A** or **Coche B**.
- **Amigas:** Gary note → mood → wait card (“Lala is spinning for her next seat”) + Maps to the next stop. No roulette control.

Bride UI hides Maps; amigas show **Google Maps** on every challenge (and on the wait card for the next location).

Duckies: `assets/lala-duckies.png` · Styles: `assets/css/styles.css`.

`auth.js` / `passwordHash` remain in the repo unused (amigas is open access).

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
