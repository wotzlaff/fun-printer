/**
 * Text → ImageData rendering for text printing.
 * Black text on white, word-wrapped at the printer width, then rasterized
 * with a fixed threshold (crisp glyphs — dithering would smear text).
 */

export interface TextRenderOptions {
  text: string;
  fontSize?: number; // px at printer scale
  bold?: boolean;
  monospace?: boolean;
  /** Render width in px (printer width). */
  width?: number;
  /** Line height factor. */
  lineHeight?: number;
}

/** Word-wrap text for a measuring context; pure function, testable. */
export function wrapText(
  text: string,
  measure: (s: string) => number,
  maxWidth: number,
): string[] {
  const out: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const words = rawLine.split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0) {
      out.push(""); // keep empty lines
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (measure(candidate) <= maxWidth) {
        current = candidate;
      } else {
        if (current) out.push(current);
        // very long word: hard-break it
        let rest = word;
        while (measure(rest) > maxWidth && rest.length > 1) {
          let cut = rest.length;
          while (cut > 1 && measure(rest.slice(0, cut)) > maxWidth) cut--;
          out.push(rest.slice(0, Math.max(1, cut)));
          rest = rest.slice(Math.max(1, cut));
        }
        current = rest;
      }
    }
    if (current) out.push(current);
  }
  return out;
}

export function renderText(options: TextRenderOptions): ImageData {
  const {
    text,
    fontSize = 24,
    bold = false,
    monospace = false,
    width = 384,
    lineHeight = 1.35,
  } = options;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const font = `${bold ? "bold " : ""}${fontSize}px ${monospace ? "ui-monospace, monospace" : "system-ui, sans-serif"}`;
  ctx.font = font;
  const padding = 8;
  const maxWidth = width - padding * 2;
  const lines = wrapText(text, (s) => ctx.measureText(s).width, maxWidth);
  const lineH = Math.round(fontSize * lineHeight);
  canvas.height = Math.max(lineH, lines.length * lineH + padding * 2);

  ctx.font = font;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "top";
  let y = padding;
  for (const line of lines) {
    ctx.fillText(line, padding, y);
    y += lineH;
  }
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
