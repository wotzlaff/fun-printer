/**
 * Label rendering. The print head is always 384 dots (48 mm at 203 dpi) —
 * the raster MUST be full head width; label content is laid out inside its
 * mm-derived content width and padded white beyond (a narrower label simply
 * stays white there). Fixed widths at 200 dpi with the 0.95 correction
 * factor per docs/02.
 */
import QRCode from "qrcode";

/** Label widths the original app offers (mm). */
export const LABEL_WIDTHS_MM = [20, 25, 30, 40, 50] as const;

/** mm → printer px at 200 dpi with the 0.95 correction factor. */
export function mmToLabelPx(mm: number): number {
  return Math.floor((mm / 25.4) * 200 * 0.95);
}

/** The head raster width the printer expects per line (live-verified: 48 B). */
export const HEAD_WIDTH = 384;

export interface LabelRenderOptions {
  widthMm: number;
  title: string;
  /** QR content; empty = no QR. */
  qr?: string;
  /** Body text under the title. */
  body?: string;
  bold?: boolean;
}

export async function renderLabel(options: LabelRenderOptions): Promise<ImageData> {
  const { widthMm, title, qr = "", body = "", bold = true } = options;
  const headWidth = HEAD_WIDTH;
  const contentWidth = Math.min(headWidth, mmToLabelPx(widthMm));
  const padding = Math.max(4, Math.round(contentWidth * 0.06));
  const qrSize = qr ? Math.round(contentWidth * 0.55) : 0;

  // measure text against a measuring canvas
  const titleSize = Math.round(contentWidth * 0.13);
  const bodySize = Math.round(contentWidth * 0.10);
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  const titleLines = wrap(title, measure, contentWidth - padding * 2 - (qr ? qrSize + padding : 0));
  measure.font = `${bodySize}px system-ui, sans-serif`;
  const bodyLines = body ? wrap(body, measure, contentWidth - padding * 2 - (qr ? qrSize + padding : 0)) : [];

  const titleH = titleLines.length * titleSize * 1.25;
  const bodyH = bodyLines.length * bodySize * 1.25;
  const heightPx = Math.max(
    mmToLabelPx(15),
    Math.ceil(Math.max(qrSize, titleH + bodyH) + padding * 2),
  );

  const canvas = document.createElement("canvas");
  canvas.width = headWidth; // ALWAYS head width — 48-byte rows
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, headWidth, heightPx);
  ctx.fillStyle = "#000000";

  const textX = padding + (qr ? qrSize + padding : 0);
  let y = padding;
  ctx.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  for (const line of titleLines) {
    ctx.fillText(line, textX, y, contentWidth - padding - textX);
    y += titleSize * 1.25;
  }
  ctx.font = `${bodySize}px system-ui, sans-serif`;
  for (const line of bodyLines) {
    ctx.fillText(line, textX, y, contentWidth - padding - textX);
    y += bodySize * 1.25;
  }

  if (qr) {
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qr, { margin: 0, scale: 4, errorCorrectionLevel: "M" });
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvas, padding, Math.round((heightPx - qrSize) / 2), qrSize, qrSize);
  }

  return ctx.getImageData(0, 0, headWidth, heightPx);
}

function wrap(text: string, ctx: CanvasRenderingContext2D, maxWidth: number): string[] {
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const words = raw.split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    let cur = "";
    for (const w of words) {
      const cand = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(cand).width <= maxWidth) {
        cur = cand;
      } else {
        if (cur) out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}
