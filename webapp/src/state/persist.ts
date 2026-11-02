/**
 * Settings persistence: remembers print/tone settings in localStorage,
 * keyed per device once connected (falls back to a global key).
 */
import { getState, setState, type AppState } from "./store";

export interface PersistedSettings {
  density: number;
  gamma: number;
  contrast: number;
  brightness: number;
  threshold: number;
  quality: number;
  dither: "floyd" | "threshold" | "gray";
}

const GLOBAL_KEY = "fun-printer:settings:global";

/**
 * Bump when the shipped defaults change so stale stored values from older
 * versions don't override them (old entries are ignored on load).
 */
const SETTINGS_VERSION = 2;

const SETTINGS_FIELDS: (keyof PersistedSettings)[] = [
  "density",
  "gamma",
  "contrast",
  "brightness",
  "threshold",
  "quality",
  "dither",
];

function key(deviceName: string | null): string {
  return deviceName ? `fun-printer:settings:${deviceName}` : GLOBAL_KEY;
}

/** Load persisted settings (device-specific first, then global) into the store. */
export function loadSettings(deviceName: string | null): void {
  try {
    const raw = localStorage.getItem(key(deviceName)) ?? localStorage.getItem(GLOBAL_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<PersistedSettings> & { version?: number };
    if (parsed.version !== SETTINGS_VERSION) return; // stale defaults → keep ours
    const patch: Record<string, unknown> = {};
    for (const field of SETTINGS_FIELDS) {
      const value = parsed[field];
      if (value !== undefined) patch[field] = value;
    }
    setState(patch as Partial<AppState>);
  } catch {
    // corrupted storage → ignore
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/** Persist current settings (debounced). */
export function saveSettings(deviceName: string | null): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const state = getState();
      const settings: PersistedSettings = {
        density: state.density,
        gamma: state.gamma,
        contrast: state.contrast,
        brightness: state.brightness,
        threshold: state.threshold,
        quality: state.quality,
        dither: state.dither,
      };
      localStorage.setItem(
        key(deviceName),
        JSON.stringify({ version: SETTINGS_VERSION, ...settings }),
      );
    } catch {
      // storage full/unavailable → non-fatal
    }
  }, 300);
}
