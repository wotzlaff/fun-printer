# 03 – Bluetooth Transports

The app uses **three different transport paths**; the protocol depends on the
model (see Doc 02).

## A) Bluetooth Classic SPP (Android) – `models/printer/android.js` (module `0774`)

Implemented entirely in JavaScript via the DCloud bridge
(`plus.android.importClass("android.bluetooth.…")`):

1. **Adapter**: `BluetoothAdapter.getDefaultAdapter()`; if disabled:
   `adapter.enable()` (deprecated, but that is what the app does) + modal dialog.
2. **Discovery**: `adapter.startDiscovery()` + `BroadcastReceiver` (via
   `plus.android.implements("io.dcloud.android.content.BroadcastReceiver", …)`)
   on `ACTION_FOUND`/`DISCOVERY_STARTED`/`DISCOVERY_FINISHED`/`STATE_CHANGED`.
   - Special case: MAC prefix `00:15:83:3B` → name normalized to `JX400R`.
   - V7S validation: the last 4 characters of the name must match the last 4 of
     the MAC (without colons).
   - Additionally `getBondedDevices()` via `BluetoothManager` for paired devices.
3. **Connection**: `device.createInsecureRfcommSocketToServiceRecord(
   UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"))` → `socket.connect()`
   (insecure RFCOMM channel, standard SPP UUID). Success is checked after 4 s by timer.
4. **Writing**: `socket.getOutputStream()` → `write(byte[])` + `flush()`.
   JS converts hex strings to Java `byte[]` (signed bytes; functions `z()`/`w()`
   in `0774.js`).
5. **Reading/responses**: `socket.getInputStream().available()` / `read()` in a
   polling loop; the read loop terminates on:
   - `0D 0A` (CRLF),
   - a lone `0x11` (XON) as 2-character hex,
   - firmware acks `1E 00 08 00 00 01 B6 DD`, `1E 00 08 03 00 01 AA D4`,
     `1E 00 0A 03 …` (20 characters),
   - otherwise after `available()` length.
6. **Handshake after connecting**:
   - V6/V6PRO: send `1B 79 44 45 4E` ("ESC y DEN") and wait 5 s for the response;
   - V8/V8PRO: `v8_is_connected()` sends `1B 02` and expects a response within
     2–5 s, otherwise `"oldversion"` = error.

Chunking for SPP printing (function `p()`): the byte sequence is sent in chunks
of size `i`; after the last chunk a feed command follows depending on `i`:

| Chunk size (bytes) | Feed after printing |
|---|---|
| 3000 | `1B 64 60` (ESC d 0x60) |
| 2314 | `1B 62 01 B0` |
| 3466 | `1B 64 06` (ESC d 6) |
| 2322 / 3474 | (none) |
| otherwise | `1B 4A 50` (ESC J 0x50 = 80 dot feed) |

The chunk sizes correspond to the model types (image heights/band sizes) and are
passed as the 4th argument of `print_hex()` (e.g. `6*s+10`, or `e.length` for
single packets).

**Response-driven sending**: after each chunk, `m()` reads the response:
- `11` (XON) → send the next chunk,
- empty → resend the same chunk ("remedy"),
- known command (see the list in `m()`) → no response expected.

## B) BLE via uni APIs (iOS path) – `models/printer/ble.js` (module `c543`) and `ios.js` (`daf2`)

1. `uni.openBluetoothAdapter` → `uni.startBluetoothDevicesDiscovery`
   → filter devices by **name list** (list in Doc 02).
2. `uni.createBLEConnection(deviceId)` → after 1.5 s `uni.getBLEDeviceServices`.
3. **Characteristic selection** (no fixed UUIDs needed, but compatible with Doc 04):
   - write characteristic: first with `properties.write && !properties.read`;
   - notify characteristic: first with `properties.notify || properties.indicate`.
4. `uni.notifyBLECharacteristicValueChange` → then immediately send status query
   `51 78 A3 00 01 00 00 00 FF`.
5. **MTU**: for known printer names `uni.setBLEMTU(82)` → packet size 50 B,
   otherwise **20 B** per `uni.writeBLECharacteristicValue`.
6. iOS printing (`daf2.js`): chunk sizes 2314 (default), 1157, 1733, 3000;
   after the last packet group a feed follows: >6000 → `1B 4A 50`, 3000 → `1B 64 60`,
   otherwise `1B 62 01 C0`.

## C) BLE via native plugin "Ytbbluetooth" (main Android path) – `com.wtx.ytbbleplugin`

Plugin: `ytbBleFastV3Module` (FastBLE library `com.clj.fastble`), source class in
`analysis/decompiled/ytbBleFastV3Module.java`.

### GATT UUIDs (depending on board)

| Service | Write | Notify (data) | Notify (general) |
|---|---|---|---|
| `0000FF00-0000-1000-8000-00805F9B34FB` | `0000FF02` (write, no response) | `0000FF03` | `0000FF01` |
| `0000AE30-0000-1000-8000-00805F9B34FB` | `0000AE03` (write) / `0000AE01` (write cmd) | – | `0000AE02` |
| `0000200A-0000-1000-8000-00805F9B34FB` (R5 board) | `0000202A` | `0000204A` | `0000203A` |

(Source: `ytbBleFastV3Module.java` lines ~447–464, `ytbBleFastModule.java` ~503–511.)

### JS API of the plugin (Android path)

- `Ytbbluetooth.init()` / `uniInit()` – initialize the BT stack
- Scan: callback `type 4` with `{ble_name, ble_address, FFValue?}` (FFValue =
  manufacturer broadcast bytes, used for MXW01 board detection)
- `connect` → after MTU change (`type 102`) `setMtu(503)` + `openNotification`
  (subscribe to the notify characteristic) → `type 108` = "actually connected"
- `printCmdFromHexstring({hex_cmd, speed, model, is_command, package_length, needSplitHex})`
  → FlowWrite queue

### Chunking & flow control (FlowWrite.java / FlowWriteV2 / FlowWriteForQ7 / FlowWriteForV10G)

- Hex string → bytes, `splitByte(data, chunkSize)`: chunk = `package_length`
  (V5X: 384/480) or the plugin's `perPackageLength` default; otherwise model MTUs
  from `PrinterModel.java` (GT01: img 123 B, text 83 B).
- Between two packets: `intervalBetweenTwoPackage` = the `speed` parameter
  (JS default 30 ms; MX05: 36 ms; V10G/D2: 60 ms; 55AA and 5178A1 tail: 10 ms).
- **Flow-control notifications** (native handler `handleMainNotification`):

| Notification (hex) | Effect |
|---|---|
| `aa01`, `5178ae0101001070ff`, `2221a800010020e0ff`, `2221ae0101001070ff`, `2221ae0001000000`, `5688a70101000107ff` | **Stop** – write queue paused (`setCanWriteFlag(false)` + wait) |
| `aa00`, `5178ae0101000000ff`, `2221a80001003090ff`, `2221ae0101000000ff`, `2221ae0001001000`, `5688a70101000000ff` | **Continue** – queue resumes (`notify()`) |

- **Error status** (cancels printing): notification with prefix `6572723a`
  (ASCII `err:`), 16 hex chars; bit 2 of the byte at position 10–12 = print head
  overheat, bits "11" at position 12–14 = out of paper → `setCancalPrintFlag(true)`.

## D) Further transports

- **WiFi/TCP socket**: `socket_port 8081` (touchscreen devices, "FriendAI") –
  JSON messages (`socket.send_message({action, parameter})`), not a thermal printer protocol.
- **iOS SPP**: the `AutoPrinterV5` plugin accepts `ble_type: "btspp"` on iOS
  (`d51f.js`) – the plugin then handles the classic Bluetooth serial port.
