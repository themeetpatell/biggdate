import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { matchGenerationPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, saveMatchesForUser, getCachedMatches, setCachedMatches } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const today = new Date().toISOString().slice(0, 10);

  // Return cached matches if available for today
  const cached = await getCachedMatches(auth.userId, today);
  if (cached) return NextResponse.json(cached);

  // Use profile from DB, fall back to request body
  const body = await req.json();
  const profile = await getProfileByUserId(auth.userId) || body.profile;
  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }

  const result = await generateText({
    model: getModel(),
    prompt: matchGenerationPrompt(profile),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(raw);
    // Prompt returns { matches: [...] } but guard against raw array too
    const matches = Array.isArray(parsed) ? parsed : (parsed.matches ?? []);
    const withIds = matches.map(
      (m: Record<string, unknown>, i: number) => ({
        ...m,
        id: `match_${Date.now()}_${i}`,
      }),
    );

    // Save to DB and cache for today
    await saveMatchesForUser(auth.userId, withIds as Match[]);
    await setCachedMatches(auth.userId, today, withIds as Match[]);

    return NextResponse.json(withIds);
  } catch {
    return NextResponse.json({ error: "Failed to parse matches", raw }, { status: 500 });
  }
}
