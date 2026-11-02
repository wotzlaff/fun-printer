/**
 * App-wide state: a minimal custom store (no external dependency).
 * Components subscribe via useStore(selector).
 */
import { useSyncExternalStore } from "react";
import type { StatusInfo } from "../protocol/status";
import type { PrintProgress } from "../transport/bluetooth";

export type ConnectionState = "disconnected" | "connecting" | "connected";

export interface AppState {
  connection: ConnectionState;
  deviceName: string | null;
  firmware: string | null;
  status: StatusInfo | null;
  flowPaused: boolean;
  progress: PrintProgress | null;
  printing: boolean;
  image: ImageBitmap | null;
  imageName: string | null;
  dither: "floyd" | "threshold";
  density: number;
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
  image: null,
  imageName: null,
  dither: "floyd",
  density: 200,
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
