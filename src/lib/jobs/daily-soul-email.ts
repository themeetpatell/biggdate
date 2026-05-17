import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { getCachedMatches } from "@/lib/repo";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";
import {
  renderDailySoulEmail,
  type DailyEmailDay,
  type DailyEmailContext,
} from "@/lib/email-daily";

// Lazy Resend init — surface a clear skip in dev when keys aren't set, rather
// than crashing the whole orchestrator.
function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM || "Maahi from BiggDate <maahi@biggdate.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://biggdate.app";

interface RecipientRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  daily_email_pref: string | null; // null when key absent from prefs JSON
}

interface PendingCountRow {
  pending: string;
}

interface DailyEmailStats {
  candidates: number;
  sent: number;
  alreadySent: number;
  optedOut: number;
  noEmail: number;
  failed: number;
  skippedNoKey: boolean;
}

// Stateless unsubscribe URL. We sign userId+kind so the receiver can't craft
// a token for a different user. Verification recomputes the HMAC on the
// unsubscribe route.
function unsubscribeUrlFor(userId: string): string {
  const secret =
    process.env.EMAIL_UNSUBSCRIBE_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.CRON_SECRET ||
    "";
  if (!secret) {
    // Without a signing secret, fall back to a settings deep-link so the
    // user can still opt out manually. Never crash the send.
    return `${APP_URL}/settings`;
  }
  const sig = createHmac("sha256", secret)
    .update(`${userId}:daily_soul_email`)
    .digest("base64url");
  const params = new URLSearchParams({ u: userId, k: "daily_soul_email", s: sig });
  return `${APP_URL}/api/email/unsubscribe?${params.toString()}`;
}

/**
 * Daily Soul Knock email blast. One short note per user, in Maahi's voice,
 * varied by day of week. Idempotent via notification_log unique index on
 * (user_id, 'daily_soul_email', sent_day). Safe to re-run on the same UTC
 * day — duplicates short-circuit at the DB level.
 */
export async function runDailySoulEmail(): Promise<DailyEmailStats> {
  const client = resendClient();
  const stats: DailyEmailStats = {
    candidates: 0,
    sent: 0,
    alreadySent: 0,
    optedOut: 0,
    noEmail: 0,
    failed: 0,
    skippedNoKey: !client,
  };

  if (!client) {
    log.warn("daily soul email: RESEND_API_KEY not set, skipping");
    return stats;
  }

  const today = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
  const dayOfWeek = new Date().getUTCDay() as DailyEmailDay;

  const rows = (await sql`
    SELECT
      ah.user_id::text                                       AS user_id,
      ah.email                                               AS email,
      ah.full_name                                           AS full_name,
      p.notification_preferences->>'dailyEmail'              AS daily_email_pref
    FROM account_handles ah
    JOIN profiles p ON p.user_id = ah.user_id
    WHERE ah.email IS NOT NULL
      AND ah.email <> ''
  `) as unknown as RecipientRow[];

  stats.candidates = rows.length;

  for (const r of rows) {
    try {
      if (!r.email) {
        stats.noEmail += 1;
        continue;
      }
      if (r.daily_email_pref === "false") {
        stats.optedOut += 1;
        continue;
      }

      const already = await sql`
        SELECT 1 FROM notification_log
        WHERE user_id = ${r.user_id}::uuid
          AND kind = 'daily_soul_email'
          AND sent_day = (now() at time zone 'utc')::date
        LIMIT 1
      `;
      if (already.length > 0) {
        stats.alreadySent += 1;
        continue;
      }

      const firstName = (r.full_name?.split(" ")[0] || "there").trim() || "there";

      const pendingRows = (await sql`
        SELECT COUNT(*)::text AS pending
        FROM intros i
        WHERE i.matched_user_id = ${r.user_id}::uuid
          AND NOT EXISTS (
            SELECT 1 FROM soul_knock_responses skr
            WHERE skr.intro_id = i.id
              AND skr.user_id = ${r.user_id}::uuid
          )
      `) as unknown as PendingCountRow[];
      const pendingIntros = Math.max(0, parseInt(pendingRows[0]?.pending ?? "0", 10) || 0);

      const matches = await getCachedMatches(r.user_id, today);
      const top = matches && matches.length > 0 ? matches[0] : null;

      const ctx: DailyEmailContext = {
        firstName,
        pendingIntros,
        topMatchName: top?.name ?? null,
        topMatchId: top?.id ?? null,
        appUrl: APP_URL,
        unsubscribeUrl: unsubscribeUrlFor(r.user_id),
        dayOfWeek,
      };

      const rendered = renderDailySoulEmail(ctx);

      const sendResult = await client.emails.send({
        from: FROM,
        to: r.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });

      // Resend SDK returns { data, error }. Treat any error as a failed send
      // and skip the success-log row so the next cron pass can retry.
      if (sendResult.error) {
        stats.failed += 1;
        log.error("daily soul email: resend error", sendResult.error as unknown, {
          userId: r.user_id,
          variant: rendered.variant,
        });
        await logSend({
          userId: r.user_id,
          status: "failed",
          error: String((sendResult.error as { message?: string })?.message ?? sendResult.error),
        }).catch(() => undefined);
        continue;
      }

      await logSend({ userId: r.user_id, status: "sent" });
      await track({
        name: "daily_soul_email_sent",
        userId: r.user_id,
        properties: {
          variant: rendered.variant,
          dayOfWeek,
          pendingIntros,
          hasTopMatch: top !== null,
        },
      });
      stats.sent += 1;
    } catch (err) {
      stats.failed += 1;
      log.error("daily soul email: send failed", err, { userId: r.user_id });
      await logSend({
        userId: r.user_id,
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      }).catch(() => undefined);
    }
  }

  return stats;
}

async function logSend(params: {
  userId: string;
  status: "sent" | "failed";
  error?: string;
}) {
  await sql`
    INSERT INTO notification_log (id, user_id, channel, kind, status, error)
    VALUES (
      'nl_' || gen_random_uuid()::text,
      ${params.userId}::uuid,
      'email',
      'daily_soul_email',
      ${params.status},
      ${params.error ?? null}
    )
    ON CONFLICT DO NOTHING
  `;
}
