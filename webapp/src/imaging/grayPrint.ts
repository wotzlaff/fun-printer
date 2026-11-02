/**
 * EXPERIMENT: 8-bit grayscale printing (no dithering).
 *
 * The original plugin contains V5g.getGrayPrintData: per line, a "51 78 A2"
 * frame carrying one gray byte per pixel (Rec. 601 luma) + CRC + FF.
 * NOTE: the original hardcodes the header "5178A2003000" (LEN=48) while the
 * gray payload is width bytes — we build the frame with the true LEN
 * (frame() computes it) and flag this as an on-device A/B experiment.
 */
import type { GrayImage } from "./raster";

export function grayLines(image: GrayImage): Uint8Array[] {
  const rows: Uint8Array[] = [];
  for (let y = 0; y < image.height; y++) {
    rows.push(image.gray.slice(y * image.width, (y + 1) * image.width));
  }
  return rows;
}
