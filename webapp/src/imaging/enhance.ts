/**
 * Auto-enhance + cropping for the print pipeline (pure functions, testable).
 *
 * Pipeline position: fit → toGray → cropGray → autoEnhance → applyTone → dither.
 * Auto-enhance = percentile auto-levels + unsharp mask — the browser-side
 * equivalent of the original app's OpenCV `enhancePicture` path.
 */
import type { GrayImage } from "./raster";

/** Auto-contrast: stretch the histogram so [clip %, 100-clip %] spans 0..255. */
export function autoLevels(image: GrayImage, clip = 0.005): GrayImage {
  const { gray } = image;
  const hist = new Uint32Array(256);
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++;
  const lowCount = gray.length * clip;
  let lo = 0;
  let acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc > lowCount) {
      lo = v;
      break;
    }
  }
  let hi = 255;
  acc = 0;
  for (let v = 255; v >= 0; v--) {
    acc += hist[v];
    if (acc > lowCount) {
      hi = v;
      break;
    }
  }
  if (hi - lo < 2) return image; // flat image, nothing to stretch
  const scale = 255 / (hi - lo);
  const out = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    out[i] = Math.max(0, Math.min(255, Math.round((gray[i] - lo) * scale)));
  }
  return { ...image, gray: out };
}

/** Unsharp mask: out = gray + amount·(gray − blur), 3×3 gaussian blur. */
export function unsharpMask(image: GrayImage, amount = 0.6): GrayImage {
  const { width, height, gray } = image;
  const blur = new Uint8ClampedArray(gray.length);
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0;
      let ki = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++, ki++) {
          const sy = Math.min(height - 1, Math.max(0, y + dy));
          const sx = Math.min(width - 1, Math.max(0, x + dx));
          acc += gray[sy * width + sx] * kernel[ki];
        }
      }
      blur[y * width + x] = acc / 16;
    }
  }
  const out = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    out[i] = Math.max(0, Math.min(255, Math.round(gray[i] + amount * (gray[i] - blur[i]))));
  }
  return { ...image, gray: out };
}

/** Auto-enhance = auto-levels + sharpening. */
export function autoEnhance(image: GrayImage): GrayImage {
  return unsharpMask(autoLevels(image));
}

/** Crop rectangle in image coordinates. */
export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Crop a gray image to a rectangle (clamped to bounds). */
export function cropGray(image: GrayImage, rect: CropRect): GrayImage {
  const x = Math.max(0, Math.min(image.width - 1, Math.round(rect.x)));
  const y = Math.max(0, Math.min(image.height - 1, Math.round(rect.y)));
  const w = Math.max(1, Math.min(image.width - x, Math.round(rect.w)));
  const h = Math.max(1, Math.min(image.height - y, Math.round(rect.h)));
  const gray = new Uint8Array(w * h);
  for (let row = 0; row < h; row++) {
    const src = (y + row) * image.width + x;
    gray.set(image.gray.subarray(src, src + w), row * w);
  }
  return { width: w, height: h, gray };
}
