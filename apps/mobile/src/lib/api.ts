import { createApiClient, resolveApiBaseUrl } from "@biggdate/shared";

import { env } from "./env";
import { supabase } from "./supabase";

/**
 * Backend API client for the native app. Every request carries the current
 * Supabase access token as a Bearer header; the backend's dual-mode auth
 * (`getSession`) accepts it in place of the web session cookie.
 */
export const api = createApiClient({
  baseUrl: resolveApiBaseUrl(env.apiUrl),
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
