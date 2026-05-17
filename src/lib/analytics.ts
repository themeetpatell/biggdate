/**
 * Funnel-event emitter. Writes to the `analytics_events` table directly so
 * we never lose events to an outage in an external analytics provider. A
 * PostHog/Mixpanel adapter can forward from this table in batch when we
 * wire that up.
 *
 * Usage:
 *
 *   import { track } from "@/lib/analytics";
 *   await track({ name: "signup", userId: user.id });
 *
 *   await track({
 *     name: "first_soul_knock_sent",
 *     userId,
 *     properties: { matchId, route: "/intros/request" },
 *   });
 *
 * Fire-and-forget by design: log failures never block the user flow. If
 * the write fails we log via Sentry and move on.
 */

import { randomUUID } from "node:crypto";
import { sql, hasDatabaseConfig } from "@/lib/db";
import { log } from "@/lib/log";

export type AnalyticsEventName =
  | "signup"
  | "onboarding_phase1_complete"
  | "onboarding_phase2_complete"
  | "first_match_viewed"
  | "first_soul_knock_sent"
  | "first_thread_unlocked"
  | "first_paid"
  // Open-ended action events. Adding a new event name doesn't need a schema
  // change — properties carries the context. Add to this union as you add
  // emit sites so we have a discoverable list.
  | "soul_knock_sent"
  | "soul_knock_scored"
  | "thread_unlocked"
  | "maahi_session_started"
  | "life_preview_generated"
  | "match_generated"
  | "addon_redeemed"
  | "checkout_started"
  | "checkout_completed"
  // Growth orchestration (cron-driven daily notifications + admin tooling)
  | "pulse_prompt_pushed"
  | "match_of_the_day_pushed"
  | "admin_reactivation_targeted"
  | "admin_reactivation_delivered";

export type AnalyticsClient = "web" | "ios" | "android" | "server";

export interface TrackInput {
  name: AnalyticsEventName;
  userId?: string | null;
  sessionId?: string | null;
  properties?: Record<string, unknown>;
  client?: AnalyticsClient;
}

export async function track(input: TrackInput): Promise<void> {
  // Skip silently in environments without a database (local dev without
  // SUPABASE_DB_URL configured). Events are non-critical.
  if (!hasDatabaseConfig()) return;

  const id = `ev_${randomUUID()}`;
  const properties = input.properties ? JSON.stringify(input.properties) : "{}";

  try {
    await sql`
      INSERT INTO analytics_events (id, user_id, event_name, properties, session_id, client)
      VALUES (
        ${id},
        ${input.userId ?? null},
        ${input.name},
        ${properties}::jsonb,
        ${input.sessionId ?? null},
        ${input.client ?? "server"}
      )
    `;
  } catch (err) {
    // Never block the request on analytics failure. Log to Sentry so we
    // notice but the user-facing path completes.
    log.error("analytics: failed to insert event", err, {
      eventName: input.name,
      userId: input.userId ?? null,
    });
  }
}

/**
 * Emit an event only once per user. Used for "first_*" funnel milestones.
 * Cheap implementation: query analytics_events for an existing row before
 * insert. At our scale the table is small enough that the index hit is
 * effectively free; revisit when row count crosses ~10M.
 */
export async function trackFirst(input: TrackInput): Promise<void> {
  if (!hasDatabaseConfig()) return;
  if (!input.userId) {
    await track(input);
    return;
  }

  try {
    const rows = await sql`
      SELECT 1 FROM analytics_events
      WHERE user_id = ${input.userId}
        AND event_name = ${input.name}
      LIMIT 1
    `;
    if (rows.length === 0) {
      await track(input);
    }
  } catch (err) {
    log.error("analytics: trackFirst lookup failed", err, {
      eventName: input.name,
      userId: input.userId,
    });
  }
}
