import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { matchGenerationPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, saveMatchesForUser } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Use profile from DB, fall back to request body
  const body = await req.json();
  const profile = getProfileByUserId(auth.userId) || body.profile;
  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 400 });
  }

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: matchGenerationPrompt(profile),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    const matches = JSON.parse(raw);
    const withIds = (Array.isArray(matches) ? matches : []).map(
      (m: Record<string, unknown>, i: number) => ({
        ...m,
        id: `match_${Date.now()}_${i}`,
      }),
    );

    // Save to DB
    saveMatchesForUser(auth.userId, withIds as Match[]);

    return NextResponse.json(withIds);
  } catch {
    return NextResponse.json({ error: "Failed to parse matches", raw }, { status: 500 });
  }
}
