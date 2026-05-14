import { NextResponse } from "next/server";
import { sql, hasDatabaseConfig } from "@/lib/db";

export async function GET() {
  const checks: Record<string, "ok" | "fail" | "skip"> = {
    db: "skip",
    redis: "skip",
    stripe: "skip",
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

  const allOk = Object.values(checks).every((s) => s !== "fail");

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  );
}
