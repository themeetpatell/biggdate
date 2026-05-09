import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { icebreakerPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getMatchForUser, updateIntroWithIcebreakers, getIntroById } from "@/lib/repo";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { introId?: unknown; matchId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const introId = typeof body.introId === "string" ? body.introId.trim() : "";
  const matchId = typeof body.matchId === "string" ? body.matchId.trim() : "";

  if (!introId || !matchId) {
    return NextResponse.json({ error: "introId and matchId are required" }, { status: 400 });
  }

  // Verify the intro belongs to this user (IDOR protection)
  const intro = await getIntroById(introId);
  if (!intro || (intro.userId !== auth.userId && intro.matchedUserId !== auth.userId)) {
    return NextResponse.json({ error: "Intro not found" }, { status: 404 });
  }

  const [profile, match] = await Promise.all([
    getProfileByUserId(auth.userId),
    getMatchForUser(auth.userId, matchId),
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  const result = await generateText({
    model: getModel(),
    prompt: icebreakerPrompt(profile, match),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  try {
    const parsed = JSON.parse(raw);
    const icebreakers: string[] = parsed.icebreakers || [];
    await updateIntroWithIcebreakers(introId, icebreakers);
    return NextResponse.json({ icebreakers });
  } catch {
    return NextResponse.json({ icebreakers: [] });
  }
}
