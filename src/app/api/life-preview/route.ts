import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { lifePreviewPrompt } from "@/lib/prompts";
import { requireAuth } from "@/lib/require-auth";
import {
  getProfileByUserId,
  getLifePreview,
  saveLifePreview,
  requirePlanAtomic,
  getMatchForUser,
} from "@/lib/repo";

export const maxDuration = 60;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const gate = await requirePlanAtomic(auth.userId, "life_preview");
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Life Preview not available on your plan", gate },
      { status: 403 }
    );
  }

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

  // Return cached result if available
  const cached = await getLifePreview(auth.userId, match.id);
  if (cached) return NextResponse.json(cached);

  const result = await generateText({
    model: getModel(),
    prompt: lifePreviewPrompt(profile, match),
  });

  const raw = (result.text || "")
    .replace(/```json?\n?/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const previewData = JSON.parse(raw);
    const preview = { matchId: match.id, match, ...previewData };

    await saveLifePreview(auth.userId, match.id, preview);
    // Usage already incremented atomically via requirePlanAtomic

    return NextResponse.json(preview);
  } catch {
    // Don't expose raw AI output — it contains user profile data
    return NextResponse.json(
      { error: "Failed to generate life preview" },
      { status: 500 }
    );
  }
}
