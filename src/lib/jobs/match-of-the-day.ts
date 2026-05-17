import { sql } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
import { getCachedMatches } from "@/lib/repo";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";

interface SubscribedUserRow {
  user_id: string;
}

/**
 * For each user with at least one active push subscription, pick the top
 * cached match for today and send a single push. Idempotent via
 * notification_log unique index on (user_id, 'match_of_the_day', sent_day).
 */
export async function runMatchOfTheDay(): Promise<{
  candidates: number;
  pushed: number;
  noMatch: number;
  alreadySent: number;
  failed: number;
}> {
  const today = new Date().toISOString().slice(0, 10);

  const subscribers = (await sql`
    select distinct user_id::text as user_id
    from push_subscriptions
  `) as unknown as SubscribedUserRow[];

  let pushed = 0;
  let noMatch = 0;
  let alreadySent = 0;
  let failed = 0;

  for (const s of subscribers) {
    try {
      const already = await sql`
        select 1 from notification_log
        where user_id = ${s.user_id}::uuid
          and kind = 'match_of_the_day'
          and sent_day = (now() at time zone 'utc')::date
        limit 1
      `;
      if (already.length > 0) {
        alreadySent += 1;
        continue;
      }

      const matches = await getCachedMatches(s.user_id, today);
      if (!matches || matches.length === 0) {
        noMatch += 1;
        continue;
      }
      const top = matches[0];

      await sendPushToUser(s.user_id, {
        title: "Your match for today",
        body: `${top.name}, ${top.age} — ${top.city}`,
        url: `/matches/${top.id}`,
        tag: `motd-${today}`,
      });

      await sql`
        insert into notification_log (id, user_id, channel, kind, status)
        values (
          'nl_' || gen_random_uuid()::text,
          ${s.user_id}::uuid,
          'push',
          'match_of_the_day',
          'sent'
        )
        on conflict do nothing
      `;

      await track({
        name: "match_of_the_day_pushed",
        userId: s.user_id,
        properties: { matchId: top.id },
      });
      pushed += 1;
    } catch (err) {
      failed += 1;
      log.error("match of the day: push failed", err, { userId: s.user_id });
    }
  }

  return { candidates: subscribers.length, pushed, noMatch, alreadySent, failed };
}
