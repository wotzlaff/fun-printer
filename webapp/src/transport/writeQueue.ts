/**
 * Flow-controlled write queue for the "51 78" printers.
 *
 * The printer can send a pause notification (AE payload 0x10) mid-print; the
 * original app's native FlowWrite class then suspends its packet queue and
 * resumes on AE payload 0x00 (live-verified). We replicate that: packets are
 * written back-to-back; the queue waits while paused.
 */

export interface QueueCallbacks {
  onProgress?: (sent: number, total: number) => void;
  onPaused?: (paused: boolean) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
}

export class FlowWriteQueue {
  private packets: Uint8Array[] = [];
  private index = 0;
  private running = false;
  private paused = false;
  private cancelled = false;
  private waiting = false;
  private readonly wake: Promise<void>;
  private notifyWake!: () => void;

  constructor(
    private readonly write: (packet: Uint8Array) => Promise<void>,
    private readonly callbacks: QueueCallbacks = {},
  ) {
    this.wake = new Promise((resolve) => (this.notifyWake = resolve));
  }

  /** Feed the queue (must be called before run()). */
  enqueueAll(data: Uint8Array, chunkSize: number): void {
    for (let offset = 0; offset < data.length; offset += chunkSize) {
      this.packets.push(data.subarray(offset, Math.min(offset + chunkSize, data.length)));
    }
  }

  /** Flow control from the printer. */
  pause(): void {
    if (!this.paused) {
      this.paused = true;
      this.callbacks.onPaused?.(true);
    }
  }

  resume(): void {
    if (this.paused) {
      this.paused = false;
      this.callbacks.onPaused?.(false);
      if (this.waiting) this.notifyWake();
    }
  }

  cancel(): void {
    this.cancelled = true;
    this.paused = false;
    if (this.waiting) this.notifyWake();
  }

  get total(): number {
    return this.packets.length;
  }

  get sent(): number {
    return this.index;
  }

  isRunning(): boolean {
    return this.running;
  }

  async run(): Promise<void> {
    if (this.running) throw new Error("Queue already running");
    this.running = true;
    try {
      while (this.index < this.packets.length) {
        if (this.cancelled) throw new Error("cancelled");
        if (this.paused) {
          this.waiting = true;
          await this.wake;
          this.waiting = false;
          continue;
        }
        const packet = this.packets[this.index];
        try {
          await this.write(packet);
        } catch (error) {
          this.callbacks.onError?.(error);
          throw error;
        }
        this.index++;
        this.callbacks.onProgress?.(this.index, this.packets.length);
      }
      this.callbacks.onDone?.();
    } finally {
      this.running = false;
    }
  }
}
