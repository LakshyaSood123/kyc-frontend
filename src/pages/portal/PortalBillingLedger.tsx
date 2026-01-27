import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalBillingLedger } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalBillingLedger() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [transactions, setTransactions] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalBillingLedger(tokens.idToken ?? "mock-token")
      .then((res) => setTransactions(res.transactions))
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Billing Ledger" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Billing Ledger" tone="warning">
        {error && <div className="cw-alert">{error}</div>}
        {!transactions && !error && <p className="cw-muted">Loading ledger…</p>}
        {transactions && (
          <div className="cw-table">
            <div className="cw-table-head">
              <span>kind</span>
              <span>amount</span>
              <span>created_at</span>
            </div>
            {transactions.length === 0 && <div className="cw-muted">No transactions.</div>}
            {transactions.map((row, i) => (
              <div key={i} className="cw-table-row">
                <span>{String(row.kind ?? "-")}</span>
                <span>{String(row.amount ?? "-")}</span>
                <span>{String(row.created_at ?? "-")}</span>
              </div>
            ))}
          </div>
        )}
      </Widget>
    </div>
  );
}
