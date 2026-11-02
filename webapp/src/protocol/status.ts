/**
 * Decoding of printer→app frames: status (A3), info (A8), flow control (AE).
 * Verified against the live MX10 capture.
 */
export type PrinterStatus =
  | "ok"
  | "paper-out"
  | "overheat"
  | "battery-low"
  | "unknown";

export interface StatusInfo {
  status: PrinterStatus;
  /** Print head temperature in °C (A3 response byte 2). */
  temperature: number | null;
  /** Raw first payload byte (0x00 normal; 0x80 flag bit observed, meaning open). */
  rawStatus: number;
}

export function decodeA3(payload: Uint8Array): StatusInfo {
  const rawStatus = payload.length > 0 ? payload[0] : 0;
  const temperature = payload.length >= 3 ? payload[2] : null;
  let status: PrinterStatus = "unknown";
  switch (rawStatus & 0x7f) {
    case 0x00:
      status = "ok";
      break;
    case 0x01:
    case 0x09:
      status = "paper-out";
      break;
    case 0x04:
      status = "overheat";
      break;
    case 0x08:
      status = "battery-low";
      break;
  }
  return { status, temperature, rawStatus };
}

/** Extract ASCII firmware version from an A8 response payload, e.g. "1.0.11". */
export function decodeA8Firmware(payload: Uint8Array): string | null {
  if (payload.length < 3) return null;
  const ascii = payload
    .slice(2, payload.length - 1) // skip 2 bytes header + trailing NUL
    .filter((b) => b >= 0x20 && b < 0x7f);
  return ascii.length > 0 ? String.fromCharCode(...ascii) : null;
}

/** Flow-control notification payload (AE): 0x10 = pause, 0x00 = resume. */
export type FlowControlEvent = "pause" | "resume";

export function decodeAE(payload: Uint8Array): FlowControlEvent | null {
  if (payload.length < 1) return null;
  return payload[0] === 0x10 ? "pause" : payload[0] === 0x00 ? "resume" : null;
}
