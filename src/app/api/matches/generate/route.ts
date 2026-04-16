import { NextResponse } from "next/server";
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
  requirePlan,
  incrementUsage,
} from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const today = new Date().toISOString().slice(0, 10);

  // Return cached matches if available for today
  const cached = await getCachedMatches(auth.userId, today);
  if (cached && cached.length > 0) return NextResponse.json({ matches: cached });

  // Feature gate: daily matches
  const gate = await requirePlan(auth.userId, "daily_matches");
  if (!gate.allowed) {
    return NextResponse.json({ error: "Daily match limit reached", gate }, { status: 403 });
  }

  const profile = await getProfileByUserId(auth.userId);
  let userProfile = profile;

  if (!userProfile) {
    // Allow profile from request body during onboarding
    const body = await req.json().catch(() => ({}));
    if (!body.profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 400 });
    }
    userProfile = body.profile;
  }

  // Find real user candidates
  const candidates = await getRealUserCandidates(auth.userId, userProfile!);

  if (candidates.length === 0) {
    return NextResponse.json({ matches: [], poolEmpty: true });
  }

  let aiText: string;
  try {
    const result = await generateText({
      model: getModel(),
      prompt: realUserMatchPrompt(userProfile!, candidates),
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

  try {
    const parsed = JSON.parse(raw);
    const rawMatches = Array.isArray(parsed) ? parsed : (parsed.matches ?? []);

    // Cap at limit (free=5, premium=20, pro=unlimited)
    const cap = gate.limit === -1 ? rawMatches.length : Math.min(rawMatches.length, gate.limit);
    const capped = rawMatches.slice(0, cap);

    const withIds = capped.map(
      (m: Record<string, unknown>, i: number) => ({
        ...m,
        id: `match_${Date.now()}_${i}`,
      }),
    ) as Match[];

    // Record seen matches and increment usage
    await Promise.all([
      ...withIds
        .filter((m) => m.matchedUserId)
        .map((m) => markUserSeen(auth.userId, m.matchedUserId!)),
      incrementUsage(auth.userId, "daily_matches"),
    ]);

    // Save to DB and cache for today
    await saveMatchesForUser(auth.userId, withIds);
    await setCachedMatches(auth.userId, today, withIds);

    return NextResponse.json({ matches: withIds });
  } catch {
    console.error("[matches/generate] JSON parse failed. raw response:", raw);
    return NextResponse.json({ error: "Failed to parse matches", raw }, { status: 500 });
  }
}
