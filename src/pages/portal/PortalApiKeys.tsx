import { useEffect, useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { createPortalApiKey, deletePortalApiKey, getPortalApiKeys } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalApiKeys() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [keys, setKeys] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  const load = () => {
    if (authDisabled && !tokens.idToken && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalApiKeys(tokens.idToken ?? "mock-token")
      .then((res) => setKeys(res.keys))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="API Keys" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="API Keys" tone="violet">
        {error && <div className="cw-alert">{error}</div>}
        {createdSecret && (
          <div className="cw-alert">
            Save this secret now: <code>{createdSecret}</code>
          </div>
        )}
        <div className="cw-form">
          <input
            className="cw-input"
            value={name}
            placeholder="New API key name"
            onChange={(event) => setName(event.target.value)}
          />
          <button
            className="cw-btn cw-btn-active"
            type="button"
            onClick={() => {
              if (!tokens.idToken || !name.trim()) return;
            setError(null);
            setCreatedSecret(null);
              createPortalApiKey(tokens.idToken ?? "mock-token", name.trim())
                .then((res) => {
                  setName("");
                  setCreatedSecret(String((res.key as { secret?: string })?.secret ?? ""));
                  load();
                })
                .catch((err) => setError(err.message));
            }}
          >
            Create key
          </button>
        </div>

        <div className="cw-table">
          <div className="cw-table-head">
            <span>name</span>
            <span>prefix</span>
            <span>status</span>
            <span></span>
          </div>
          {keys.length === 0 && <div className="cw-muted">No keys yet.</div>}
          {keys.map((key) => (
            <div key={String(key.id ?? key.prefix ?? Math.random())} className="cw-table-row">
              <span>{String(key.name ?? "-")}</span>
              <span>{String(key.prefix ?? "-")}</span>
              <span>{String(key.status ?? "-")}</span>
              <span>
                <button
                  className="cw-btn"
                  type="button"
                  onClick={() => {
                    if (!key.id) return;
                    deletePortalApiKey(tokens.idToken ?? "mock-token", String(key.id))
                      .then(load)
                      .catch((err) => setError(err.message));
                  }}
                >
                  Revoke
                </button>
              </span>
            </div>
          ))}
        </div>
      </Widget>
    </div>
  );
}
