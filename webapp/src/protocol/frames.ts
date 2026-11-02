/**
 * "51 78" frame builder and command constants.
 *
 * Frame layout (docs/04-protocol-5178.md, live-verified):
 *   51 78 <CMD> <LEN16 BE> 00 <payload (LEN bytes)> <CRC8(payload)> FF
 */
import { crc8 } from "./crc8";

export const HEADER = 0x51; // "Q"
export const MAGIC = 0x78; // "x"
export const TERMINATOR = 0xff;

/** Print head burn energy (AF), 16-bit little-endian. Live MX10 value: 15000. */
export type PrintCommand = {
  /** Command byte, e.g. 0xF2 (density), 0xA3 (status query). */
  cmd: number;
  payload: Uint8Array;
};

/** Build one wire frame. */
export function frame(cmd: number, payload: Uint8Array = new Uint8Array(0)): Uint8Array {
  const out = new Uint8Array(6 + payload.length + 2);
  out[0] = HEADER;
  out[1] = MAGIC;
  out[2] = cmd;
  out[3] = (payload.length >> 8) & 0xff;
  out[4] = payload.length & 0xff;
  out[5] = 0x00; // separator
  out.set(payload, 6);
  out[out.length - 2] = crc8(payload);
  out[out.length - 1] = TERMINATOR;
  return out;
}

// ---------------------------------------------------------------- commands
const bytes = (...values: number[]) => Uint8Array.from(values);

/** Status query. Response: payload [status, ?, temperature °C]. */
export const statusQuery = () => frame(0xa3, bytes(0x00));

/** Device info query (ASCII firmware version in response). */
export const deviceInfoQuery = () => frame(0xa8, bytes(0x00));

/** Device ID query. */
export const deviceIdQuery = () => frame(0xbb, bytes(0x01));

/** Poll companion of A3 (response grows during print; meaning unresolved). */
export const d3Query = () => frame(0xd3, bytes(0x00));

/** Density/"Nongdu" 1..200. Live MX10: 200, reduced to 130 when hot. */
export const setDensity = (density: number) => frame(0xf2, bytes(0x01, density & 0xff));

/** Burn energy, 16-bit little-endian. Live MX10: 15000. */
export const setEnergy = (energy: number) =>
  frame(0xaf, bytes(energy & 0xff, (energy >> 8) & 0xff));

/** Print mode: 0x00 = image. */
export const setModeImage = () => frame(0xbe, bytes(0x00));

/** Print head speed. Live MX10: 10 (sent twice per job). */
export const setSpeed = (speed: number) => frame(0xbd, bytes(speed & 0xff));

/** Paper feed in dots (0x30 = 48 dots at 200 dpi). */
export const paperFeed = (dots = 0x30) => frame(0xa1, bytes(dots, 0x00));

/** Raster start marker (lattice). */
export const LATTICE_START = Uint8Array.from(
  "5178A6000B00AA551738445F5F5F44382CA1FF".match(/.{2}/g)!.map((h) => parseInt(h, 16)),
);

/** Raster end marker. */
export const LATTICE_END = Uint8Array.from(
  "5178A6000B00AA5517000000000000001711FF".match(/.{2}/g)!.map((h) => parseInt(h, 16)),
);

/** One 1 bpp image line. `line` length = width/8, LSB-first, bit 1 = black. */
export const imageLine = (line: Uint8Array) => frame(0xa2, line);

// ---------------------------------------------------------------- rx parsing
export type ParsedFrame = { cmd: number; payload: Uint8Array };

/**
 * Scan a notify byte buffer for complete frames and return them plus the number
 * of bytes consumed. Handles both wire layouts:
 *  A (app→printer): 51 78 CMD LEN16BE 00 payload crc FF
 *  B (device→app):  51 78 CMD flags  plen 00 payload crc FF
 * A frame is accepted when CRC and terminator validate.
 */
export function scanFrames(
  buf: Uint8Array,
): { frames: ParsedFrame[]; consumed: number } {
  const frames: ParsedFrame[] = [];
  let i = 0;
  outer: while (i + 8 <= buf.length) {
    if (buf[i] !== HEADER || buf[i + 1] !== MAGIC) {
      i++; // resync: skip one byte
      continue;
    }
    const cmd = buf[i + 2];
    const b3 = buf[i + 3];
    const candidates = b3 === 0 ? [buf[i + 4]] : [buf[i + 4], b3];
    for (const plen of candidates) {
      const end = i + 6 + plen;
      if (end + 2 > buf.length) continue; // this candidate incomplete
      const body = buf.subarray(i + 6, end);
      if (buf[end + 1] === TERMINATOR && buf[end] === crc8(body)) {
        frames.push({ cmd, payload: new Uint8Array(body) });
        i = end + 2;
        continue outer;
      }
    }
    // No candidate validated: if another header exists later in the buffer,
    // the current one is noise → continue there. Otherwise wait for more data.
    const next = nextHeader(buf, i + 2);
    if (next === -1) break;
    i = next;
  }
  return { frames, consumed: i };
}

function nextHeader(buf: Uint8Array, from: number): number {
  for (let i = from; i + 2 <= buf.length; i++) {
    if (buf[i] === HEADER && buf[i + 1] === MAGIC) return i;
  }
  return -1;
}

/** Detect the plain-text error notifications ("err:…" = ASCII 6572723a…). */
export function looksLikeErrorNotification(buf: Uint8Array): boolean {
  return (
    buf.length >= 8 &&
    buf[0] === 0x65 && buf[1] === 0x72 && buf[2] === 0x72 && buf[3] === 0x3a
  );
}
