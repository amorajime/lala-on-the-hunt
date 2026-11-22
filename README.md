# Lala on the Hunt

Static Spanish-language scavenger hunt site for Lala’s bachelorette in Valdetorres de Jarama.

**Format:** shared convoy (2 cars, same stops) · bride unlocks one stop at a time · friends see the full itinerary behind a password.

## Live URL

After GitHub Pages is enabled (see below):

**https://amorajime.github.io/lala-on-the-hunt/**

| Route | Who | Notes |
|---|---|---|
| `/` or `/novia/` | Lala (bride) | One active stop; **Hecho** unlocks the next; progress in `localStorage` |
| `/amigas/` | Friends / hosts | Password-gated full itinerary + host tips |

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

This repo deploys from the `main` branch root via GitHub Actions (`.github/workflows/pages.yml`).

Manual fallback (Settings → Pages):

1. **Source:** Deploy from a branch  
2. **Branch:** `main` / `/` (root)  
3. Save — site will appear at `https://amorajime.github.io/lala-on-the-hunt/`

Or keep the Actions workflow: Settings → Pages → Source → **GitHub Actions**.

## Edit stops & copy

All stop text, Maps queries, Gary placeholders, and host tips live in one file:

**[`assets/js/stops.js`](assets/js/stops.js)**

- Spanish clues / tasks → `clue`, `task`
- Gary English note slots → `garyPlaceholder` (shown after **Hecho** on the bride path)
- Friends tips → `hostTip`
- Maps pin → `lat`, `lng`, `mapsQuery`, `address`
- Password hash → `LALA_META.passwordHash` (SHA-256 hex of the password)

After changing the plaintext password, recompute:

```bash
printf '%s' 'YourNewPassword' | sha256sum
```

Duckies artwork: `assets/lala-duckies.png`.

Styles: `assets/css/styles.css`.

## Stops (shared route)

1. **A1** Parque Julián González Rodríguez — group selfie with green in frame  
2. **A2** Ayuntamiento / Plaza de la Constitución — town-hall façade exterior  
3. **B3** Campo de fútbol (Camino de la Vega, 1 · Pvo. Municipal) — group photo · **Ana: verify pin**  
4. **Finale** American Ribs, Pl. de José Antonio 5 — letter/gift + lunch ~14:30  

Start: Calle Jorge Manrique, 1 (Silillos). Lala may switch cars between stops.

## Ana — pins to verify

| Stop | Proposed pin | Status |
|---|---|---|
| Start | Calle Jorge Manrique 1 | Confirm Maps / Silillos |
| A1 | Parque @ ~40.694321, −3.512548 (C. Calvario) | Parking + flat access |
| A2 | Plaza Constitución / Ayuntamiento @ ~40.69513, −3.51243 | Exterior photo spot, 2-car parking |
| **B3** | **Campo de fútbol · Camino de la Vega 1 @ 40.695747, −3.517540** | **Verify public access / parking** |
| Finale | American Ribs · Pl. José Antonio 5 @ 40.696003, −3.513482 | Sunday 20 Dec lunch hours + reserve 7 @ ~14:30 |

## Privacy notes

- Optional selfies stay on the phone — there is no upload backend.  
- Bride progress is stored only in that browser’s `localStorage`.  
- Amigas unlock is also `localStorage` on that device.
