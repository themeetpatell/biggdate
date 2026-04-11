import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { coachingPlanPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Use DB profile, fall back to body
  const body = await req.json();
  const profile = await getProfileByUserId(auth.userId) || body.profile;
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 400 });
  }

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: coachingPlanPrompt(profile),
  });

  return NextResponse.json({ plan: result.text || "" });
}
