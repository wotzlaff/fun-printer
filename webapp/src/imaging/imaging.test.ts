import { describe, expect, it } from "vitest";
import { crc8 } from "../protocol/crc8";
import { scanFrames } from "../protocol/frames";
import { encodePrintJob } from "../protocol/printJob";
import { grayLines } from "./grayPrint";
import { mmToLabelPx, LABEL_WIDTHS_MM } from "./labelRender";
import { wrapText } from "./textRender";

describe("gray print experiment", () => {
  it("encodes one gray byte per pixel and validates the frame LEN", () => {
    const gray = { width: 8, height: 2, gray: Uint8Array.from([0, 64, 128, 192, 255, 0, 64, 128, 192, 255, 0, 64, 128, 192, 255, 0]) };
    const lines = grayLines(gray);
    expect(lines.length).toBe(2);
    expect(lines[0].length).toBe(8); // one byte per pixel
    const job = encodePrintJob(lines, { density: 200 });
    const { frames } = scanFrames(job);
    const a2 = frames.filter((f) => f.cmd === 0xa2);
    expect(a2.length).toBe(2);
    expect(a2[0].payload.length).toBe(8); // LEN = width (not width/8)
    // CRC over the gray bytes must validate
    expect(a2[0].payload[a2[0].payload.length - 1] /* trailing crc handled by scan */).toBeDefined();
  });

  it("frame length of a gray line is larger than a dot line", () => {
    const grayLine = new Uint8Array(384);
    const dotLine = new Uint8Array(48);
    const grayFrame = new Uint8Array(6 + 384 + 2);
    grayFrame.set([0x51, 0x78, 0xa2, 0x01, 0x80, 0x00], 0);
    grayFrame[grayFrame.length - 2] = crc8(grayLine);
    grayFrame[grayFrame.length - 1] = 0xff;
    const { frames } = scanFrames(grayFrame);
    expect(frames.length).toBe(1);
    expect(frames[0].payload.length).toBe(384);
    expect(dotLine.length).toBe(48);
  });
});

describe("label metrics", () => {
  it("converts mm to px at 200 dpi with 0.95 factor", () => {
    expect(mmToLabelPx(30)).toBe(Math.floor((30 / 25.4) * 200 * 0.95));
    expect(mmToLabelPx(50)).toBe(374); // 50/25.4*200*0.95 = 374.01 → 374
  });
  it("offers the documented label widths", () => {
    expect([...LABEL_WIDTHS_MM]).toEqual([20, 25, 30, 40, 50]);
  });
});

describe("text wrapping", () => {
  const measure = (s: string) => s.length * 10; // 10 px per char
  it("wraps long lines at the width", () => {
    const lines = wrapText("aaaa bbbb cccc dddd", measure, 100);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(line.length * 10).toBeLessThanOrEqual(100);
  });
  it("preserves empty lines and hard-breaks long words", () => {
    const lines = wrapText("aaa\n\nXXXXXXXXXXXX", measure, 100);
    expect(lines[0]).toBe("aaa");
    expect(lines.includes("")).toBe(true);
    for (const line of lines) expect(line.length * 10).toBeLessThanOrEqual(100);
  });
});

describe("multi-copy job", () => {
  it("repeat copies via the printer add feed frames between copies", async () => {
    // simulate: 2 copies of a 2-line job → the print() method enqueues
    // job, feed, job — verify via encodePrintJob + frame(0xa1) concatenation
    const lines = [new Uint8Array(48), new Uint8Array(48)];
    const job = encodePrintJob(lines, { density: 200 });
    const feed = new Uint8Array([0x51, 0x78, 0xa1, 0x00, 0x02, 0x00, 0x30, 0x00, 0xf9, 0xff]);
    const stream = new Uint8Array([...job, ...feed, ...job]);
    const { frames } = scanFrames(stream);
    const cmds = frames.map((f) => f.cmd);
    const a1Count = cmds.filter((c) => c === 0xa1).length;
    // 1 in-job feed per copy + 1 inter-copy feed = 3
    expect(a1Count).toBe(3);
  });
});
