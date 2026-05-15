import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getMatchForUser } from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { matchId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const matchId =
    typeof body.matchId === "string" ? body.matchId.trim() : "";
  if (!UUID_RE.test(matchId) && !/^match_\d+_\d+$/.test(matchId)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  const [profile, match] = await Promise.all([
    getProfileByUserId(auth.userId),
    getMatchForUser(auth.userId, matchId),
  ]);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const signalsContext = match.compatibilitySignals
    ? `Values signal: ${match.compatibilitySignals.values}. Communication signal: ${match.compatibilitySignals.communication}. Life direction: ${match.compatibilitySignals.lifeDirection}.`
    : "";

  const aiStart = Date.now();
  try {
    const result = await generateText({
      model: getModel(),
      prompt: `You are a matchmaking concierge. Write a warm, insightful agent briefing (3-4 paragraphs) about why ${profile.name} and ${match.name} could work together. ${signalsContext} Connection hook: ${match.connectionHook}. Intent alignment: ${match.intentAlignment}. Be honest about challenges (friction point: ${match.frictionPoint}). End with this opening question they should both explore: "${match.openingQuestion}".`,
    });
    await logAiCall({
      route: "matches/briefing",
      userId: auth.userId,
      usage: result.usage,
      durationMs: Date.now() - aiStart,
    });
    return NextResponse.json({ briefing: result.text || "" });
  } catch (err) {
    await logAiCall({
      route: "matches/briefing",
      userId: auth.userId,
      durationMs: Date.now() - aiStart,
      error: err instanceof Error ? err.message : "unknown",
    });
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 503 });
  }
}
