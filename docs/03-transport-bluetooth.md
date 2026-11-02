# 03 – Bluetooth-Transport

Die App verwendet **drei verschiedene Transportwege**; das Protokoll hängt am Modell
(siehe Dok 02).

## A) Bluetooth Classic SPP (Android) – `models/printer/android.js` (Modul `0774`)

Implementierung komplett in JavaScript über die DCloud-Brücke
(`plus.android.importClass("android.bluetooth.…")`):

1. **Adapter**: `BluetoothAdapter.getDefaultAdapter()`; falls deaktiviert:
   `adapter.enable()` (deprecated, aber so macht es die App) + Modal.
2. **Discovery**: `adapter.startDiscovery()` + `BroadcastReceiver` (über
   `plus.android.implements("io.dcloud.android.content.BroadcastReceiver", …)`)
   auf `ACTION_FOUND`/`DISCOVERY_STARTED`/`DISCOVERY_FINISHED`/`STATE_CHANGED`.
   - Sonderfall: MAC-Präfix `00:15:83:3B` → Name wird zu `JX400R` normalisiert.
   - V7S-Validierung: letzte 4 Zeichen des Namens müssen den letzten 4 der MAC
     (ohne Doppelpunkte) entsprechen.
   - Zusätzlich `getBondedDevices()` über `BluetoothManager` für gekoppelte Geräte.
3. **Verbindung**: `device.createInsecureRfcommSocketToServiceRecord(
   UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"))` → `socket.connect()`
   (unsicherer RFCOMM-Kanal, Standard-SPP-UUID). Erfolgscheck nach 4 s per Timer.
4. **Schreiben**: `socket.getOutputStream()` → `write(byte[])` + `flush()`.
   JS konvertiert Hex-Strings zu Java-`byte[]` (Vorzeichenbehaftete Bytes,
   Funktion `z()`/`w()` in `0774.js`).
5. **Lesen/Antworten**: `socket.getInputStream().available()` / `read()` in einem
   Polling-Loop; Leseschleife terminiert auf:
   - `0D 0A` (CRLF),
   - einzelnes `0x11` (XON) als 2-Zeichen-Hex,
   - Firmware-Acks `1E 00 08 00 00 01 B6 DD`, `1E 00 08 03 00 01 AA D4`,
     `1E 00 0A 03 …` (20 Zeichen),
   - sonst nach `available()`-Länge.
6. **Handshake nach dem Verbinden**:
   - V6/V6PRO: sende `1B 79 44 45 4E` („ESC y DEN“) und warte auf Antwort (5 s);
   - V8/V8PRO: `v8_is_connected()` sendet `1B 02` und erwartet Antwort binnen 2–5 s,
     sonst `"oldversion"` = Fehler.

Chunking beim SPP-Druck (Funktion `p()`): Die Bytefolge wird in Stücke der
Größe `i` gesendet; nach dem letzten Stück folgt je nach `i` ein Feed-Befehl:

| Chunk-Größe (Bytes) | Feed nach dem Druck |
|---|---|
| 3000 | `1B 64 60` (ESC d 0x60) |
| 2314 | `1B 62 01 B0` |
| 3466 | `1B 64 06` (ESC d 6) |
| 2322 / 3474 | (keiner) |
| sonst | `1B 4A 50` (ESC J 0x50 = 80 Dot-Feed) |

Die Chunk-Größen entsprechen den Modelltypen (Bildhöhen/Bandgrößen) und werden als
4. Argument von `print_hex()` übergeben (z. B. `6*s+10` oder `e.length` für Einzelpakete).

**Antwortgesteuertes Senden**: Nach jedem Chunk liest `m()` die Antwort:
- `11` (XON) → nächsten Chunk senden,
- leer → denselben Chunk wiederholen („remedy“),
- bekannter Befehl (einsehen: Liste in `m()`) → keine Antwort erwartet.

## B) BLE über uni-APIs (iOS-Pfad) – `models/printer/ble.js` (Modul `c543`) und `ios.js` (`daf2`)

1. `uni.openBluetoothAdapter` → `uni.startBluetoothDevicesDiscovery`
   → Geräte nach **Namen-Liste** filtern (Liste in Dok 02).
2. `uni.createBLEConnection(deviceId)` → nach 1,5 s `uni.getBLEDeviceServices`.
3. **Characteristic-Auswahl** (keine fixen UUIDs nötig, aber kompatibel zu Dok-04):
   - Write-Char: erste mit `properties.write && !properties.read`;
   - Notify-Char: erste mit `properties.notify || properties.indicate`.
4. `uni.notifyBLECharacteristicValueChange` → danach sofort Status-Query
   `51 78 A3 00 01 00 00 00 FF` senden.
5. **MTU**: Für bekannte Druckernamen `uni.setBLEMTU(82)` → Paketgröße 50 B,
   sonst **20 B** pro `uni.writeBLECharacteristicValue`.
6. iOS-Print (`daf2.js`): Chunk-Größen 2314 (default), 1157, 1733, 3000;
   nach der letzten Paketgruppe Feed: >6000 → `1B 4A 50`, 3000 → `1B 64 60`,
   sonst `1B 62 01 C0`.

## C) BLE über natives Plugin „Ytbbluetooth“ (Android-Hauptpfad) – `com.wtx.ytbbleplugin`

Plugin: `ytbBleFastV3Module` (FastBLE-Bibliothek `com.clj.fastble`), Quellklasse in
`analysis/decompiled/ytbBleFastV3Module.java`.

### GATT-UUIDs (je nach Board)

| Service | Write | Notify (Daten) | Notify (allgemein) |
|---|---|---|---|
| `0000FF00-0000-1000-8000-00805F9B34FB` | `0000FF02` (write, ohne Response) | `0000FF03` | `0000FF01` |
| `0000AE30-0000-1000-8000-00805F9B34FB` | `0000AE03` (write) / `0000AE01` (write cmd) | – | `0000AE02` |
| `0000200A-0000-1000-8000-00805F9B34FB` (R5-Board) | `0000202A` | `0000204A` | `0000203A` |

(Quelle: `ytbBleFastV3Module.java` Zeilen ~447–464, `ytbBleFastModule.java` ~503–511.)

### JS-API des Plugins (Android-Pfad)

- `Ytbbluetooth.init()` / `uniInit()` – BT-Stack initialisieren
- Scan: Callback `type 4` mit `{ble_name, ble_address, FFValue?}` (FFValue =
  Hersteller-Broadcast-Bytes, genutzt für MXW01-Board-Erkennung)
- `connect` → nach MTU-Change (`type 102`) `setMtu(503)` + `openNotification`
  (Subscribe auf Notify-Char) → `type 108` = „wirklich verbunden“
- `printCmdFromHexstring({hex_cmd, speed, model, is_command, package_length, needSplitHex})`
  → FlowWrite-Queue

### Chunking & Flow-Control (FlowWrite.java / FlowWriteV2 / FlowWriteForQ7 / FlowWriteForV10G)

- Hex-String → Bytes, `splitByte(data, chunkSize)`: chunk = `package_length`
  (V5X: 384/480) bzw. `perPackageLength`-Default des Plugins; sonst Modell-MTUs
  aus `PrinterModel.java` (GT01: img 123 B, text 83 B).
- Zwischen zwei Paketen: `intervalBetweenTwoPackage` = `speed`-Parameter
  (JS default 30 ms; MX05: 36 ms; V10G/D2: 60 ms; 55AA- und 5178A1-Tail: 10 ms).
- **Flow-Control-Notifies** (Native-Handler `handleMainNotification`):

| Notify (hex) | Wirkung |
|---|---|
| `aa01`, `5178ae0101001070ff`, `2221a800010020e0ff`, `2221ae0101001070ff`, `2221ae0001000000`, `5688a70101000107ff` | **Stopp** – Write-Queue pausiert (`setCanWriteFlag(false)` + wait) |
| `aa00`, `5178ae0101000000ff`, `2221a80001003090ff`, `2221ae0101000000ff`, `2221ae0001001000`, `5688a70101000000ff` | **Weiter** – Queue läuft (`notify()`) |

- **Fehlerstatus** (bricht Druck ab): Notify mit Präfix `6572723a` (ASCII `err:`),
  16 Hex-Zeichen; Bit 2 des Bytes an Position 10–12 = Druckkopf überhitzt,
  Bits „11“ an Position 12–14 = papierlos → `setCancalPrintFlag(true)`.

## D) Weitere Transporte

- **WiFi/TCP-Socket**: `socket_port 8081` (Geräte mit Touchscreen, „FriendAI“) –
  JSON-Nachrichten (`socket.send_message({action, parameter})`), kein Thermoprinter-Protokoll.
- **iOS SPP**: Das `AutoPrinterV5`-Plugin akzeptiert `ble_type: "btspp"` auf iOS
  (`d51f.js`) – dort übernimmt das Plugin den klassischen Bluetooth-Serial-Port.
