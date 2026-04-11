import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIProvider, getModel } from "@/lib/ai";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { reflection } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !reflection) {
    return NextResponse.json({ error: "Missing profile or reflection" }, { status: 400 });
  }

  const provider = getAIProvider();
  const result = await generateText({
    model: provider(getModel()),
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

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to parse reflection", raw }, { status: 500 });
  }
}
