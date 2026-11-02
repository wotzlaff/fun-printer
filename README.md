# fun-printer

Reverse engineering & documentation of the printing functionality of the Android app
**Fun Print 8.10.13** (`com.fun.mxw`) for small Chinese Bluetooth thermal printers –
as the basis for an **alternative UI**.

→ **Start here: [`docs/README.md`](docs/README.md)** (quick summary + index)

**Try the app:** <https://wotzlaff.github.io/fun-printer/>
(Chrome/Edge only – Web Bluetooth; deployed from `main` via Actions)

## Structure

```
docs/       Technical documentation (protocols, transports, image pipeline, …)
analysis/   Evidence: decompiled Java classes, formatted JS modules, tools
notes/      Working notes: methodology, sniff guide, open points
webapp/     Alternative UI: React + TypeScript + Vite (Web Bluetooth)
external/   Original XAPK (not in Git)
extracted/  Unpacked XAPK (not in Git)
```

## Reproduction

```bash
# 1. Unpack the XAPK
unzip external/com.fun.mxw-8.10.13.xapk -d extracted/

# 2. Split the uni-app bundle into modules
node analysis/extract-modules.js          # → analysis/modules/ (1303 files)

# 3. Decompile the DEX (jadx ≥ 1.5)
jadx --no-res --no-debug-info -d /tmp/jadx-out extracted/com.fun.mxw.apk
```

## Status

- [x] XAPK unpacked, integrity verified (12 corrupt image assets, non-critical)
- [x] App architecture (uni-app + native plugins) identified
- [x] Bluetooth transports (SPP, BLE UUIDs, chunking, flow control) documented
- [x] Print protocols (5178, ESC-y, 2221, 55AA, 5688, V5M) reconstructed
- [x] Image pipeline (OpenCV, dithering, encoders) documented
- [x] Reference encoder (`analysis/reference-encoder.py`) with CRC self-test
- [x] Device identified: **MX10** → V5G model, 5178 protocol, 384 px @ 203 dpi (Doc 02)
- [x] Live verification on the device: BLE sniff, all frames CRC-OK (Doc 04)
- [x] **Alternative UI: `webapp/`** – React + TypeScript + Vite, Web Bluetooth,
      DE/EN, photo printing with live 1 bpp preview (see `webapp/README.md`)
- [ ] On-device test of the web app (Chrome/Edge, HTTPS/localhost) – open
