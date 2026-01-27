import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalWebhookDeliveries } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalWebhooksDeliveries() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [deliveries, setDeliveries] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalWebhookDeliveries(tokens.idToken ?? "mock-token")
      .then((res) => setDeliveries(res.items))
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Webhook Deliveries" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Webhook Deliveries" tone="warning">
        {error && <div className="cw-alert">{error}</div>}
        <div className="cw-table">
          <div className="cw-table-head">
            <span>delivery_id</span>
            <span>status</span>
            <span>endpoint_id</span>
            <span>updated_at</span>
          </div>
          {deliveries.length === 0 && <div className="cw-muted">No deliveries found.</div>}
          {deliveries.map((delivery, i) => (
            <div key={String(delivery.delivery_id ?? i)} className="cw-table-row">
              <span>{String(delivery.delivery_id ?? "-")}</span>
              <span>{String(delivery.status ?? "-")}</span>
              <span>{String(delivery.endpoint_id ?? "-")}</span>
              <span>{String(delivery.updated_at ?? "-")}</span>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  );
}
