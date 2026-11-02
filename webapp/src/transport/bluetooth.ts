/**
 * Web Bluetooth transport for the "51 78" printers.
 *
 * Services/characteristics per docs/03-bluetooth-transport.md:
 *   FF00 → write FF02, notify FF01/FF03   (standard boards)
 *   AE30 → write AE01/AE03, notify AE02
 *   200A → write 202A, notify 203A/204A   (R5 boards)
 * Live MX10 observation: MTU 517, 240-byte write chunks, ≈1.2 ms pacing.
 */

import { FlowWriteQueue } from "./writeQueue";
import {
  decodeA3,
  decodeA8Firmware,
  decodeAE,
  type FlowControlEvent,
  type StatusInfo,
} from "../protocol/status";
import {
  deviceInfoQuery,
  deviceIdQuery,
  labelMeasure,
  labelNext,
  labelPositionFound,
  looksLikeErrorNotification,
  paperFeed,
  scanFrames,
  statusQuery,
} from "../protocol/frames";
import { encodePrintJob, type PrintJobOptions } from "../protocol/printJob";

const SERVICE_UUIDS = [
  "0000ff00-0000-1000-8000-00805f9b34fb",
  "0000ae30-0000-1000-8000-00805f9b34fb",
  "0000200a-0000-1000-8000-00805f9b34fb",
];

/** Bluetooth names the original app treats as printers (docs/02). */
const NAME_PREFIXES = [
  "GT", "YT", "MX", "MINI PRINTER", "BQ", "MXW", "LP", "P1", "P3", "MP", "PD",
  "X5", "XO", "AZ-", "CYLO", "EWTTO", "GV-", "KP-", "IM.", "NEWSMY", "C21",
  "D1", "D2", "E2", "URBANWORX", "MINISO", "JL-BR22", "PAPERGO", "YINTIBAO",
  "AEQ", "GB0", "YTB", "58P", "15P", "A4", "A5",
];

export interface PrinterEvents {
  onStatus?: (status: StatusInfo) => void;
  onFirmware?: (version: string) => void;
  onFlowControl?: (event: FlowControlEvent) => void;
  onProgress?: (progress: PrintProgress) => void;
  onError?: (message: string) => void;
  onDisconnect?: () => void;
}

export interface PrintProgress {
  sent: number;
  total: number;
}

const CHUNK_SIZE = 240; // live-verified MX10 write size

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Printer {
  private server: BluetoothRemoteGATTServer | null = null;
  private writeChar: BluetoothRemoteGATTCharacteristic | null = null;
  private notifyChars: BluetoothRemoteGATTCharacteristic[] = [];
  private rxBuffer = new Uint8Array(0);
  private queue: FlowWriteQueue | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  readonly events: PrinterEvents;

  constructor(events: PrinterEvents = {}) {
    this.events = events;
  }

  get connected(): boolean {
    return this.server?.connected ?? false;
  }

  /** Show the browser device picker and connect. Must run in a user gesture. */
  async connect(): Promise<string> {
    if (!navigator.bluetooth) {
      throw new Error("web-bluetooth-unsupported");
    }
    const device = await navigator.bluetooth.requestDevice({
      filters: NAME_PREFIXES.map((prefix) => ({ namePrefix: prefix })),
      optionalServices: SERVICE_UUIDS,
    });
    device.addEventListener("gattserverdisconnected", () => {
      this.stopPolling();
      this.server = null;
      this.events.onDisconnect?.();
    });
    this.server = await device.gatt!.connect();
    await this.discover();
    this.startPolling();
    // initial info queries (observed sequence: A8 → BB)
    await this.writeRaw(deviceInfoQuery());
    await this.writeRaw(deviceIdQuery());
    return device.name ?? "printer";
  }

  async disconnect(): Promise<void> {
    this.stopPolling();
    this.queue?.cancel();
    this.server?.disconnect();
    this.server = null;
  }

  private async discover(): Promise<void> {
    const services = await this.server!.getPrimaryServices();
    for (const service of services) {
      const chars = await service.getCharacteristics();
      for (const char of chars) {
        const props = char.properties;
        if (props.notify || props.indicate) {
          await char.startNotifications();
          char.addEventListener("characteristicvaluechanged", (event) =>
            this.onNotify((event.target as BluetoothRemoteGATTCharacteristic).value!),
          );
          this.notifyChars.push(char);
        }
      }
    }
    // pick a writable characteristic (prefer writeWithoutResponse, as the app does)
    for (const service of services) {
      const chars = await service.getCharacteristics();
      for (const char of chars) {
        if (char.properties.writeWithoutResponse || char.properties.write) {
          this.writeChar = char;
          return;
        }
      }
    }
    throw new Error("no-writable-characteristic");
  }

  private onNotify(value: DataView): void {
    const incoming = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    if (looksLikeErrorNotification(incoming)) {
      this.events.onError?.(new TextDecoder().decode(incoming));
      return;
    }
    // Reassemble the notify stream, then decode frames (frames may span packets).
    const merged = new Uint8Array(this.rxBuffer.length + incoming.length);
    merged.set(this.rxBuffer, 0);
    merged.set(incoming, this.rxBuffer.length);
    const { frames, consumed } = scanFrames(merged);
    this.rxBuffer = merged.slice(consumed);
    if (this.rxBuffer.length > 4096) this.rxBuffer = new Uint8Array(0); // runaway buffer
    for (const f of frames) {
      switch (f.cmd) {
        case 0xa3: {
          const status = decodeA3(f.payload);
          // 22-char responses carry a 16-bit value at payload[1..2]: the
          // label-mark position (0 = mark under the head) or head temperature.
          if (f.payload.length >= 3) {
            this.lastA3Position = (f.payload[1] << 8) | f.payload[2];
          }
          this.events.onStatus?.(status);
          break;
        }
        case 0xa8: {
          const fw = decodeA8Firmware(f.payload);
          if (fw) this.events.onFirmware?.(fw);
          break;
        }
        case 0xae: {
          const event = decodeAE(f.payload);
          if (event === "pause") this.queue?.pause();
          if (event === "resume") this.queue?.resume();
          if (event) this.events.onFlowControl?.(event);
          break;
        }
      }
    }
  }

  private async writeRaw(data: Uint8Array): Promise<void> {
    const char = this.writeChar!;
    if (char.properties.writeWithoutResponse) {
      await char.writeValueWithoutResponse(data);
    } else {
      await char.writeValueWithResponse(data);
    }
  }

  /** Enqueue and send a print job (with copies); resolves when all packets were handed to the radio. */
  async print(
    lines: Uint8Array[],
    options: PrintJobOptions & { copies?: number } = {},
  ): Promise<void> {
    if (!this.connected) throw new Error("not-connected");
    if (this.queue?.isRunning()) throw new Error("print-already-running");
    const { copies = 1, ...jobOptions } = options;
    const job = encodePrintJob(lines, jobOptions);
    const callbacks = {
      onProgress: (sent: number, total: number) =>
        this.events.onProgress?.({ sent, total }),
    };
    this.queue = new FlowWriteQueue((packet) => this.writeRaw(packet), callbacks);
    for (let copy = 0; copy < copies; copy++) {
      if (copy > 0 && jobOptions.feedDots !== 0) {
        this.queue.enqueueAll(paperFeed(jobOptions.feedDots ?? 0x30), CHUNK_SIZE);
      }
      this.queue.enqueueAll(job, CHUNK_SIZE);
    }
    await this.queue.run();
  }

  /**
   * Label print with black-mark positioning (experimental, docs/06):
   * measure loop (A1 0004 + A3 polling) until the mark reports position 0,
   * then "position found" and the job. Between copies: next-label feed + re-measure.
   * Bounded strictly: devices without a mark sensor (e.g. MX10 reports head
   * temperature in the same field) abort after ~1.5 s WITHOUT printing.
   */
  async printLabel(
    lines: Uint8Array[],
    options: PrintJobOptions & { copies?: number } = {},
  ): Promise<void> {
    if (!this.connected) throw new Error("not-connected");
    if (this.queue?.isRunning()) throw new Error("print-already-running");
    const { copies = 1, ...jobOptions } = options;
    for (let copy = 0; copy < copies; copy++) {
      if (copy > 0) await this.writeRaw(labelNext());
      await this.writeRaw(labelMeasure());
      const found = await this.waitForMark(40);
      if (!found) throw new Error("label-mark-not-found");
      await this.writeRaw(labelPositionFound());
      await this.print(lines, { ...jobOptions, copies: 1, feedDots: 0 });
    }
  }

  /** Poll A3 until the position payload reports 0 (mark under the head). */
  private async waitForMark(maxTries: number): Promise<boolean> {
    for (let i = 0; i < maxTries; i++) {
      await this.writeRaw(labelMeasure());
      await this.writeRaw(statusQuery());
      await sleep(40);
      if (this.lastA3Position === 0) return true;
    }
    return false;
  }

  private lastA3Position = -1;

  /** Manual paper feed (dots). */
  async feed(dots = 0x30): Promise<void> {
    await this.writeRaw(paperFeed(dots));
  }

  /** Periodic status polling (A3), ~2 s cadence. */
  private startPolling(): void {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      if (this.connected && !(this.queue?.isRunning() ?? false)) {
        void this.writeRaw(statusQuery());
      }
    }, 2000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

/** Web Bluetooth availability (Chrome/Edge only; not Safari, not Firefox). */
export function isBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.bluetooth;
}
