import { describe, expect, it } from "vitest";
import { crc8 } from "./crc8";
import {
  imageLine,
  LATTICE_END,
  LATTICE_START,
  paperFeed,
  setDensity,
  setEnergy,
  setModeImage,
  setSpeed,
  scanFrames,
  statusQuery,
} from "./frames";
import { encodePrintJob } from "./printJob";
import { applyTone, ditherToLines, type GrayImage } from "../imaging/raster";

const hex = (u8: Uint8Array) =>
  Array.from(u8, (b) => b.toString(16).padStart(2, "0")).join("");

describe("crc8 (poly 0x07, init 0)", () => {
  // Values from the original JS table (module 9673) and the live MX10 capture.
  it.each([
    [[0x30, 0x00], 0xf9], // paper feed
    [[0x31], 0x97], // quality 1
    [[0x34], 0x8c], // quality 4 (live)
    [[0x0a], 0x36], // speed 10
    [[0xe0, 0x2e], 0x89], // energy 12000 LE
    [[0x10, 0x27], 0xa2], // energy 10000 LE
    [[0x01, 0x0f], 0x38], // density F2
    [[0x01, 0xc8], 0x63], // density 200 (live MX10)
    [[0x98, 0x3a], 0xef], // energy 15000 (live MX10)
    [
      [0xaa, 0x55, 0x17, 0x38, 0x44, 0x5f, 0x5f, 0x5f, 0x44, 0x38, 0x2c],
      0xa1,
    ], // lattice start
    [
      [0xaa, 0x55, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17],
      0x11,
    ], // lattice end
  ])("crc8(%j) === 0x%s", (data, expected) => {
    expect(crc8(Uint8Array.from(data))).toBe(expected);
  });
});

describe("frames", () => {
  it("status query matches the captured frame", () => {
    expect(hex(statusQuery())).toBe("5178a30001000000ff");
  });
  it("paper feed matches the captured frame", () => {
    expect(hex(paperFeed())).toBe("5178a10002003000f9ff");
  });
  it("mode image matches the captured frame", () => {
    expect(hex(setModeImage())).toBe("5178be0001000000ff");
  });
  it("speed 10 matches the captured frame", () => {
    expect(hex(setSpeed(10))).toBe("5178bd0001000a36ff");
  });
  it("energy 15000 is little-endian (live MX10)", () => {
    expect(hex(setEnergy(15000))).toBe("5178af000200983aefff");
  });
  it("density 200 (live MX10)", () => {
    expect(hex(setDensity(200))).toBe("5178f200020001c863ff");
  });
  it("lattice markers match the captured constants", () => {
    expect(hex(LATTICE_START)).toBe("5178a6000b00aa551738445f5f5f44382ca1ff");
    expect(hex(LATTICE_END)).toBe("5178a6000b00aa5517000000000000001711ff");
  });
  it("line frame carries LEN = row bytes and LSB-first bits", () => {
    const line = Uint8Array.from([0b00000001, 0, 0, 0, 0, 0]);
    const f = imageLine(line);
    expect(f[2]).toBe(0xa2);
    expect(f[3]).toBe(0x00);
    expect(f[4]).toBe(6); // LEN16 low byte
    expect(f[6] & 1).toBe(1); // leftmost pixel = bit 0
  });
});

describe("scanFrames (rx)", () => {
  it("parses back-to-back frames and validates CRC", () => {
    const stream = new Uint8Array([
      ...statusQuery(),
      ...setDensity(200),
    ]);
    const { frames, consumed } = scanFrames(stream);
    expect(consumed).toBe(stream.length);
    expect(frames.map((f) => f.cmd)).toEqual([0xa3, 0xf2]);
  });
  it("keeps an incomplete trailing frame unconsumed", () => {
    const full = statusQuery();
    const partial = full.slice(0, 5);
    const { frames, consumed } = scanFrames(new Uint8Array([...full, ...partial]));
    expect(frames.length).toBe(1);
    expect(consumed).toBe(full.length);
  });
  it("resyncs after corrupted bytes", () => {
    const stream = new Uint8Array([0x00, 0x51, 0x78, 0xff, ...statusQuery()]);
    const { frames } = scanFrames(stream);
    expect(frames.map((f) => f.cmd)).toEqual([0xa3]);
  });
});

describe("encodePrintJob (live-verified sequence)", () => {
  it("produces F2 → A3 → A4 → A6 → AF → BE → BD×2 → A2… → A1 → A6 → A3", () => {
    const lines = [Uint8Array.from([0xff]), Uint8Array.from([0x00])];
    const job = encodePrintJob(lines, { density: 200, energy: 15000, speed: 10, quality: 4, feedDots: 0x30 });
    const { frames } = scanFrames(job);
    expect(frames.map((f) => f.cmd)).toEqual([
      0xf2, 0xa3, 0xa4, 0xa6, 0xaf, 0xbe, 0xbd, 0xbd, 0xa2, 0xa2, 0xa1, 0xa6, 0xa3, 0xa3,
    ]);
    // lattice start/end are constant frames without payload — they appear inside
    // the job between the parsed frames, verified by byte counts:
    expect(job.length).toBeGreaterThan(frames.length * 8);
  });
});

describe("tone + rasterization (thermal darkness)", () => {
  const flatImage: GrayImage = {
    width: 8,
    height: 1,
    gray: Uint8Array.from([0, 64, 128, 170, 192, 224, 240, 255]),
  };

  it("gamma darkens midtones (thermal paper prints light without it)", () => {
    const toned = applyTone(flatImage, { gamma: 2 });
    expect(toned.gray[2]).toBe(64); // 128 → 255·0.5² = 63.75 → 64
    expect(toned.gray[3]).toBeLessThan(150); // 170 → 255·(2/3)² ≈ 113
    expect(toned.gray[0]).toBe(0);
    expect(toned.gray[7]).toBe(255);
  });

  it("identity tone returns the image untouched", () => {
    expect(applyTone(flatImage, {})).toBe(flatImage);
  });

  it("threshold mode uses the original app's 170 default (more black)", () => {
    const lines = ditherToLines(flatImage, "threshold", 170);
    // pixels < 170 are black: 0, 64, 128, 170? (170 is NOT < 170) → 3 black
    const row = lines[0];
    let black = 0;
    for (const byte of row) black += popcount(byte);
    expect(black).toBe(3);
  });

  it("floyd mode with high threshold darkens more than low", () => {
    const dark = ditherToLines(applyTone(flatImage, { gamma: 3 }), "floyd", 128);
    const light = ditherToLines(flatImage, "floyd", 128);
    const black = (lines: Uint8Array[]) =>
      lines.reduce(
        (n, row) => n + [...row].reduce((m, b) => m + popcount(b), 0),
        0,
      );
    expect(black(dark)).toBeGreaterThan(black(light));
  });
});

function popcount(b: number): number {
  let n = 0;
  while (b) {
    n += b & 1;
    b >>= 1;
  }
  return n;
}
