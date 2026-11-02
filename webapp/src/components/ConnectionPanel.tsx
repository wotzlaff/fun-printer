import { isBluetoothSupported } from "../transport/bluetooth";
import { getPrinter, feedPaper } from "../transport/printerInstance";
import { setState, useStore } from "../state/store";
import { loadSettings } from "../state/persist";
import { useI18n } from "../i18n";
import type { StatusInfo } from "../protocol/status";

export function ConnectionPanel() {
  const { t } = useI18n();
  const connection = useStore((s) => s.connection);
  const deviceName = useStore((s) => s.deviceName);
  const firmware = useStore((s) => s.firmware);
  const printing = useStore((s) => s.printing);

  const supported = isBluetoothSupported();
  const secure = window.isSecureContext;

  const connect = async () => {
    setState({ connection: "connecting", error: null });
    try {
      const name = await getPrinter().connect();
      setState({ connection: "connected", deviceName: name });
      loadSettings(name); // device-specific settings override globals
    } catch (error) {
      setState({
        connection: "disconnected",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const disconnect = async () => {
    await getPrinter().disconnect();
    setState({ connection: "disconnected", flowPaused: false, firmware: null });
  };

  return (
    <section className="panel">
      <h2>{t.connection}</h2>
      {!supported && <p className="warning">{t.btUnsupported}</p>}
      {supported && !secure && <p className="warning">{t.btHttpWarning}</p>}
      <div className="row">
        {connection === "connected" ? (
          <button className="primary" onClick={disconnect}>
            {t.disconnect}
          </button>
        ) : (
          <button
            className="primary"
            disabled={!supported || !secure || connection === "connecting"}
            onClick={() => void connect()}
          >
            {connection === "connecting" ? t.connecting : t.connect}
          </button>
        )}
        <span className={`badge ${connection === "connected" ? "ok" : ""}`}>
          {connection === "connected" ? t.connected : connection === "connecting" ? t.connecting : t.disconnected}
        </span>
      </div>
      {deviceName && (
        <dl className="meta">
          <dt>{t.device}</dt>
          <dd>{deviceName}</dd>
          {firmware && (
            <>
              <dt>{t.firmware}</dt>
              <dd>{firmware}</dd>
            </>
          )}
        </dl>
      )}
      {connection === "connected" && (
        <div className="row">
          <button
            className="secondary"
            disabled={printing}
            onClick={() => void feedPaper()}
          >
            {t.feed}
          </button>
        </div>
      )}
      {connection === "connected" && <StatusPanel />}
    </section>
  );
}

export function StatusPanel() {
  const { t } = useI18n();
  const status = useStore((s) => s.status);
  const flowPaused = useStore((s) => s.flowPaused);

  const statusLabel = (s: StatusInfo["status"]) =>
    s === "ok" ? t.statusOk
    : s === "paper-out" ? t.statusPaper
    : s === "overheat" ? t.statusHeat
    : s === "battery-low" ? t.statusBattery
    : t.statusUnknown;

  return (
    <div className="status-grid">
      <div>
        <span className="meta-label">{t.status}</span>
        <span className={`badge ${status?.status === "ok" ? "ok" : "warn"}`}>
          {status ? statusLabel(status.status) : "—"}
        </span>
      </div>
      <div>
        <span className="meta-label">{t.temperature}</span>
        <span>{status?.temperature != null ? `${status.temperature} °C` : "—"}</span>
      </div>
      <div>
        <span className="meta-label">{t.flowControl}</span>
        <span className={`badge ${flowPaused ? "warn" : "ok"}`}>
          {flowPaused ? t.flowPaused : t.flowRunning}
        </span>
      </div>
    </div>
  );
}
