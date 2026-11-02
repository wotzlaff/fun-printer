/**
 * Complete print-job encoder for the MX10 (V5G model class, 384 px @ 203 dpi).
 * Sequence live-verified 2026-11-02 (docs/04-protocol-5178.md):
 *   F2 density → A3 status → A4 quality → A6 lattice start → AF energy →
 *   BE mode image → BD speed ×2 → A2 lines → A1 feed → A6 lattice end → A3 status
 */
import {
  frame,
  imageLine,
  LATTICE_END,
  LATTICE_START,
  paperFeed,
  setDensity,
  setEnergy,
  setModeImage,
  setSpeed,
  statusQuery,
} from "./frames";

/** Print-job tuning. All fields optional; defaults live-verified on the MX10. */
export interface PrintJobOptions {
  /** Density/"Nongdu" 1..200 (live MX10: 200). */
  density?: number;
  /** Burn energy (live MX10: 15000). */
  energy?: number;
  /** Head speed (live MX10: 10). */
  speed?: number;
  /** Quality level 1..5 (live MX10: 4). */
  quality?: number;
  /** Feed dots after the image (live MX10: one feed of 0x30 = 48 dots). */
  feedDots?: number;
}

export const DEFAULT_JOB_OPTIONS: Required<PrintJobOptions> = {
  density: 200,
  energy: 15000,
  speed: 10,
  quality: 4,
  feedDots: 0x30,
};

export function encodePrintJob(lines: Uint8Array[], options: PrintJobOptions = {}): Uint8Array {
  const opts = { ...DEFAULT_JOB_OPTIONS, ...options };
  const parts: Uint8Array[] = [
    setDensity(opts.density),
    statusQuery(),
    frame(0xa4, Uint8Array.from([0x30 + opts.quality])),
    LATTICE_START,
    setEnergy(opts.energy),
    setModeImage(),
    setSpeed(opts.speed),
    setSpeed(opts.speed), // observed twice per job in the live capture
  ];
  for (const line of lines) {
    parts.push(imageLine(line));
  }
  parts.push(paperFeed(opts.feedDots), LATTICE_END, statusQuery(), statusQuery());
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}
