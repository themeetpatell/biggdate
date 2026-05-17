import { createClient, type User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "./supabase";
import { normalizeCountryIso2 } from "./location-data";

export interface Session {
  userId: string;
  email: string | null;
  phoneCountryIso2: string | null;
}

function toSession(user: User): Session {
  const phoneCountry = user.user_metadata?.phone_country_iso2;
  return {
    userId: user.id,
    email: user.email ?? null,
    phoneCountryIso2:
      normalizeCountryIso2(typeof phoneCountry === "string" ? phoneCountry : null) ?? null,
  };
}

function requireSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable",
    );
  }
  return { url, anonKey };
}

/**
 * Resolve the session from the web session cookie (`@supabase/ssr`).
 * Used by Server Components and the web client.
 */
export async function getSessionFromCookies(): Promise<Session | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return toSession(user);
}

/**
 * Resolve the session from a Supabase access token (native/mobile clients).
 * The token is validated server-side against Supabase Auth.
 */
async function getSessionFromBearerToken(token: string): Promise<Session | null> {
  const { url, anonKey } = requireSupabaseEnv();
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return toSession(user);
}

/**
 * Resolve the current session from either a Bearer token (native/mobile
 * clients) or the session cookie (web). A valid `Authorization: Bearer`
 * header takes precedence; otherwise the request falls back to the cookie.
 *
 * Safe to call from both Route Handlers and Server Components.
 */
export async function getSession(): Promise<Session | null> {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) return getSessionFromBearerToken(token);
  }
  return getSessionFromCookies();
}

export async function clearSessionCookie() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
