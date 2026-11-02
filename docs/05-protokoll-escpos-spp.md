# 05 – Protokolle der SPP-Fotodrucker (V6/V7S/V8/V10/X5/V8SJP)

Zuständig: `models/printer/android.js` (`0774`), Encoder nativ in
`OpencvUtilsWXModule.java` (`getBitMapHex`, `getBitMapHex_v7s`, `getBitMapHex_v8`,
`getBitMapHex_v10`), Wrapper in `0a9f.js` (Funktion `z()`).

Diese Familie ist **weitgehend ESC/POS-artig**, enthält aber herstellerspezifische
Erweiterungen. Alle Bytes werden über den SPP-Socket (Dok 03) geschickt.

## 1. „ESC y“-Statusfamilie (0x1B 0x79) – V6/V6PRO-Handshake

Nach dem Verbinden sendet die App an V6/V6PRO:

| Kommando | Bytes | Bedeutung |
|---|---|---|
| `ESC y DEN` | `1B 79 44 45 4E` | Initialer „Announce“/Enumerate – Antwort triggert die folgenden Queries |
| `ESC y BAT` | `1B 79 42 41 54` | Akku abfragen |
| `ESC y VER` | `1B 79 56 45 52` | Firmware-Version abfragen |
| `ESC y MAC` | `1B 79 4D 41 43` | MAC abfragen |
| `ESC y DS 00/01/02` | `1B 79 44 53 00`… | Status-Varianten |
| `ESC y SFC` | `1B 79 53 46 43` | (unbestätigte Bedeutung) |

**Antwortformat** (gelesen bis `0D 0A`/`11`): Byte 1 (zweiter Byte, `d.substr(2,2)`)
wählt den Typ (`0774.js` Funktion `b()`):

| Byte1 | Inhalt | Aktion der App |
|---|---|---|
| `01` | Firmware-Version (ASCII ab Byte 2 bis vor CRC) | `fireware_version` setzen |
| `02` | Seriennummer (ASCII an Position 6, 9 Zeichen) | `device_no = Modell + SN`, dann `ESC y BAT` |
| `03` | Akkustand (Hex an Position 4) | `battery_<XX>.png` anzeigen, dann `ESC y VER` |
| `04` | Modellname (ASCII, z. B. `V6PRO`) | Modell setzen; V6PRO → Breite 576; dann `ESC y MAC` |

Antworten enden mit 2 Checksummen-Bytes (z. B. `…B6 DD`).
Modell-Erkennung aus „…576DPI“/anderem DPI-Suffix → `V7S`/`V7SPRO`.

## 2. Rasterformate

### V5/V5PRO/V7/V7PRO/V5N/V5NPRO/V10G – `ESC * 24-Dot-Bänder` (`getBitMapHex`)

Klassisches **ESC/POS-Spaltenraster**:

```
Pro 24-Zeilen-Band:
  1B 2A 21 <n_lo> <n_hi>     ESC * 0x21 (Modus 33 = 24-dot double density),
                             n = Breite in Bytes = Bildbreite (z. B. 384)
  dann je Spalte 3 Bytes:    Bit 7 = oberste Zeile des Oktetts,
                             1 = schwarz (Grauwert < 128)
  [V5-Familie:] 1B 33 00 0A  ESC 3 → Zeilenabstand 10 Dot
  [letztes Band:] 1B 64 04   ESC d 4 (Feed 4 Zeilen) bzw. 1B 64 06 (PRO)
```

### V6/V6PRO/V7S/V7SPRO – `GS v 0`-Raster (`getBitMapHex_v7s`)

```
1D 76 30 00 <w_bytes> 00 <h_lo> <h_hi> <Zeilen: w_bytes je h Zeilen>
```
`w_bytes` = Breite/8 (z. B. 72 bei 576 px), Höhe 16 Bit little-endian,
Zeilen MSB-first (Bit 7 = linkes Pixel), 1 = schwarz. Danach bei V7S
4× das Leerband aus `0ef3.js` (`v7s_space_hex` = 15× `GS v 0` mit 72 B Nullen).

Präfix vor dem Raster bei V7S/V7SPRO: `1D 49 F0 <density>` (GS I 0xF0 + Byte:
`05`→0x40, `0A`→0x30, `0D`→0x20).

### V8/V8PRO/V10 – Vendor-Raster `1D 82` (`getBitMapHex_v8`, `getBitMapHex_v10`)

```
1D 82 30 00 <ZeilenbyteBreite> 00 <h_lo> <h_hi> <Zeilen (auf feste Breite gepolstert)>
```
- V8: Zeilenbreite fix 104 Bytes (832 px), Präfix `1D 82 30 00 68 00`
- V10: fix 216 Bytes (1728 px), Präfix `1D 82 30 00 D8 00`; Suffix `1D 83 03 1B 64 60`
- V8/V8PRO Präfix `1D 83 03` (GS 0x83 0x03) vor dem Raster (JS `0a9f.js`)

### X5 – Präfix `1B 37 09 00 CC` (iOS: `1B 40 12 23 0F 1B 33 00`), dann V5-Encoder
### V8SJP – V7-Encoder + Suffix `1B 64 03`

## 3. Sonstige Einzelkommandos (aus `0774.js`/`0a9f.js`)

| Bytes | Bedeutung |
|---|---|
| `1B 40` | ESC @ – Init/Reset |
| `12 23 <n>` | DC2 # n – Hitze/Dichte (z. B. `12230F` = 15) |
| `1B 33 <n>` | ESC 3 – Zeilenabstand |
| `1B 64 <n>` | ESC d – Feed n Zeilen |
| `1B 4A <n>` | ESC J – Feed n Dot |
| `1B 62 01 B0` / `1B 62 01 C0` | Feed-Varianten (Chunk-Feeds) |
| `1D 76 30 …` | GS v 0 – Rasterbild |
| `1D 49 F0 …` | GS I 0xF0 – Printer-ID/Modus |
| `1D 83 <n>` | GS 0x83 – Vendor (V8-Präfix) |
| `1E 47 00` | Cut (Vendor) |
| `1B 02` | V8-Handshake (Antwort erwartet) |
| `1E …` | Firmware-Update-Frames (`1E 00 08 …`), Länge/DPI-Erkennung |
| `1F 28 73 …` | Vendor-Status (`1F287302001200` u. a.) |

## 4. Antwort- und Wiederholungslogik (SPP)

- Kommandos in der „keine Antwort“-Liste (Init, Feeds, Status) werden ohne
  Wartezeit gesendet.
- Bildraster (`1D 76 30`-Präfix) und `1D 49 F0` → kein ACK-Waiting.
- Sonst: Antwort lesen; `11` = XON → weiter; leer → Chunk wiederholen.
- Antwort mit „…DPI“-Suffix → Modell ableiten (576 → V7S, sonst V7SPRO).

## 5. Gesamtablauf Bild-Druck (Beispiel V10)

```
1D 83 03                        (V8/V8PRO-Präfix entfällt bei V10)
<Raster: 1D 82 30 00 D8 00 <h> <216B×h>>
1D 83 03 1B 64 60               (V10-Suffix)
```
Für V10 sendet die JS-Schicht `print_hex(e, …, e.length)` = Einzelpaket,
danach `1B 64 60` (Feed 96).
