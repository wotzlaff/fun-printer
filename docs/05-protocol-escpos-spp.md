# 05 – Protocols of the SPP Photo Printers (V6/V7S/V8/V10/X5/V8SJP)

Responsible: `models/printer/android.js` (`0774`), encoders natively in
`OpencvUtilsWXModule.java` (`getBitMapHex`, `getBitMapHex_v7s`, `getBitMapHex_v8`,
`getBitMapHex_v10`), wrapper in `0a9f.js` (function `z()`).

This family is **largely ESC/POS-like**, but contains vendor-specific extensions.
All bytes go through the SPP socket (Doc 03).

## 1. "ESC y" status family (0x1B 0x79) – V6/V6PRO handshake

After connecting, the app sends to V6/V6PRO:

| Command | Bytes | Meaning |
|---|---|---|
| `ESC y DEN` | `1B 79 44 45 4E` | Initial "announce"/enumerate – response triggers the following queries |
| `ESC y BAT` | `1B 79 42 41 54` | Query battery |
| `ESC y VER` | `1B 79 56 45 52` | Query firmware version |
| `ESC y MAC` | `1B 79 4D 41 43` | Query MAC |
| `ESC y DS 00/01/02` | `1B 79 44 53 00`… | Status variants |
| `ESC y SFC` | `1B 79 53 46 43` | (unconfirmed meaning) |

**Response format** (read until `0D 0A`/`11`): byte 1 (second byte, `d.substr(2,2)`)
selects the type (`0774.js` function `b()`):

| Byte 1 | Content | App action |
|---|---|---|
| `01` | Firmware version (ASCII from byte 2 until before CRC) | set `fireware_version` |
| `02` | Serial number (ASCII at position 6, 9 chars) | `device_no = model + SN`, then `ESC y BAT` |
| `03` | Battery level (hex at position 4) | show `battery_<XX>.png`, then `ESC y VER` |
| `04` | Model name (ASCII, e.g. `V6PRO`) | set model; V6PRO → width 576; then `ESC y MAC` |

Responses end with 2 checksum bytes (e.g. `…B6 DD`).
Model detection from a "…576DPI"/other DPI suffix → `V7S`/`V7SPRO`.

## 2. Raster formats

### V5/V5PRO/V7/V7PRO/V5N/V5NPRO/V10G – `ESC *` 24-dot bands (`getBitMapHex`)

Classic **ESC/POS column raster**:

```
Per 24-row band:
  1B 2A 21 <n_lo> <n_hi>     ESC * 0x21 (mode 33 = 24-dot double density),
                             n = width in bytes = image width (e.g. 384)
  then per column 3 bytes:   bit 7 = topmost row of the octet,
                             1 = black (gray value < 128)
  [V5 family:] 1B 33 00 0A  ESC 3 → line spacing 10 dots
  [last band:] 1B 64 04   ESC d 4 (feed 4 lines) or 1B 64 06 (PRO)
```

### V6/V6PRO/V7S/V7SPRO – `GS v 0` raster (`getBitMapHex_v7s`)

```
1D 76 30 00 <w_bytes> 00 <h_lo> <h_hi> <lines: w_bytes per h rows>
```
`w_bytes` = width/8 (e.g. 72 at 576 px), height 16-bit little-endian,
rows MSB-first (bit 7 = leftmost pixel), 1 = black. For V7S, 4× the blank band
from `0ef3.js` follows (`v7s_space_hex` = 15× `GS v 0` with 72 B of zeros).

Prefix before the raster for V7S/V7SPRO: `1D 49 F0 <density>` (GS I 0xF0 + byte:
`05`→0x40, `0A`→0x30, `0D`→0x20).

### V8/V8PRO/V10 – vendor raster `1D 82` (`getBitMapHex_v8`, `getBitMapHex_v10`)

```
1D 82 30 00 <rowByteWidth> 00 <h_lo> <h_hi> <rows (padded to fixed width)>
```
- V8: row width fixed at 104 bytes (832 px), prefix `1D 82 30 00 68 00`
- V10: fixed 216 bytes (1728 px), prefix `1D 82 30 00 D8 00`; suffix `1D 83 03 1B 64 60`
- V8/V8PRO prefix `1D 83 03` (GS 0x83 0x03) before the raster (JS `0a9f.js`)

### X5 – prefix `1B 37 09 00 CC` (iOS: `1B 40 12 23 0F 1B 33 00`), then V5 encoder
### V8SJP – V7 encoder + suffix `1B 64 03`

## 3. Other individual commands (from `0774.js`/`0a9f.js`)

| Bytes | Meaning |
|---|---|
| `1B 40` | ESC @ – init/reset |
| `12 23 <n>` | DC2 # n – heat/density (e.g. `12230F` = 15) |
| `1B 33 <n>` | ESC 3 – line spacing |
| `1B 64 <n>` | ESC d – feed n lines |
| `1B 4A <n>` | ESC J – feed n dots |
| `1B 62 01 B0` / `1B 62 01 C0` | Feed variants (chunk feeds) |
| `1D 76 30 …` | GS v 0 – raster image |
| `1D 49 F0 …` | GS I 0xF0 – printer ID/mode |
| `1D 83 <n>` | GS 0x83 – vendor (V8 prefix) |
| `1E 47 00` | Cut (vendor) |
| `1B 02` | V8 handshake (response expected) |
| `1E …` | Firmware update frames (`1E 00 08 …`), length/DPI detection |
| `1F 28 73 …` | Vendor status (`1F287302001200` etc.) |

## 4. Response and retry logic (SPP)

- Commands on the "no response" list (init, feeds, status) are sent without waiting.
- Raster data (`1D 76 30` prefix) and `1D 49 F0` → no ACK waiting.
- Otherwise: read response; `11` = XON → continue; empty → resend chunk.
- Response with "…DPI" suffix → derive model (576 → V7S, otherwise V7SPRO).

## 5. Full image print flow (example V10)

```
1D 83 03                        (V8/V8PRO prefix; absent for V10)
<Raster: 1D 82 30 00 D8 00 <h> <216B×h>>
1D 83 03 1B 64 60               (V10 suffix)
```
For V10, the JS layer sends `print_hex(e, …, e.length)` = single packet,
followed by `1B 64 60` (feed 96).
