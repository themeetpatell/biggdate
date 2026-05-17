/**
 * Shared client configuration. The web app and the native app each supply
 * their own API base URL (web: same-origin; native: `EXPO_PUBLIC_API_URL`).
 */

export const LOCAL_API_BASE_URL = "http://localhost:3000";

/**
 * Resolve the API base URL, trimming a trailing slash so callers can always
 * compose paths as `${baseUrl}/api/...`. Falls back to localhost for dev.
 */
export function resolveApiBaseUrl(explicit?: string | null): string {
  const value = explicit?.trim();
  const base = value && value.length > 0 ? value : LOCAL_API_BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}
