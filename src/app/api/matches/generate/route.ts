import { NextResponse } from "next/server";
import { after } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { realUserMatchPrompt } from "@/lib/prompts";
import { log } from "@/lib/log";
import { requireAuth } from "@/lib/require-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  getProfileByUserId,
  saveMatchesForUser,
  getCachedMatches,
  setCachedMatches,
  getRealUserCandidates,
  markUserSeen,
  requirePlan,
  requirePlanAtomic,
  decrementUsage,
} from "@/lib/repo";
import { sendNotification } from "@/lib/notifications";
import { sendPushToUser } from "@/lib/push";
import { logAiCall } from "@/lib/ai-costs";
import { trackFirst, track } from "@/lib/analytics";
import type { Match } from "@/lib/types";

export const maxDuration = 60;

// Belt-and-suspenders against AI hallucinations: even if a matchedUserId
// matches the candidate set by string identity coincidence, reject anything
// that's not a real UUID before it hits a uuid-typed column.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const rl = await checkRateLimit("matches:generate", auth.userId, { limit: 10, windowSec: 86400 });
    if (!rl.allowed) return rateLimitResponse(rl);

    const today = new Date().toISOString().slice(0, 10);

    // Return cached matches if available for today — but re-slice to the
    // current plan's cap so a user who downgrades after caching doesn't keep
    // a premium-sized result for the rest of the day. requirePlan is
    // read-only so we don't double-burn the counter.
    const cached = await getCachedMatches(auth.userId, today);
    if (cached && cached.length > 0) {
      const planCheck = await requirePlan(auth.userId, "daily_matches");
      const cap = planCheck.limit === -1 ? cached.length : Math.min(cached.length, planCheck.limit);
      return NextResponse.json({ matches: cached.slice(0, cap) });
    }

    // Feature gate: daily matches (atomic check + increment).
    // If AI/parse fails downstream we refund this slot via decrementUsage.
    const gate = await requirePlanAtomic(auth.userId, "daily_matches");
    if (!gate.allowed) {
      return NextResponse.json({ error: "Daily match limit reached", gate }, { status: 403 });
    }

    const userProfile = await getProfileByUserId(auth.userId);

    if (!userProfile) {
      await decrementUsage(auth.userId, "daily_matches");
      return NextResponse.json(
        { error: "Complete your profile before generating matches" },
        { status: 400 }
      );
    }

    // Find real user candidates
    const candidates = await getRealUserCandidates(auth.userId, userProfile);

    if (candidates.length === 0) {
      // Diagnostic: emit the filter inputs so we can tell WHY the pool is empty
      // next time. Past failure mode was a silent case-mismatch on gender that
      // we only caught by hand-querying prod. Don't let it go silent again.
      log.warn("[matches/generate] empty candidate pool", {
        userId: auth.userId,
        gender: userProfile.gender ?? null,
        partnerGender: userProfile.partnerGender ?? null,
        partnerAgeMin: userProfile.partnerAgeMin ?? null,
        partnerAgeMax: userProfile.partnerAgeMax ?? null,
        city: userProfile.city ?? null,
      });
      await decrementUsage(auth.userId, "daily_matches");
      return NextResponse.json({ matches: [], poolEmpty: true });
    }

    let aiText: string;
    const aiStart = Date.now();
    try {
      const result = await generateText({
        model: getModel(),
        prompt: realUserMatchPrompt(userProfile, candidates),
      });
      aiText = result.text || "";
      await logAiCall({
        route: "matches/generate",
        userId: auth.userId,
        usage: result.usage,
        durationMs: Date.now() - aiStart,
      });
    } catch (err) {
      log.error("[matches/generate] AI call failed", err);
      await logAiCall({
        route: "matches/generate",
        userId: auth.userId,
        durationMs: Date.now() - aiStart,
        error: err instanceof Error ? err.message : "unknown",
      });
      await decrementUsage(auth.userId, "daily_matches");
      return NextResponse.json({ error: "AI unavailable, try again" }, { status: 503 });
    }

    // Strip markdown fences then find the outermost JSON object
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
      // Soft-fail: log the cause but return an empty list so the dashboard renders.
      // The user sees "no matches yet" instead of a hard error toast.
      const reason = err instanceof Error ? err.message : "parse error";
      log.error("[matches/generate] JSON parse failed", undefined, { reason, rawStart: raw.slice(0, 400) });
      await decrementUsage(auth.userId, "daily_matches");
      return NextResponse.json({ matches: [], parseError: true });
    }

    const rawMatches = Array.isArray(parsed)
      ? parsed
      : ((parsed as { matches?: unknown[] })?.matches ?? []);

    // Cap at limit (free=5, premium=20, pro=unlimited)
    const cap = gate.limit === -1 ? rawMatches.length : Math.min(rawMatches.length, gate.limit);
    const capped = rawMatches.slice(0, cap);

    // The AI sometimes hallucinates a matchedUserId that isn't a real candidate.
    // Drop any match whose matchedUserId isn't in the candidate set AND a real
    // UUID — this protects the uuid-typed seen_matches.matched_user_id and
    // matches.matched_user_id INSERTs downstream from an implicit-cast 500.
    const candidateIds = new Set(candidates.map((c) => c.userId));
    const validated = (capped as Record<string, unknown>[]).filter((m) => {
      const mid = m.matchedUserId;
      return typeof mid === "string" && candidateIds.has(mid) && UUID_RE.test(mid);
    });

    const withIds = validated.map(
      (m, i) => ({
        ...m,
        id: `match_${Date.now()}_${i}`,
      }),
    ) as Match[];

    // Record seen matches (usage already incremented atomically via
    // requirePlanAtomic). Non-critical write — a partial failure here must not
    // 500 the request, the user got their matches. Log rejections so we keep
    // visibility on bad rows.
    const seenResults = await Promise.allSettled(
      withIds
        .filter((m) => m.matchedUserId)
        .map((m) => markUserSeen(auth.userId, m.matchedUserId!)),
    );
    for (const r of seenResults) {
      if (r.status === "rejected") {
        log.warn("[matches/generate] markUserSeen failed", {
          userId: auth.userId,
          reason: r.reason instanceof Error ? r.reason.message : String(r.reason),
        });
      }
    }

    // Save to DB and cache for today. Cache write is best-effort — a cache
    // failure must not 500 a successful generation.
    await saveMatchesForUser(auth.userId, withIds);
    try {
      await setCachedMatches(auth.userId, today, withIds);
    } catch (cacheErr) {
      log.warn("[matches/generate] setCachedMatches failed", {
        userId: auth.userId,
        reason: cacheErr instanceof Error ? cacheErr.message : String(cacheErr),
      });
    }

    // Funnel events. match_generated fires per cohort-day cycle; first_
    // match_viewed gates the dashboard funnel — emitted only when there's
    // at least one real match to surface.
    if (withIds.length > 0) {
      await track({
        name: "match_generated",
        userId: auth.userId,
        properties: { count: withIds.length },
      });
      await trackFirst({
        name: "first_match_viewed",
        userId: auth.userId,
        properties: { count: withIds.length },
      });
    }

    // Fire match_ready email after the response — non-blocking, best-effort.
    // Only fires when there's at least one fresh match to surface.
    if (withIds.length > 0) {
      after(async () => {
        await sendNotification({ event: "match_ready", toUserId: auth.userId });
        await sendPushToUser(auth.userId, {
          title: "Your matches are waiting",
          body: "Maahi found people worth meeting today.",
          url: "/dashboard",
        });
      });
    }

    return NextResponse.json({ matches: withIds });
  } catch (err) {
    // Surface the underlying cause in logs so future 500s are diagnosable
    // instead of opaque. Keeps the existing 401/403/503/200-with-parseError
    // branches above untouched via early returns.
    log.error("[matches/generate] unhandled error", err);
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 });
  }
}
