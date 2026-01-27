import { loadConfig } from "./config";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const cfg = loadConfig();
  if (!cfg.apiBaseUrl) {
    throw new Error("API_BASE_URL is not configured.");
  }

  const url = new URL(path, cfg.apiBaseUrl);
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url.toString(), { ...options, headers });
  const payload = await parseJson(res);

  if (!res.ok) {
    const msg = typeof payload === "string" ? payload : (payload as { error?: string })?.error;
    throw new ApiError(msg || "Request failed", res.status, payload);
  }

  return payload as T;
}
