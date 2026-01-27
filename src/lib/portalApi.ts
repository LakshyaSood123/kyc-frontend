import { loadConfig } from "./config";
import { apiFetch } from "./http";

export type PortalMeResponse = {
  identity: { id: string; email: string };
  tenant: {
    id: string;
    role: string;
    name: string;
    kyb_status: string;
    ops_status: string;
    risk_tier: string;
    plan: string;
  };
};

export type PortalStatsResponse = {
  stats: {
    jobs_today: number;
    jobs_total_30d: number;
    environment: string;
    history: Record<string, number>;
  };
};

function mockDelay<T>(value: T, ms = 200) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function useMocks() {
  return Boolean(loadConfig().useMocks);
}

export function getPortalMe(token: string) {
  if (useMocks()) {
    return mockDelay<PortalMeResponse>({
      identity: { id: "user_dev_123", email: "dev@example.com" },
      tenant: {
        id: "tn_dev_001",
        role: "OWNER",
        name: "Acme KYC Labs",
        kyb_status: "APPROVED",
        ops_status: "ACTIVE",
        risk_tier: "LOW",
        plan: "FREE_TIER",
      },
    });
  }
  return apiFetch<PortalMeResponse>("/portal/me", { method: "GET" }, token);
}

export function getPortalStats(token: string) {
  if (useMocks()) {
    return mockDelay<PortalStatsResponse>({
      stats: {
        jobs_today: 128,
        jobs_total_30d: 3245,
        environment: "SANDBOX",
        history: {
          "2026-01-20": 92,
          "2026-01-21": 101,
          "2026-01-22": 115,
          "2026-01-23": 121,
          "2026-01-24": 98,
          "2026-01-25": 133,
          "2026-01-26": 146,
        },
      },
    });
  }
  return apiFetch<PortalStatsResponse>("/portal/stats", { method: "GET" }, token);
}

export function getPortalBillingBalance(token: string) {
  if (useMocks()) {
    return mockDelay<{ balance: Record<string, unknown> }>({
      balance: {
        tenant_id: "tn_dev_001",
        current_balance: 842.5,
        billing_status: "GOOD_STANDING",
        currency: "USD",
      },
    });
  }
  return apiFetch<{ balance: Record<string, unknown> }>(
    "/portal/billing/balance",
    { method: "GET" },
    token
  );
}

export function getPortalBillingLedger(token: string) {
  if (useMocks()) {
    return mockDelay<{ transactions: Record<string, unknown>[] }>({
      transactions: [
        { kind: "TOP_UP", amount: 500, created_at: "2026-01-20T10:12:00Z" },
        { kind: "USAGE", amount: -87.5, created_at: "2026-01-22T14:05:00Z" },
        { kind: "USAGE", amount: -70, created_at: "2026-01-25T09:40:00Z" },
      ],
    });
  }
  return apiFetch<{ transactions: Record<string, unknown>[] }>(
    "/portal/billing/ledger",
    { method: "GET" },
    token
  );
}

export function getPortalApiKeys(token: string) {
  if (useMocks()) {
    return mockDelay<{ keys: Record<string, unknown>[] }>({
      keys: [
        { id: "key_dev_1", name: "Default Key", prefix: "key_dev_", status: "ACTIVE" },
        { id: "key_dev_2", name: "Sandbox Runner", prefix: "key_dev_", status: "ACTIVE" },
      ],
    });
  }
  return apiFetch<{ keys: Record<string, unknown>[] }>(
    "/portal/apikeys",
    { method: "GET" },
    token
  );
}

export function createPortalApiKey(token: string, name: string) {
  if (useMocks()) {
    return mockDelay<{ key: Record<string, unknown>; message: string }>({
      message: "API Key created. Save this secret, it will not be shown again.",
      key: {
        id: `key_mock_${name.toLowerCase().replace(/\s+/g, "_")}`,
        secret: "key_mock.secret_value_example",
        name,
        created_at: new Date().toISOString(),
      },
    });
  }
  return apiFetch<{ key: Record<string, unknown>; message: string }>(
    "/portal/apikeys",
    {
      method: "POST",
      body: JSON.stringify({ name }),
    },
    token
  );
}

export function deletePortalApiKey(token: string, keyId: string) {
  if (useMocks()) {
    return mockDelay<{ message: string }>({ message: `Key ${keyId} revoked successfully` });
  }
  return apiFetch<{ message: string }>(
    `/portal/apikeys/${encodeURIComponent(keyId)}`,
    { method: "DELETE" },
    token
  );
}

export function getPortalAuditLogs(token: string) {
  if (useMocks()) {
    return mockDelay<{ logs: Record<string, unknown>[] }>({
      logs: [
        {
          id: "aud_001",
          event: "api_key.created",
          actor: "dev@example.com",
          status: "SUCCESS",
          occurred_at: "2026-01-26T12:00:00Z",
        },
        {
          id: "aud_002",
          event: "webhook.tested",
          actor: "dev@example.com",
          status: "SUCCESS",
          occurred_at: "2026-01-26T12:15:00Z",
        },
      ],
    });
  }
  return apiFetch<{ logs: Record<string, unknown>[] }>(
    "/portal/audit-logs",
    { method: "GET" },
    token
  );
}

export function getPortalWebhookEndpoints(token: string) {
  if (useMocks()) {
    return mockDelay<{ endpoints: Record<string, unknown>[] }>({
      endpoints: [
        {
          endpoint_id: "WH_001",
          status: "ACTIVE",
          environment: "SANDBOX",
          event_types: ["kyc.job.completed", "kyc.job.failed"],
        },
      ],
    });
  }
  return apiFetch<{ endpoints: Record<string, unknown>[] }>(
    "/portal/webhooks/endpoints",
    { method: "GET" },
    token
  );
}

export function getPortalWebhookDeliveries(token: string) {
  if (useMocks()) {
    return mockDelay<{ items: Record<string, unknown>[] }>({
      items: [
        {
          delivery_id: "EVT_100#WH_001",
          status: "DELIVERED",
          endpoint_id: "WH_001",
          updated_at: "2026-01-26T13:00:00Z",
        },
        {
          delivery_id: "EVT_101#WH_001",
          status: "FAILED",
          endpoint_id: "WH_001",
          updated_at: "2026-01-26T13:05:00Z",
        },
      ],
    });
  }
  return apiFetch<{ items: Record<string, unknown>[] }>(
    "/portal/webhooks/deliveries",
    { method: "GET" },
    token
  );
}

export function createOnboarding(token: string, companyName: string) {
  if (useMocks()) {
    return mockDelay<{ message: string; tenant: Record<string, unknown> }>({
      message: "Tenant created successfully",
      tenant: {
        id: "tn_dev_001",
        name: companyName,
        plan: "FREE_TIER",
      },
    });
  }
  return apiFetch<{ message: string; tenant: Record<string, unknown> }>(
    "/portal/onboarding",
    { method: "POST", body: JSON.stringify({ company_name: companyName }) },
    token
  );
}

export function getKybUploadUrl(token: string, filename: string, contentType: string) {
  if (useMocks()) {
    return mockDelay<{ upload_url: string; key: string; expires_in: number }>({
      upload_url: "https://example.com/mock-upload",
      key: `kyb/mock/${filename}`,
      expires_in: 300,
    });
  }
  return apiFetch<{ upload_url: string; key: string; expires_in: number }>(
    "/portal/onboarding/upload-url",
    { method: "POST", body: JSON.stringify({ filename, content_type: contentType }) },
    token
  );
}
