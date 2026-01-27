import { useEffect, useState } from "react";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalMe, type PortalMeResponse } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalHome() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [data, setData] = useState<PortalMeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalMe(tokens.idToken ?? "mock-token")
      .then(setData)
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <div className="cw-card cw-card-tone-neutral">
          <h1 className="cw-title">Account Status</h1>
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <div className="cw-card cw-card-tone-neutral">
        <h1 className="cw-title">Account Status</h1>
        {error && <div className="cw-alert">{error}</div>}
        {!data && !error && <p className="cw-muted">Loading account details…</p>}
        {data && (
          <div className="cw-detail-grid">
            <div>
              <div className="cw-muted">Tenant</div>
              <div>{data.tenant.name}</div>
            </div>
            <div>
              <div className="cw-muted">Role</div>
              <div>{data.tenant.role}</div>
            </div>
            <div>
              <div className="cw-muted">KYB Status</div>
              <div>{data.tenant.kyb_status}</div>
            </div>
            <div>
              <div className="cw-muted">Ops Status</div>
              <div>{data.tenant.ops_status}</div>
            </div>
            <div>
              <div className="cw-muted">Risk Tier</div>
              <div>{data.tenant.risk_tier}</div>
            </div>
            <div>
              <div className="cw-muted">Plan</div>
              <div>{data.tenant.plan}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
