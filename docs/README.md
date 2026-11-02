# Fun Print (com.fun.mxw) – Technische Analyse der Druckfunktion

Reverse-Engineering der Android-App **Fun Print 8.10.13** (`com.fun.mxw-8.10.13.xapk`)
für kleine chinesische Bluetooth-Thermoprinter. Ziel: alle technischen Details der
Druckfunktion (Bluetooth-Transport, Protokolle, Bildkonvertierung) so dokumentieren,
dass eine **alternative Oberfläche** (eigene App) entwickelt werden kann.

## Schnellübersicht (TL;DR)

| Thema | Kurzfassung |
|---|---|
| App-Typ | uni-app (DCloud/HBuilderX) + Weex-Runtime; App-Logik in `app-service.js` (30 MB Webpack-Bundle) |
| Hersteller/Cloud | YinTiBao (yintb.com) – eine Codebasis für mehrere White-Labels (Fun Print, 印题宝, iBleem, 喵学王, FriendAI) |
| Drucker-Familien | Minidrucker (BLE, proprietäres `51 78`-Protokoll), Fotodrucker (Bluetooth Classic SPP, ESC/POS-artig), Labeldrucker (`22 21`-Protokoll), A4-Drucker (native Plugins), WiFi-Drucker (TCP 8081) |
| BLE-Transport | Service `0000FF00-…` (Write `FF02` ohne Response, Notify `FF01`/`FF03`), alternativ `0000AE30-…` und `0000200A-…`; MTU-Anforderung 82/503 |
| SPP-Transport | UUID `00001101-0000-1000-8000-00805F9B34FB`, `createInsecureRfcommSocketToServiceRecord` (Android, via `plus.android`-Bridge aus JS) |
| Druckdaten | 1bpp-Raster (schwarz=1). Pro Familie: `51 78`-Zeilenframes (Minidrucker), `ESC * 0x21` 24-Dot-Bänder (V5/V7), `GS v 0` (V7S), `1D 82`-Raster (V8/V10), `22 21`-Frames (V5X-Label) |
| CRC | CRC-8, Polynom 0x07, Init 0x00 („CRC-8/ATM“), über den Payload, vor `0xFF`-Terminator |
| Flow-Control | Drucker sendet Pause/Resume-Notify (`…AE01010010 70 FF` = Stopp, `…AE01010000 00 FF` = weiter); Native-Seite pausiert die Write-Queue |
| Bild-Pipeline | OpenCV: skalieren/rotieren → Dithering (Floyd/Sierra) für Fotos bzw. adaptive Schwelle für Text → Encoder pro Modell → Hex-String → gechunkter BLE/SPP-Write |

## Dokumentation

1. [App-Überblick & Architektur](01-app-ueberblick.md)
2. [Geräte- und Modellmatrix](02-geraete-und-modelle.md)
3. [Bluetooth-Transport (SPP + BLE)](03-transport-bluetooth.md)
4. [Protokoll „51 78“ – BLE-Minidrucker](04-protokoll-5178.md)
5. [Protokolle „ESC/POS-artig“ – SPP-Fotodrucker](05-protokoll-escpos-spp.md)
6. [Protokolle Label & Sonstige (22 21 / 55 AA / 56 88)](06-protokoll-label-sonstige.md)
7. [Bildverarbeitung & Encoder](07-bildverarbeitung.md)
8. [End-to-End-Druckablauf](08-druckablauf.md)
9. [UI-Beobachtungen der Original-App (Basis fürs Redesign)](09-ui-beobachtungen.md)

## Beweisstücke

- `analysis/decompiled/` – die entscheidenden, mit jadx dekompilierten Java-Klassen
  (u. a. `V5g.java` = kompletter 5178-Encoder, `OpencvUtilsWXModule.java` = Bildpipeline,
  `ytbBleFastV3Module.java` = BLE-Stack, `FlowWrite.java` = Chunking/Flow-Control)
- `analysis/*.js` – die relevanten, formatierten Webpack-Module aus `app-service.js`
  (Dateinamen = Webpack-Modul-ID; Originalpfade stehen in den `at …`-Logstrings,
  z. B. `0774.js` = `models/printer/android.js`)
- `analysis/page-paths.json` – alle 154 Seiten der Original-App
- `analysis/extract-modules.js` – Skript zum Zerlegen des Bundles

> ⚠️ Die dekompilierten Quellen sind urheberrechtlich geschütztes Material des
> App-Herstellers und nur für private Interoperabilitätsanalyse vorgesehen.
> Sie dienen als Nachweis (Evidence) und dürfen nicht in einem abgeleiteten
> Produkt weiterverwendet werden.

## Offene Punkte / Grenzen

Siehe [notes/analyse-notizen.md](../notes/analyse-notizen.md): Statisch analysiert;
kein Laufzeit-Mittmessen am echten Gerät. Die Zuordnung „welcher Drucker genau“
hängt vom Bluetooth-Namen des eigenen Geräts ab (Identifikationshilfe in
[Dok 02](02-geraete-und-modelle.md)).
