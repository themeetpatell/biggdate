import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getActivePulsePrompts, getTodayPulsePrompt } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Returns latest active prompt as `prompt` for backward compat,
  // and the full active list as `prompts` for the inspo carousel.
  const prompts = await getActivePulsePrompts(5);
  const prompt = await getTodayPulsePrompt();
  return NextResponse.json({ prompt, prompts });
}
