/**
 * CRC-8 as used by the "51 78" printer protocol:
 * polynomial 0x07, init 0x00, MSB-first, no final XOR ("CRC-8/ATM").
 * Verified against live captures (docs/04-protocol-5178.md).
 */
const TABLE = (() => {
  const t = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let bit = 0; bit < 8; bit++) {
      c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
    }
    t[i] = c;
  }
  return t;
})();

export function crc8(data: Uint8Array, offset = 0, length = data.length): number {
  let crc = 0;
  for (let i = offset; i < offset + length; i++) {
    crc = TABLE[crc ^ (data[i] & 0xff)];
  }
  return crc;
}
