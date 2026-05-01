import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { moderatePhoto } from "@/lib/photo-moderation";
import { recordPhotoModeration } from "@/lib/repo";
import { log } from "@/lib/log";

/**
 * Moderate a photo URL after the client has uploaded it to Supabase Storage.
 * Returns:
 *   200 { verdict: "safe" }       — client may commit the URL to the profile
 *   422 { verdict: "flagged", reason } — client must discard the URL
 *
 * The moderation outcome is recorded in `photo_moderation` for audit trail and
 * for the admin review queue.
 */
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { photoUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl.trim() : "";
  if (!photoUrl) {
    return NextResponse.json({ error: "photoUrl is required" }, { status: 400 });
  }

  const result = await moderatePhoto(photoUrl);

  try {
    await recordPhotoModeration({
      userId: auth.userId,
      photoUrl,
      status: result.verdict,
      provider: result.provider ?? undefined,
      scores: result.scores ?? undefined,
      reason: result.reason ?? undefined,
    });
  } catch (err) {
    log.error("failed to record photo moderation entry", err, {
      userId: auth.userId,
      photoUrl,
    });
    // Don't block the user on a logging failure — the verdict still applies.
  }

  if (result.verdict === "flagged") {
    return NextResponse.json(
      {
        verdict: "flagged",
        reason: result.reason ?? "This photo doesn't meet our community guidelines.",
      },
      { status: 422 },
    );
  }

  return NextResponse.json({ verdict: "safe" });
}
