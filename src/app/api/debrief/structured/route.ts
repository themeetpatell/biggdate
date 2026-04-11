import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { debriefReflectionInsightPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, createDebriefReflection } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { matchId, matchName, chemistry, surprise, decision } = await req.json();
  if (!matchName || !chemistry || !surprise || !decision) {
    return NextResponse.json({ error: "All 3 answers required" }, { status: 400 });
  }

  const profile = await getProfileByUserId(auth.userId);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
    prompt: debriefReflectionInsightPrompt(profile, matchName, { chemistry, surprise, decision }),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  let parsed = { insight: "", chemistryScore: null as number | null, wouldSeeAgain: null as boolean | null, growthNote: "", nextMatchHint: "" };
  try { parsed = JSON.parse(raw); } catch { /* use defaults */ }

  const reflection = await createDebriefReflection(
    auth.userId,
    matchId || "unknown",
    matchName,
    { chemistry, surprise, decision },
    parsed.chemistryScore,
    parsed.wouldSeeAgain,
    parsed.insight || result.text || "",
  );

  return NextResponse.json({ ...reflection, growthNote: parsed.growthNote, nextMatchHint: parsed.nextMatchHint });
}
