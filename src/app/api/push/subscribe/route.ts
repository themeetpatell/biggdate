import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await req.json();
  const { endpoint, keys } = body ?? {};

  if (
    typeof endpoint !== "string" ||
    !endpoint.startsWith("https://") ||
    typeof keys !== "object" ||
    keys === null ||
    typeof keys.p256dh !== "string" ||
    typeof keys.auth !== "string"
  ) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await sql`
    INSERT INTO push_subscriptions (user_id, endpoint, keys)
    VALUES (${auth.userId}, ${endpoint}, ${JSON.stringify(keys)})
    ON CONFLICT (user_id, endpoint) DO UPDATE SET keys = EXCLUDED.keys
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { endpoint } = await req.json();
  if (typeof endpoint !== "string") {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  await sql`
    DELETE FROM push_subscriptions
    WHERE user_id = ${auth.userId} AND endpoint = ${endpoint}
  `;

  return NextResponse.json({ ok: true });
}
