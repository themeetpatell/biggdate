import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { coachingPlanPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const profile = await getProfileByUserId(auth.userId);
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 400 });
  }

  const aiStart = Date.now();
  const result = await generateText({
    model: getModel(),
    prompt: coachingPlanPrompt(profile),
  });
  await logAiCall({
    route: "coach/plan",
    userId: auth.userId,
    usage: result.usage,
    durationMs: Date.now() - aiStart,
  });

  return NextResponse.json({ plan: result.text || "" });
}
