import { useEffect, useRef, useState } from "react";
import { LABEL_WIDTHS_MM, renderLabel, HEAD_WIDTH } from "../imaging/labelRender";
import { toGray, ditherToLines } from "../imaging/raster";
import { printLines } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { useI18n } from "../i18n";
import { PrintControls } from "./PhotoPanel";

export function LabelPanel() {
  const { t } = useI18n();
  const labelTitle = useStore((s) => s.labelTitle);
  const labelBody = useStore((s) => s.labelBody);
  const labelQr = useStore((s) => s.labelQr);
  const labelWidthMm = useStore((s) => s.labelWidthMm);
  const qrFullWidth = useStore((s) => s.qrFullWidth);
  const positioning = useStore((s) => s.positioning);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Uint8Array[] | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    if (!labelTitle.trim() && !labelQr.trim()) {
      linesRef.current = null;
      return;
    }
    let cancelled = false;
    void renderLabel({
      widthMm: labelWidthMm,
      title: labelTitle,
      body: labelBody,
      qr: labelQr,
      qrFullWidth,
    })
      .then((imageData) => {
        if (cancelled || !previewRef.current) return;
        const gray = toGray(imageData);
        const lines = ditherToLines(gray, "threshold", 170);
        linesRef.current = lines;
        const canvas = previewRef.current;
        canvas.width = gray.width * 2; // = head width ×2
        canvas.height = gray.height * 2;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#111111";
        for (let y = 0; y < gray.height; y++) {
          const row = lines[y];
          for (let x = 0; x < gray.width; x++) {
            if (row[x >> 3] & (1 << (x & 7))) {
              ctx.fillRect(x * 2, y * 2, 2, 2);
            }
          }
        }
      })
      .catch((error) => setRenderError(String(error)));
    return () => {
      cancelled = true;
    };
  }, [labelTitle, labelBody, labelQr, labelWidthMm, qrFullWidth]);

  const onPrint = () => {
    if (!linesRef.current || !previewRef.current) return;
    void printLines(
      linesRef.current,
      HEAD_WIDTH,
      linesRef.current.length,
      `label-${labelWidthMm}mm`,
      previewRef.current.toDataURL("image/png"),
    );
  };

  return (
    <section className="panel">
      <h2>{t.tabLabel}</h2>
      <div className="row">
        <label className="inline">
          {t.labelWidth}:{" "}
          <select
            value={labelWidthMm}
            onChange={(e) => setState({ labelWidthMm: Number(e.target.value) })}
          >
            {LABEL_WIDTHS_MM.map((mm) => (
              <option key={mm} value={mm}>
                {mm === 0 ? t.labelWidthFull : `${mm} mm`}
              </option>
            ))}
          </select>
        </label>
        <label className="inline">
          <input
            type="checkbox"
            checked={qrFullWidth}
            onChange={(e) => setState({ qrFullWidth: e.target.checked })}
            disabled={!labelQr.trim()}
          />
          {t.qrFullWidth}
        </label>
        <label className="inline">
          <input
            type="checkbox"
            checked={positioning}
            onChange={(e) => setState({ positioning: e.target.checked })}
          />
          {t.positioning} ⚗
        </label>
      </div>
      {positioning && <p className="hint">{t.positioningHint}</p>}
      <input
        className="text-field"
        placeholder={t.labelTitlePlaceholder}
        value={labelTitle}
        onChange={(e) => setState({ labelTitle: e.target.value })}
      />
      <textarea
        className="text-input"
        rows={3}
        placeholder={t.labelBodyPlaceholder}
        value={labelBody}
        onChange={(e) => setState({ labelBody: e.target.value })}
      />
      <input
        className="text-field"
        placeholder={t.labelQrPlaceholder}
        value={labelQr}
        onChange={(e) => setState({ labelQr: e.target.value })}
      />
      {renderError && <p className="warning">{t.printError}: {renderError}</p>}
      {(labelTitle.trim() || labelQr.trim()) && (
        <>
          <h3>{t.preview}</h3>
          <canvas ref={previewRef} className="preview" />
          <PrintControls onPrint={onPrint} />
        </>
      )}
    </section>
  );
}
