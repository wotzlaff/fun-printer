# Fun Printer – Web App

Standalone React UI for the MX10 thermal printer (and compatible "51 78" boards).
Pure client-side: printing runs over **Web Bluetooth**, no backend.

## Requirements

- **Chrome or Edge** (desktop or Android) – Web Bluetooth only exists there;
  Safari/iOS and Firefox do not work.
- **HTTPS or localhost** (Web Bluetooth requirement).
- The printer must be turned on and in pairing range.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run test       # protocol unit tests (23 checks incl. live-capture CRCs)
npm run build      # production build → dist/
```

## Features (v1: photo printing)

- Connect via the browser device picker (name-prefix filter for the documented
  printer name list)
- Device panel: firmware version, head temperature, printer status, flow-control
  state — updated from live notifications + 2 s status polling
- Image → scale to 384 px → **live 1 bpp preview** (pixel-exact, same raster the
  head prints) with Floyd–Steinberg or fixed-threshold dithering
- Density slider 1–200 (sent as the `F2` frame; the printer auto-reduces when hot)
- Print with real packet progress (`X/Y`) and pause display on flow control

## Architecture (multi-file, layered)

```
src/
├── protocol/     Wire protocol — port of analysis/reference-encoder.py
│   ├── crc8.ts        CRC-8 (poly 0x07) — verified against live captures
│   ├── frames.ts      Frame builder + RX stream scanner (both wire layouts)
│   ├── printJob.ts    Complete job: F2→A3→A4→A6→AF→BE→BD×2→A2×H→A1→A6→A3
│   ├── status.ts      A3/A8/AE response decoding
│   └── frames.test.ts Unit tests (examples from docs/04 + live MX10 capture)
├── transport/    Web Bluetooth
│   ├── bluetooth.ts   Service/characteristic discovery, notify handling,
│   │                  status polling, adaptive writes (240-B chunks)
│   ├── writeQueue.ts  Flow-controlled packet queue (pause/resume via AE)
│   └── printerInstance.ts  App-level singleton wired to the store
├── imaging/      Canvas image processing (luma, Floyd–Steinberg, 1 bpp rows)
├── state/        Minimal custom store (useSyncExternalStore)
├── i18n/         DE/EN dictionaries + tiny provider
└── components/   ConnectionPanel, ImagePanel (preview, density, print controls)
```

Defaults (density 200, energy 15000, speed 10, quality 4, one 48-dot feed)
follow the **live-verified MX10 capture** — see
[docs/04-protocol-5178.md](../docs/04-protocol-5178.md), "Live verification".

## Deliberately out of scope (v1)

- Text/label printing, label editor, positioning commands (docs/06)
- Firmware update (risky, little value)
- Cloud features of the original app (AI/OCR/telemetry) — printing is fully local
