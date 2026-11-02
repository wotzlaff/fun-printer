import { useEffect, useRef } from "react";
import {
  fitToWidth,
  rotateSource,
  toGray,
  applyTone,
  ditherToLines,
} from "../imaging/raster";
import { printLines } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { useI18n } from "../i18n";

const PRINTER_WIDTH = 384;

export function PhotoPanel() {
  const { t } = useI18n();
  const image = useStore((s) => s.image);
  const imageName = useStore((s) => s.imageName);
  const rotation = useStore((s) => s.rotation);
  const fitMode = useStore((s) => s.fitMode);
  const dither = useStore((s) => s.dither);
  const density = useStore((s) => s.density);
  const gamma = useStore((s) => s.gamma);
  const contrast = useStore((s) => s.contrast);
  const brightness = useStore((s) => s.brightness);
  const threshold = useStore((s) => s.threshold);
  const quality = useStore((s) => s.quality);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const linesRef = useRef<Uint8Array[] | null>(null);

  // Re-dither + re-draw the 1 bpp preview whenever image or settings change.
  useEffect(() => {
    if (!image || !previewRef.current) return;
    const rotated = rotation ? rotateSource(image, rotation) : image;
    const imageData = fitToWidth(rotated, PRINTER_WIDTH, fitMode);
    const toned = applyTone(toGray(imageData), { gamma, contrast, brightness });
    const lines = ditherToLines(toned, dither === "gray" ? "threshold" : dither, threshold);
    linesRef.current = lines;
    const canvas = previewRef.current;
    canvas.width = PRINTER_WIDTH * 2;
    canvas.height = toned.height * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111111";
    for (let y = 0; y < toned.height; y++) {
      const row = lines[y];
      for (let x = 0; x < PRINTER_WIDTH; x++) {
        if (row[x >> 3] & (1 << (x & 7))) {
          ctx.fillRect(x * 2, y * 2, 2, 2);
        }
      }
    }
  }, [image, rotation, fitMode, dither, gamma, contrast, brightness, threshold]);

  const pickFile = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    setState({ image: bitmap, imageName: file.name, rotation: 0 });
  };

  const onPrint = () => {
    if (!linesRef.current || !previewRef.current) return;
    void printLines(
      linesRef.current,
      PRINTER_WIDTH,
      linesRef.current.length,
      imageName ?? "photo",
      previewRef.current.toDataURL("image/png"),
    );
  };

  return (
    <section className="panel">
      <h2>{t.tabPhoto}</h2>
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
          {t.fitMode}:{" "}
          <select
            value={fitMode}
            onChange={(e) => setState({ fitMode: e.target.value as typeof fitMode })}
          >
            <option value="contain">{t.fitContain}</option>
            <option value="cover">{t.fitCover}</option>
            <option value="stretch">{t.fitStretch}</option>
          </select>
        </label>
        <button
          className="secondary"
          onClick={() => setState({ rotation: (rotation + 1) % 4 })}
          title={`${t.rotate} 90°`}
        >
          ⟳ 90°
        </button>
        <label className="inline">
          {t.ditherMode}:{" "}
          <select
            value={dither}
            onChange={(e) => setState({ dither: e.target.value as typeof dither })}
          >
            <option value="floyd">{t.ditherFloyd}</option>
            <option value="threshold">{t.ditherThreshold}</option>
            <option value="gray">{t.ditherGray}</option>
          </select>
        </label>
      </div>

      {image ? (
        <>
          <h3>{t.preview}</h3>
          <canvas ref={previewRef} className="preview" />
          <div className="sliders">
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
            <label className="inline">
              {t.gamma}: <strong>{gamma.toFixed(1)}</strong>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={gamma}
                onChange={(e) => setState({ gamma: Number(e.target.value) })}
              />
            </label>
            <label className="inline">
              {t.contrast}: <strong>{contrast.toFixed(2)}</strong>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.05}
                value={contrast}
                onChange={(e) => setState({ contrast: Number(e.target.value) })}
              />
            </label>
            <label className="inline">
              {t.brightness}: <strong>{brightness}</strong>
              <input
                type="range"
                min={-100}
                max={100}
                step={5}
                value={brightness}
                onChange={(e) => setState({ brightness: Number(e.target.value) })}
              />
            </label>
            {dither === "threshold" && (
              <label className="inline">
                {t.threshold}: <strong>{threshold}</strong>
                <input
                  type="range"
                  min={1}
                  max={254}
                  value={threshold}
                  onChange={(e) => setState({ threshold: Number(e.target.value) })}
                />
              </label>
            )}
            <label className="inline">
              {t.quality}:{" "}
              <select
                value={quality}
                onChange={(e) => setState({ quality: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <PrintControls onPrint={onPrint} />
        </>
      ) : (
        <p className="hint">{t.noImage}</p>
      )}
    </section>
  );
}

export function PrintControls({ onPrint }: { onPrint: () => void }) {
  const { t } = useI18n();
  const printing = useStore((s) => s.printing);
  const progress = useStore((s) => s.progress);
  const flowPaused = useStore((s) => s.flowPaused);
  const error = useStore((s) => s.error);

  return (
    <div className="print-controls">
      <button className="primary" disabled={printing} onClick={onPrint}>
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
