# 07 – Image Processing & Encoders

Responsible: `models/opencv.js` (`0a9f.js`) orchestrates; natively
`com.xyz.yintibao.OpencvUtilsWXModule` (uni plugin name **"ImageProcess"**)
with OpenCV. The main entry function is `ImageProcess.hex({...})`.

## Input parameters (selection, `0a9f.js` call)

```js
uni.requireNativePlugin("ImageProcess").hex({
  image_path, model,          // e.g. "gt01", "v5", "v7s", "v5x" (lowercase)
  print_mode,                 // "image" (photo) | "text" (text/docs) | "label_text" | "landscape"
  scale, left, top, rotate,   // geometry
  binaryValue: 170,           // binarization threshold (native default 127)
  modified_px,                // target width in px (384/576/832/…)
  print_speed: 10,            // speed parameter (BLE: packet interval)
  blePrexName,                // board name: GT01/GT02/MX01/… (encoder selection)
  print_quelity,              // 3 (V5G quality) or 0
  energy: 12000,              // burn energy (AF/F2 command)
  is_gray_print, gammaHandle, convertTo16, …
}, callback)                   // callback({code, hex, image?, black_dot?, white_dot?})
```

## Pipeline (native, `hex()` bytecode + helper functions)

1. **Load**: OpenCV `Imgcodecs.imread` → `cvtColor` (RGB) → bitmap.
2. **Geometry**: `rotateBitmap2` (deg), `resize` to `modified_px × scale`,
   crop/placement (`getScaleBitmap`, `addTopRightBorder`,
   `cropImageOutMaxHeight`, `handlerForV10GManHeight` for minimum height 2200).
3. **Black & white** depending on `print_mode`:
   - `image` → **Floyd–Steinberg/Sierra dithering**
     (`getFlyodBitmapNew`, `SierraDithering`, `errorDiffusion`)
   - `text` → **adaptive threshold** (`adaptiveThreshold`, `adaptiveThresholdNew`,
     OpenCV `Imgproc.adaptiveThreshold` equivalent)
   - `label_text` → **fixed threshold** (`fixedThreshBinary(bitmap, 170, …)`)
   - gray printing: `RGB2Gray(r,g,b) = 0.299 r + 0.587 g + 0.114 b`
4. **Encoding** per model (dispatch in the bytecode of `hex()`):

| Model (lowercase) | Encoder function | Format |
|---|---|---|
| `v5g`, boards GT01/GT02/MX01/MX02… | `getBitMapHex_v5g` → `V5g.getPrintData` | 5178 line frames (Doc 04) |
| `v5x` | `getBitMapHex_v5x` | 2221 frames (Doc 06) |
| `v10g` | `getBitMapHexV10g` | `1B 23 21` header + zlib raster |
| `v10` | `getBitMapHex_v10` | 1D 82, 216 B/line |
| `v5m` | `getBitMapHex_v5m` | 55/5A 04 frames |
| `v7s`, `v7spro`, `v6`, `v6pro` | `getBitMapHex_v7s` | GS v 0 |
| `v8`, `v8pro` | `getBitMapHex_v8` | 1D 82, 104/160 B/line |
| `v5`, `v5pro`, `v5n`, `v5npro`, `v7`, `v7pro` | `getBitMapHex` | ESC * 24-dot |
| `v8s`, `v8spro` | `v8sPrintImage` (separate Vson plugin) | plugin-internal |
| P7 models | JS sets `p7_print_image` → `wtr_printer.print()` | plugin `YtbWeiTeRuiModule` |

5. **Return**: `{code: 0, hex: "<HEX string>", black_dot, white_dot, heigthIsCuted?}`
   – the hex string already contains the protocol-typical prefixes
   (e.g. `5178A10002003000F9FF` in the V5G case; the JS layer deduplicates:
   `e.replace("5178A10002003000F9FF5178A10002003000F9FF", "5178A10002003000F9FF")`).

## JS post-processing (`0a9f.js` after the native callback)

Depending on the model, protocol headers/tails are added (details in Doc 04–06), e.g.:

- **V5G**: `<F2 density>` + `<A3 status>` + hex + `<A3 status>`; YT* tail
  `5178A1000200380051FF`
- **V7S/V7SPRO**: `1D 49 F0 <density>` prefix, `+ "0A0A0A0A"` tail
- **V5/V7 family (BLE)**: `1B 40 12 23 <density>` prefix (density 0x05/0x0A/0x0D/0x0F)
- **V8/V8PRO**: `1D 83 03` prefix; **V10**: suffix `1D 83 03 1B 64 60`
- **V6/V6PRO**: suffix `1B 64 04`/`1B 64 06`
- **X5**: `1B 37 09 00 CC` prefix (Android) / `1B 40 12 23 0F 1B 33 00` (iOS)
- **V5X**: start header (Doc 06) + image body from offset 20 (hex chars)

## Print darkness (practical note, partially observed)

- The JS wrapper passed **`binaryValue: 170`** to the native encoder (threshold
  170, not 128!) – anything below 170 becomes black, so prints come out darker.
  A naive 128 threshold prints visibly lighter on thermal paper.
- The native side has a **gamma handling path** (`is_use_gamma_handle`,
  `gammaHandle` flag, `gamma(Mat, float)`) – the original app darkened midtones
  before dithering on capable boards.
- The web app therefore applies **gamma 2.0 by default** (user-adjustable 1–3,
  plus contrast/brightness sliders) before Floyd–Steinberg, and uses threshold
  170 in threshold mode.

## Density/energy control per device (JS, `0a9f.js`)

Quality levels "05" (light), "0A" (medium), "0D" (dark), "0F" (custom):

| Level | Text: C=energy, N=… | Image: C=energy, N=… |
|---|---|---|
| 05 | C=3, N=100 (MX07 70 / MX08 50 / MX09 130) | C=3, N=90 (MX05/MX06 150, MX08 60, MX09 130) |
| 0A | C=4, N=130 (MX07 90 / MX08 70 / MX09 150) | C=4, N=110 (MX05/MX06 180, MX08 90, MX09 150) |
| 0D | C=5, N=150 (MX07 110 / MX08 100 / MX09 200) | C=4, N=130 (MX05/MX06 200, MX08 110, MX09 200) |
| 0F | C=4, N=15e3 + custom value | ditto |

For MX05–MX13/PD01/… the density is sent as a `5178F2` frame with
`crc8([0x01, <energy>])` (value range 1–200). For series/multiple printing and
hot heads, the JS logic dynamically reduces the density (`mx10_serial_nongdu`,
`pd01_nongdu`; thresholds: head temperature ≥ 50, last print < 50 s ago; min
density 95 or a 70–150 corridor on D2 boards).

`PrinterModel.java` device constants (GT01/GT02/MX02/MX03):
`imgPrintSpeed 55`, `textPrintSpeed 45`, `imgMTU 123`, `textMTU 83`,
`paperNum 2`, `interval 4`, `devdpi 200`, `hasId true`, `newCompress true`;
energy: GT01/GT02 8000–12000, MX02/MX03 20000.
