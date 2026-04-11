import { createSupabaseServerClient } from "./supabase";

export async function getSessionFromCookies(): Promise<{ userId: string } | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { userId: user.id };
}

export async function clearSessionCookie() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

