#!/usr/bin/env python3
"""Zero-dependency parser for Android Bluetooth HCI snoop logs (btsnoop_hci.log).

Decodes ATT traffic (writes/notifications) and optionally verifies the "51 78"
print protocol frames against docs/04-protocol-5178.md, including live CRC checks.
Write/notify payloads are reassembled into per-handle streams first, because BLE
chunking cuts protocol frames across GATT writes.

File format (public, well documented):
  - 16-byte header: "btsnoop\0" + version(4) + datalink(4, 1002 = HCI UART/H4)
  - records: original_len(4) included_len(4) flags(4) drops(4) timestamp(8) + packet
  - H4 packet types: 0x02 ACL data, 0x04 HCI event
  - ACL → L2CAP (len, cid); ATT lives on cid 0x0004
  - ATT opcodes: 0x12 Write Request, 0x52 Write Command, 0x1B/0x1D notifications,
    0x02/0x03 MTU exchange

Usage:
  python3 parse-btsnoop.py btsnoop_hci.log                # summary + all ATT data
  python3 parse-btsnoop.py btsnoop_hci.log --5178         # decoded 51 78 frames + CRC check
  python3 parse-btsnoop.py btsnoop_hci.log --handles      # only the per-handle summary
"""
import struct
import sys
from collections import defaultdict

ATT_NAMES = {
    0x02: "MTU_REQ", 0x03: "MTU_RSP",
    0x12: "WRITE_REQ", 0x52: "WRITE_CMD",
    0x1B: "NOTIFY", 0x1D: "INDICATE",
    0x10: "READ_RSP", 0x0A: "READ_REQ",
}

# ---------------------------------------------------------------- btsnoop layer
def read_records(path):
    with open(path, "rb") as f:
        header = f.read(16)
        if header[:8] != b"btsnoop\x00":
            raise SystemExit("Not a btsnoop file (bad magic)")
        version, datalink = struct.unpack(">II", header[8:16])
        if datalink != 1002:
            raise SystemExit(f"Unsupported datalink {datalink} (expect 1002 = H4)")
        while True:
            rec = f.read(24)
            if len(rec) < 24:
                break
            orig, inc, flags, drops, ts = struct.unpack(">IIIIQ", rec)
            data = f.read(inc)
            if len(data) < inc:
                break
            yield flags, ts, data

# ---------------------------------------------------------------- H4/ACL layer
def h4_records(records):
    """Yield (direction, ts, acl_handle, l2cap_payload) with ACL reassembly."""
    fragments = {}
    for flags, ts, data in records:
        if not data:
            continue
        ptype = data[0]
        direction = "TX" if (flags & 1) else "RX"  # flags bit0: 1=sent, 0=received
        if ptype == 0x02 and len(data) >= 9:  # ACL
            hf, dlen = struct.unpack("<HH", data[1:5])
            acl_handle = hf & 0x0FFF
            pb = (hf >> 12) & 0x3
            payload = data[5:5 + dlen]
            key = (direction, acl_handle)
            if pb in (0x2, 0x0):          # start of L2CAP packet
                fragments[key] = payload
            elif pb == 0x1 and key in fragments:  # continuation
                fragments[key] += payload
            else:
                continue
            # try L2CAP: len(2) cid(2) …
            buf = fragments[key]
            if len(buf) < 4:
                continue
            l2len, cid = struct.unpack("<HH", buf[:4])
            if len(buf) - 4 < l2len:
                continue                  # wait for more fragments
            l2cap = buf[4:4 + l2len]
            del fragments[key]
            if cid == 0x0004:             # ATT channel
                yield direction, ts, acl_handle, l2cap

# ---------------------------------------------------------------- ATT layer
def att_packets(l2caps):
    for direction, ts, acl_handle, l2 in l2caps:
        if not l2:
            continue
        opcode = l2[0]
        name = ATT_NAMES.get(opcode, f"OPCODE_{opcode:02x}")
        body = l2[1:]
        if opcode in (0x12, 0x52, 0x1B, 0x1D, 0x0A):
            if len(body) >= 2:
                handle = struct.unpack("<H", body[:2])[0]
                yield direction, ts, acl_handle, name, handle, body[2:]
                continue
        if opcode in (0x02, 0x03):        # MTU: payload is 2-byte MTU
            mtu = struct.unpack("<H", body[:2])[0] if len(body) >= 2 else 0
            yield direction, ts, acl_handle, name, None, mtu
            continue
        yield direction, ts, acl_handle, name, None, body

# ---------------------------------------------------------------- 51 78 decoding
def crc8(data):
    t = 0
    for b in data:
        c = t ^ (b & 0xFF)
        for _ in range(8):
            c = ((c << 1) ^ 0x07) & 0xFF if c & 0x80 else (c << 1) & 0xFF
        t = c
    return t

def _parse_frame(buf, i):
    """Parse one frame at offset i. Returns (description, next_offset) or None.
    Layout A (app→printer commands): 51 78 CMD LEN16BE 00 payload crc FF
    Layout B (device→app notifications): 51 78 CMD flags plen 00 payload crc FF
    (both share the wire bytes; A is B with flags=0 — disambiguate by CRC)."""
    if len(buf) < i + 8 or buf[i] != 0x51 or buf[i + 1] != 0x78:
        return None
    cmd = buf[i + 2]
    b3, b4, b5 = buf[i + 3], buf[i + 4], buf[i + 5]

    def try_layout(plen, start, end_reserve):
        end = start + plen
        if end + 2 > len(buf) or buf[end + 1] != 0xFF:
            return None
        body = buf[start:end]
        crc = buf[end]
        good = crc == crc8(body)
        return f"51 78 {cmd:02X} LEN={plen} payload={body.hex().upper()} " \
               f"{'CRC-OK' if good else f'CRC-FAIL(exp {crc8(body):02X} got {crc:02X})'}", end + 2

    if b3 == 0:                            # unambiguous layout A
        r = try_layout(b4, i + 6, 2)
        if r:
            return r
    for plen in (b4, b3):                  # layout B candidates
        r = try_layout(plen, i + 6, 2)
        if r:
            return r
    return None

def decode_stream(buf):
    """Decode a concatenated 51 78 frame stream; returns (lines, tail_bytes)."""
    lines = []
    i = 0
    while i < len(buf):
        r = _parse_frame(buf, i)
        if not r:
            break
        lines.append(r[0])
        i = r[1]
    return lines, buf[i:]

# ---------------------------------------------------------------- main
def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    path = sys.argv[1]
    mode_5178 = "--5178" in sys.argv
    mode_handles = "--handles" in sys.argv

    per_handle = defaultdict(int)
    stats = defaultdict(int)
    mtu_seen = None
    streams = defaultdict(bytearray)   # (direction, att_handle) → payload bytes
    order = []                         # remember stream order
    for direction, ts, acl, name, handle, data in att_packets(h4_records(read_records(path))):
        stats[name] += 1
        if handle is not None:
            per_handle[(direction, name, handle)] += 1
        if name == "MTU_REQ" and isinstance(data, int):
            mtu_seen = mtu_seen or ("request", data)
            mtu_seen = ("request", data) if mtu_seen and mtu_seen[0] != "request" else mtu_seen
        if name == "MTU_RSP" and isinstance(data, int):
            mtu_seen = ("response", data)
        if name in ("WRITE_REQ", "WRITE_CMD", "NOTIFY", "INDICATE") and isinstance(data, bytes):
            key = (direction, handle)
            if key not in streams:
                order.append(key)
            streams[key] += data

    if mode_5178:
        for key in order:
            direction, handle = key
            lines, tail = decode_stream(streams[key])
            if lines:
                print(f"== {direction} stream, ATT handle {handle:#06x} "
                      f"({len(streams[key])} bytes) ==")
                for l in lines:
                    print("   ", l)
                if tail:
                    print(f"    (non-frame tail: {tail.hex().upper()})")
    elif not mode_handles:
        for key in order:
            direction, handle = key
            print(f"== {direction} stream, ATT handle {handle:#06x} "
                  f"({len(streams[key])} bytes) ==")
            data = bytes(streams[key])
            for off in range(0, len(data), 48):
                print(f"    {data[off:off + 48].hex().upper()}")

    print("\n== summary ==")
    print("MTU exchange:", mtu_seen or "none observed")
    for (direction, name, handle), n in sorted(per_handle.items()):
        print(f"  {direction} {name:10s} ATT handle {handle:#06x}: {n} packets")
    for name, n in sorted(stats.items()):
        print(f"  total {name:10s}: {n}")

if __name__ == "__main__":
    main()
