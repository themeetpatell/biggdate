import { sql } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";

const LOOKBACK_HOURS = 48;
const COPY = {
  title: "Someone's waiting on you",
  body: "Your matches got better since you were last in. Take a look.",
  url: "/matches",
};

interface PendingPing {
  event_id: string;
  user_id: string;
}

interface PushSubRow {
  count: string;
}

/**
 * Consume admin_reactivation_targeted events from the last 48h that have not
 * yet been delivered (no notification_log row with matching source_event_id),
 * and push them. Idempotent: a re-run is a no-op because the unique index on
 * source_event_id rejects duplicates.
 */
export async function runReactivationWorker(): Promise<{
  attempted: number;
  delivered: number;
  skippedNoSub: number;
  failed: number;
}> {
  const pending = (await sql`
    select e.id::text as event_id, e.user_id::text as user_id
    from analytics_events e
    left join notification_log nl on nl.source_event_id = e.id
    where e.event_name = 'admin_reactivation_targeted'
      and e.user_id is not null
      and e.occurred_at >= now() - (${LOOKBACK_HOURS}::text || ' hours')::interval
      and nl.id is null
    order by e.occurred_at asc
    limit 500
  `) as unknown as PendingPing[];

  let delivered = 0;
  let skippedNoSub = 0;
  let failed = 0;

  for (const p of pending) {
    try {
      const subRows = (await sql`
        select count(*)::text as count from push_subscriptions where user_id = ${p.user_id}::uuid
      `) as unknown as PushSubRow[];
      const hasSub = parseInt(subRows[0]?.count ?? "0", 10) > 0;

      if (!hasSub) {
        await logSend({
          userId: p.user_id,
          sourceEventId: p.event_id,
          status: "no_subscription",
        });
        skippedNoSub += 1;
        continue;
      }

      await sendPushToUser(p.user_id, {
        title: COPY.title,
        body: COPY.body,
        url: COPY.url,
        tag: `reactivation-${p.event_id}`,
      });

      await logSend({
        userId: p.user_id,
        sourceEventId: p.event_id,
        status: "sent",
      });
      await track({
        name: "admin_reactivation_delivered",
        userId: p.user_id,
        properties: { sourceEventId: p.event_id },
      });
      delivered += 1;
    } catch (err) {
      failed += 1;
      log.error("reactivation worker: delivery failed", err, {
        userId: p.user_id,
        eventId: p.event_id,
      });
      await logSend({
        userId: p.user_id,
        sourceEventId: p.event_id,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      }).catch(() => undefined);
    }
  }

  return { attempted: pending.length, delivered, skippedNoSub, failed };
}

async function logSend(params: {
  userId: string;
  sourceEventId: string;
  status: "sent" | "failed" | "no_subscription";
  error?: string;
}) {
  await sql`
    insert into notification_log (id, user_id, channel, kind, source_event_id, status, error)
    values (
      'nl_' || gen_random_uuid()::text,
      ${params.userId}::uuid,
      'push',
      'reactivation',
      ${params.sourceEventId},
      ${params.status},
      ${params.error ?? null}
    )
    on conflict (source_event_id) where source_event_id is not null do nothing
  `;
}
