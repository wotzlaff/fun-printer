# 06 – Label- und Sonstige-Protokolle (22 21 / 55 AA / 56 88 / 5A 04)

## A) „22 21“-Protokoll – V5X/V5X_S/BH03/PD03-Labeldrucker

Zuständig: `d5ca.js` (V5X-Helfer), `dc2f.js`, Encoder nativ
(`getBitMapHexForV5xDotPrint`, `getBitMapHexForV5xGrayPrint`,
`bq95V2DotHex`, `bq95V2GrayHexWithCompress`).

### Dot-Druck (Standard)

Bild-Header (vom nativen Encoder, 10 Bytes):

```
22 21 A9 00 02 00 <h_lo> <h_hi> <CRC8> FF
└─Magic┘  │ └──LEN──┘ └─ Höhe LE ─┘
          CMD A9
```

Start-Kommando (von JS, `0a9f.js`):

```
22 21 A9 00 04 00 <Höhe aus Header, 2 B> <Modus-Byte 0x30…0x33> 00 00 00
```

| Modus-Byte | Bedeutung |
|---|---|
| `0x30` (`30000000`) | normaler Druck |
| `0x31` (`30010000`) | Label-Modus |
| `0x32` (`30020000`) | Gray-Druck |
| `0x33` (`30030000`) | BH03/PD03/BHSZY-Label |

Danach der Bildkörper: pro Zeile `ceil(breite/8)` Bytes, **MSB-first**
(Bit 7 = linkes Pixel, 1 = schwarz, Grauwert < 128), Höhe aus Header.
Zeilenbreite ≈ `floor(papier_mm / 25.4 × 200 × 0.95–0.99)`.

### Sonstige 22-21-Kommandos

| Kommando | Bedeutung | Quelle |
|---|---|---|
| `2221AC0001000000FF` | Druck abbrechen | `d5ca.js`, `dc2f.js` |
| `2221B2000100000000` | Label-Material-Lernen | `d5ca.js` |
| `2221B10001000000FF` | Status-Subscribe nach Verbinden | `dc2f.js` |
| `2221B3 0022 00…` | (Label-Größen-Kommando; schaltet JS in Kommandomodus) | `dc2f.js` |
| `2221AE…` / `2221A8 0001 0020 E0 FF` / `…0030 90 FF` | Flow-Control Stop/Go | Native-Handler |
| `2221B5…` / `5178F6…` | Kommandos, die nicht als „Daten“ gezählt werden (kein Chunking) | `dc2f.js` |

### Gray-Druck mit Kompression

`bq95V2GrayHexWithCompress` komprimiert das Gray-Raster (zlib via `ZlibTool`/
LZO via `MinilzoTool`, Flag `newCompress` in `PrinterModel.java`) und verpackt
es in `22 21`-Frames; Details in `OpencvUtilsWXModule.java` Zeilen ~892–975.

## B) „55 AA“-Protokoll – DCK (C21/D1/D2/E2/NEWSMY)

Modul `7869.js`; Framing `55 AA <CMD> <LEN> … <crc?> FF`:

| Kommando | Bedeutung |
|---|---|
| `55AAF00001010100001FFF` | Firmware-Version abfragen |
| `55AAF40001010100001FFF` | Buch-/Flash-Info abfragen |
| `55AAF6/F7/F5…` | Druck-Kommandos (Sonderbehandlung: Interval 10 ms) |
| Import/Zeilen-Flags | Wortkarten-/Zeilen-Modus (`import_book_info` mit Verlag, Standard-Buch „西工大出版社…“) |

Statusrückmeldungen laufen über denselben Notify-Kanal; JS speichert
`dck_firmware_verison`.

## C) „56 88“-Protokoll – V5C (YTB01)

- Verbinden: `5688AA0001000000FF` (600 ms nach Connect, `dc2f.js`)
- Flow-Control: `5688A70101000107FF` (Stopp) / `5688A70101000000FF` (weiter)
- Druck: `bq95V2DotHex`/`getBitmapHex_v5c` (Dot) bzw. Gray mit Gamma-Handling
  (`is_use_gamma_handle`), Max-Höhe via `get_v5c_max_height`

## D) „5A 04“/„55“-Protokoll – V5M (Paperang-artig, `getBitMapHex_v5m`)

2 Zeilen pro Paket: `55 <Zeilenindex 4 hex LE> <2 Zeilen zu je ceil(w/8) Bytes,
MSB-first> 00`; gesamt `5A 04 <Paketanzahl 4 hex> 00` am Kopf und
`5A 04 <Paketanzahl> 01` am Fuß. Breite wird auf 192 Hex-Zeichen (96 B) gepolstert.

## E) Label-Positionierung (V5G-Board, `4ab3.js`)

Für schwarze Markierungen auf Label-Rollen („dingwei“):

| Kommando | Bedeutung |
|---|---|
| `5178A1000200040054FF` + `5178A30001000000FF` | Positionsmessung starten (Pausen 30–50 ms) |
| `5178A1000200100057FF` | Position erreicht → drucken |
| `5178A10002000900BDFF` | Label-Seitenvorschub (Vor-Seite) |
| `5178F0000300 <avg 2B> 20 <crc8> FF` | „gujian_dingwei“ – Lernwert senden (avg + 0x20) |
| `5178F30001000000FF` / `5178F40001000000FF` | BQ-Lernen Variante 1/2 |

Messwerte (22-Byte-Antworten) → gleitender Mittelwert über 4 Messungen;
Standardabweichung < 60 ⇒ Wert als „v5g_label_avg_dianya_hex“ speichern;
Zustandsmaschine A/B über Summen-Schwellen (166/168).

## F) Firmware-Update (SPP-Familie)

`1E`-Frames (`1e0008000001b6dd` = OK, `1e0008030001aad4` = fertig,
`1e000a03…` = Chunk-ACK, 20 Zeichen) – die App hält die Update-Kommandos in
`fireware_update_cmd[]` und sendet sie Chunk für Chunk. Hinweis: Update läuft
über die Original-App; die Frame-Semantik ist nur teilweise beobachtet.
