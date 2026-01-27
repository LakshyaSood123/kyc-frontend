import { useState } from "react";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getKybUploadUrl } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalKybUpload() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [filename, setFilename] = useState("");
  const [contentType, setContentType] = useState("application/pdf");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadUrl = String(result?.upload_url ?? "-");
  const key = String(result?.key ?? "-");
  const expiresIn = String(result?.expires_in ?? "-");

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <Widget title="KYB Upload URL" tone="neutral">
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </Widget>
      </div>
    );
  }

  return (
    <div className="cw-page">
      <Widget title="KYB Upload URL" tone="violet">
        {error && <div className="cw-alert">{error}</div>}
        {result && (
          <div className="cw-detail-grid" style={{ marginBottom: 12 }}>
            <div>
              <div className="cw-muted">Upload URL</div>
              <div className="cw-break">{uploadUrl}</div>
            </div>
            <div>
              <div className="cw-muted">Storage Key</div>
              <div className="cw-break">{key}</div>
            </div>
            <div>
              <div className="cw-muted">Expires In</div>
              <div>{expiresIn} seconds</div>
            </div>
          </div>
        )}
        <div className="cw-form">
          <input
            className="cw-input"
            value={filename}
            placeholder="Document filename"
            onChange={(event) => setFilename(event.target.value)}
          />
          <input
            className="cw-input"
            value={contentType}
            placeholder="Content type"
            onChange={(event) => setContentType(event.target.value)}
          />
          <button
            className="cw-btn cw-btn-active"
            type="button"
            onClick={() => {
              if (!filename.trim()) return;
              if (!tokens.idToken && !useMocks) return;
              setError(null);
              setResult(null);
              getKybUploadUrl(tokens.idToken ?? "mock-token", filename.trim(), contentType.trim())
                .then((res) => setResult(res))
                .catch((err) => setError(err.message));
            }}
          >
            Get upload URL
          </button>
        </div>
      </Widget>
    </div>
  );
}
