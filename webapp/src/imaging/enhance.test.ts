import { describe, expect, it } from "vitest";
import { autoEnhance, autoLevels, cropGray, unsharpMask } from "./enhance";
import type { GrayImage } from "./raster";

const grayImage = (width: number, height: number, values: number[]): GrayImage => ({
  width,
  height,
  gray: Uint8Array.from(values),
});

describe("autoLevels (auto-contrast)", () => {
  it("stretches a low-contrast ramp to full range", () => {
    // 64..192 → 0..255
    const img = grayImage(8, 1, [64, 80, 96, 112, 128, 144, 160, 192]);
    const out = autoLevels(img, 0);
    expect(out.gray[0]).toBe(0);
    expect(out.gray[7]).toBe(255);
    expect(out.gray[4]).toBe(128); // (128-64)·(255/128) = 127.5 → 128
  });
  it("leaves a full-range image unchanged", () => {
    const img = grayImage(4, 1, [0, 128, 200, 255]);
    const out = autoLevels(img, 0);
    expect([...out.gray]).toEqual([0, 128, 200, 255]);
  });
  it("returns flat images untouched (no divide by zero)", () => {
    const img = grayImage(4, 1, [128, 128, 128, 128]);
    const out = autoLevels(img, 0);
    expect([...out.gray]).toEqual([128, 128, 128, 128]);
  });
  it("clips outlier pixels by default", () => {
    // one 0 and one 255 outlier among mid-values → stretched interior
    const img = grayImage(10, 1, [0, 100, 100, 100, 100, 100, 100, 100, 100, 255]);
    const out = autoLevels(img); // 0.5% clip: 1 px clipped per end at 10 px
    expect(out.gray[1]).toBeGreaterThan(0); // 100 no longer pinned at 0
  });
});

describe("unsharpMask", () => {
  it("sharpens an edge (dark side darker, bright side brighter)", () => {
    const img = grayImage(6, 1, [200, 200, 200, 100, 100, 100]);
    const out = unsharpMask(img, 0.6);
    expect(out.gray[2]).toBeGreaterThan(200);
    expect(out.gray[3]).toBeLessThan(100);
  });
  it("leaves a flat field unchanged", () => {
    const img = grayImage(4, 4, new Array(16).fill(128));
    const out = unsharpMask(img, 0.6);
    expect([...out.gray]).toEqual(new Array(16).fill(128));
  });
});

describe("autoEnhance", () => {
  it("combines levels + sharpening", () => {
    const img = grayImage(8, 1, [80, 82, 84, 86, 88, 90, 92, 94]);
    const out = autoEnhance(img);
    expect(out.gray[7]).toBeGreaterThan(out.gray[0]);
    expect(out.gray[7]).toBeGreaterThan(94); // stretched + sharpened
  });
});

describe("cropGray", () => {
  const img = grayImage(4, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  it("extracts the rectangle with new row stride", () => {
    const out = cropGray(img, { x: 1, y: 2, w: 2, h: 2 });
    expect(out.width).toBe(2);
    expect(out.height).toBe(2);
    expect([...out.gray]).toEqual([9, 10, 13, 14]);
  });
  it("clamps rectangles beyond the bounds", () => {
    const out = cropGray(img, { x: 2, y: 2, w: 100, h: 100 });
    expect(out.width).toBe(2);
    expect(out.height).toBe(2);
    expect([...out.gray]).toEqual([10, 11, 14, 15]);
  });
  it("full-image crop is an identity copy", () => {
    const out = cropGray(img, { x: 0, y: 0, w: 4, h: 4 });
    expect([...out.gray]).toEqual([...img.gray]);
  });
});
