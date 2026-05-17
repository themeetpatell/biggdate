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
import { logAiCall } from "@/lib/ai-costs";
import { track } from "@/lib/analytics";

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

  // Cache lookup runs *before* the plan gate so users can re-view a
  // preview they already paid to generate without burning another seat
  // from their plan budget.
  const earlyCached = await getLifePreview(auth.userId, matchId);
  if (earlyCached) return NextResponse.json(earlyCached);

  const gate = await requirePlanAtomic(auth.userId, "life_preview");
  if (!gate.allowed) {
    return NextResponse.json(
      { error: "Life Preview not available on your plan", gate },
      { status: 403 }
    );
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

  // Double-check between gate increment and AI call in case another
  // request generated the same preview while this one was waiting.
  const cached = await getLifePreview(auth.userId, match.id);
  if (cached) return NextResponse.json(cached);

  const aiStart = Date.now();
  const result = await generateText({
    model: getModel(),
    prompt: lifePreviewPrompt(profile, match),
  });
  await logAiCall({
    route: "life-preview",
    userId: auth.userId,
    usage: result.usage,
    durationMs: Date.now() - aiStart,
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

    await track({
      name: "life_preview_generated",
      userId: auth.userId,
      properties: { matchId: match.id },
    });

    return NextResponse.json(preview);
  } catch {
    // Don't expose raw AI output — it contains user profile data
    return NextResponse.json(
      { error: "Failed to generate life preview" },
      { status: 500 }
    );
  }
}
