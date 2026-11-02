/**
 * App-wide state: a minimal custom store (no external dependency).
 * Components subscribe via useStore(selector).
 */
import { useSyncExternalStore } from "react";
import type { StatusInfo } from "../protocol/status";
import type { PrintProgress } from "../transport/bluetooth";
import type { FitMode } from "../imaging/raster";

export type ConnectionState = "disconnected" | "connecting" | "connected";
export type PrintTab = "photo" | "text" | "label" | "history";
export type RasterMode = "floyd" | "threshold" | "gray";

export interface AppState {
  connection: ConnectionState;
  deviceName: string | null;
  firmware: string | null;
  status: StatusInfo | null;
  flowPaused: boolean;
  progress: PrintProgress | null;
  printing: boolean;
  tab: PrintTab;
  // photo
  image: ImageBitmap | null;
  imageName: string | null;
  rotation: number; // quarter turns
  fitMode: FitMode;
  // raster / tone
  dither: RasterMode;
  density: number;
  gamma: number;
  contrast: number;
  brightness: number;
  threshold: number;
  quality: number;
  copies: number;
  // text
  textContent: string;
  fontSize: number;
  bold: boolean;
  // label
  labelTitle: string;
  labelBody: string;
  labelQr: string;
  labelWidthMm: number;
  positioning: boolean; // black-mark positioning (experimental)
  error: string | null;
}

let state: AppState = {
  connection: "disconnected",
  deviceName: null,
  firmware: null,
  status: null,
  flowPaused: false,
  progress: null,
  printing: false,
  tab: "photo",
  image: null,
  imageName: null,
  rotation: 0,
  fitMode: "contain",
  dither: "floyd",
  density: 200,
  gamma: 2.0,
  contrast: 1.0,
  brightness: 0,
  threshold: 170,
  quality: 4,
  copies: 1,
  textContent: "",
  fontSize: 24,
  bold: true,
  labelTitle: "",
  labelBody: "",
  labelQr: "",
  labelWidthMm: 30,
  positioning: false,
  error: null,
};

const listeners = new Set<() => void>();

export function getState(): AppState {
  return state;
}

export function setState(patch: Partial<AppState>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => selector(state),
  );
}
