import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { match }: { match: Match } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !match) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const signalsContext = match.compatibilitySignals
    ? `Values signal: ${match.compatibilitySignals.values}. Communication signal: ${match.compatibilitySignals.communication}. Life direction: ${match.compatibilitySignals.lifeDirection}.`
    : "";

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: `You are a matchmaking concierge. Write a warm, insightful agent briefing (3-4 paragraphs) about why ${profile.name} and ${match.name} could work together. ${signalsContext} Connection hook: ${match.connectionHook}. Intent alignment: ${match.intentAlignment}. Be honest about challenges (friction point: ${match.frictionPoint}). End with this opening question they should both explore: "${match.openingQuestion}".`,
  });

  return NextResponse.json({ briefing: result.text || "" });
}
