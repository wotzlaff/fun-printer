#!/usr/bin/env python3
"""Reference encoder for the "51 78" BLE protocol of the Fun Print mini printers
(GT01/GT02/MX01/MX02 boards, e.g. MXW009/MXW010).

Target device of this project: **MX10** (model class V5G, 384 px @ 203 dpi) –
defaults below follow the GT01 board constants from PrinterModel.java.

Reconstructed from the decompiled original plugin:
  - analysis/decompiled/V5g.java          (getPrintData, eachLinePixToCmdB)
  - analysis/decompiled/V5gCMD.java       (paper, flowControl)
  - analysis/decompiled/ConvertUtils.java (calcCrc8, CRC-8 poly 0x07)
  - analysis/04-protocol-5178.md          (documentation)

Usage:
  python3 reference-encoder.py image.png > frames.bin
  (any Pillow-readable image; scaled to 384 px and dithered)

The output is the complete byte stream for the BLE write characteristic
(0000FF02 …), already including the density frame, status queries and feed.
Without an image, a short self-test (CRC + frame examples) runs instead.
"""
import sys

# ---------- CRC-8 (poly 0x07, init 0, MSB-first) ----------
def _crc8_table():
    t = []
    for i in range(256):
        c = i
        for _ in range(8):
            c = ((c << 1) ^ 0x07) & 0xFF if c & 0x80 else (c << 1) & 0xFF
        t.append(c)
    return t

CRC8_TABLE = _crc8_table()

def crc8(data: bytes) -> int:
    t = 0
    for b in data:
        t = CRC8_TABLE[t ^ (b & 0xFF)]
    return t

# ---------- Framing: 51 78 <CMD> <LEN16 BE> 00 <payload> <crc8> FF ----------
def frame(cmd: int, payload: bytes) -> bytes:
    n = len(payload)
    return bytes([0x51, 0x78, cmd, (n >> 8) & 0xFF, n & 0xFF, 0x00]) \
         + payload + bytes([crc8(payload), 0xFF])

# ---------- Individual commands (from V5g.java / V5gCMD.java) ----------
def status_query():            return frame(0xA3, b"\x00")                    # getDevState
def mode_image():              return frame(0xBE, b"\x00")                    # print_img
def speed(s: int):             return frame(0xBD, bytes([s]))                 # getPrintSpeed
def energy(e: int):            return frame(0xAF, e.to_bytes(2, "little"))    # getEnerageByte
def paper_feed(dots=0x30):     return frame(0xA1, bytes([dots, 0x00]))        # paper (200 dpi)
def quality(q: int):           return frame(0xA4, bytes([0x30 + q]))          # quality1..5
def density(energy_val: int):  return frame(0xF2, bytes([0x01, energy_val]))  # newer FW

LATTICE_START = bytes.fromhex("5178A6000B00AA551738445F5F5F44382CA1FF")  # printLattice
LATTICE_END   = bytes.fromhex("5178A6000B00AA5517000000000000001711FF")  # finishLattice

# ---------- Bitmap → 1 bpp line frames (eachLinePixToCmdB + bitmapToBWPix) ----------
def bitmap_to_lines(pixels, width, height):
    """pixels: list of height*width gray values (0..255). Returns 1 bpp rows,
    LSB-first per byte, 1 = black (gray value < 128)."""
    row_bytes = width // 8
    lines = []
    for y in range(height):
        row = bytearray(row_bytes)
        for x in range(width):
            if pixels[y * width + x] < 128:          # px2Byte: gray<128 → black
                row[x // 8] |= 1 << (x % 8)          # V5g: pixel 0 = bit 0 (LSB-first)
        lines.append(bytes(row))
    return lines

def encode_print_data(pixels, width, height, speed_val=10, quality_lvl=4,
                      density_val=200, energy_val=15000, paper_feeds=1, dpi=200):
    """Complete sequence per V5g.getPrintData + JS wrap (0a9f.js).

    Defaults follow the **live MX10 capture (2026-11-02)**, see
    docs/04-protocol-5178.md "Live verification":
    density 200 (F2), quality level 4, energy 15000, speed 10, one 48-dot feed.
    GT01 static defaults would be: speed 55, quality 3, energy 12000, 2 feeds.
    """
    out = bytearray()
    out += density(density_val)       # JS: 5178F2 … before the sequence
    out += status_query()             # JS: A3 before the sequence
    out += quality(quality_lvl)       # A4 (payload 0x31..0x35)
    out += LATTICE_START              # A6 … AA 55 17 38 44 …
    out += energy(energy_val)         # AF, 16-bit little-endian
    out += mode_image()               # BE
    row_bytes = width // 8
    for row in bitmap_to_lines(pixels, width, height):
        out += frame(0xA2, row)       # 5178A2 <LEN16=row_bytes> 00 <row> <crc> FF
    out += speed(speed_val)           # BD
    for _ in range(paper_feeds):      # paper × paperNum (GT01: 2)
        out += paper_feed(0x48 if dpi == 300 else 0x30)
    out += LATTICE_END                # A6 … AA 55 17 00 … 17
    out += status_query()             # JS: A3 after the sequence
    return bytes(out)

# ---------- Image loading + Floyd–Steinberg (simplified approximation of the original) ----------
def load_pixels(path, target_width=384):
    from PIL import Image
    img = Image.open(path).convert("L")
    ratio = target_width / img.width
    img = img.resize((target_width, max(1, round(img.height * ratio))))
    px = list(img.getdata())
    w, h = img.width, img.height
    # Floyd–Steinberg (original uses OpenCV getFlyodBitmapNew/Sierra)
    for y in range(h):
        for x in range(w):
            old = px[y * w + x]
            new = 0 if old < 128 else 255
            px[y * w + x] = new
            err = old - new
            for dx, dy, f in ((1, 0, 7/16), (-1, 1, 3/16), (0, 1, 5/16), (1, 1, 1/16)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    px[ny * w + nx] = max(0, min(255, px[ny * w + nx] + err * f))
    return px, w, h

# ---------- Self-test ----------
def selftest():
    ok = lambda name, got, exp: print(f"{name:26s} {got:#04x} {'OK' if got == exp else 'FAIL exp ' + hex(exp)}")
    ok("crc8([0x30,0x00])", crc8(bytes([0x30, 0x00])), 0xF9)   # paper
    ok("crc8([0x31])", crc8(b"\x31"), 0x97)                    # quality1
    ok("crc8([0x34])", crc8(b"\x34"), 0x8C)                    # quality4 (live MX10)
    ok("crc8([0x01,0xC8])", crc8(bytes([0x01, 0xC8])), 0x63)   # density 200 (live MX10)
    ok("crc8([0x0A])", crc8(b"\x0A"), 0x36)                    # speed 10
    ok("crc8([0xE0,0x2E])", crc8(bytes([0xE0, 0x2E])), 0x89)   # energy 12000 LE
    ok("crc8([0x10,0x27])", crc8(bytes([0x10, 0x27])), 0xA2)   # energy 10000 LE
    ok("crc8([0x01,0x0F])", crc8(bytes([0x01, 0x0F])), 0x38)   # density F2
    ok("crc8(lattice-payload)", crc8(bytes.fromhex("AA551738445F5F5F44382C")), 0xA1)
    ok("crc8(finish-payload)", crc8(bytes.fromhex("AA55170000000000000017")), 0x11)
    assert paper_feed() == bytes.fromhex("5178A10002003000F9FF")
    assert status_query() == bytes.fromhex("5178A30001000000FF")
    assert mode_image() == bytes.fromhex("5178BE0001000000FF")
    assert speed(10) == bytes.fromhex("5178BD0001000A36FF")
    assert quality(3) == bytes.fromhex("5178A40001003399FF")
    assert energy(12000) == bytes.fromhex("5178AF000200E02E89FF")
    assert density(0x64) == bytes.fromhex("5178F20002000164 2EFF".replace(" ", ""))
    # Example line: 8 px, 1 black pixel leftmost → 0x01, LSB-first
    lf = frame(0xA2, bytes([0b00000001]))
    assert lf[:6] == bytes([0x51, 0x78, 0xA2, 0x00, 0x01, 0x00])
    print("All frame/CRC examples from docs/04 verified.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        selftest()
        print("\nUsage: python3 reference-encoder.py <image.png> [width_px] [density]")
        sys.exit(0)
    width = int(sys.argv[2]) if len(sys.argv) > 2 else 384
    density_val = int(sys.argv[3]) if len(sys.argv) > 3 else 120
    px, w, h = load_pixels(sys.argv[1], width)
    data = encode_print_data(px, w, h, density_val=density_val)
    sys.stdout.buffer.write(data)
    print(f"\n# {len(data)} bytes generated for {w}×{h} px (density={density_val}, 384 board).",
          file=sys.stderr)
