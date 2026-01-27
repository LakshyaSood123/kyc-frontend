import { useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { createOnboarding } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalOnboarding() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tenant = (result?.tenant as { id?: string; name?: string; plan?: string } | undefined) ?? null;

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="Onboarding" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="Onboarding" tone="success">
        {error && <div className="cw-alert">{error}</div>}
        {result && (
          <div className="cw-detail-grid" style={{ marginBottom: 12 }}>
            <div>
              <div className="cw-muted">Status</div>
              <div>{String(result.message ?? "Tenant created")}</div>
            </div>
            {tenant && (
              <>
                <div>
                  <div className="cw-muted">Tenant ID</div>
                  <div>{tenant.id ?? "-"}</div>
                </div>
                <div>
                  <div className="cw-muted">Tenant Name</div>
                  <div>{tenant.name ?? "-"}</div>
                </div>
                <div>
                  <div className="cw-muted">Plan</div>
                  <div>{tenant.plan ?? "-"}</div>
                </div>
              </>
            )}
          </div>
        )}
        <div className="cw-form">
          <input
            className="cw-input"
            value={companyName}
            placeholder="Company name"
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <button
            className="cw-btn cw-btn-active"
            type="button"
            onClick={() => {
              if (!companyName.trim()) return;
              if (!tokens.idToken && !useMocks) return;
              setError(null);
              setResult(null);
              createOnboarding(tokens.idToken ?? "mock-token", companyName.trim())
                .then((res) => setResult(res))
                .catch((err) => setError(err.message));
            }}
          >
            Submit
          </button>
        </div>
      </Widget>
    </div>
  );
}
