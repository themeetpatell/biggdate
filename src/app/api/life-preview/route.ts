import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { lifePreviewPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import { getProfileByUserId, getLifePreview, saveLifePreview } from "@/lib/repo";
import type { Match } from "@/lib/types";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { match }: { match: Match } = await req.json();
  const profile = await getProfileByUserId(auth.userId);
  if (!profile || !match) {
    return NextResponse.json({ error: "Missing profile or match" }, { status: 400 });
  }

  // Check cache
  const cached = await getLifePreview(auth.userId, match.id);
  if (cached) return NextResponse.json(cached);

  const result = await generateText({
    model: getModel(),
    prompt: lifePreviewPrompt(profile, match),
  });

  const raw = (result.text || "").replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    const previewData = JSON.parse(raw);
    const preview = { matchId: match.id, match, ...previewData };

    // Cache in DB
    await saveLifePreview(auth.userId, match.id, preview);

    return NextResponse.json(preview);
  } catch {
    return NextResponse.json({ error: "Failed to parse life preview", raw }, { status: 500 });
  }
}
