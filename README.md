# fun-printer

Reverse-Engineering & Dokumentation der Druckfunktion der Android-App
**Fun Print 8.10.13** (`com.fun.mxw`) für kleine chinesische Bluetooth-
Thermoprinter – als Basis für eine **alternative Oberfläche**.

→ **Start hier: [`docs/README.md`](docs/README.md)** (Schnellübersicht + Index)

## Struktur

```
docs/       Technische Dokumentation (Protokolle, Transport, Bildpipeline, …)
analysis/   Beweisstücke: dekompilierte Java-Klassen + formatierte JS-Module
notes/      Arbeitsnotizen: Methodik, Grenzen, offene Punkte
external/   Original-XAPK (nicht im Git)
extracted/  Entpacktes XAPK (nicht im Git)
```

## Reproduktion

```bash
# 1. XAPK entpacken
unzip external/com.fun.mxw-8.10.13.xapk -d extracted/

# 2. uni-app-Bundle in Module zerlegen
node analysis/extract-modules.js          # → analysis/modules/ (1303 Dateien)

# 3. DEX dekompilieren (jadx ≥ 1.5)
jadx --no-res --no-debug-info -d /tmp/jadx-out extracted/com.fun.mxw.apk
```

## Status

- [x] XAPK entpackt, Integrität geprüft (12 korrupte Bild-Assets, unkritisch)
- [x] App-Architektur (uni-app + Native-Plugins) identifiziert
- [x] Bluetooth-Transporte (SPP, BLE-UUIDs, Chunking, Flow-Control) dokumentiert
- [x] Druck-Protokolle (5178, ESC-y, 2221, 55AA, 5688, V5M) rekonstruiert
- [x] Bild-Pipeline (OpenCV, Dithering, Encoder) dokumentiert
- [ ] Live-Verifikation am Gerät (BLE-Sniff) – offen
- [ ] Alternative Oberfläche – geplant (Basis: Dok 09)
