import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import { sql } from "@/lib/db";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(100),
  reason: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const auth = await requireAdmin("dashboard:ping-reactivation");
  if (auth.error) return auth.error;

  let parsed;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid payload" },
      { status: 400 },
    );
  }

  const reason = parsed.reason ?? "manual-admin";
  const adminId = auth.userId;

  // Fan-out: one analytics_events row per targeted user. A downstream
  // push/email worker picks these up — keeps this endpoint a no-PII writer
  // so RLS stays simple and replays are safe.
  const inserted = await sql`
    insert into analytics_events (id, user_id, event_name, properties, client, occurred_at)
    select
      'rxn_' || gen_random_uuid()::text,
      uid::uuid,
      'admin_reactivation_targeted',
      jsonb_build_object('admin_id', ${adminId}::text, 'reason', ${reason}::text),
      'server',
      now()
    from unnest(${parsed.userIds}::text[]) as uid
    returning id
  `;

  log.info("admin reactivation ping", {
    adminId,
    count: inserted.length,
    reason,
  });

  return NextResponse.json({ count: inserted.length });
}
