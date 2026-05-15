import { NextResponse } from "next/server";
import { sql, hasDatabaseConfig } from "@/lib/db";

export async function GET() {
  const checks: Record<string, "ok" | "fail" | "skip"> = {
    db: "skip",
    redis: "skip",
    stripe: "skip",
    supabase_auth: "skip",
    ai: "skip",
  };

  // Database (direct pg connection)
  if (hasDatabaseConfig()) {
    try {
      await sql`select 1 as ok`;
      checks.db = "ok";
    } catch {
      checks.db = "fail";
    }
  }

  // Redis (Upstash)
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/ping`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        signal: AbortSignal.timeout(3000),
      });
      checks.redis = res.ok ? "ok" : "fail";
    } catch {
      checks.redis = "fail";
    }
  }

  // Stripe (lightweight key validation via /v1/balance)
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    try {
      const res = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${stripeKey}` },
        signal: AbortSignal.timeout(5000),
      });
      // 200 = keys valid, 401 = key wrong (config error), anything else = Stripe outage
      checks.stripe = res.status === 200 || res.status === 401 ? (res.status === 200 ? "ok" : "fail") : "ok";
    } catch {
      checks.stripe = "fail";
    }
  }

  // Supabase Auth reachability — distinct from DB, since auth.users lives
  // behind GoTrue, not the pg connection we already probed.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && anonKey) {
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/health`, {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(3000),
      });
      checks.supabase_auth = res.ok ? "ok" : "fail";
    } catch {
      checks.supabase_auth = "fail";
    }
  }

  // AI provider reachability. We don't burn a generation — just confirm the
  // key is present and the host answers. Fail-quiet on outage so the deploy
  // gate stays green when only AI is degraded; degraded status is exposed
  // in the response body for ops to triage.
  const aiProvider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (aiProvider === "gemini" && process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
        { signal: AbortSignal.timeout(3000) },
      );
      checks.ai = res.ok ? "ok" : "fail";
    } catch {
      checks.ai = "fail";
    }
  } else if (aiProvider === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        signal: AbortSignal.timeout(3000),
      });
      checks.ai = res.ok ? "ok" : "fail";
    } catch {
      checks.ai = "fail";
    }
  }

  // Critical services for deploy-gate purposes: db, supabase_auth. AI/Stripe/
  // Redis failing is degraded-but-serving; DB or auth failing is hard down.
  const criticalDown = checks.db === "fail" || checks.supabase_auth === "fail";
  const anyDown = Object.values(checks).some((s) => s === "fail");
  const status = criticalDown ? "down" : anyDown ? "degraded" : "ok";

  return NextResponse.json(
    {
      status,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: criticalDown ? 503 : 200 },
  );
}
