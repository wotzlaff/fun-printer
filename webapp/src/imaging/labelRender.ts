/**
 * Label rendering. The print head is always 384 dots (48 mm at 203 dpi) —
 * the raster MUST be full head width; label content is laid out inside its
 * mm-derived content width and padded white beyond (a narrower label simply
 * stays white there). widthMm = 0 means full head width (continuous paper).
 * Fixed widths at 200 dpi with the 0.95 correction factor per docs/02.
 */
import QRCode from "qrcode";

/** Label widths (mm); 0 = full head width (continuous paper). */
export const LABEL_WIDTHS_MM = [0, 20, 25, 30, 40, 50] as const;

/** mm → printer px at 200 dpi with the 0.95 correction factor. */
export function mmToLabelPx(mm: number): number {
  return Math.floor((mm / 25.4) * 200 * 0.95);
}

/** The head raster width the printer expects per line (live-verified: 48 B). */
export const HEAD_WIDTH = 384;

/** Content width for a width selection: 0 = full head width. */
export function contentWidthFor(widthMm: number): number {
  return widthMm === 0 ? HEAD_WIDTH : Math.min(HEAD_WIDTH, mmToLabelPx(widthMm));
}

/**
 * Integer QR module size for a target width (quiet zone: 2 modules per side).
 * Rendering at integer scale keeps modules crisp — scaling a bitmap by a
 * fractional factor blurs them. Returns scale and the final pixel size
 * including the quiet zone.
 */
export function qrPixelSize(
  targetWidth: number,
  modules: number,
): { scale: number; size: number } {
  const scale = Math.max(1, Math.floor(targetWidth / (modules + 4)));
  return { scale, size: scale * (modules + 4) };
}

export interface LabelRenderOptions {
  widthMm: number;
  title: string;
  /** QR content; empty = no QR. */
  qr?: string;
  /** Body text under the title. */
  body?: string;
  bold?: boolean;
  /** QR spans the full content width (title/body centered below it). */
  qrFullWidth?: boolean;
}

export async function renderLabel(options: LabelRenderOptions): Promise<ImageData> {
  const {
    widthMm,
    title,
    qr = "",
    body = "",
    bold = true,
    qrFullWidth = false,
  } = options;
  const headWidth = HEAD_WIDTH;
  const contentWidth = contentWidthFor(widthMm);
  const padding = Math.max(4, Math.round(contentWidth * 0.06));

  // QR sizing: full width → as wide as fits (integer modules, 2-module quiet
  // zone each side); otherwise 55% of the content width, left of the text.
  let qrSize = 0;
  let qrScale = 1;
  if (qr) {
    const created = QRCode.create(qr, { errorCorrectionLevel: "M" });
    if (qrFullWidth) {
      const s = qrPixelSize(contentWidth - padding * 2, created.modules.size);
      qrScale = s.scale;
      qrSize = s.size; // includes quiet zone
    } else {
      qrSize = Math.round(contentWidth * 0.55);
      qrScale = Math.max(1, Math.floor((qrSize * 0.9) / created.modules.size));
      qrSize = qrScale * created.modules.size;
    }
  }

  const fullWidthText = qrFullWidth && qr !== "";
  const textX = fullWidthText ? padding : padding + (qr ? qrSize + padding : 0);
  const textW = contentWidth - padding - textX;

  // measure text against a measuring canvas
  const titleSize = Math.round(contentWidth * (fullWidthText ? 0.10 : 0.13));
  const bodySize = Math.round(contentWidth * 0.10);
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  const titleLines = wrap(title, measure, textW - padding);
  measure.font = `${bodySize}px system-ui, sans-serif`;
  const bodyLines = body ? wrap(body, measure, textW - padding) : [];

  const titleH = titleLines.length * titleSize * 1.25;
  const bodyH = bodyLines.length * bodySize * 1.25;
  const heightPx = Math.max(
    mmToLabelPx(15),
    Math.ceil((qr ? qrSize : 0) + titleH + bodyH + padding * 2),
  );

  const canvas = document.createElement("canvas");
  canvas.width = headWidth; // ALWAYS head width — 48-byte rows
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, headWidth, heightPx);
  ctx.fillStyle = "#000000";

  let y = padding;
  if (qr) {
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qr, {
      margin: 0,
      scale: qrScale,
      errorCorrectionLevel: "M",
    });
    ctx.imageSmoothingEnabled = false;
    const qrX = fullWidthText
      ? Math.round((contentWidth - qrCanvas.width) / 2)
      : padding;
    ctx.drawImage(qrCanvas, qrX, y, qrCanvas.width, qrCanvas.width);
    y += qrCanvas.width + (fullWidthText ? padding : 0);
  }
  ctx.textAlign = fullWidthText ? "center" : "left";
  const originX = fullWidthText ? contentWidth / 2 : textX;
  ctx.font = `${bold ? "bold " : ""}${titleSize}px system-ui, sans-serif`;
  for (const line of titleLines) {
    ctx.fillText(line, originX, y, textW);
    y += titleSize * 1.25;
  }
  ctx.font = `${bodySize}px system-ui, sans-serif`;
  for (const line of bodyLines) {
    ctx.fillText(line, originX, y, textW);
    y += bodySize * 1.25;
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
