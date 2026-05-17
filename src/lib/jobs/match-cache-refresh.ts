import { generateText } from "ai";
import { sql } from "@/lib/db";
import { getModel } from "@/lib/ai";
import { realUserMatchPrompt } from "@/lib/prompts";
import {
  getProfileByUserId,
  getRealUserCandidates,
  saveMatchesForUser,
  setCachedMatches,
  markUserSeen,
} from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";
import { log } from "@/lib/log";
import type { Match } from "@/lib/types";

// Cron-only cap. Match-of-the-Day only needs the top one, but we keep 5
// so a user who opens the app after the push still sees a useful list.
const CRON_MATCH_CAP = 5;

interface SubscribedUserRow {
  user_id: string;
}

interface CachedRow {
  user_id: string;
}

/**
 * For every push-subscribed user that does not yet have a match_cache row
 * for today, generate one. System action — bypasses the per-user plan gate
 * so the user's own daily allowance is preserved for their explicit
 * generations.
 *
 * NOTE: duplicates the AI/parse/cache steps in
 * src/app/api/matches/generate/route.ts. The user-facing route adds plan
 * gating, analytics, and notifications that don't apply here. Consolidate
 * into a shared core when either path needs to change.
 */
export async function runMatchCacheRefresh(): Promise<{
  candidates: number;
  alreadyCached: number;
  generated: number;
  poolEmpty: number;
  failed: number;
}> {
  const today = new Date().toISOString().slice(0, 10);

  const subscribers = (await sql`
    select distinct user_id::text as user_id
    from push_subscriptions
  `) as unknown as SubscribedUserRow[];

  if (subscribers.length === 0) {
    return { candidates: 0, alreadyCached: 0, generated: 0, poolEmpty: 0, failed: 0 };
  }

  const subscriberIds = subscribers.map((s) => s.user_id);
  const cachedRows = (await sql`
    select user_id::text as user_id
    from match_cache
    where cache_date = ${today}
      and user_id::text = any(${subscriberIds}::text[])
  `) as unknown as CachedRow[];
  const cachedSet = new Set(cachedRows.map((r) => r.user_id));

  let alreadyCached = 0;
  let generated = 0;
  let poolEmpty = 0;
  let failed = 0;

  for (const s of subscribers) {
    if (cachedSet.has(s.user_id)) {
      alreadyCached += 1;
      continue;
    }
    try {
      const result = await generateForUser(s.user_id, today);
      if (result === "generated") generated += 1;
      else if (result === "pool_empty") poolEmpty += 1;
      // "skipped" = no profile yet (pre-onboarding user with push sub). Not an error.
    } catch (err) {
      failed += 1;
      log.error("match cache refresh: generation failed", err, {
        userId: s.user_id,
      });
    }
  }

  return {
    candidates: subscribers.length,
    alreadyCached,
    generated,
    poolEmpty,
    failed,
  };
}

type StepResult = "generated" | "pool_empty" | "skipped";

async function generateForUser(userId: string, today: string): Promise<StepResult> {
  const userProfile = await getProfileByUserId(userId);
  if (!userProfile) return "skipped";

  const candidates = await getRealUserCandidates(userId, userProfile);
  if (candidates.length === 0) return "pool_empty";

  let aiText: string;
  const aiStart = Date.now();
  try {
    const result = await generateText({
      model: getModel(),
      prompt: realUserMatchPrompt(userProfile, candidates),
    });
    aiText = result.text || "";
    await logAiCall({
      route: "cron/match-cache-refresh",
      userId,
      usage: result.usage,
      durationMs: Date.now() - aiStart,
    });
  } catch (err) {
    await logAiCall({
      route: "cron/match-cache-refresh",
      userId,
      durationMs: Date.now() - aiStart,
      error: err instanceof Error ? err.message : "unknown",
    });
    throw err;
  }

  const stripped = aiText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  const jsonStart = stripped.indexOf("{");
  const jsonEnd = stripped.lastIndexOf("}");
  const raw = jsonStart >= 0 && jsonEnd > jsonStart
    ? stripped.slice(jsonStart, jsonEnd + 1)
    : stripped;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    log.error("match cache refresh: JSON parse failed", err, {
      userId,
      rawStart: raw.slice(0, 200),
    });
    return "pool_empty";
  }

  const rawMatches = Array.isArray(parsed)
    ? parsed
    : ((parsed as { matches?: unknown[] })?.matches ?? []);

  const capped = (rawMatches as Record<string, unknown>[]).slice(0, CRON_MATCH_CAP);

  const candidateIds = new Set(candidates.map((c) => c.userId));
  const validated = capped.filter((m) => {
    const mid = m.matchedUserId;
    return typeof mid === "string" && candidateIds.has(mid);
  });

  if (validated.length === 0) return "pool_empty";

  const withIds = validated.map(
    (m, i) => ({
      ...m,
      id: `cron_match_${Date.now()}_${i}`,
    }),
  ) as Match[];

  await Promise.all(
    withIds
      .filter((m) => m.matchedUserId)
      .map((m) => markUserSeen(userId, m.matchedUserId!)),
  );

  await saveMatchesForUser(userId, withIds);
  await setCachedMatches(userId, today, withIds);

  return "generated";
}
