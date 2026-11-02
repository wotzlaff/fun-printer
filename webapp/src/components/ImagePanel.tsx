import { useEffect, useRef } from "react";
import { fitToWidth, toGray, ditherToLines } from "../imaging/raster";
import { printLines } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { useI18n } from "../i18n";

const PRINTER_WIDTH = 384;

export function ImagePanel() {
  const { t } = useI18n();
  const image = useStore((s) => s.image);
  const dither = useStore((s) => s.dither);
  const density = useStore((s) => s.density);
  const printing = useStore((s) => s.printing);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const linesRef = useRef<Uint8Array[] | null>(null);

  // Re-draw the 1 bpp preview whenever image/dither changes and cache the lines.
  useEffect(() => {
    if (!image || !previewRef.current) return;
    const imageData = fitToWidth(image, PRINTER_WIDTH);
    const gray = toGray(imageData);
    const lines = ditherToLines(gray, dither);
    linesRef.current = lines;
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
  }, [image, dither]);

  const pickFile = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    setState({ image: bitmap, imageName: file.name });
  };

  const onPrint = () => {
    if (!linesRef.current) return;
    setState({ printing: true, progress: null, error: null });
    void printLines(
      linesRef.current,
      density,
      () => setState({ printing: false }),
      (message) => setState({ printing: false, error: message }),
    );
  };

  return (
    <section className="panel">
      <h2>{t.image}</h2>
      <div className="row">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void pickFile(file);
          }}
        />
        <button className="secondary" onClick={() => fileInput.current?.click()}>
          {image ? t.changeImage : t.chooseImage}
        </button>
        <label className="inline">
          {t.ditherMode}:{" "}
          <select
            value={dither}
            onChange={(e) => setState({ dither: e.target.value as "floyd" | "threshold" })}
          >
            <option value="floyd">{t.ditherFloyd}</option>
            <option value="threshold">{t.ditherThreshold}</option>
          </select>
        </label>
      </div>

      {image ? (
        <>
          <h3>{t.preview}</h3>
          <canvas ref={previewRef} className="preview" />
          <div className="row">
            <label className="inline">
              {t.density}: <strong>{density}</strong>
              <input
                type="range"
                min={1}
                max={200}
                value={density}
                onChange={(e) => setState({ density: Number(e.target.value) })}
              />
            </label>
          </div>
          <PrintControls disabled={printing} onPrint={onPrint} printing={printing} />
        </>
      ) : (
        <p className="hint">{t.noImage}</p>
      )}
    </section>
  );
}

function PrintControls({
  disabled,
  onPrint,
  printing,
}: {
  disabled: boolean;
  onPrint: () => void;
  printing: boolean;
}) {
  const { t } = useI18n();
  const progress = useStore((s) => s.progress);
  const flowPaused = useStore((s) => s.flowPaused);
  const error = useStore((s) => s.error);

  return (
    <div className="print-controls">
      <button className="primary" disabled={disabled} onClick={onPrint}>
        {printing ? t.printing : t.print}
      </button>
      {printing && progress && (
        <span className="progress">
          {t.progress}: {progress.sent}/{progress.total}
          {flowPaused && <span className="badge warn">⏸ {t.flowPaused}</span>}
        </span>
      )}
      {error && <p className="warning">{t.printError}: {error}</p>}
    </div>
  );
}
