import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, createDebrief } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { matchName, matchId, feedback } = await req.json();
  const profile = getProfileByUserId(auth.userId);
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 400 });
  }

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: `You are a relationship coach doing a post-date debrief. ${profile.name} (${profile.attachment} attachment, ${profile.loveLanguage} love language) just had a date with ${matchName}. Their feedback: "${feedback}"

Provide: 1) A warm acknowledgment 2) What this reveals about their patterns 3) One specific growth insight 4) Whether to pursue or pass, with reasoning. Keep it concise (3-4 paragraphs).`,
  });

  createDebrief(auth.userId, matchId, matchName, feedback, result.text || "");

  return NextResponse.json({ insight: result.text || "" });
}
