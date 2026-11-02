import { useEffect, useRef } from "react";
import { renderText } from "../imaging/textRender";
import { toGray, ditherToLines } from "../imaging/raster";
import { printLines } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { useI18n } from "../i18n";
import { PrintControls } from "./PhotoPanel";

const PRINTER_WIDTH = 384;

export function TextPanel() {
  const { t } = useI18n();
  const textContent = useStore((s) => s.textContent);
  const fontSize = useStore((s) => s.fontSize);
  const bold = useStore((s) => s.bold);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Uint8Array[] | null>(null);
  const heightRef = useRef(0);

  useEffect(() => {
    if (!previewRef.current) return;
    if (!textContent.trim()) {
      linesRef.current = null;
      return;
    }
    const imageData = renderText({ text: textContent, fontSize, bold, width: PRINTER_WIDTH });
    const gray = toGray(imageData);
    // text: fixed threshold at the stored value, no tone/gamma — crisp glyphs
    const lines = ditherToLines(gray, "threshold", 170);
    linesRef.current = lines;
    heightRef.current = gray.height;
    const canvas = previewRef.current;
    canvas.width = PRINTER_WIDTH * 2;
    canvas.height = gray.height * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    for (let y = 0; y < gray.height; y++) {
      const row = lines[y];
      for (let x = 0; x < PRINTER_WIDTH; x++) {
        if (row[x >> 3] & (1 << (x & 7))) {
          ctx.fillRect(x * 2, y * 2, 2, 2);
        }
      }
    }
  }, [textContent, fontSize, bold]);

  const onPrint = () => {
    if (!linesRef.current || !previewRef.current) return;
    void printLines(
      linesRef.current,
      PRINTER_WIDTH,
      heightRef.current,
      "text",
      previewRef.current.toDataURL("image/png"),
    );
  };

  return (
    <section className="panel">
      <h2>{t.tabText}</h2>
      <textarea
        className="text-input"
        rows={6}
        placeholder={t.textPlaceholder}
        value={textContent}
        onChange={(e) => setState({ textContent: e.target.value })}
      />
      <div className="row">
        <label className="inline">
          {t.fontSize}: <strong>{fontSize}px</strong>
          <input
            type="range"
            min={16}
            max={64}
            step={2}
            value={fontSize}
            onChange={(e) => setState({ fontSize: Number(e.target.value) })}
          />
        </label>
        <label className="inline">
          <input
            type="checkbox"
            checked={bold}
            onChange={(e) => setState({ bold: e.target.checked })}
          />
          {t.bold}
        </label>
      </div>
      {textContent.trim() && (
        <>
          <h3>{t.preview}</h3>
          <canvas ref={previewRef} className="preview" />
          <PrintControls onPrint={onPrint} />
        </>
      )}
    </section>
  );
}
