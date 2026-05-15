import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";
import { logAiCall } from "@/lib/ai-costs";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { reflection } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !reflection) {
    return NextResponse.json({ error: "Missing profile or reflection" }, { status: 400 });
  }

  const aiStart = Date.now();
  const result = await generateText({
    model: getModel(),
    prompt: `You are a growth coach for ${profile.name} (${profile.attachment} attachment, readiness ${profile.readinessScore}/100).

Their reflection: "${reflection}"

Return STRICT JSON only:
{
  "insight": "One sentence insight about what this reveals",
  "readinessShift": number between -5 and +5,
  "growthNote": "What they should focus on next",
  "encouragement": "A warm, specific encouragement"
}`,
  });
  await logAiCall({
    route: "growth/reflect",
    userId: auth.userId,
    usage: result.usage,
    durationMs: Date.now() - aiStart,
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to parse reflection", raw }, { status: 500 });
  }
}
