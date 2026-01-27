import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalAuditLogs } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalAuditLogs() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalAuditLogs(tokens.idToken ?? "mock-token")
      .then((res) => setLogs(res.logs))
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Audit Logs" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Audit Logs" tone="info">
        {error && <div className="cw-alert">{error}</div>}
        <div className="cw-table">
          <div className="cw-table-head">
            <span>event</span>
            <span>actor</span>
            <span>status</span>
            <span>occurred_at</span>
          </div>
          {logs.length === 0 && <div className="cw-muted">No audit logs yet.</div>}
          {logs.map((log, i) => (
            <div key={String(log.id ?? i)} className="cw-table-row">
              <span>{String(log.event ?? "-")}</span>
              <span>{String(log.actor ?? "-")}</span>
              <span>{String(log.status ?? "-")}</span>
              <span>{String(log.occurred_at ?? "-")}</span>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  );
}
