# 08 – End-to-End Print Workflow

Example: **Android app ↔ BLE mini printer (GT01 board, e.g. MX01/MXW009)**
– the most common case for a "small Chinese thermal printer".

## Sequence

```
App (JS)                        Native plugin (Ytbbluetooth)      Printer
──────                          ───────────────────────────       ───────
init() ───────────────────────▶ initBleParam()
scan() ───────────────────────▶ BleManager.scan
  ◀─ type 4 {ble_name, addr, FFValue} ──────────────────────── Adv packets
connect(addr) ────────────────▶ connect → onConnected
                                setMtu(503) ────────────────────▶ MTU change
                                openNotification(FF01/FF03) ────▶ write CCCD
  ◀─ type 108 (subscribe ok = "actually connected")
print_cmd(2221B1…) for V5X / status query for V5G ─────────────▶ 5178A30001000000FF
  ◀──────────────────────────── Notify: status (a3 …) ◀─────────

[image]
Pick image → editing (0a9f.opencv: enhance/dither/crop)
ImageProcess.hex({image_path, model:"v5g", blePrexName:"GT01", …})
  → {hex: "<5178A1…><A4…><A6…><AF…><BE…><A2 lines…><BD…><A1…><A6…>"}
JS wrap: + F2 density + A3 status + … + A3 status
android_ble.print_hex(hex_cmd, model, cb, nums, [], isLabel)
  ─────────────────────────────▶ printCmdFromHexstring({hex_cmd, speed:30, …})
                                FlowWrite.flowWrite(splitBy(package_length),
                                  interval=speed)
                                per packet: writeCharacteristic(FF02, no response)
                                  ◀── flow-control notifications (AE 10/00) ──
  ◀─ onWriteSuccess(current,total) (progress callbacks type 101)
  ◀─ type 51/52 (finished / cancelled)
print_complete → status query, statistics upload (print_log)
```

## Critical details for an alternative implementation

1. **Connection order**: connect → MTU → subscribe → only then send the status
   query (the printer acknowledges the subscription with a ready status; only
   after that does it cleanly accept data).
2. **Packet size**: 20 B without MTU negotiation, 50 B at MTU 82 (uni path),
   plugin-side 83–123 B or 384/480 B (V5X). The native library writes **without
   write response** (`writeType false` = WRITE_TYPE_NO_RESPONSE) and paces via
   `interval` (30 ms default).
3. **Flow control is mandatory**: the printer sends `5178AE0101001070FF` mid
   print; without pausing you lose lines. An alternative must stop the write
   queue and resume on `…000000FF`.
4. **Error status**: `err:` notifications (ASCII `6572723a…`) and A3 status
   bytes (paper out / overheat / battery) → cancel or pause printing.
5. **Respect the print width** (GT01: 384 px); image width ≠ printer width →
   pad/scale horizontally beforehand (`handleImageWithoutModel`).
6. **Multiple copies**: repeat the whole sequence; for label printers with a
   black mark, run the positioning commands (Doc 06) between copies.
7. **Density**: `F2` frame with an energy value (1–200) or `A4` quality 1–5;
   factory defaults from `PrinterModel.java` (12000/20000 energy).

## SPP case (V6/V7S/V8/V10)

```
BluetoothAdapter.startDiscovery → BroadcastReceiver (ACTION_FOUND)
socket = device.createInsecureRfcommSocketToServiceRecord(SPP-UUID)
socket.connect()
V6: send 1B7944454E → wait 5 s for DEN response → BAT/VER/MAC queries
V8: send 1B02 → wait 2–5 s ("oldversion" = error)
Image: getBitMapHex_v7s/_v8/_v10 → print_hex(e, chunk=e.length)
      → Output.write + flush, response polling (XON/"remedy")
Feed: 1B6460 / 1B6406 / … (per chunk size, Doc 03)
```

## Reference implementation (pseudocode, 5178 protocol)

```python
CRC_TABLE = crc8_table(0x07)  # poly 0x07, init 0, MSB-first

def frame(cmd: int, payload: bytes) -> bytes:
    n = len(payload)
    head = bytes([0x51, 0x78, cmd, (n >> 8) & 0xFF, n & 0xFF, 0x00])
    return head + payload + bytes([crc8(payload)]) + b"\xff"

STATUS   = frame(0xA3, b"\x00")                                  # 5178A30001000000FF
LATTICE  = bytes.fromhex("5178A6000B00AA551738445F5F5F44382CA1FF")
FINISH   = bytes.fromhex("5178A6000B00AA5517000000000000001711FF")
MODE_IMG = frame(0xBE, b"\x00")                                  # 5178BE0001000000FF
SPEED    = lambda s: frame(0xBD, bytes([s]))                     # e.g. s=25 → …19 4F FF
ENERGY   = lambda e: frame(0xAF, e.to_bytes(2, "little"))        # 12000 → …E02E 89 FF
FEED     = frame(0xA1, bytes([0x30, 0x00]))                      # …3000 F9 FF
DENSITY  = lambda e: frame(0xF2, bytes([0x01, e]))               # 51 78 F2 0002 00 01 <e> <crc> FF
QUALITY  = lambda q: frame(0xA4, bytes([0x30 + q]))              # q=1..5 → 0x31..0x35

def line_frame(row_bits_1bpp_lsb_first: bytes) -> bytes:
    # 51 78 A2 <LEN16 BE> 00 <rowbytes> <crc8(rowbytes)> FF
    return frame(0xA2, row_bits_1bpp_lsb_first)

# Gray variant: payload = 1 gray-value byte per pixel instead of 1 bpp line bytes.
```

> Important: the frames above are **reconstructed from the original plugin code**
> (`V5g.java`, `V5gCMD.java`, `ytbBleFastV3Module.java`); all CRC examples were
> verified computationally against frames observed in the code/JS (see Doc 04).
> For the first live connection it is still advisable to verify the order on your
> own device with a BLE sniffer (e.g. nRF Connect: capture the original app's
> write stream).

A runnable version of this pseudocode with a passing CRC self-test lives in
[`analysis/reference-encoder.py`](../analysis/reference-encoder.py).
