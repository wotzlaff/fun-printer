/**
 * 1 bpp rasterization matching the printer's expectations:
 * rows of width/8 bytes, LSB-first (leftmost pixel = bit 0), bit 1 = black.
 * (V5g.eachLinePixToCmdB in the original plugin; live-verified.)
 */

export interface GrayImage {
  width: number;
  height: number;
  /** One gray byte per pixel (0..255). */
  gray: Uint8Array;
}

/** Tone controls tuned for thermal paper (see docs/07-image-processing.md). */
export interface ToneOptions {
  /**
   * Gamma > 1 darkens midtones — thermal paper prints light without it.
   * The original app had a gamma-handling path; default here: 2.0.
   */
  gamma?: number;
  /** Linear contrast slope around mid-gray (1 = unchanged). */
  contrast?: number;
  /** Additive brightness offset (-100..100). */
  brightness?: number;
}

/** Apply gamma/contrast/brightness BEFORE dithering (darkens → stronger print). */
export function applyTone(image: GrayImage, options: ToneOptions = {}): GrayImage {
  const { gamma = 1, contrast = 1, brightness = 0 } = options;
  if (gamma === 1 && contrast === 1 && brightness === 0) return image;
  // 256-entry lookup keeps it fast for repeat calls.
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) {
    let out = 255 * Math.pow(v / 255, gamma);
    out = (out - 128) * contrast + 128 + brightness;
    lut[v] = Math.max(0, Math.min(255, Math.round(out)));
  }
  const gray = new Uint8Array(image.gray.length);
  for (let i = 0; i < gray.length; i++) gray[i] = lut[image.gray[i]];
  return { ...image, gray };
}

/** Extract grayscale (Rec. 601 luma, as the original RGB2Gray) from ImageData. */
export function toGray(image: ImageData): GrayImage {
  const { width, height, data } = image;
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return { width, height, gray };
}

export function ditherToLines(
  image: GrayImage,
  mode: "floyd" | "threshold" = "floyd",
  threshold = 170,
): Uint8Array[] {
  const { width, height, gray } = image;
  const out = new Uint8Array(gray.length);
  if (mode === "threshold") {
    for (let i = 0; i < gray.length; i++) out[i] = gray[i] < threshold ? 1 : 0;
  } else {
    floydSteinberg(gray, width, height, out, threshold);
  }
  const rows: Uint8Array[] = [];
  const bytesPerRow = Math.ceil(width / 8);
  for (let y = 0; y < height; y++) {
    const row = new Uint8Array(bytesPerRow);
    for (let x = 0; x < width; x++) {
      if (out[y * width + x]) row[x >> 3] |= 1 << (x & 7);
    }
    rows.push(row);
  }
  return rows;
}

/** Floyd–Steinberg error diffusion (original uses OpenCV Floyd/Sierra for photos). */
function floydSteinberg(
  gray: Uint8Array,
  width: number,
  height: number,
  out: Uint8Array,
  threshold: number,
): void {
  const buf = new Int16Array(gray);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const old = buf[idx];
      const next = old < threshold ? 0 : 255;
      out[idx] = next === 0 ? 1 : 0; // black = 1
      const err = old - next;
      const push = (dx: number, dy: number, factor: number) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny >= height) return;
        buf[ny * width + nx] += Math.trunc(err * factor);
      };
      push(1, 0, 7 / 16);
      push(-1, 1, 3 / 16);
      push(0, 1, 5 / 16);
      push(1, 1, 1 / 16);
    }
  }
}

/** How the image fills the print area. */
export type FitMode = "contain" | "cover" | "stretch";

/** Scale/fit an image to the printer width (384 px). */
export function fitToWidth(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  targetWidth = 384,
  mode: FitMode = "contain",
): ImageData {
  const srcW = source.width;
  const srcH = source.height;
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;

  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";

  if (mode === "stretch") {
    const targetHeight = Math.max(1, Math.round((srcH * targetWidth) / srcW));
    canvas.height = targetHeight;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  }

  const scale = mode === "cover"
    ? Math.max(targetWidth / srcW, targetWidth / srcH) // cover: also crops vertically
    : targetWidth / srcW; // contain: whole width, keep aspect
  const drawW = srcW * scale;
  const drawH = srcH * scale;

  if (mode === "cover") {
    // crop the source to the target aspect before scaling (center crop)
    const cropH = Math.min(srcH, srcW * (drawH / drawW));
    const cropW = Math.min(srcW, targetWidth / scale);
    canvas.height = Math.max(1, Math.round(targetWidth / (cropW / cropH)));
    ctx.fillRect(0, 0, targetWidth, canvas.height);
    ctx.drawImage(
      source,
      (srcW - cropW) / 2,
      (srcH - cropH) / 2,
      cropW,
      cropH,
      0,
      0,
      targetWidth,
      canvas.height,
    );
  } else {
    const targetHeight = Math.max(1, Math.round(drawH));
    canvas.height = targetHeight;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(source, 0, 0, srcW, srcH, 0, 0, drawW, drawH);
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/** Rotate a source image by quarter turns before fitting. */
export function rotateSource(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  quarterTurns: number,
): HTMLCanvasElement {
  const turns = ((quarterTurns % 4) + 4) % 4;
  const canvas = document.createElement("canvas");
  if (turns % 2 === 0) {
    canvas.width = source.width;
    canvas.height = source.height;
  } else {
    canvas.width = source.height;
    canvas.height = source.width;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.drawImage(source, -source.width / 2, -source.height / 2);
  return canvas;
}
