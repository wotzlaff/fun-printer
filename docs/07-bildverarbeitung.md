# 07 – Bildverarbeitung & Encoder

Zuständig: `models/opencv.js` (`0a9f.js`) orchestriert; nativ
`com.xyz.yintibao.OpencvUtilsWXModule` (uni-Plugin-Name **„ImageProcess“**)
mit OpenCV. Die Haupteintrittsfunktion ist `ImageProcess.hex({...})`.

## Eingabeparameter (Auswahl, `0a9f.js` Aufruf)

```js
uni.requireNativePlugin("ImageProcess").hex({
  image_path, model,          // z. B. "gt01", "v5", "v7s", "v5x" (kleingeschrieben)
  print_mode,                 // "image" (Foto) | "text" (Text/Doku) | "label_text" | "landscape"
  scale, left, top, rotate,   // Geometrie
  binaryValue: 170,           // Binärschwelle (Default 127 im Native)
  modified_px,                // Zielbreite in px (384/576/832/…)
  print_speed: 10,            // Speed-Parameter (BLE: Paketintervall)
  blePrexName,                // Boardname: GT01/GT02/MX01/… (Encoder-Auswahl)
  print_quelity,              // 3 (V5G-Qualität) oder 0
  energy: 12000,              // Verbrennungsenergie (AF/F2-Kommando)
  is_gray_print, gammaHandle, convertTo16, …
}, callback)                   // callback({code, hex, image?, black_dot?, white_dot?})
```

## Pipeline (nativ, `hex()`-Bytecode + Hilfsfunktionen)

1. **Laden**: OpenCV `Imgcodecs.imread` → `cvtColor` (RGB) → Bitmap.
2. **Geometrie**: `rotateBitmap2` (deg), `resize` auf `modified_px × scale`,
   Zuschnitt/Platzierung (`getScaleBitmap`, `addTopRightBorder`,
   `cropImageOutMaxHeight`, `handlerForV10GManHeight` für Mindesthöhe 2200).
3. **Schwarz-Weiß** je nach `print_mode`:
   - `image` → **Floyd-Steinberg/Sierra-Dithering**
     (`getFlyodBitmapNew`, `SierraDithering`, `errorDiffusion`)
   - `text` → **adaptive Schwelle** (`adaptiveThreshold`, `adaptiveThresholdNew`,
     OpenCV `Imgproc.adaptiveThreshold`-Äquivalent)
   - `label_text` → **feste Schwelle** (`fixedThreshBinary(bitmap, 170, …)`)
   - Gray-Druck: `RGB2Gray(r,g,b) = 0.299 r + 0.587 g + 0.114 b`
4. **Encoding** je Modell (Dispatch im Bytecode von `hex()`):

| Modell (lowercase) | Encoder-Funktion | Format |
|---|---|---|
| `v5g`, Boards GT01/GT02/MX01/MX02… | `getBitMapHex_v5g` → `V5g.getPrintData` | 5178-Zeilenframes (Dok 04) |
| `v5x` | `getBitMapHex_v5x` | 2221-Frames (Dok 06) |
| `v10g` | `getBitMapHexV10g` | `1B 23 21`-Header + zlib-Raster |
| `v10` | `getBitMapHex_v10` | 1D 82, 216 B/Zeile |
| `v5m` | `getBitMapHex_v5m` | 55/5A 04-Frames |
| `v7s`, `v7spro`, `v6`, `v6pro` | `getBitMapHex_v7s` | GS v 0 |
| `v8`, `v8pro` | `getBitMapHex_v8` | 1D 82, 104/160 B/Zeile |
| `v5`, `v5pro`, `v5n`, `v5npro`, `v7`, `v7pro` | `getBitMapHex` | ESC * 24-Dot |
| `v8s`, `v8spro` | `v8sPrintImage` (separates Vson-Plugin) | plugin-intern |
| P7-Modelle | JS setzt `p7_print_image` → `wtr_printer.print()` | Plugin `YtbWeiTeRuiModule` |

5. **Rückgabe**: `{code: 0, hex: "<HEX-String>", black_dot, white_dot, heigthIsCuted?}`
   – der Hex-String enthält bereits die protokolltypischen Prefixe
   (z. B. `5178A10002003000F9FF` im V5G-Fall; die JS-Schicht entfernt doppelte
   Prefixe: `e.replace("5178A10002003000F9FF5178A10002003000F9FF", "5178A10002003000F9FF")`).

## JS-Nachbearbeitung (`0a9f.js` nach dem Native-Callback)

Je nach Modell werden Protokoll-Header/Tail ergänzt (Details in Dok 04–06), z. B.:

- **V5G**: `<F2 Dichte>` + `<A3 Status>` + Hex + `<A3 Status>`; YT*-Tail
  `5178A1000200380051FF`
- **V7S/V7SPRO**: `1D 49 F0 <density>` Präfix, `+ "0A0A0A0A"` Tail
- **V5/V7-Familie (BLE)**: `1B 40 12 23 <density>` Präfix (Dichte 0x05/0x0A/0x0D/0x0F)
- **V8/V8PRO**: `1D 83 03` Präfix; **V10**: Suffix `1D 83 03 1B 64 60`
- **V6/V6PRO**: Suffix `1B 64 04`/`1B 64 06`
- **X5**: `1B 37 09 00 CC` Präfix (Android) / `1B 40 12 23 0F 1B 33 00` (iOS)
- **V5X**: Start-Header (Dok 06) + Bildkörper ab Offset 20 (Hex-Zeichen)

## Dichte-/Energiesteuerung pro Gerät (JS, `0a9f.js`)

Qualitätsstufen „05“ (hell), „0A“ (mittel), „0D“ (dunkel), „0F“ (custom):

| Stufe | Text: C=energy, N=… | Bild: C=energy, N=… |
|---|---|---|
| 05 | C=3, N=100 (MX07 70 / MX08 50 / MX09 130) | C=3, N=90 (MX05/MX06 150, MX08 60, MX09 130) |
| 0A | C=4, N=130 (MX07 90 / MX08 70 / MX09 150) | C=4, N=110 (MX05/MX06 180, MX08 90, MX09 150) |
| 0D | C=5, N=150 (MX07 110 / MX08 100 / MX09 200) | C=4, N=130 (MX05/MX06 200, MX08 110, MX09 200) |
| 0F | C=4, N=15e3 + Custom-Wert | dito |

Für MX05–MX13/PD01/… wird die Dichte als `5178F2`-Frame mit
`crc8([0x01, <energy>])` gesendet (Wertebereich 1–200). Bei Serien-/Mehrfachdruck
und heißen Köpfen regelt die JS-Logik die Dichte dynamisch zurück
(`mx10_serial_nongdu`, `pd01_nongdu`, Schwellen: Kopf-Temperatur ≥ 50, letzte
Druckzeit < 50 s; Min-Dichte 95 bzw. 70–150-Korridor bei D2-Boards).

`PrinterModel.java`-Gerätekonstanten (GT01/GT02/MX02/MX03):
`imgPrintSpeed 55`, `textPrintSpeed 45`, `imgMTU 123`, `textMTU 83`,
`paperNum 2`, `interval 4`, `devdpi 200`, `hasId true`, `newCompress true`;
Energie: GT01/GT02 8000–12000, MX02/MX03 20000.
