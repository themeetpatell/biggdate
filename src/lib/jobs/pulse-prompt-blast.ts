import { sql } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";
import { getTodayPulsePrompt } from "@/lib/repo";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";

interface SubscribedUserRow {
  user_id: string;
}

/**
 * Push today's active Pulse prompt to every user with a push subscription.
 * Idempotent via notification_log unique index on
 * (user_id, 'pulse_prompt', sent_day).
 */
export async function runPulsePromptBlast(): Promise<{
  candidates: number;
  pushed: number;
  alreadySent: number;
  noPrompt: boolean;
  failed: number;
}> {
  const prompt = await getTodayPulsePrompt();
  if (!prompt) {
    return { candidates: 0, pushed: 0, alreadySent: 0, noPrompt: true, failed: 0 };
  }

  const subscribers = (await sql`
    select distinct user_id::text as user_id
    from push_subscriptions
  `) as unknown as SubscribedUserRow[];

  const teaser = prompt.content.length > 90
    ? prompt.content.slice(0, 87).trimEnd() + "…"
    : prompt.content;

  let pushed = 0;
  let alreadySent = 0;
  let failed = 0;

  for (const s of subscribers) {
    try {
      const already = await sql`
        select 1 from notification_log
        where user_id = ${s.user_id}::uuid
          and kind = 'pulse_prompt'
          and sent_day = (now() at time zone 'utc')::date
        limit 1
      `;
      if (already.length > 0) {
        alreadySent += 1;
        continue;
      }

      await sendPushToUser(s.user_id, {
        title: "Today's Pulse",
        body: teaser,
        url: `/pulse?promptId=${encodeURIComponent(prompt.id)}`,
        tag: `pulse-${prompt.id}`,
      });

      await sql`
        insert into notification_log (id, user_id, channel, kind, status)
        values (
          'nl_' || gen_random_uuid()::text,
          ${s.user_id}::uuid,
          'push',
          'pulse_prompt',
          'sent'
        )
        on conflict do nothing
      `;

      await track({
        name: "pulse_prompt_pushed",
        userId: s.user_id,
        properties: { promptId: prompt.id },
      });
      pushed += 1;
    } catch (err) {
      failed += 1;
      log.error("pulse prompt blast: push failed", err, { userId: s.user_id });
    }
  }

  return { candidates: subscribers.length, pushed, alreadySent, noPrompt: false, failed };
}
