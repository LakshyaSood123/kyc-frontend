import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePortalAuth } from "../lib/portalAuth";

export default function LoginCallback() {
  const { exchangeCode } = usePortalAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    const errorParam = params.get("error");
    const errorDesc = params.get("error_description");

    if (errorParam) {
      setError(errorDesc || errorParam);
      return;
    }

    if (!code) {
      setError("Missing authorization code.");
      return;
    }

    exchangeCode(code, state)
      .then(() => navigate("/portal", { replace: true }))
      .catch((err) => setError(err.message));
  }, [exchangeCode, navigate, params]);

  return (
    <div className="cw-page">
      <div className="cw-card cw-card-tone-neutral">
        <h1 className="cw-title">Signing you in…</h1>
        {error ? <div className="cw-alert">{error}</div> : <p className="cw-muted">Finishing login.</p>}
      </div>
    </div>
  );
}
