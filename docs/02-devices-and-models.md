# 02 – Device & Model Matrix

The app identifies the printer by its **Bluetooth device name** (`get_printer_model`,
module `a061.js` = `common/ytb.js`, line ~836) and derives transport + protocol from it.
Name lists in modules `11c6.js` and `4bd5.js` or `e289.js`/`1ddb.js`.

## Identifying your own device

1. Note the printer's Bluetooth name (visible in Android BT settings).
2. Normalize the name: uppercase, strip spaces (`e.toUpperCase().replace(/\s+/g,"")`).
3. Look it up in the table below. Typical mini-printer names: `GT01`, `MX01`,
   `MX02`, `MXW009`, `MXW010`, `YT01`, `MINI PRINTER`, `BQ01` …
4. The app build in the XAPK file name (here the MXW build) matches devices named
   with an `MX*` prefix; the build supports nearly all families, though.

## Model detection (order from `a061.js`)

| Condition (normalized name) | Model | Note |
|---|---|---|
| `JXPRINTER*` / `PRINTER-*` | V10 | only in the 印题宝 variant |
| `FYT2*` | X5 | |
| contains `#` and length 18 | V8SPRO | name contains MAC |
| `YINTIBAO-V8SPRO` / `YINTIBAO-V8S` | V8SPRO / V8S | |
| `P4*` / `BAYPAGE*` | V8SJP | |
| `JX400R06P*` | V8PRO | |
| `JX400R*` | V8 | |
| `YINTIBAO` / `PAPERGO` | V6 | |
| name ∈ TWO_INCH_203_BLE_NAME (`YINTIBAO-V5`, `P100`, `MP100`, `MP200`, `MP220` ± `-LE`) | V5 | 2″, 203 dpi, 384 px |
| ∈ NEW_TWO_INCH_203_BLE_NAME (`LP100`, `LY100_BLE`, `LP220` ± `-LE`) | V5N | |
| ∈ TWO_INCH_304_BLE_NAME (`YINTIBAO-V5PRO`, `P100S`, `MP100S`, `MP200S`, `MP220S` ± `-LE`) | V5PRO | 2″, 304 dpi, 576 px |
| ∈ NEW_TWO_INCH_304_BLE_NAME (`LP100S`, `LP220S` ± `-LE`) | V5NPRO | |
| ∈ THREE_INCH_203_BLE_NAME (`P3`, `MP300` ± `-LE`) | V7 | 3″, 203 dpi, 576 px |
| ∈ THREE_INCH_304_BLE_NAME (`P3S`, `MP300S` ± `-LE`) | V7PRO | 3″, 304 dpi, 832 px |
| ∈ `V5G_LIST` | V5G | BLE address ending in `59` → V5X_S |
| ∈ `V5X_LIST` | V5X | label printer |
| `AEQ918N4` | V5 | |
| ∈ {`C21`,`D1`,`D2`,`E2`,`NEWSMY`} | DCK | 55-AA protocol |
| ∈ {`GB01`,`GB02`,`GB03`,`YT01`,`YT02`,`X5`,`X6`,`X7h`,`YHK`,`Paperang`,`M02A`,`M02S`,`M02 pro`,`M03A`,`M04AH`,`M04S`,`M04AS`,`BUXIAODING`,`Buding-B3`,`TP6-S`,`peripage`} | V10G | |
| `YTB01` | V5C | 56-88 protocol |
| starts with `58P7_`, `15P1_`, `58D3_`, `A47`, `A55`, `15P3_`, `A42`, `A55Pro`, `A41` | P7 | A4/Weiturui family |

**BLE mini-printer special names** (routed through the V5G code paths and mapped
internally to `GT01`/`GT02`/`MX01` boards, modules `1ddb.js`/`e289.js`):
`GT01, YT01, YT02, MX01, MX02, MX03, MX05, MX06, MINI PRINTER, MX07, MX09, C21,
NEWSMY, D1, D2, E2, JL-BR22, MX08, URBANWORX KIDS CAMERA, CYLO BT PRINTER,
MXTP-100, AZ-P2108X, MX10, MX11, MX12, PD01, XO POPPY, MX13, BQ01, BQ02,
EWTTO ET-Z0499, MXW009, MXW010, GV-MA211, KP-IM606, BQ03, BQ17, IM.17`
(module `c543.js`; extensions in `1ddb.js`: `BQ05…BQ96`, `MINISO-M1/M12`,
`LP212`, `MXPC-100`, `BH03`, `PD03`, `BHSZY`, `EWTTO ET-N3687/3689`).

## Matrix: model → transport → print format → print width

| Model | Transport (Android) | Raster format | Width (px) | dpi |
|---|---|---|---|---|
| GT01/GT02/MX01/MX02 (5178 board) | BLE (`Ytbbluetooth`) | `51 78` line frames, LSB-first | 384 | 200 |
| MX03 | BLE | same | 576 | 200 |
| MXW010 | BLE | same + `51 78 D0` prefix, gray via `getMXW010GrayHex` | 384 | 200 |
| V5 / V5N | BLE via `AutoPrinterV5` plugin or BLE module | `ESC * 0x21` 24-dot bands + `ESC 3 0x0A` + `ESC d 4` | 384 | 203 |
| V5PRO / V5NPRO | same | same, end feed `ESC d 6` | 576 | 304 |
| V7 / V7PRO | same | same, top offset 30/38 | 576 / 832 | 203/304 |
| V6 / V6PRO | **SPP** | `GS v 0` encoder (`getBitMapHex_v7s`) + end feed `ESC d 4/6` | 576 | – |
| V7S / V7SPRO | **SPP** | `GS I 0xF0 <density>` prefix + `GS v 0` + 4× blank band (`0ef3.js`) | 576 | 200/300 |
| V8 / V8PRO | **SPP** | `1D 82 30 00 68 00` + rows padded to 104 B | 832 | – |
| V10 | **SPP** | `1D 82 30 00 D8 00` + rows padded to 216 B, suffix `1D 83 03 1B 64 60` | 1728 | – |
| V8SJP | **SPP** | V7 encoder + suffix `ESC d 3` | – | – |
| X5 | **SPP** | prefix `1B 37 09 00 CC` + V5 encoder | – | – |
| V8S / V8SPRO | plugin `Vsonprinter` | `v8sPrintImage` (plugin-side) | 1280 (V8SPRO) | 300 |
| V5X / V5X_S / BH03/PD03 | BLE | `22 21` frames (dot) or gray+compression | ~295–378 per paper | 200 |
| V5G (label mode) | BLE | `51 78` frames + positioning commands | per label | 200 |
| V5C (YTB01) | BLE | `bq95V2DotHex` family | – | – |
| V10G (Paperang M02 family etc.) | BLE | `1B 23 21` header + **zlib-compressed** raster | – | – |
| V5M (Paperang M02?) | BLE | `55`/`5A 04` frames | – | – |
| DCK (C21/D1/D2/E2/NEWSMY) | BLE | `55 AA` frames (module `7869.js`) | – | – |
| P7 (A47/A55/58P7_…) | plugin `YtbWeiTeRuiModule` | `printBitmap` call in the plugin, dpi 200/300, packet pause 60 ms | 1600 max. A4 | 200/300 |

Widths from: `0a9f.js` (v5: 384, v5pro: 576, v7: 576, v7pro: 832), `a061.js`
(V6PRO: `model_img_width=576`), `d51f.js` (864 → P3S, 576 → V5), `8588.js`
(1280 → V8SPRO), `PrinterModel.java` (GT01 384, MX03 576), `getBitMapHex_v8/_v10`
(pad widths 104/160/216 bytes ⇒ 832/1280/1728 px).

## Label dimensions (V5X/V5G labels, `0a9f.js`)

Width in pixels = `floor(mm / 25.4 × 200 × f)` with correction factor f = 0.95–0.99
per paper/device type (e.g. 40 mm → ~295–312 px). Margin data (rightBorder/topBorder)
per device in `m()`/`b()` of `0a9f.js`.

## The device in this project: MX10

The actual printer is named **MX10**. Everything observed about it:

| Aspect | Value | Evidence |
|---|---|---|
| Model class | **V5G** | `ble_name_config` (webpack module `3429`): `{name:"MX10", model:"V5G", module:"P0"}` |
| Feature module | P0 (same class as MX01/MX02/MX03/BQ…) | ditto |
| Protocol family | **"51 78" BLE protocol** → [Doc 04](04-protocol-5178.md) | model V5G dispatch (`e289.js` function `C`) |
| Transport | BLE via `Ytbbluetooth` plugin (services `FF00`/`AE30`/`200A`) | Doc 03 |
| Print width | **384 px**, dpi 203, paper width 5.7 (cm) | `set_printer_info` (`291c`): `case "V6": case "V5": case "V5G": case "V5X": model_img_width=384` |
| Density handling | Member of `mx10_list` (`cc_nongdu_helper`, module `4bd5`): temperature-driven reduction `mx10_serial_nongdu` (thresholds 55/60/65/70/75 °C), minimum density **95**; multi-copy density management via `mx10_serial_continuous_nongdu`/`get_continuous_hex` | `dc2f.js`, `4bd5.js` |
| Not member of | the `ie`/`le` F2-density lists in `0a9f.js`, the density config `7b53`, any `is_convert_*` board-remap list | verified |

**Open point (flagged as inference):** the JS normalization in `0a9f.js` would remap
the board name for MX10 as `"MX10".replace("MX","GT")` = `"GT10"` – but the native
`PrinterModel.java` only knows GT01/GT02/MX02/MX03, so `V5g("GT10")` would throw an
NPE. Since MX10 evidently works with the original app, either the label/photo print
path for MX10 does not run through `V5g.getPrintData` with that name, or the
server-driven `get_support_ble` config overrides the static mapping. This does not
affect an alternative implementation: the wire protocol (Doc 04) is device-side and
name-independent. Practical starting point: **GT01-like parameters** (384 px, 200 dpi,
energy 12000, speed 55, 2× paper feed of 48 dots), then verify with a BLE sniff.
