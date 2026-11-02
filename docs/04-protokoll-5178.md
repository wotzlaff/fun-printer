# 04 – Protokoll „51 78“ (BLE-Minidrucker: GT01/GT02/MX01/MX02/…)

Zuständig: `models/printer/v5g_label.js` (`4ab3`), `android_ble.js` (`dc2f`),
`ble.js` (`c543`), Encoder nativ in `com.xyz.yintibao.library.V5g` und `V5gCMD`
(siehe `analysis/decompiled/`).

## Framing

Jedes Kommando ist ein BLE-Paket der Form (rekonstruiert aus `V5g.java`,
`V5gCMD.java` und den JS-Frames; CRC-Beispiele rechnerisch verifiziert):

```
51 78 <CMD> <LEN16 BE> 00 <PAYLOAD (LEN Bytes)> <CRC8> FF
 │    │     │    └───┬──┘  │   │             │     └─ Terminator 0xFF
 │    │     │     Länge BE  │   │             └─ CRC-8 über PAYLOAD
 │    │     │        │      │   │                (Poly 0x07, Init 0)
 │    │     │        │      │   └─ Payload-Bytes
 │    │     │        │      └─ festes Trennbyte 0x00
 │    │     └─ Kommando-Byte
 │    └─ Magic „Qx“ (0x51 0x78)
 └─ Startzeichen „Q“
```

Beispiele (CRC je rechnerisch geprüft):
`5178A10002003000F9FF` (A1, LEN 2, Payload `30 00`),
`5178A30001000000FF` (A3, LEN 1, Payload `00`),
`5178AF000200E02E89FF` (AF, LEN 2, Payload `E0 2E` = 12000 LE).

CRC-8 wird über den Payload (nicht über Magic/CMD/LEN) gerechnet –
Umsetzung siehe `ConvertUtils.calcCrc8` und JS-Modul `9673.js`
(Tabelle = CRC-8/ATM, Poly 0x07, Init 0x00, MSB-first, kein XOR-Out).
Hinweis: die JS-Funktion `crc8(arr)` aus `9673.js` gibt **Payload+CRC als Hex**
zurück (hängt das CRC-Byte an) – deshalb taucht im JS-Quelltext z. B. beim
F2-Frame `crc8(hexStr2Bytes("01"+energy))` als „01 <e> <crc>“ auf.

Geräte→App-Benachrichtigungen (Flow-Control `AE`) nutzen ein abweichendes
Layout: `51 78 AE 01 01 00 <Param> <CRC8> FF`.

## Kommandos (aus `V5g.java`, `V5gCMD.java`, JS-Modulen)

| CMD | Beispiel-Frame (hex) | Bedeutung | Quelle |
|---|---|---|---|
| `A1` | `5178A10002003000F9FF` | Papier-Feed/Papierumleitung: Payload 2 B, `0030` = 48 Dot (200 dpi ≈ 6 mm); 300-dpi-Variante `0048` = 72 Dot. Andere Werte: `0009` (Label-Druck-Sequenz), `0001`/`0010` (Positionierung), `0038` (YT*-Tail) | `V5g.paper`, `4ab3.js` |
| `A2` | `5178A2 00 30 00 <48 B Zeile> <crc> FF` | **Bildzeile**: `00 30` = Bytes pro Zeile (48 = 384 px/8); Zeilenbytes 1bpp, LSB-first, Bit=1 → schwarz; danach CRC8 über die Zeilenbytes und `FF`. (Gray-Variante: 1 Byte pro Pixel, Grauwert) | `V5g.eachLinePixToCmdB`, `getGrayPrintData` |
| `A3` | `5178A30001000000FF` | Status-Query. Antwort 18 oder 22 Hex-Zeichen, `a3` an Position 4; Statusbyte an Position 12 (s. u.); 22-Zeichen-Antwort = Label (Positionswert an Position 14) | `e54e.js`, `c543.js` |
| `A4` | `5178A40001003197FF` … `…35…` | **Dichte/Quality 1–5** (Payload `0x31`–`0x35` = „1“–„5“; in der Cancel-Sequenz steht `0x34` = Stufe 4) | `V5g.quality1–5`, `dc2f.js` |
| `A6` | `5178A6000B00AA551738445F5F5F44382C A1 FF` | Raster-Startmarker („Lattice“, 11 B Magic `AA 55 17 38 44 5F 5F 5F 44 38 2C`) | `V5g.printLattice` |
| `A6` | `5178A6000B00AA5517000000000000 00 17 11 FF` | Raster-Endmarker (Magic `AA 55 17 00…00 17`, CRC `0x11`) | `V5g.finishLattice` |
| `AE` | `5178AE0101001070FF` / `5178AE0101000000FF` | Flow-Control an/aus (siehe Dok 03) | Native-Handler |
| `AF` | `5178AF000200E02E89FF` | Verbrennungs-Energie, 16 Bit **little-endian** (12000 = `0x2EE0` → `E0 2E`) | `V5g.getEnerageByte` |
| `BD` | `5178BD0001000A36FF` | Druckgeschwindigkeit (1 B, z. B. `0x0A`); Bild-Druck GT01: 55, Text: 45 | `V5g.getPrintSpeed`, `PrinterModel.java` |
| `BE` | `5178BE0001000000FF` (Bild) / `5178BE0001000107FF` (Text) | Druckmodus | `V5g.print_img`/`print_text` |
| `A8` | `5178A800010000 00 FF` | Geräte-Info | `V5g.getDevInfo` |
| `A9` | `5178A900010000 00 FF` | Firmware-Update-Kick | `V5g.updateDev` |
| `BB` | `5178BB0001000107FF` | Geräte-ID | `V5g.getDevId` |
| `D0` | `5178D00101000000FF` / `…010107FF` | MXW010: Papierart (normal/Label) | `4ab3.js` |
| `D1` | `5178D10101000000FF` | MXW010: Label-Ende | `4ab3.js` |
| `D2` | `5178D20101000000FF` | MXW010: Lernen (Label-Material) | `4ab3.js` |
| `F2` | `5178F200020001787AFF` | **Dichte setzen** (neuere Firmware, „Nongdu“): Payload = `01` + Dichte-Byte (1–200), CRC8 über beide Bytes (Beispiel: 120 = `0x78`, CRC `0x7A`) | `0a9f.js`, `e289.js` |
| `F5` | `5178F50001000107FF` | BQ02/BQ03/BQ17: Label-Print-Start | `0a9f.js` |
| `B9` | `5178B901010000FF` | MXW009: Label-Print-Empfangsbestätigung | `e54e.js` |

## Status-Antworten (Notify-Char)

18-Zeichen-Antwort (`…a3…` an Position 4), Statusbyte = Hex an Position 12:

| Byte | Zustand | Quelle (i18n-Key) |
|---|---|---|
| `00` | normal („zhengchang“) | `e54e.js` |
| `01`, `09` | **papierlos** („quezhi“, 缺纸) | dito |
| `04`, `D2` | **überhitzt** („guore“, 过热) | dito |
| `08` | **Akku niedrig** („didian“, 低电) | dito |

Erweiterte Decodierung (`e54e.js`): Bit 6 des Bytes an Position 10 = überhitzt;
Bits „11“ (binär) des Bytes an Position 12 = papierlos.

22-Zeichen-Antworten = Label-Vermessung: Wert an Position 14 (4 Hex) = Positionsmesswert
→ V5G-Lern-/Positionier-Algorithmus (`4ab3.js` `find`/`gujian_dingwei`: gleitender
Durchschnitt über 4 Messungen, Standardabweichung < 60 ⇒ gespeichert; Feinposition
über Spannungs-Messreihe `dianya`, Schwellen 166/168).

## Vollständige Bild-Sequenz (V5G-Dot-Druck, `V5g.getPrintData`)

```
<A4 Quality 1..5>              z. B. 5178A40001003399FF   (Stufe 3)
<A6 Lattice-Start>             5178A6000B00AA551738445F5F5F44382CA1FF
[<AF Energie> (nur Label/Gray)] 5178AF000200E02E89FF   (12000 LE = E0 2E)
<BE Modus = Bild>              5178BE0001000000FF
<A2 Zeile> × height            5178A2003000<48 B><crc>FF
<BD Speed>                     5178BD000100194FFF   (25; GT01-Img-Default 55 = 0x37)
<A1 Papier-Feed> × paperNum     5178A10002003000F9FF (GT01: 2×)
<A6 Lattice-Ende>              5178A6000B00AA5517000000000000001711FF
<A3 Status-Query>              5178A30001000000FF
```

Zusätzlich setzt die JS-Schicht bei den MX*/GT*-Boards **vor** die Sequenz:
`<F2 Dichte>` + `<A3 Status>` und hängt am Ende nochmals `<A3 Status>` an
(`0a9f.js` Zeile ~682). YT*-Geräte erhalten den Tail `5178A1000200380051FF`.
MXW010 erhält Präfix `5178D00101000000FF` (bzw. `…010107FF` im Labelmodus).

## Gray-Druck (V5G)

`V5g.getGrayPrintData`: pro Zeile Frame `5178A2` + 1 Grauwert-Byte je Pixel
(RGB→Gray 0.299/0.587/0.114) + CRC8 + `FF`; Papier-Feed 300 dpi abhängig von
`devdpi`; kein `BE`-Bildmodus, sondern `printLattice` + `getEnerageByte` am Kopf.

## Cancel-Sequenz (V10G u. a., `dc2f.js`)

```
5178A30001000000FF   Status
5178A4000100348CFF   Quality = Stufe 4 (0x34)
5178A6000B00AA551738445F5F5F44382CA1FF   Lattice-Start
5178AF0002001027A2FF   Energie = 10000 (0x2710 LE)
5178BE0001000000FF   Modus Bild
5178BD0001000A36FF   Speed 10
5178A10002003000F9FF   Feed 48
```
