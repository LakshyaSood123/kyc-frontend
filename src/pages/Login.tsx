import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalAuth } from "../lib/portalAuth";

export default function Login() {
  const { isAuthenticated, login, authDisabled } = usePortalAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="cw-page">
      <div className="cw-card cw-card-tone-neutral">
        <h1 className="cw-title">Sign in</h1>
        <p className="cw-muted">
          Use Cognito Hosted UI with Authorization Code + PKCE to obtain an ID token.
        </p>
        {authDisabled && (
          <div className="cw-alert">Auth bypass enabled (local only). No login required.</div>
        )}
        {error && <div className="cw-alert">{error}</div>}
        <button
          className="cw-btn cw-btn-active"
          type="button"
          onClick={() => {
            setError(null);
            login().catch((err) => setError(err.message));
          }}
        >
          {authDisabled ? "Continue to Portal" : "Continue with Cognito"}
        </button>
      </div>
    </div>
  );
}
