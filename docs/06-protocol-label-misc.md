# 06 – Label and Misc Protocols (22 21 / 55 AA / 56 88 / 5A 04)

## A) "22 21" protocol – V5X/V5X_S/BH03/PD03 label printers

Responsible: `d5ca.js` (V5X helper), `dc2f.js`, encoders natively
(`getBitMapHexForV5xDotPrint`, `getBitMapHexForV5xGrayPrint`,
`bq95V2DotHex`, `bq95V2GrayHexWithCompress`).

### Dot printing (standard)

Image header (from the native encoder, 10 bytes):

```
22 21 A9 00 02 00 <h_lo> <h_hi> <CRC8> FF
└─magic┘  │ └──LEN──┘ └─ height LE ─┘
          CMD A9
```

Start command (from JS, `0a9f.js`):

```
22 21 A9 00 04 00 <height from header, 2 B> <mode byte 0x30…0x33> 00 00 00
```

| Mode byte | Meaning |
|---|---|
| `0x30` (`30000000`) | normal printing |
| `0x31` (`30010000`) | label mode |
| `0x32` (`30020000`) | gray printing |
| `0x33` (`30030000`) | BH03/PD03/BHSZY label |

Then the image body: per row `ceil(width/8)` bytes, **MSB-first**
(bit 7 = leftmost pixel, 1 = black, gray value < 128), height from the header.
Row width ≈ `floor(paper_mm / 25.4 × 200 × 0.95–0.99)`.

### Other 22-21 commands

| Command | Meaning | Source |
|---|---|---|
| `2221AC0001000000FF` | Cancel printing | `d5ca.js`, `dc2f.js` |
| `2221B2000100000000` | Learn label material | `d5ca.js` |
| `2221B10001000000FF` | Status subscription after connect | `dc2f.js` |
| `2221B3 0022 00…` | (label size command; switches JS into command mode) | `dc2f.js` |
| `2221AE…` / `2221A8 0001 0020 E0 FF` / `…0030 90 FF` | Flow control stop/go | Native handler |
| `2221B5…` / `5178F6…` | Commands not counted as "data" (no chunking) | `dc2f.js` |

### Gray printing with compression

`bq95V2GrayHexWithCompress` compresses the gray raster (zlib via `ZlibTool`/
LZO via `MinilzoTool`, flag `newCompress` in `PrinterModel.java`) and wraps it
in `22 21` frames; details in `OpencvUtilsWXModule.java` lines ~892–975.

## B) "55 AA" protocol – DCK (C21/D1/D2/E2/NEWSMY)

Module `7869.js`; framing `55 AA <CMD> <LEN> … <crc?> FF`:

| Command | Meaning |
|---|---|
| `55AAF00001010100001FFF` | Query firmware version |
| `55AAF40001010100001FFF` | Query book/flash info |
| `55AAF6/F7/F5…` | Print commands (special case: interval 10 ms) |
| Import/line flags | Word-card/line mode (`import_book_info` with publisher, standard book "西工大出版社…") |

Status feedbacks run over the same notify channel; JS stores `dck_firmware_verison`.

## C) "56 88" protocol – V5C (YTB01)

- Connect: `5688AA0001000000FF` (600 ms after connect, `dc2f.js`)
- Flow control: `5688A70101000107FF` (stop) / `5688A70101000000FF` (continue)
- Print: `bq95V2DotHex`/`getBitmapHex_v5c` (dot) or gray with gamma handling
  (`is_use_gamma_handle`), max height via `get_v5c_max_height`

## D) "5A 04"/"55" protocol – V5M (Paperang-like, `getBitMapHex_v5m`)

2 rows per packet: `55 <row index 4 hex LE> <2 rows of ceil(w/8) bytes each,
MSB-first> 00`; overall `5A 04 <packet count 4 hex> 00` at the head and
`5A 04 <packet count> 01` at the tail. Width is padded to 192 hex chars (96 B).

## E) Label positioning (V5G board, `4ab3.js`)

For black marks on label rolls ("dingwei"):

| Command | Meaning |
|---|---|
| `5178A1000200040054FF` + `5178A30001000000FF` | Start position measurement (pauses 30–50 ms) |
| `5178A1000200100057FF` | Position reached → print |
| `5178A10002000900BDFF` | Label page advance (previous page) |
| `5178F0000300 <avg 2B> 20 <crc8> FF` | "gujian_dingwei" – send learned value (avg + 0x20) |
| `5178F30001000000FF` / `5178F40001000000FF` | BQ learn variants 1/2 |

Measurements (22-byte responses) → rolling average over 4 measurements;
standard deviation < 60 ⇒ store as "v5g_label_avg_dianya_hex";
A/B state machine over sum thresholds (166/168).

## F) Firmware update (SPP family)

`1E` frames (`1e0008000001b6dd` = OK, `1e0008030001aad4` = done,
`1e000a03…` = chunk ack, 20 chars) – the app keeps the update commands in
`fireware_update_cmd[]` and sends them chunk by chunk. Note: updates run through
the original app; the frame semantics are only partially observed.
