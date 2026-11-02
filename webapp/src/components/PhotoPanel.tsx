import { useEffect, useRef, useState } from "react";
import {
  fitToWidth,
  rotateSource,
  toGray,
  applyTone,
  ditherToLines,
} from "../imaging/raster";
import { autoEnhance as applyEnhance, cropGray, type CropRect } from "../imaging/enhance";
import type { GrayImage } from "../imaging/raster";
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
  const autoEnhance = useStore((s) => s.autoEnhance);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const linesRef = useRef<Uint8Array[] | null>(null);
  const fittedGrayRef = useRef<GrayImage | null>(null);
  const cropRef = useRef<CropRect | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [dragRect, setDragRect] = useState<CropRect | null>(null);
  const [cropVersion, setCropVersion] = useState(0);
  const crop = useStore((s) => s.image) ? cropRef.current : null;

  // Pipeline: rotate → fit → crop → auto-enhance → tone → dither.
  useEffect(() => {
    if (!image || !previewRef.current) return;
    const rotated = rotation ? rotateSource(image, rotation) : image;
    const fitted = fitToWidth(rotated, PRINTER_WIDTH, fitMode);
    fittedGrayRef.current = toGray(fitted);
    let gray = fittedGrayRef.current;
    if (cropRef.current) gray = cropGray(gray, cropRef.current);
    if (autoEnhance) gray = applyEnhance(gray);
    const toned = applyTone(gray, { gamma, contrast, brightness });
    const lines = ditherToLines(toned, dither === "gray" ? "threshold" : dither, threshold);
    linesRef.current = lines;
    const canvas = previewRef.current;
    canvas.width = toned.width * 2;
    canvas.height = toned.height * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (cropMode) {
      // undithered grayscale view for crop selection
      const src = cropRef.current ? cropGray(fittedGrayRef.current!, cropRef.current) : fittedGrayRef.current!;
      const img = ctx.createImageData(src.width, src.height);
      for (let i = 0; i < src.gray.length; i++) {
        const v = src.gray[i];
        img.data[i * 4] = v;
        img.data[i * 4 + 1] = v;
        img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      // existing crop rect (fitted-image coords) or current drag rect
      const rect = dragRect ?? cropRef.current;
      if (rect) {
        // if a crop is applied, the view is the crop → draw in view coords
        const viewRect = cropRef.current && !dragRect
          ? { x: 0, y: 0, w: src.width, h: src.height }
          : rect;
        ctx.strokeStyle = "#4fc3f7";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(viewRect.x * 2, viewRect.y * 2, viewRect.w * 2, viewRect.h * 2);
      }
      return;
    }
    ctx.fillStyle = "#111111";
    for (let y = 0; y < toned.height; y++) {
      const row = lines[y];
      for (let x = 0; x < toned.width; x++) {
        if (row[x >> 3] & (1 << (x & 7))) {
          ctx.fillRect(x * 2, y * 2, 2, 2);
        }
      }
    }
  }, [image, rotation, fitMode, dither, gamma, contrast, brightness, threshold, autoEnhance, cropMode, dragRect, cropVersion, crop]);

  const pickFile = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    cropRef.current = null;
    setState({ image: bitmap, imageName: file.name, rotation: 0 });
    setCropVersion((v) => v + 1);
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

  const resetCrop = () => {
    cropRef.current = null;
    setCropVersion((v) => v + 1);
  };

  // pointer → image coordinates (canvas attribute px = image px × 2)
  const toImageCoords = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = previewRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * (canvas.width / rect.width)) / 2;
    const y = ((e.clientY - rect.top) * (canvas.height / rect.height)) / 2;
    return {
      x: Math.max(0, Math.min(fittedGrayRef.current!.width - 1, Math.round(x))),
      y: Math.max(0, Math.min(fittedGrayRef.current!.height - 1, Math.round(y))),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!cropMode || !fittedGrayRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toImageCoords(e);
    setDragRect({ x, y, w: 1, h: 1 });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!cropMode || !dragRect || !fittedGrayRef.current) return;
    const { x, y } = toImageCoords(e);
    const startX = dragRect.w >= 0 ? dragRect.x : dragRect.x + dragRect.w;
    const startY = dragRect.h >= 0 ? dragRect.y : dragRect.y + dragRect.h;
    setDragRect({
      x: startX,
      y: startY,
      w: Math.max(1, x - startX),
      h: Math.max(1, y - startY),
    });
  };

  const onPointerUp = () => {
    if (!cropMode || !dragRect) return;
    if (dragRect.w >= 8 && dragRect.h >= 8) {
      cropRef.current = dragRect;
      setCropMode(false);
      setCropVersion((v) => v + 1);
    }
    setDragRect(null);
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
        <label className="inline">
          <input
            type="checkbox"
            checked={autoEnhance}
            onChange={(e) => setState({ autoEnhance: e.target.checked })}
          />
          {t.autoEnhance}
        </label>
      </div>

      {image ? (
        <>
          <h3>{cropMode ? t.cropSelect : t.preview}</h3>
          <canvas
            ref={previewRef}
            className={`preview${cropMode ? " crop-target" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
          <div className="row">
            {cropMode ? (
              <>
                <span className="hint">{t.cropHint}</span>
                <button className="secondary" onClick={() => setCropMode(false)}>
                  {t.cancel}
                </button>
              </>
            ) : (
              <>
                <button className="secondary" onClick={() => setCropMode(true)}>
                  ✂ {t.cropMode}
                </button>
                {cropRef.current && (
                  <button className="secondary" onClick={resetCrop}>
                    ✕ {t.cropReset}
                  </button>
                )}
              </>
            )}
          </div>
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
      {error && (
        <p className="warning">
          {t.printError}: {error === "label-mark-not-found" ? t.labelMarkNotFound : error}
        </p>
      )}
    </div>
  );
}
