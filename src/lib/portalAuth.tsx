import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createCodeChallenge, generateCodeVerifier } from "./pkce";
import { loadConfig } from "./config";

type Tokens = {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

type PortalAuthContextValue = {
  tokens: Tokens;
  isAuthenticated: boolean;
  authDisabled: boolean;
  login: () => Promise<void>;
  exchangeCode: (code: string, state?: string | null) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "kyc.portal.tokens";
const VERIFIER_KEY = "kyc.portal.pkce_verifier";
const STATE_KEY = "kyc.portal.oauth_state";

const PortalAuthContext = createContext<PortalAuthContextValue | undefined>(undefined);

function readTokens(): Tokens {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return {};
  }
}

function writeTokens(tokens: Tokens) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

function clearTokens() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Tokens>(() => readTokens());
  const authDisabled = Boolean(loadConfig().disableAuth);

  const login = async () => {
    if (authDisabled) return;
    const cfg = loadConfig();
    if (!cfg.cognitoDomain || !cfg.cognitoClientId) {
      throw new Error("Missing Cognito configuration.");
    }

    const verifier = generateCodeVerifier();
    const challenge = await createCodeChallenge(verifier);
    const state = generateCodeVerifier();

    sessionStorage.setItem(VERIFIER_KEY, verifier);
    sessionStorage.setItem(STATE_KEY, state);

    const redirectUri =
      cfg.cognitoRedirectUri ?? `${cfg.portalUiUrl.replace(/\/$/, "")}/login/callback`;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: cfg.cognitoClientId,
      redirect_uri: redirectUri,
      scope: "openid email profile",
      code_challenge_method: "S256",
      code_challenge: challenge,
      state,
    });

    window.location.assign(`${cfg.cognitoDomain}/oauth2/authorize?${params.toString()}`);
  };

  const exchangeCode = async (code: string, state?: string | null) => {
    if (authDisabled) return;
    const cfg = loadConfig();
    if (!cfg.cognitoDomain || !cfg.cognitoClientId) {
      throw new Error("Missing Cognito configuration.");
    }

    const storedState = sessionStorage.getItem(STATE_KEY);
    if (state && storedState && state !== storedState) {
      throw new Error("OAuth state mismatch.");
    }

    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (!verifier) {
      throw new Error("Missing PKCE verifier.");
    }

    const redirectUri =
      cfg.cognitoRedirectUri ?? `${cfg.portalUiUrl.replace(/\/$/, "")}/login/callback`;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: cfg.cognitoClientId,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    });

    const res = await fetch(`${cfg.cognitoDomain}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload.error_description || "Failed to exchange code.");
    }

    const nextTokens: Tokens = {
      idToken: payload.id_token,
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresIn: payload.expires_in,
    };

    writeTokens(nextTokens);
    setTokens(nextTokens);
    sessionStorage.removeItem(VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);
  };

  const logout = () => {
    clearTokens();
    setTokens({});
  };

  const value = useMemo<PortalAuthContextValue>(
    () => ({
      tokens,
      isAuthenticated: authDisabled || Boolean(tokens.idToken),
      authDisabled,
      login,
      exchangeCode,
      logout,
    }),
    [tokens, authDisabled]
  );

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) {
    throw new Error("usePortalAuth must be used within PortalAuthProvider.");
  }
  return ctx;
}
