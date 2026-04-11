import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { icebreakerPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, updateIntroWithIcebreakers } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { match, introId }: { match: Match; introId: string } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !match) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const result = await generateText({
    model: getModel(),
    prompt: icebreakerPrompt(profile, match),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  try {
    const parsed = JSON.parse(raw);
    const icebreakers: string[] = parsed.icebreakers || [];
    // Update the intro record with icebreakers
    if (introId) await updateIntroWithIcebreakers(introId, icebreakers);
    return NextResponse.json({ icebreakers });
  } catch {
    return NextResponse.json({ icebreakers: [] });
  }
}
