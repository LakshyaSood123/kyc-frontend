import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalWebhookEndpoints } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalWebhooksEndpoints() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [endpoints, setEndpoints] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalWebhookEndpoints(tokens.idToken ?? "mock-token")
      .then((res) => setEndpoints(res.endpoints))
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Webhook Endpoints" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Webhook Endpoints" tone="info">
        {error && <div className="cw-alert">{error}</div>}
        <div className="cw-table">
          <div className="cw-table-head">
            <span>endpoint_id</span>
            <span>status</span>
            <span>environment</span>
            <span>event_types</span>
          </div>
          {endpoints.length === 0 && <div className="cw-muted">No webhook endpoints.</div>}
          {endpoints.map((endpoint, i) => (
            <div key={String(endpoint.endpoint_id ?? i)} className="cw-table-row">
              <span>{String(endpoint.endpoint_id ?? "-")}</span>
              <span>{String(endpoint.status ?? "-")}</span>
              <span>{String(endpoint.environment ?? "-")}</span>
              <span>{String(endpoint.event_types ?? "-")}</span>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  );
}
