# Analyse-Notizen (Methodik, Grenzen, offene Punkte)

## Arbeitsumgebung & Methodik

1. **XAPK entpackt** (`unzip`) → `extracted/` (nicht im Git, 206 MB).
   - `manifest.json` des XAPK = Paketdaten (App-Name, Version, Rechte, Splits).
   - Base-APK `com.fun.mxw.apk`: 7369 Member, 12 CRC-korrupt (nur Sticker-Assets).
2. **uni-app-Bundle extrahiert**: `analysis/extract-modules.js` führt
   `assets/apps/__UNI__573AE67/www/app-service.js` in einer Node-VM mit
   `webpackJsonp`-Stub aus und fängt das Modul-Map ab → 1303 Module als
   Einzeldateien. (Das Bundle selbst ist zu groß fürs Repo; Rekonstruktion über
   das Skript + XAPK.)
3. **Relevante Module identifiziert** via Suche nach
   `plus.android.importClass("android.bluetooth.…")`, `writeBLECharacteristicValue`,
   Hex-Kommandos (`1B79…`, `5178…`, `2221…`, `55AA…`) → 23 Module formatiert
   (`npx js-beautify`) und in `analysis/` eingecheckt.
4. **DEX dekompiliert**: jadx 1.5.4 (`--no-res --no-debug-info -j 6`) über das
   Base-APK → 11.699 Klassen; relevante Pakete:
   `com.xyz.yintibao.*` (Bild-Pipeline/Encoder, uni-Plugin „ImageProcess“),
   `com.wtx.ytbbleplugin.*` (uni-Plugin „Ytbbluetooth“, FastBLE).
   Die große `hex()`-Methode wurde nur als Bytecode-Dump dekompiliert
   (`--single-class … --comments-level debug`, liegt unter `/tmp/opencode/`);
   der Dispatch wurde aus dem Dump + JS-Wrapper rekonstruiert.
5. Dokumentation mit Beweisstellen: JS-Modul-ID (`0774.js` = original
   `models/printer/android.js`, sichtbar an den `at …`-Log-Strings) und
   Java-Klasse/Zeile.

## Alternative DEX-Analyse via REA (für spätere Vertiefung)

REA bietet Android-Tools (`inspect_android_package`, `inspect_android_method` …),
sie benötigen aber das bring-your-own JAR:

```bash
mkdir -p ~/.local/share/rea/android && cd ~/.local/share/rea/android
curl -fL -o jadx-headless-mcp-0.7.1-all.jar \
  https://github.com/1013503897/jadx-headless-mcp/releases/download/v0.7.1/jadx-headless-mcp-0.7.1-all.jar
echo '6e5eacf500b64292bfb73c49797c1958f6ee44646e43e868039ae7feb573ff75  jadx-headless-mcp-0.7.1-all.jar' | sha256sum -c -
# dann REA/MCP-Client neu starten mit REA_JADX_MCP_JAR=<absoluter Pfad>
```
(Quelle: `/tmp/rea-repo/docs/android-analysis.md`.) Der laufende REA-Prozess hat
die Variable beim Start gelesen – nach dem Setzen muss der MCP-Client neu
gestartet werden.

## Beobachtete Grenzen (offene Punkte)

- **Statisch, kein Laufzeit-Trace**: Alle Frames aus Code abgeleitet; ein
  BLE-Sniffer-Mitmjogging am realen Gerät (nRF Connect / HCI-Log) ist der
  nächste Verifikationsschritt, insbesondere:
  - exakte LEN-Feld-Deutung im 5178-Frame (A2-Zeilenframe „00 30 00“),
  - die CRC-Range je Kommando (Payload vs. Header inklusive),
  - A3-Antwortlayout (Positionen 4/10/12/14) am eigenen Gerät.
- **Eigenes Druckermodell unbekannt**: Die Zuordnung hängt vom BT-Namen ab
  (Dok 02). Der MXW-Build deutet auf MXW009/MXW010-Board hin; Name prüfen!
- **V8S/V8SPRO (Vson) und P7 (Weiturui)** drucken über geschlossene
  Plugin-Encoders (kein Hex-Format in JS sichtbar); DEX-Klassen existieren
  (`Vsonprinter`-Modul), aber nur für diese beiden Familien ist der Rasterpfad
  nicht vollständig aufgedröselt.
- **SN-Auth**: Manche Modelle prüfen die SN gegen das Backend (yintb.com);
  ob die Hardware selbst das erzwingt, ist unbekannt (vermutlich nein –
  die Prüfung ist App-seitig).
- **12 korrupte Assets** im XAPK (Sticker-Grafiken) – für Druck irrelevant.

## Gerätelisten (Kopie aus Modul `c543.js`, Stand 8.10.13)

```
GT01 YT01 YT02 MX01 MX02 MX03 MX05 MX06 "MINI PRINTER" MX07 MX09 C21 NEWSMY
D1 D2 E2 JL-BR22 MX08 "URBANWORX KIDS CAMERA" "CYLO BT PRINTER" MXTP-100
AZ-P2108X MX10 MX11 MX12 PD01 "XO POPPY" MX13 BQ01 BQ02 "EWTTO ET-Z0499"
MXW009 MXW010 GV-MA211 KP-IM606 BQ03 BQ17 IM.17
```
