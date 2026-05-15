import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { logAiCall } from "@/lib/ai-costs";
import { getVariant } from "@/lib/experiments";
import { track } from "@/lib/analytics";
import { log } from "@/lib/log";

export const maxDuration = 30;

/**
 * Score a draft Soul Knock question before send. The Soul Knock mechanic
 * only works if the floor is enforced — "hey"-tier openers defeat the whole
 * intent-first model.
 *
 * Returns:
 *   score    0-100 — higher is a stronger, more answerable opener
 *   verdict  "strong" | "weak"
 *   coaching one short line on how to sharpen it (only when weak)
 *   enforce  whether the client should soft-block on a weak verdict. Driven
 *            by the `exp_soul_knock_floor` experiment — control = advisory
 *            only, so scoring ships safe until the experiment is turned on.
 *
 * A cheap local heuristic short-circuits truly trivial input so we don't
 * burn an AI call on "hey".
 */

const TRIVIAL_COACHING =
  "This is too short to land. Ask something real — about how they live, what they want, a detail from their profile.";

function localTrivialCheck(question: string): boolean {
  const q = question.trim();
  if (q.length < 12) return true;
  // A single word, or no real prompt at all.
  if (!/\s/.test(q)) return true;
  const lowEffort = /^(hey+|hi+|hello+|sup|yo+|wassup|what'?s up|hii+)\b/i;
  if (lowEffort.test(q) && q.length < 25) return true;
  return false;
}

interface ScoreResult {
  score: number;
  verdict: "strong" | "weak";
  coaching: string;
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 50;
  return Math.max(0, Math.min(100, Math.round(v)));
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const rl = await checkRateLimit("intros:score-question", auth.userId, {
    limit: 40,
    windowSec: 3600,
  });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { question?: unknown; matchId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > 280) {
    return NextResponse.json({ error: "question is too long" }, { status: 400 });
  }

  // Control = advisory only; the client won't soft-block. Flip the
  // exp_soul_knock_floor experiment to a non-control variant to enforce.
  const variant = await getVariant("exp_soul_knock_floor", auth.userId);
  const enforce = variant !== "control";

  // Cheap local short-circuit — no AI call for obviously trivial input.
  if (localTrivialCheck(question)) {
    await track({
      name: "soul_knock_scored",
      userId: auth.userId,
      properties: { verdict: "weak", score: 5, local: true, enforce },
    });
    return NextResponse.json({
      score: 5,
      verdict: "weak",
      coaching: TRIVIAL_COACHING,
      enforce,
    });
  }

  const prompt = `You score the quality of a dating-app opening question (a "Soul Knock"). A strong Soul Knock is a real, specific, answerable question that invites a substantive reply and shows genuine curiosity. A weak one is generic, low-effort, a flat compliment, a yes/no question, or anything that reads like "hey".

Question to score: "${question}"

Return STRICT JSON only, no prose:
{
  "score": <integer 0-100, how strong this opener is>,
  "verdict": "strong" or "weak",
  "coaching": "<if weak, one short, warm, specific sentence on how to sharpen it; if strong, empty string>"
}
Use verdict "weak" for any score below 55.`;

  let result: ScoreResult;
  const aiStart = Date.now();
  try {
    const ai = await generateText({ model: getModel(), prompt });
    await logAiCall({
      route: "intros/score-question",
      userId: auth.userId,
      usage: ai.usage,
      durationMs: Date.now() - aiStart,
    });
    const raw = (ai.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const score = clampScore(parsed.score);
    const verdict: "strong" | "weak" =
      parsed.verdict === "strong" || parsed.verdict === "weak"
        ? parsed.verdict
        : score >= 55 ? "strong" : "weak";
    result = {
      score,
      verdict,
      coaching: typeof parsed.coaching === "string" ? parsed.coaching : "",
    };
  } catch (err) {
    await logAiCall({
      route: "intros/score-question",
      userId: auth.userId,
      durationMs: Date.now() - aiStart,
      error: err instanceof Error ? err.message : "unknown",
    });
    log.warn("score-question: scoring failed, allowing send", {
      userId: auth.userId,
    });
    // Fail open — a scoring outage must never block a user from connecting.
    return NextResponse.json({
      score: 70,
      verdict: "strong",
      coaching: "",
      enforce: false,
    });
  }

  await track({
    name: "soul_knock_scored",
    userId: auth.userId,
    properties: { verdict: result.verdict, score: result.score, enforce },
  });

  return NextResponse.json({ ...result, enforce });
}
