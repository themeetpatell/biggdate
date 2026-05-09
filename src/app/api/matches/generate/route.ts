import { NextResponse } from "next/server";
import { after } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { realUserMatchPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import {
  getProfileByUserId,
  saveMatchesForUser,
  getCachedMatches,
  setCachedMatches,
  getRealUserCandidates,
  markUserSeen,
  requirePlanAtomic,
} from "@/lib/repo";
import { sendNotification } from "@/lib/notifications";
import { sendPushToUser } from "@/lib/push";
import type { Match } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const today = new Date().toISOString().slice(0, 10);

    // Return cached matches if available for today
    const cached = await getCachedMatches(auth.userId, today);
    if (cached && cached.length > 0) return NextResponse.json({ matches: cached });

    // Feature gate: daily matches (atomic check + increment)
    const gate = await requirePlanAtomic(auth.userId, "daily_matches");
    if (!gate.allowed) {
      return NextResponse.json({ error: "Daily match limit reached", gate }, { status: 403 });
    }

    const userProfile = await getProfileByUserId(auth.userId);

    if (!userProfile) {
      return NextResponse.json(
        { error: "Complete your profile before generating matches" },
        { status: 400 }
      );
    }

    // Find real user candidates
    const candidates = await getRealUserCandidates(auth.userId, userProfile);

    if (candidates.length === 0) {
      return NextResponse.json({ matches: [], poolEmpty: true });
    }

    let aiText: string;
    try {
      const result = await generateText({
        model: getModel(),
        prompt: realUserMatchPrompt(userProfile, candidates),
      });
      aiText = result.text || "";
    } catch (err) {
      console.error("[matches/generate] AI call failed:", err);
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
      console.error(
        "[matches/generate] JSON parse failed:",
        reason,
        "\nraw start:",
        raw.slice(0, 400),
      );
      return NextResponse.json({ matches: [], parseError: true });
    }

    const rawMatches = Array.isArray(parsed)
      ? parsed
      : ((parsed as { matches?: unknown[] })?.matches ?? []);

    // Cap at limit (free=5, premium=20, pro=unlimited)
    const cap = gate.limit === -1 ? rawMatches.length : Math.min(rawMatches.length, gate.limit);
    const capped = rawMatches.slice(0, cap);

    // The AI sometimes hallucinates a matchedUserId that isn't a real candidate.
    // Drop any match whose matchedUserId isn't in the candidate set — this
    // protects the uuid-typed seen_matches.matched_user_id INSERT downstream.
    const candidateIds = new Set(candidates.map((c) => c.userId));
    const validated = (capped as Record<string, unknown>[]).filter((m) => {
      const mid = m.matchedUserId;
      return typeof mid === "string" && candidateIds.has(mid);
    });

    const withIds = validated.map(
      (m, i) => ({
        ...m,
        id: `match_${Date.now()}_${i}`,
      }),
    ) as Match[];

    // Record seen matches (usage already incremented atomically via requirePlanAtomic)
    await Promise.all(
      withIds
        .filter((m) => m.matchedUserId)
        .map((m) => markUserSeen(auth.userId, m.matchedUserId!)),
    );

    // Save to DB and cache for today
    await saveMatchesForUser(auth.userId, withIds);
    await setCachedMatches(auth.userId, today, withIds);

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
    console.error("[matches/generate] unhandled error:", err);
    return NextResponse.json({ error: "Failed to generate matches" }, { status: 500 });
  }
}
