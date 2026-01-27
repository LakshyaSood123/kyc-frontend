import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalBillingBalance } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalBillingBalance() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [balance, setBalance] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentBalance = Number(balance?.current_balance ?? 0);
  const currency = String(balance?.currency ?? "USD");
  const status = String(balance?.billing_status ?? "-");
  const tenantId = String(balance?.tenant_id ?? "-");

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalBillingBalance(tokens.idToken ?? "mock-token")
      .then((res) => setBalance(res.balance))
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Billing Balance" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Billing Balance" tone="success">
        {error && <div className="cw-alert">{error}</div>}
        {!balance && !error && <p className="cw-muted">Loading balance…</p>}
        {balance && (
          <div className="cw-detail-grid">
            <div>
              <div className="cw-muted">Current Balance</div>
              <div className="cw-kpi">
                {currentBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currency}
              </div>
            </div>
            <div>
              <div className="cw-muted">Billing Status</div>
              <div>{status}</div>
            </div>
            <div>
              <div className="cw-muted">Tenant ID</div>
              <div>{tenantId}</div>
            </div>
          </div>
        )}
      </Widget>
    </div>
  );
}
