/**
 * Transport-agnostic API client for the BiggDate backend.
 *
 * The same `/api/*` route handlers serve both the web app (cookie session)
 * and native clients (Bearer token). Native callers pass a `getAccessToken`
 * resolver; the client attaches `Authorization: Bearer <token>` per request.
 */

export interface ApiClientOptions {
  /** Base URL without trailing slash, e.g. `https://biggdate.com`. */
  baseUrl: string;
  /** Resolves the current Supabase access token, or null when signed out. */
  getAccessToken: () => Promise<string | null> | string | null;
}

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

type BodylessOptions = Omit<ApiRequestOptions, "method" | "body">;

/** Thrown when the backend returns a non-2xx response. */
export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, getAccessToken } = options;

  async function request<T>(path: string, init: ApiRequestOptions = {}): Promise<T> {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...init.headers,
    };
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method: init.method ?? (init.body !== undefined ? "POST" : "GET"),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: init.signal,
    });

    const text = await response.text();
    const payload = text.length > 0 ? safeJsonParse(text) : null;

    if (!response.ok) {
      const message =
        (isRecord(payload) && typeof payload.error === "string" && payload.error) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(response.status, message, payload);
    }

    return payload as T;
  }

  return {
    request,
    get: <T>(path: string, init?: BodylessOptions): Promise<T> =>
      request<T>(path, { ...init, method: "GET" }),
    post: <T>(path: string, body?: unknown, init?: BodylessOptions): Promise<T> =>
      request<T>(path, { ...init, method: "POST", body }),
    patch: <T>(path: string, body?: unknown, init?: BodylessOptions): Promise<T> =>
      request<T>(path, { ...init, method: "PATCH", body }),
    del: <T>(path: string, init?: BodylessOptions): Promise<T> =>
      request<T>(path, { ...init, method: "DELETE" }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
