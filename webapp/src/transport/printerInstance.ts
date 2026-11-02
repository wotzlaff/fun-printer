/**
 * App-level printer singleton: one Printer instance, wired to the global store.
 * Both the connection panel and the print controls use it.
 */
import { Printer } from "./bluetooth";
import { setState } from "../state/store";

let printer: Printer | null = null;

export function getPrinter(): Printer {
  if (!printer) {
    printer = new Printer({
      onStatus: (status) => setState({ status }),
      onFirmware: (firmware) => setState({ firmware }),
      onFlowControl: (event) => setState({ flowPaused: event === "pause" }),
      onProgress: (progress) => setState({ progress }),
      onError: (message) => setState({ error: message }),
      onDisconnect: () =>
        setState({ connection: "disconnected", flowPaused: false, printing: false }),
    });
  }
  return printer;
}

/** Print pre-encoded lines with the current tone/print settings; resolves on completion. */
export async function printLines(
  lines: Uint8Array[],
  density: number,
  quality: number,
  onDone: () => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    await getPrinter().print(lines, { density, quality });
    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : String(error));
  }
}
