import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import { getZodiacCompat } from "@/lib/zodiac";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { match }: { match: Match } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !match) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const zodiacCompat =
    profile.zodiac && match.zodiac ? getZodiacCompat(profile.zodiac, match.zodiac) : null;

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: `You are a matchmaking concierge. Write a warm, insightful agent briefing (3-4 paragraphs) about why ${profile.name} and ${match.name} could work together. Reference their attachment styles (${profile.attachment} + ${match.attachment}), love languages (${profile.loveLanguage} + ${match.loveLanguage}), shared values, and zodiac compatibility (${zodiacCompat?.label || "unknown"}). Be honest about challenges. End with a specific conversation starter suggestion.`,
  });

  return NextResponse.json({ briefing: result.text || "", zodiacCompat });
}
