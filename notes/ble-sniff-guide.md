# BLE Sniff Guide (verify the documented protocol on the real MX10)

Goal: capture the actual GATT traffic of the **original Fun Print app** while it
prints, and compare it against [Doc 04](../docs/04-protocol-5178.md). No extra
hardware needed – Android can log its own Bluetooth controller traffic.

## Method 1 (recommended): Android HCI snoop log

Works on nearly all Android 8+ devices, no root required.

1. **Enable developer options**: Settings → About phone → tap "Build number" 7×.
2. **Enable the log**: Developer options → **"Bluetooth HCI snoop log"**
   (German: *Bluetooth-HCI-Protokoll*).
3. **Restart Bluetooth** (off/on); on some devices a reboot is needed.
4. Keep other Bluetooth devices disconnected so the log stays clean.
5. Open the **original Fun Print app**, connect the MX10 and print:
   - one **small photo** (image mode),
   - one **small label** (label mode), and
   - ideally one print that pauses mid-way (large image → flow control `AE`).
6. **Pull the log**:
   - With a PC + [platform-tools](https://developer.android.com/tools/releases/platform-tools):
     `adb bugreport bugreport.zip`
   - Without a PC: Developer options → "Take bug report" (the report is generated
     on the phone and can be shared as a file).
7. In the zip, the log lives at
   `FS/data/misc/bluetooth/logs/btsnoop_hci.log` (sometimes rotated
   `btsnoop_hci.log.last`). Extract just that file.
8. Turn the HCI snoop option **off again** (the log records all Bluetooth
   traffic, including other devices' traffic – treat it as private data).

## Method 2 (fallback): hardware sniffer

If your ROM does not produce the log: a Nordic **nRF52840 dongle** (~10 €) with
the "nRF Sniffer for Bluetooth LE" firmware + Wireshark plugin captures live
advertising/connection traffic. Only needed if Method 1 fails.

## Analyzing the capture

`btsnoop_hci.log` opens directly in **Wireshark** (filter `btatt`):

| Filter | Shows |
|---|---|
| `btatt.opcode.method == 0x52` | Write Command (app → printer, **without response** – expected!) |
| `btatt.opcode.method == 0x12` | Write Request (with response) |
| `btatt.opcode.method == 0x1b or 0x1d` | Notifications (printer → app: status, flow control) |
| `btatt.opcode.method == 0x02 or 0x03` | MTU exchange (native plugin requests **503**) |

For a quick full dump: `tshark -r btsnoop_hci.log -Y btatt -T fields -e frame.number -e btatt.opcode.method -e btatt.ehandle -e btatt.value`

**Or use the repo's zero-dependency parser** (pure Python, verifies CRCs live):

```bash
python3 analysis/parse-btsnoop.py btsnoop_hci.log                 # all ATT traffic
python3 analysis/parse-btsnoop.py btsnoop_hci.log --5178          # decoded 51 78 frames + CRC check
python3 analysis/parse-btsnoop.py btsnoop_hci.log --expected 384  # full print-sequence check vs Doc 04
```

Drop the log into `/tmp` or `notes/captures/` (gitignored – contains private
traffic) and the analysis can run here.

## Verification checklist (map to Doc 04)

- [ ] Service/characteristics actually used: `FF00` (FF02 write / FF01+FF03 notify),
      or `AE30` / `200A` instead
- [ ] Negotiated MTU (expect 503 from the native plugin; 82 via uni path)
- [ ] Write chunk size in bytes (GT01 constants say **123 B image / 83 B text**)
      and the pacing between packets (default 30 ms)
- [ ] Frame sequence of one print job matches Doc 04:
      `F2` density → `A3` status → `A4` quality → `A6` lattice start →
      `AF` energy → `BE` mode → `A2` lines → `BD` speed → `A1` feed →
      `A6` lattice end → `A3` status
- [ ] Density payload in `F2` and energy in `AF` for the chosen quality level
- [ ] Line frame length = 48 bytes for 384 px width, bit 0 = leftmost pixel
- [ ] Flow-control notifications `5178AE0101001070FF` / `…000000FF` appear
      mid-print and the write stream actually pauses
- [ ] Status responses (`…a3…`, 18/22 chars) match the state table in Doc 04
- [ ] Board identity: does the app send anything containing "GT10"? (Doc 02 open point)
