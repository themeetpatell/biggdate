import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

interface FeedRow {
  id: string;
  user_id: string | null;
  event_name: string;
  occurred_at: string;
  name: string | null;
  city: string | null;
}

export async function GET() {
  const auth = await requireAdmin("dashboard:feed");
  if (auth.error) return auth.error;

  const rows = await sql`
    select
      e.id,
      e.user_id::text as user_id,
      e.event_name,
      e.occurred_at::text as occurred_at,
      p.name,
      p.city
    from analytics_events e
    left join profiles p on p.user_id = e.user_id
    where e.occurred_at >= now() - interval '24 hours'
    order by e.occurred_at desc
    limit 60
  `;

  return NextResponse.json({ events: rows as unknown as FeedRow[] });
}
