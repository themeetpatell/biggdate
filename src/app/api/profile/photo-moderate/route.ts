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

  // Reject URLs that don't point to our own Supabase Storage bucket — prevents
  // SSRF where a client tricks the server into fetching an arbitrary URL via
  // the Sightengine proxy.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(photoUrl);
    } catch {
      return NextResponse.json({ error: "Invalid photoUrl" }, { status: 400 });
    }
    const allowedHost = new URL(supabaseUrl).hostname;
    if (parsedUrl.hostname !== allowedHost) {
      return NextResponse.json({ error: "photoUrl must be a Supabase Storage URL" }, { status: 400 });
    }
  }

  const result = await moderatePhoto(photoUrl);

  const unavailable = result.reason === "moderation_unavailable";

  try {
    await recordPhotoModeration({
      userId: auth.userId,
      photoUrl,
      // Outage uploads enter `pending` so the admin queue can re-review them
      // when Sightengine recovers; genuine flags stay `flagged`.
      status: unavailable ? "pending" : result.verdict,
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
    if (unavailable) {
      return NextResponse.json(
        {
          verdict: "flagged",
          reason: "moderation_unavailable",
          message: "We can't verify photos right now. Try again in a few minutes.",
        },
        { status: 503 },
      );
    }
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
