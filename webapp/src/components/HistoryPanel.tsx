import { useCallback, useEffect, useState } from "react";
import {
  deleteHistory,
  listHistory,
  type HistoryEntry,
} from "../state/history";
import { printLines } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { useI18n } from "../i18n";

export function HistoryPanel() {
  const { t } = useI18n();
  const printing = useStore((s) => s.printing);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    void listHistory().then(setEntries);
  }, []);

  useEffect(refresh, [refresh]);

  const reprint = async (entry: HistoryEntry) => {
    setBusy(true);
    // restore the stored print settings for a faithful reprint
    setState({ ...entry.settings, copies: 1 });
    await printLines(entry.lines, entry.width, entry.height, entry.name, entry.thumb);
    setBusy(false);
  };

  const remove = async (id: number) => {
    await deleteHistory(id);
    refresh();
  };

  const restore = (entry: HistoryEntry) => {
    setState({ ...entry.settings });
  };

  return (
    <section className="panel">
      <h2>{t.tabHistory}</h2>
      {entries.length === 0 && <p className="hint">{t.historyEmpty}</p>}
      <div className="history-grid">
        {entries.map((entry) => (
          <div key={entry.id} className="history-item">
            {entry.thumb && <img src={entry.thumb} alt={entry.name} />}
            <div className="history-meta">
              <span>{entry.name}</span>
              <span className="muted">
                {entry.width}×{entry.height} ·{" "}
                {new Date(entry.ts).toLocaleString()}
              </span>
            </div>
            <div className="history-actions">
              <button
                className="secondary"
                disabled={printing || busy}
                onClick={() => void reprint(entry)}
              >
                {t.reprint}
              </button>
              <button
                className="secondary"
                onClick={() => restore(entry)}
                title={t.restoreSettings}
              >
                ⚙
              </button>
              <button
                className="secondary danger"
                onClick={() => entry.id != null && void remove(entry.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
