import { createSupabaseServerClient } from "./supabase";
import { normalizeCountryIso2 } from "./location-data";

export async function getSessionFromCookies(): Promise<{
  userId: string;
  email: string | null;
  phoneCountryIso2: string | null;
} | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    userId: user.id,
    email: user.email ?? null,
    phoneCountryIso2: normalizeCountryIso2(user.user_metadata?.phone_country_iso2) ?? null,
  };
}

export async function clearSessionCookie() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

