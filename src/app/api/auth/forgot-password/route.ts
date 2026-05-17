import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // 3 reset emails per IP per 10 minutes — generous enough for a real user who
  // mistyped, tight enough to block reset-flood abuse.
  const rl = await checkRateLimit("auth:forgot", clientIp(req), {
    limit: 3,
    windowSec: 600,
  });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Canonical site URL wins so the redirect always matches what's allow-listed
  // in Supabase. Falling back to the request Origin (or localhost in dev) only
  // when the env var is missing keeps local development working.
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3000";
  const supabase = await createSupabaseServerClient();

  // Always return 200 to avoid email enumeration
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent("/auth?mode=reset")}`,
  });

  return NextResponse.json({
    message: "If an account exists with that email, you will receive a reset link.",
  });
}
