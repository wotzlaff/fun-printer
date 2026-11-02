# Fun Printer – Web App

Standalone React UI for the MX10 thermal printer (and compatible "51 78" boards).
Pure client-side: printing runs over **Web Bluetooth**, no backend.

**Live (GitHub Pages):** <https://wotzlaff.github.io/fun-printer/>
(deployed automatically on every push to `main` via the Actions workflow; the
workflow also runs the protocol test suite before deploying)

## Requirements

- **Chrome or Edge** (desktop or Android) – Web Bluetooth only exists there;
  Safari/iOS and Firefox do not work.
- **HTTPS or localhost** (Web Bluetooth requirement) – the Pages URL satisfies this.
- The printer must be turned on and in pairing range.
- On Android: location services must be on, or Chrome finds no BLE devices.

## Features

### Photo tab
- Image → rotate (90° steps), fit mode (contain/cover/stretch) → scale to 384 px
- **Live 1 bpp preview** (pixel-exact, same raster the head prints)
- Tone stage: gamma (default 2.0 — thermal paper needs darkening), contrast,
  brightness
- Raster modes: Floyd–Steinberg, fixed threshold (170, as the original app),
  **grayscale (experiment)** — 8-bit gray rows instead of dithering
- Density slider 1–200 (`F2` frame) + quality level 1–5 (`A4` frame)
- Copies 1–10 with automatic feed between copies

### Text tab
- Textarea → word-wrapped rendering → crisp threshold rasterization → print

### Label tab
- Label widths 20/25/30/40/50 mm (200 dpi, 0.95 correction factor)
- Title + body lines + optional QR code
- ⚗ **Black-mark positioning** (experimental): measure loop with `A1 0004`/`A3`
  until the mark reports 0, then print at position; next-label feed between copies

### History tab
- Every successful print is stored in IndexedDB (lines + settings + thumbnail)
- Reprint with one click (restores the stored settings), or load its settings

### Connection panel
- Device picker (name-prefix filter), firmware + head temperature + status
  (paper/heat/battery), flow-control state
- Manual paper feed button
- Settings persist in localStorage per device (density/tone/quality/dither)

### PWA
- Installable (Android home screen / desktop install), offline-capable
  (service worker precaches the app shell; printing naturally needs the printer)

## Architecture (multi-file, layered)

```
src/
├── protocol/     Wire protocol — port of analysis/reference-encoder.py
│   ├── crc8.ts        CRC-8 (poly 0x07) — verified against live captures
│   ├── frames.ts      Frame builder + RX stream scanner (16-bit LEN + both
│   │                  wire layouts, CRC-validated, resyncing)
│   ├── printJob.ts    Complete job: F2→A3→A4→A6→AF→BE→BD×2→A2×H→A1→A6→A3
│   └── status.ts      A3/A8/AE response decoding
├── transport/    Web Bluetooth
│   ├── bluetooth.ts   Service/characteristic discovery, notify handling,
│   │                  status polling, copies, label positioning, feed
│   ├── writeQueue.ts  Flow-controlled packet queue (pause/resume via AE)
│   └── printerInstance.ts  App-level singleton wired to the store
├── imaging/      raster (luma/dither/fit/rotate), textRender, labelRender,
│                 grayPrint — plus tests for the pure parts
├── state/        custom store, localStorage persistence, IndexedDB history
├── i18n/         DE/EN dictionaries + tiny provider
└── components/   ConnectionPanel, PhotoPanel, TextPanel, LabelPanel, HistoryPanel
```

Defaults (density 200, energy 15000, speed 10, quality 4, one 48-dot feed)
follow the **live-verified MX10 capture** — see
[docs/04-protocol-5178.md](../docs/04-protocol-5178.md), "Live verification".

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run test       # 34 protocol/imaging tests incl. live-capture CRCs
npm run build      # production build + service worker (CI=true → base /fun-printer/)
```

### Pages deployment

The workflow `.github/workflows/deploy-pages.yml` builds and deploys on every
push to `main`. One-time setup (repo owner):
Settings → Pages → Build and deployment → **Source: GitHub Actions**.

## Known open points

- Black-mark positioning is implemented from the documented flow (docs/06) but
  not yet verified on the real device — feedback welcome.
- Grayscale print is an experiment: the original hardcodes a suspicious header
  ("5178A2003000", LEN=48) for gray lines; we send the true LEN (= width bytes).
  Compare both on paper and tell us which your board prefers.
- D3 response semantics (grows during printing) remain unresolved.
