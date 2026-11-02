# 08 – End-to-End-Druckablauf

Am Beispiel: **Android-App ↔ BLE-Minidrucker (GT01-Board, z. B. MX01/MXW009)**
– der häufigste Fall für „kleinen chinesischen Thermoprinter“.

## Sequenz

```
App (JS)                        Native Plugin (Ytbbluetooth)      Drucker
──────                          ───────────────────────────       ───────
init() ───────────────────────▶ initBleParam()
scan() ───────────────────────▶ BleManager.scan
  ◀─ type 4 {ble_name, addr, FFValue} ──────────────────────── Adv-Pakete
connect(addr) ────────────────▶ connect → onConnected
                                setMtu(503) ────────────────────▶ MTU-Change
                                openNotification(FF01/FF03) ────▶ CCCD schreiben
  ◀─ type 108 (subscribe ok = „wirklich verbunden“)
print_cmd(2221B1…) bei V5X / Status-Query bei V5G ─────────────▶ 5178A30001000000FF
  ◀──────────────────────────── Notify: Status (a3 …) ◀─────────

[Bild]
Bild wählen → Bildbearbeitung (0a9f.opencv: enhance/dither/crop)
ImageProcess.hex({image_path, model:"v5g", blePrexName:"GT01", …})
  → {hex: "<5178A1…><A4…><A6…><AF…><BE…><A2-Zeilen…><BD…><A1…><A6…>"}
JS-Wrap: + F2-Dichte + A3-Status + … + A3-Status
android_ble.print_hex(hex_cmd, model, cb, nums, [], isLabel)
  ─────────────────────────────▶ printCmdFromHexstring({hex_cmd, speed:30, …})
                                FlowWrite.flowWrite(splitBy(package_length),
                                  interval=speed)
                                je Paket: writeCharacteristic(FF02, no response)
                                  ◀── Flow-Control-Notifies (AE 10/00) ──
  ◀─ onWriteSuccess(current,total) (Progress-Callbacks type 101)
  ◀─ type 51/52 (fertig / abgebrochen)
print_complete → Status-Query, Statistik-Upload (print_log)
```

## Entscheidende Details für eine Alternative

1. **Verbindungs-Reihenfolge**: connect → MTU → subscribe → erst dann Status-Query
   senden (der Drucker quittiert subscribe mit Ready-Status; erst danach akzeptiert
   er sauber Daten).
2. **Paketgröße**: 20 B ohne MTU-Verhandlung, 50 B bei MTU 82 (uni-Pfad),
   plugin-seitig 83–123 B bzw. 384/480 B (V5X). Die Native-Bibliothek sendet
   **ohne Write-Response** (`writeType false` = WRITE_TYPE_NO_RESPONSE) und
   dosiert über `interval` (30 ms default).
3. **Flow-Control zwingend**: Der Drucker sendet mitten im Druck
   `5178AE0101001070FF`; ohne Pausierung verliert man Zeilen. Eine Alternative
   muss die Write-Queue anhalten und bei `…000000FF` fortsetzen.
4. **Fehlerstatus**: `err:`-Notifies (ASCII `6572723a…`) und A3-Statusbytes
   (papierlos/überhitzt/Akku) → Druck abbrechen bzw. pausieren.
5. **Bildbreite** einhalten (GT01: 384 px); Bildbreite ≠ Druckerbreite →
   horizontale Polsterung/Scaling im Vorfeld (`handleImageWithoutModel`).
6. **Mehrfachdruck**: Komplette Sequenz wiederholen; bei Label-Druckern mit
   Black-Mark die Positionierungskommandos (Dok 06) zwischen den Kopien.
7. **Dichte**: `F2`-Frame mit Energie-Wert (1–200) bzw. `A4`-Quality 1–5;
   fabrikdefaults aus `PrinterModel.java` (12000/20000 Energie).

## SPP-Fall (V6/V7S/V8/V10)

```
BluetoothAdapter.startDiscovery → BroadcastReceiver (ACTION_FOUND)
socket = device.createInsecureRfcommSocketToServiceRecord(SPP-UUID)
socket.connect()
V6: send 1B7944454E → warte 5 s auf DEN-Antwort → BAT/VER/MAC-Queries
V8: send 1B02 → warte 2–5 s („oldversion“ = Fehler)
Bild: getBitMapHex_v7s/_v8/_v10 → print_hex(e, chunk=e.length)
      → Output.write + flush, Antwortpolling (XON/„remedy“)
Feed: 1B6460 / 1B6406 / … (je Chunk-Größe, Dok 03)
```

## Referenz-Implementierung (Pseudocode, 5178-Protokoll)

```python
CRC_TABLE = crc8_table(0x07)  # Poly 0x07, Init 0, MSB-first

def frame(cmd: int, payload: bytes) -> bytes:
    n = len(payload)
    body = bytes([0x51, 0x78, cmd, n >> 8 & 0xFF, n & 0xFF]) + payload
    crc = crc8(payload)          # über Payload
    return body + bytes([crc]) + b"\xff"

STATUS   = frame(0xA3, bytes([0x00, 0x00, 0x00]))
LATTICE  = bytes.fromhex("5178A6000B00AA551738445F5F5F44382CA1FF")
FINISH   = bytes.fromhex("5178A6000B00AA551B000000000000001B11FF")
MODE_IMG = frame(0xBE, bytes([0x00, 0x00, 0x00]))
SPEED    = lambda s: frame(0xBD, bytes([s, 0x00]))
ENERGY   = lambda e: frame(0xAF, e.to_bytes(2, "little"))
FEED     = frame(0xA1, (0x0030).to_bytes(2, "big"))
DENSITY  = lambda e: bytes.fromhex("5178F2000200") + bytes(
             [crc8(bytes([0x01, e]))]) + b"\xff"

def line_frame(row_bits_1bpp_lsb_first: bytes) -> bytes:
    # 51 78 A2 00 <len> 00 <rowbytes> <crc8(rowbytes)> FF
    head = bytes([0x51, 0x78, 0xA2, 0x00, len(row_bits_1bpp_lsb_first), 0x00])
    return head + row_bits_1bpp_lsb_first + bytes([crc8(row_bits_1bpp_lsb_first)]) + b"\xff"

# Hinweis: Die LEN-Feld-Deutung („00 30 00“ bei A2) ist aus Beobachtungen der
# Encoder abgeleitet; die Byte-Reihenfolge variiert je Kommando – im Zweifel
# die Frames aus V5g.java nachbilden (analysis/decompiled/V5g.java).
```

> Wichtig: Die Frames oben sind **aus dem Code des Original-Plugins rekonstruiert**
> (`V5g.java`, `V5gCMD.java`, `ytbBleFastV3Module.java`). Für die erste Live-Verbindung
> empfiehlt es sich, mit einem BLE-Sniffer (z. B. nRF Connect: Write-Stream der
> Original-App mitschneiden) die Reihenfolge am eigenen Gerät zu verifizieren.
