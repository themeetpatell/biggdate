import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { dailyIntentionPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const profile = await getProfileByUserId(auth.userId);
  if (!profile) {
    return NextResponse.json({ error: "No profile" }, { status: 400 });
  }

  const result = await generateText({
    model: getModel(),
    prompt: dailyIntentionPrompt(profile),
  });

  return NextResponse.json({ intention: result.text || "" });
}
