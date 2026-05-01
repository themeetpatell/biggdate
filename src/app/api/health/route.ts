import { NextResponse } from "next/server";
import { sql, hasDatabaseConfig } from "@/lib/db";

/**
 * Health check for uptime monitoring (Vercel, status page, load balancers).
 *
 * Returns 200 with subsystem status. Returns 503 if any required subsystem
 * is unreachable. The DB check is a 1ms `select 1` — does not load the
 * connection pool meaningfully.
 */
export async function GET() {
  const checks: Record<string, "ok" | "fail" | "skip"> = {
    db: "skip",
  };

  if (hasDatabaseConfig()) {
    try {
      await sql`select 1 as ok`;
      checks.db = "ok";
    } catch {
      checks.db = "fail";
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
