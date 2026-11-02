# 04 – Protocol "51 78" (BLE mini printers: GT01/GT02/MX01/MX02/…)

Responsible: `models/printer/v5g_label.js` (`4ab3`), `android_ble.js` (`dc2f`),
`ble.js` (`c543`), encoder natively in `com.xyz.yintibao.library.V5g` and `V5gCMD`
(see `analysis/decompiled/`).

**This is the protocol of the project's device (MX10)** – model class V5G,
384 px print width at 203 dpi. See [Doc 02](02-devices-and-models.md) for the
device-specific facts and recommended starting parameters.

## ✅ Live verification (btsnoop capture, MX10, 2026-11-02)

A HCI-snoop capture of the original app printing a 384×307 px photo **confirms
the framing and every CRC** (339 TX frames, all `CRC-OK`). Observed values that
differ from the static defaults:

| Aspect | Static default (code) | **Observed live (MX10)** |
|---|---|---|
| Negociated MTU | 503 (native request) | **517** (FastBLE default request) |
| Connection init | status query | `A8` (info) → `BB` (id, payload `01`) → `A3`/`D3` polling; firmware response **"1.0.11"** |
| Density (`F2`) | 120 | **200** (1st job), **130** (2nd job, head at 55 °C → temperature reduction) |
| Quality (`A4`) | level 3 (`0x33`) | **level 4 (`0x34`)** |
| Energy (`AF`) | 12000 | **15000** (`0x3A98` LE) |
| Speed (`BD`) | 55 (GT01 img) | **10 (`0x0A`), sent twice per job** |
| Paper feed (`A1`) | 2× (paperNum) | **1× `0x0030`** per job |
| Line frames (`A2`) | 56 B each | 56 B each ✓, 307 lines, 4 line frames per BLE packet |
| Write chunking | 123/83 B (GT01 MTUs) | **240 B ATT payloads** (plugin `perPackageLength` default), pacing ≈1.2 ms (no fixed 30 ms interval) |
| Flow control | pause + resume | only `AE` payload `00` (release) observed after jobs; no pause in short capture |
| A3 response | 18/22 hex chars | 22 hex chars = LEN 3, payload `00 00 <temp>`: byte0 = status (00 normal, 0x80 flag seen), byte2 = **print head temperature in °C** (47/48/55 observed) |
| `D3` (new) | unknown | polled (`payload 00`), response LEN=1 (`0x15`, `0x19`, `0x1A`) – value grows during printing; likely feed/position or progress counter, **unresolved** |

Observed per-job sequence (both jobs identical except density):

```
F2 <01 XX>            density (200 → 130 when hot)
A3 <00>               status
A4 <34>               quality level 4
A6 <AA551738445F5F5F44382C>   lattice start
AF <98 3A>            energy 15000 LE
BE <00>               mode image
BD <0A>               speed 10
BD <0A>               speed 10 (second time)
A2 <48 B> × height    line frames (56 B each)
A1 <30 00>            paper feed 48 dots (once)
A6 <AA55170000000000000017>   lattice end
A3 <00>               status
A3 <00>               status
```

Wire-level truth beats the static defaults: an alternative implementation should
start from these observed values.

## Framing

Every command is a BLE packet of the form (reconstructed from `V5g.java`,
`V5gCMD.java` and the JS frames; CRC examples verified computationally):

```
51 78 <CMD> <LEN16 BE> 00 <PAYLOAD (LEN bytes)> <CRC8> FF
 │    │     │    └───┬──┘  │   │             │     └─ terminator 0xFF
 │    │     │     length BE  │   │             └─ CRC-8 over PAYLOAD
 │    │     │        │       │   │                (poly 0x07, init 0)
 │    │     │        │       │   └─ payload bytes
 │    │     │        │       └─ fixed separator byte 0x00
 │    │     └─ command byte
 │    └─ magic "Qx" (0x51 0x78)
 └─ start byte "Q"
```

Examples (CRC each verified):
`5178A10002003000F9FF` (A1, LEN 2, payload `30 00`),
`5178A30001000000FF` (A3, LEN 1, payload `00`),
`5178AF000200E02E89FF` (AF, LEN 2, payload `E0 2E` = 12000 LE).

CRC-8 is computed over the payload (not over magic/CMD/LEN) –
implementation see `ConvertUtils.calcCrc8` and JS module `9673.js`
(table = CRC-8/ATM, poly 0x07, init 0x00, MSB-first, no XOR-out).
Note: the JS function `crc8(arr)` from `9673.js` returns **payload+CRC as hex**
(appends the CRC byte) – which is why the JS source shows e.g. for the
F2 frame `crc8(hexStr2Bytes("01"+energy))` as "01 <e> <crc>".

Device→app notifications (flow control `AE`) use a different layout:
`51 78 AE 01 01 00 <Param> <CRC8> FF`.

## Commands (from `V5g.java`, `V5gCMD.java`, JS modules)

| CMD | Example frame (hex) | Meaning | Source |
|---|---|---|---|
| `A1` | `5178A10002003000F9FF` | Paper feed/advance: payload 2 B, `0030` = 48 dots (200 dpi ≈ 6 mm); 300-dpi variant `0048` = 72 dots. Other values: `0009` (label print sequence), `0001`/`0010` (positioning), `0038` (YT* tail) | `V5g.paper`, `4ab3.js` |
| `A2` | `5178A2 00 30 00 <48 B line> <crc> FF` | **Image line**: `00 30` = bytes per line (48 = 384 px/8); line bytes 1 bpp, LSB-first, bit=1 → black; then CRC8 over the line bytes and `FF`. (Gray variant: 1 byte per pixel, gray value) | `V5g.eachLinePixToCmdB`, `getGrayPrintData` |
| `A3` | `5178A30001000000FF` | Status query. Response 18 or 22 hex chars, `a3` at position 4; status byte at position 12 (see below); 22-char response = label (position value at position 14) | `e54e.js`, `c543.js` |
| `A4` | `5178A40001003197FF` … `…35…` | **Density/quality 1–5** (payload `0x31`–`0x35` = "1"–"5"; in the cancel sequence `0x34` = level 4) | `V5g.quality1–5`, `dc2f.js` |
| `A6` | `5178A6000B00AA551738445F5F5F44382C A1 FF` | Raster start marker ("lattice", 11 B magic `AA 55 17 38 44 5F 5F 5F 44 38 2C`) | `V5g.printLattice` |
| `A6` | `5178A6000B00AA5517000000000000 00 17 11 FF` | Raster end marker (magic `AA 55 17 00…00 17`, CRC `0x11`) | `V5g.finishLattice` |
| `AE` | `5178AE0101001070FF` / `5178AE0101000000FF` | Flow control on/off (see Doc 03) | Native handler |
| `AF` | `5178AF000200E02E89FF` | Burn energy, 16-bit **little-endian** (12000 = `0x2EE0` → `E0 2E`) | `V5g.getEnerageByte` |
| `BD` | `5178BD0001000A36FF` | Print speed (1 B, e.g. `0x0A`); image print GT01: 55, text: 45 | `V5g.getPrintSpeed`, `PrinterModel.java` |
| `BE` | `5178BE0001000000FF` (image) / `5178BE0001000107FF` (text) | Print mode | `V5g.print_img`/`print_text` |
| `A8` | `5178A800010000 00 FF` | Device info | `V5g.getDevInfo` |
| `A9` | `5178A900010000 00 FF` | Firmware update kick | `V5g.updateDev` |
| `BB` | `5178BB0001000107FF` | Device ID | `V5g.getDevId` |
| `D0` | `5178D00101000000FF` / `…010107FF` | MXW010: paper type (normal/label) | `4ab3.js` |
| `D1` | `5178D10101000000FF` | MXW010: label end | `4ab3.js` |
| `D2` | `5178D20101000000FF` | MXW010: learn (label material) | `4ab3.js` |
| `F2` | `5178F200020001787AFF` | **Set density** (newer firmware, "Nongdu"): payload = `01` + density byte (1–200), CRC8 over both bytes (example: 120 = `0x78`, CRC `0x7A`) | `0a9f.js`, `e289.js` |
| `F5` | `5178F50001000107FF` | BQ02/BQ03/BQ17: label print start | `0a9f.js` |
| `B9` | `5178B901010000FF` | MXW009: label print reception ack | `e54e.js` |

## Status responses (notify characteristic)

18-char response (`…a3…` at position 4), status byte = hex at position 12:

| Byte | State | Source (i18n key) |
|---|---|---|
| `00` | normal ("zhengchang") | `e54e.js` |
| `01`, `09` | **out of paper** ("quezhi", 缺纸) | ditto |
| `04`, `D2` | **overheated** ("guore", 过热) | ditto |
| `08` | **battery low** ("didian", 低电) | ditto |

Extended decoding (`e54e.js`): bit 6 of the byte at position 10 = overheat;
bits "11" (binary) of the byte at position 12 = out of paper.

22-char responses = label measurement: value at position 14 (4 hex) = position
measurement → V5G learn/positioning algorithm (`4ab3.js` `find`/`gujian_dingwei`:
rolling average over 4 measurements, standard deviation < 60 ⇒ stored; fine
positioning via voltage measurement series `dianya`, thresholds 166/168).

## Full image sequence (V5G dot printing, `V5g.getPrintData`)

```
<A4 Quality 1..5>              e.g. 5178A40001003399FF   (level 3)
<A6 Lattice start>             5178A6000B00AA551738445F5F5F44382CA1FF
[<AF Energy> (label/gray only)] 5178AF000200E02E89FF   (12000 LE = E0 2E)
<BE Mode = image>              5178BE0001000000FF
<A2 Line> × height             5178A2003000<48 B><crc>FF
<BD Speed>                     5178BD000100194FFF   (25; GT01 image default 55 = 0x37)
<A1 Paper feed> × paperNum      5178A10002003000F9FF (GT01: 2×)
<A6 Lattice end>               5178A6000B00AA5517000000000000001711FF
<A3 Status query>              5178A30001000000FF
```

Additionally, the JS layer sends, **before** the sequence for MX*/GT* boards:
`<F2 density>` + `<A3 status>`, and appends another `<A3 status>` at the end
(`0a9f.js` line ~682). YT* devices receive the tail `5178A1000200380051FF`.
MXW010 gets prefix `5178D00101000000FF` (or `…010107FF` in label mode).

## Gray printing (V5G)

`V5g.getGrayPrintData`: per line frame `5178A2` + 1 gray-value byte per pixel
(RGB→gray 0.299/0.587/0.114) + CRC8 + `FF`; paper feed 300 dpi depending on
`devdpi`; no `BE` image mode but `printLattice` + `getEnerageByte` at the head.

## Cancel sequence (V10G etc., `dc2f.js`)

```
5178A30001000000FF   Status
5178A4000100348CFF   Quality = level 4 (0x34)
5178A6000B00AA551738445F5F5F44382CA1FF   Lattice start
5178AF0002001027A2FF   Energy = 10000 (0x2710 LE)
5178BE0001000000FF   Mode image
5178BD0001000A36FF   Speed 10
5178A10002003000F9FF   Feed 48
```
