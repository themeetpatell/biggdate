import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const ALLOWED_DAYS = new Set([1, 3, 7, 14, 30]);

interface InactiveRow {
  user_id: string;
  name: string | null;
  city: string | null;
  age: number | null;
  last_active_at: string | null;
  days_inactive: number;
}

export async function GET(req: Request) {
  const auth = await requireAdmin("dashboard:inactive");
  if (auth.error) return auth.error;

  const url = new URL(req.url);
  const daysParam = parseInt(url.searchParams.get("days") ?? "3", 10);
  const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 3;

  const rows = await sql`
    with last_active as (
      select user_id, max(occurred_at) as last_active_at
      from analytics_events
      where user_id is not null
      group by user_id
    )
    select
      p.user_id::text as user_id,
      p.name,
      p.city,
      p.age,
      la.last_active_at::text as last_active_at,
      coalesce(
        extract(day from now() - la.last_active_at)::int,
        extract(day from now() - p.created_at)::int
      ) as days_inactive
    from profiles p
    left join last_active la on la.user_id = p.user_id
    where (la.last_active_at is null and p.created_at < now() - (${days}::text || ' days')::interval)
       or la.last_active_at < now() - (${days}::text || ' days')::interval
    order by days_inactive desc, p.created_at desc
    limit 100
  `;

  return NextResponse.json({ users: rows as unknown as InactiveRow[] });
}
