/**
 * Label rendering: fixed label widths (mm → px at 200 dpi, 0.95 correction
 * factor per docs/02), optional QR code + wrapped title text, white padding.
 */
import QRCode from "qrcode";

/** Label widths the original app offers (mm). */
export const LABEL_WIDTHS_MM = [20, 25, 30, 40, 50] as const;

/** mm → printer px at 200 dpi with the 0.95 correction factor. */
export function mmToLabelPx(mm: number): number {
  return Math.floor((mm / 25.4) * 200 * 0.95);
}

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
  const widthPx = mmToLabelPx(widthMm);
  const padding = Math.max(4, Math.round(widthPx * 0.06));
  const qrSize = qr ? Math.round(widthPx * 0.55) : 0;

  // measure text against a measuring canvas
  const titleSize = Math.round(widthPx * 0.13);
  const bodySize = Math.round(widthPx * 0.10);
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  const titleLines = wrap(title, measure, widthPx - padding * 2 - (qr ? qrSize + padding : 0));
  measure.font = `${bodySize}px system-ui, sans-serif`;
  const bodyLines = body ? wrap(body, measure, widthPx - padding * 2 - (qr ? qrSize + padding : 0)) : [];

  const titleH = titleLines.length * titleSize * 1.25;
  const bodyH = bodyLines.length * bodySize * 1.25;
  const heightPx = Math.max(
    mmToLabelPx(15),
    Math.ceil(Math.max(qrSize, titleH + bodyH) + padding * 2),
  );

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.fillStyle = "#000000";

  const textX = padding + (qr ? qrSize + padding : 0);
  let y = padding;
  ctx.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  for (const line of titleLines) {
    ctx.fillText(line, textX, y, widthPx - padding - textX);
    y += titleSize * 1.25;
  }
  ctx.font = `${bodySize}px system-ui, sans-serif`;
  for (const line of bodyLines) {
    ctx.fillText(line, textX, y, widthPx - padding - textX);
    y += bodySize * 1.25;
  }

  if (qr) {
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qr, { margin: 0, scale: 4, errorCorrectionLevel: "M" });
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrCanvas, padding, Math.round((heightPx - qrSize) / 2), qrSize, qrSize);
  }

  return ctx.getImageData(0, 0, widthPx, heightPx);
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
