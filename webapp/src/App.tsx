import { ConnectionPanel } from "./components/ConnectionPanel";
import { ImagePanel } from "./components/ImagePanel";
import { useI18n } from "./i18n";
import type { Language } from "./i18n/strings";

export default function App() {
  const { t, language, setLanguage } = useI18n();
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
        <ImagePanel />
      </div>
      <footer>{t.footer}</footer>
    </main>
  );
}
