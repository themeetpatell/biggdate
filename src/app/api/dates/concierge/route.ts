import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { dateConciergePrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { match }: { match: Match } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !match) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const result = await generateText({
    model: getModel(),
    prompt: dateConciergePrompt(profile, match),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ venues: [], bestTime: "", safetyNote: "" });
  }
}
