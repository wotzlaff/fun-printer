/**
 * App-level printer singleton: one Printer instance, wired to the global store.
 * Photo/text/label panels use the high-level helpers here.
 */
import { Printer } from "./bluetooth";
import { setState, getState } from "../state/store";
import { addHistory } from "../state/history";

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

interface PrintRequest {
  lines: Uint8Array[];
  width: number;
  height: number;
  name: string;
  /** Thumbnail dataURL for the history (optional). */
  thumb?: string;
}

async function runPrint(request: PrintRequest): Promise<void> {
  const state = getState();
  setState({ printing: true, progress: null, error: null });
  try {
    const printer = getPrinter();
    const options = {
      density: state.density,
      quality: state.quality,
      copies: state.copies,
    };
    if (state.tab === "label" && state.positioning) {
      await printer.printLabel(request.lines, options);
    } else {
      await printer.print(request.lines, options);
    }
    await addHistory({
      ts: Date.now(),
      name: request.name,
      width: request.width,
      height: request.height,
      thumb: request.thumb ?? "",
      lines: request.lines,
      settings: {
        density: state.density,
        gamma: state.gamma,
        contrast: state.contrast,
        brightness: state.brightness,
        threshold: state.threshold,
        quality: state.quality,
        dither: state.dither,
      },
    });
    setState({ printing: false });
  } catch (error) {
    setState({
      printing: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/** Print lines with the current tone/print settings (all modes). */
export async function printLines(
  lines: Uint8Array[],
  width: number,
  height: number,
  name: string,
  thumb?: string,
): Promise<void> {
  await runPrint({ lines, width, height, name, thumb });
}

/** Manual paper feed. */
export async function feedPaper(): Promise<void> {
  try {
    await getPrinter().feed();
  } catch (error) {
    setState({ error: error instanceof Error ? error.message : String(error) });
  }
}
