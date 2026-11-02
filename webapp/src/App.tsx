import { useEffect } from "react";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { PhotoPanel } from "./components/PhotoPanel";
import { TextPanel } from "./components/TextPanel";
import { LabelPanel } from "./components/LabelPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { useI18n } from "./i18n";
import type { Language, Strings } from "./i18n/strings";
import { setState, useStore } from "./state/store";
import { loadSettings, saveSettings } from "./state/persist";
import type { PrintTab } from "./state/store";

export default function App() {
  const { t, language, setLanguage } = useI18n();
  const tab = useStore((s) => s.tab);
  const deviceName = useStore((s) => s.deviceName);
  const connected = useStore((s) => s.connection === "connected");

  // auto-save settings whenever they change (device-specific once connected)
  useEffect(() => {
    saveSettings(deviceName);
  }, [deviceName, useStoreSettingsSnapshot()]);
  // load global settings once at startup
  useEffect(() => {
    loadSettings(null);
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>{t.appTitle}</h1>
          <p>{t.appSubtitle}</p>
        </div>
        <div className="lang-switch">
          {(["de", "en"] as Language[]).map((lang) => (
            <button
              key={lang}
              className={language === lang ? "active" : ""}
              onClick={() => setLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <div className="panels">
        <ConnectionPanel />
        <nav className="tabs">
          {(
            [
              ["photo", t.tabPhoto],
              ["text", t.tabText],
              ["label", t.tabLabel],
              ["history", t.tabHistory],
            ] as [PrintTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setState({ tab: id })}
            >
              {label}
            </button>
          ))}
        </nav>
        {tab === "photo" && <PhotoPanel />}
        {tab === "text" && <TextPanel />}
        {tab === "label" && <LabelPanel />}
        {tab === "history" && <HistoryPanel />}
      </div>
      <footer>{connected ? t.footer : ""}</footer>
    </main>
  );
}

/** Subscribe to the persisted settings fields so saveSettings re-runs on change. */
function useStoreSettingsSnapshot(): string {
  const density = useStore((s) => s.density);
  const gamma = useStore((s) => s.gamma);
  const contrast = useStore((s) => s.contrast);
  const brightness = useStore((s) => s.brightness);
  const threshold = useStore((s) => s.threshold);
  const quality = useStore((s) => s.quality);
  const dither = useStore((s) => s.dither);
  return JSON.stringify({ density, gamma, contrast, brightness, threshold, quality, dither });
}

// keep the Strings/Language import used for typing the language switch
export type { Language, Strings };
