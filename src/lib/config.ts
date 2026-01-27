export type AppConfig = {
  apiBaseUrl: string;
  apiOriginUrl?: string;
  portalUiUrl: string;
  cognitoUserPoolId?: string;
  cognitoClientId?: string;
  cognitoDomain?: string;
  cognitoRedirectUri?: string;
  adminBffBaseUrl?: string;
  disableAuth?: boolean;
  useMocks?: boolean;
};

type RawConfig = Partial<Record<string, string>>;

function readConfigValue(key: string, env: ImportMetaEnv, win?: Window): string | undefined {
  const fromWindow = (win as Window & { __KYC_CONFIG__?: RawConfig } | undefined)?.__KYC_CONFIG__?.[key];
  const fromVite = (env as Record<string, string | undefined>)[`VITE_${key}`];
  const fromEnv = (env as Record<string, string | undefined>)[key];
  return fromWindow ?? fromVite ?? fromEnv;
}

function parseBool(value?: string) {
  if (!value) return false;
  return value === "true" || value === "1" || value === "yes";
}

export function loadConfig(): AppConfig {
  const win = typeof window === "undefined" ? undefined : window;
  const env = import.meta.env;

  const apiBaseUrl = readConfigValue("API_BASE_URL", env, win) ?? "";
  const apiOriginUrl = readConfigValue("API_ORIGIN_URL", env, win);
  const portalUiUrl = readConfigValue("PORTAL_UI_URL", env, win) ?? win?.location.origin ?? "";
  const cognitoUserPoolId = readConfigValue("COGNITO_USER_POOL_ID", env, win);
  const cognitoClientId = readConfigValue("COGNITO_CLIENT_ID", env, win);
  const cognitoDomain = readConfigValue("COGNITO_DOMAIN", env, win);
  const cognitoRedirectUri = readConfigValue("COGNITO_REDIRECT_URI", env, win);
  const adminBffBaseUrl = readConfigValue("ADMIN_BFF_BASE_URL", env, win);
  const disableAuth = parseBool(readConfigValue("DISABLE_AUTH", env, win));
  const useMocks = parseBool(readConfigValue("USE_MOCKS", env, win));

  return {
    apiBaseUrl,
    apiOriginUrl,
    portalUiUrl,
    cognitoUserPoolId,
    cognitoClientId,
    cognitoDomain,
    cognitoRedirectUri,
    adminBffBaseUrl,
    disableAuth,
    useMocks,
  };
}
