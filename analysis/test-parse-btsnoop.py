#!/usr/bin/env python3
"""Self-test for parse-btsnoop.py: builds a synthetic btsnoop_hci.log containing
one complete MX10 print job (frames exactly as documented in docs/04), then
runs the parser over it and checks the output."""
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

def crc8(data):
    t = 0
    for b in data:
        c = t ^ (b & 0xFF)
        for _ in range(8):
            c = ((c << 1) ^ 0x07) & 0xFF if c & 0x80 else (c << 1) & 0xFF
        t = c
    return t

def frame(cmd, payload):
    n = len(payload)
    return bytes([0x51, 0x78, cmd, (n >> 8) & 0xFF, n & 0xFF, 0x00]) \
         + payload + bytes([crc8(payload), 0xFF])

def build_print_job(width=384, lines=4):
    """A complete print job per Doc 04 with the GT01 defaults."""
    job = bytearray()
    job += frame(0xF2, bytes([0x01, 0x78]))                       # density 120
    job += frame(0xA3, b"\x00")                                   # status query
    job += frame(0xA4, bytes([0x33]))                             # quality 3
    job += bytes.fromhex("5178A6000B00AA551738445F5F5F44382CA1FF")  # lattice start
    job += frame(0xAF, (12000).to_bytes(2, "little"))             # energy
    job += frame(0xBE, b"\x00")                                   # mode image
    row_bytes = width // 8
    for i in range(lines):
        row = bytearray(row_bytes)
        row[i % row_bytes] = 0xFF                                  # some pattern
        job += frame(0xA2, bytes(row))
    job += frame(0xBD, bytes([55]))                               # speed
    job += frame(0xA1, bytes([0x30, 0x00]))                       # feed ×2
    job += frame(0xA1, bytes([0x30, 0x00]))
    job += bytes.fromhex("5178A6000B00AA5517000000000000001711FF")  # lattice end
    job += frame(0xA3, b"\x00")
    return bytes(job)

def write_btsnoop(path):
    """Write a btsnoop file: MTU exchange, GATT write (fragmented over 2 ACL
    packets), notify response, flow-control notify."""
    handle = 0x0033
    records = []

    def h4_acl(direction, payload):
        # split into ACL packets of max 251 bytes (start + continuations)
        pb = 0x2
        mtu_pkt = 250
        i = 0
        while i < len(payload) or i == 0:
            chunk = payload[i:i + mtu_pkt]
            hf = (handle & 0x0FFF) | (pb << 12)
            rec = bytes([0x02]) + struct.pack("<HH", hf, len(chunk)) + chunk
            records.append((direction, rec))
            i += mtu_pkt
            pb = 0x1
            if i >= len(payload):
                break

    def h4_event(payload):
        records.append(("RX", bytes([0x04]) + payload))

    # ATT on L2CAP cid 0x0004
    def att(direction, att_payload):
        l2cap = struct.pack("<HH", len(att_payload), 0x0004) + att_payload
        h4_acl(direction, l2cap)

    att("TX", bytes([0x02]) + struct.pack("<H", 503))              # MTU request
    h4_event(bytes([0x03, 0x02, 0x03, struct.pack("<H", 247)[0]]))  # dummy
    job = build_print_job()
    # split the job into BLE write chunks of 123 bytes (GT01 img MTU)
    for i in range(0, len(job), 123):
        chunk = job[i:i + 123]
        att("TX", bytes([0x52]) + struct.pack("<H", 0x000B) + chunk)
    # printer: flow control stop + status notify
    att("RX", bytes([0x1B]) + struct.pack("<H", 0x000A)
        + bytes.fromhex("5178AE0101001070FF"))
    att("RX", bytes([0x1B]) + struct.pack("<H", 0x000A)
        + bytes.fromhex("0AA3000440"))                             # non-5178 raw → raw print

    # write btsnoop container
    with open(path, "wb") as f:
        f.write(b"btsnoop\x00" + struct.pack(">II", 1, 1002))
        for direction, rec in records:
            f.write(struct.pack(">IIIIQ", len(rec), len(rec),
                                1 if direction == "TX" else 0, 0, 0))
            f.write(rec)

def main():
    with tempfile.TemporaryDirectory() as d:
        log = Path(d) / "btsnoop_hci.log"
        write_btsnoop(str(log))
        result = subprocess.run(
            [sys.executable, str(Path(__file__).parent / "parse-btsnoop.py"),
             str(log), "--5178"],
            capture_output=True, text=True)
    out = result.stdout
    checks = {
        "MTU 503 seen":        "MTU exchange: ('request', 503)" in out,
        "frames decoded":      out.count("51 78") >= 12,
        "lattice start found": "AA551738445F5F5F44382C" in out,
        "lattice end found":   "AA55170000000000000017" in out,
        "density F2 decoded":  "51 78 F2 LEN=2 payload=0178" in out,
        "energy AF decoded":   "51 78 AF LEN=2 payload=E02E" in out,
        "speed BD decoded":    "51 78 BD LEN=1 payload=37" in out,
        "all CRC OK":          "CRC-FAIL" not in out and out.count("CRC-OK") >= 12,
        "flow ctrl seen":      "51 78 AE LEN=1 payload=10" in out,
        "raw notify fallback": "0AA3000440" in out,
    }
    ok = True
    for name, passed in checks.items():
        print(f"{'OK ' if passed else 'FAIL'} {name}")
        ok &= passed
    print("SELFTEST", "PASSED" if ok else "FAILED")
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
