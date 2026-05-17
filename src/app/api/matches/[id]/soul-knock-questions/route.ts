import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { soulKnockCandidatesPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getMatchForUser } from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

const CURATED_FALLBACK: string[] = [
  "What does it feel like when someone truly sees you?",
  "When you love someone, how do they know? What does it look like from the outside?",
  "What would end things on date three — and why does that thing matter so much to you?",
];

function fallback(reason: "ai_error" | "ai_parse" | "no_profile" | "no_match") {
  return NextResponse.json({ questions: CURATED_FALLBACK, source: "fallback", reason });
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id: matchId } = await ctx.params;
  if (!matchId) {
    return NextResponse.json({ error: "matchId is required" }, { status: 400 });
  }

  const [profile, match] = await Promise.all([
    getProfileByUserId(auth.userId),
    getMatchForUser(auth.userId, matchId),
  ]);

  if (!profile) return fallback("no_profile");
  if (!match) return fallback("no_match");

  const aiStart = Date.now();
  let raw = "";
  try {
    const result = await generateText({
      model: getModel(),
      prompt: soulKnockCandidatesPrompt(profile, match),
    });
    await logAiCall({
      route: "matches/soul-knock-questions",
      userId: auth.userId,
      usage: result.usage,
      durationMs: Date.now() - aiStart,
    });
    raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  } catch {
    return fallback("ai_error");
  }

  try {
    const parsed = JSON.parse(raw) as { questions?: unknown };
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions
          .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          .map((q) => q.trim().slice(0, 200))
      : [];

    if (questions.length < 3) {
      const filled = [...questions];
      for (const f of CURATED_FALLBACK) {
        if (filled.length >= 3) break;
        if (!filled.includes(f)) filled.push(f);
      }
      return NextResponse.json({
        questions: filled.slice(0, 3),
        source: questions.length > 0 ? "mixed" : "fallback",
      });
    }

    return NextResponse.json({ questions: questions.slice(0, 3), source: "ai" });
  } catch {
    return fallback("ai_parse");
  }
}
