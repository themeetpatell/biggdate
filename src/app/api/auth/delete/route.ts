import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSession, clearSessionCookie } from "@/lib/auth";

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await adminClient.auth.admin.deleteUser(session.userId);
  if (error) {
    return NextResponse.json(
      { error: "Account deletion failed. Please contact support." },
      { status: 500 }
    );
  }
  await clearSessionCookie();

  return NextResponse.json({ success: true });
}
