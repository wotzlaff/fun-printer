# 02 – Geräte- und Modellmatrix

Die App erkennt den Drucker anhand des **Bluetooth-Gerätenamens** (`get_printer_model`,
Modul `a061.js` = `common/ytb.js`, Zeile ~836) und wählt daraus Transport + Protokoll.
Namenslisten in Modul `11c6.js` und `4bd5.js` bzw. `e289.js`/`1ddb.js`.

## Identifikationshilfe für das eigene Gerät

1. Bluetooth-Namen des Druckers notieren (in Android-BT-Einstellungen sichtbar).
2. Namen normalisieren: Großbuchstaben, Leerzeichen entfernen (`e.toUpperCase().replace(/\s+/g,"")`).
3. In der Tabelle unten suchen. Typische Minidrucker-Namen: `GT01`, `MX01`, `MX02`,
   `MXW009`, `MXW010`, `YT01`, `MINI PRINTER`, `BQ01` …
4. Die App-Version im XAPK-Dateinamen (hier MXW-Build) passt zu Gerätenamen mit
   `MX*`-Präfix; der Build unterstützt aber fast alle Familien.

## Modell-Erkennung (Reihenfolge aus `a061.js`)

| Bedingung (normalisierter Name) | Modell | Hinweis |
|---|---|---|
| `JXPRINTER*` / `PRINTER-*` | V10 | nur in 印题宝-Variante |
| `FYT2*` | X5 | |
| enthält `#` und Länge 18 | V8SPRO | Name enthält MAC |
| `YINTIBAO-V8SPRO` / `YINTIBAO-V8S` | V8SPRO / V8S | |
| `P4*` / `BAYPAGE*` | V8SJP | |
| `JX400R06P*` | V8PRO | |
| `JX400R*` | V8 | |
| `YINTIBAO` / `PAPERGO` | V6 | |
| Name ∈ TWO_INCH_203_BLE_NAME (`YINTIBAO-V5`, `P100`, `MP100`, `MP200`, `MP220` ± `-LE`) | V5 | 2″, 203 dpi, 384 px |
| ∈ NEW_TWO_INCH_203_BLE_NAME (`LP100`, `LY100_BLE`, `LP220` ± `-LE`) | V5N | |
| ∈ TWO_INCH_304_BLE_NAME (`YINTIBAO-V5PRO`, `P100S`, `MP100S`, `MP200S`, `MP220S` ± `-LE`) | V5PRO | 2″, 304 dpi, 576 px |
| ∈ NEW_TWO_INCH_304_BLE_NAME (`LP100S`, `LP220S` ± `-LE`) | V5NPRO | |
| ∈ THREE_INCH_203_BLE_NAME (`P3`, `MP300` ± `-LE`) | V7 | 3″, 203 dpi, 576 px |
| ∈ THREE_INCH_304_BLE_NAME (`P3S`, `MP300S` ± `-LE`) | V7PRO | 3″, 304 dpi, 832 px |
| ∈ `V5G_LIST` | V5G | wenn BLE-Adresse auf `59` endet → V5X_S |
| ∈ `V5X_LIST` | V5X | Labeldrucker |
| `AEQ918N4` | V5 | |
| ∈ {`C21`,`D1`,`D2`,`E2`,`NEWSMY`} | DCK | 55-AA-Protokoll |
| ∈ {`GB01`,`GB02`,`GB03`,`YT01`,`YT02`,`X5`,`X6`,`X7h`,`YHK`,`Paperang`,`M02A`,`M02S`,`M02 pro`,`M03A`,`M04AH`,`M04S`,`M04AS`,`BUXIAODING`,`Buding-B3`,`TP6-S`,`peripage`} | V10G | |
| `YTB01` | V5C | 56-88-Protokoll |
| beginnt mit `58P7_`, `15P1_`, `58D3_`, `A47`, `A55`, `15P3_`, `A42`, `A55Pro`, `A41` | P7 | A4/Weiturui-Familie |

**BLE-Minidrucker-Sondernamen** (werden über die V5G-Codepfade geführt und intern auf
`GT01`/`GT02`/`MX01`-Boards abgebildet, Modul `1ddb.js`/`e289.js`):
`GT01, YT01, YT02, MX01, MX02, MX03, MX05, MX06, MINI PRINTER, MX07, MX09, C21,
NEWSMY, D1, D2, E2, JL-BR22, MX08, URBANWORX KIDS CAMERA, CYLO BT PRINTER,
MXTP-100, AZ-P2108X, MX10, MX11, MX12, PD01, XO POPPY, MX13, BQ01, BQ02,
EWTTO ET-Z0499, MXW009, MXW010, GV-MA211, KP-IM606, BQ03, BQ17, IM.17`
(Modul `c543.js`; Erweiterungen in `1ddb.js`: `BQ05…BQ96`, `MINISO-M1/M12`,
`LP212`, `MXPC-100`, `BH03`, `PD03`, `BHSZY`, `EWTTO ET-N3687/3689`).

## Matrix: Modell → Transport → Druckformat → Druckbreite

| Modell | Transport (Android) | Rasterformat | Breite (px) | dpi |
|---|---|---|---|---|
| GT01/GT02/MX01/MX02 (5178-Board) | BLE (`Ytbbluetooth`) | `51 78`-Zeilenframes, LSB-first | 384 | 200 |
| MX03 | BLE | dito | 576 | 200 |
| MXW010 | BLE | dito + `51 78 D0`-Präfix, Gray via `getMXW010GrayHex` | 384 | 200 |
| V5 / V5N | BLE via `AutoPrinterV5`-Plugin bzw. BLE-Modul | `ESC * 0x21` 24-Dot-Bänder + `ESC 3 0x0A` + `ESC d 4` | 384 | 203 |
| V5PRO / V5NPRO | dito | dito, End-Feed `ESC d 6` | 576 | 304 |
| V7 / V7PRO | dito | dito, Top-Offset 30/38 | 576 / 832 | 203/304 |
| V6 / V6PRO | **SPP** | `GS v 0`-Encoder (`getBitMapHex_v7s`) + End-Feed `ESC d 4/6` | 576 | – |
| V7S / V7SPRO | **SPP** | `GS I 0xF0 <density>`-Präfix + `GS v 0` + 4× Leerband (`0ef3.js`) | 576 | 200/300 |
| V8 / V8PRO | **SPP** | `1D 82 30 00 68 00` + Zeilen zu 104 B gepolstert | 832 | – |
| V10 | **SPP** | `1D 82 30 00 D8 00` + Zeilen zu 216 B gepolstert, Suffix `1D 83 03 1B 64 60` | 1728 | – |
| V8SJP | **SPP** | V7-Encoder + Suffix `ESC d 3` | – | – |
| X5 | **SPP** | Präfix `1B 37 09 00 CC` + V5-Encoder | – | – |
| V8S / V8SPRO | Plugin `Vsonprinter` | `v8sPrintImage` (Plugin-seitig) | 1280 (V8SPRO) | 300 |
| V5X / V5X_S / BH03/PD03 | BLE | `22 21`-Frames (Dot) bzw. Gray+Kompression | ~295–378 je Papier | 200 |
| V5G (Labelmodus) | BLE | `51 78`-Frames + Positionierungs-Kommandos | je Label | 200 |
| V5C (YTB01) | BLE | `bq95V2DotHex`-Familie | – | – |
| V10G (Paperang M02-Familie u. a.) | BLE | `1B 23 21`-Header + **zlib-komprimiertes** Raster | – | – |
| V5M (Paperang M02?) | BLE | `55`/`5A 04`-Frames | – | – |
| DCK (C21/D1/D2/E2/NEWSMY) | BLE | `55 AA`-Frames (Modul `7869.js`) | – | – |
| P7 (A47/A55/58P7_…) | Plugin `YtbWeiTeRuiModule` | `printBitmap`-Aufruf im Plugin, dpi 200/300, Paketpause 60 ms | 1600 max. A4 | 200/300 |

Breiten aus: `0a9f.js` (v5: 384, v5pro: 576, v7: 576, v7pro: 832), `a061.js`
(V6PRO: `model_img_width=576`), `d51f.js` (864 → P3S, 576 → V5), `8588.js`
(1280 → V8SPRO), `PrinterModel.java` (GT01 384, MX03 576), `getBitMapHex_v8/_v10`
(Polsterbreite 104/160/216 Bytes ⇒ 832/1280/1728 px).

## Label-Maße (V5X/V5G-Label, `0a9f.js`)

Breite in Pixel = `floor(mm / 25.4 × 200 × f)` mit Korrekturfaktor f = 0.95–0.99
je Papier-/Gerätetyp (z. B. 40 mm → ~295–312 px). Rahmendaten (rightBorder/topBorder)
pro Gerät in `m()`/`b()` von `0a9f.js`.
