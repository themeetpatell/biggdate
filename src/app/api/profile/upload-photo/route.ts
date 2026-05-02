import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/require-auth";
import { moderatePhoto } from "@/lib/photo-moderation";
import { recordPhotoModeration } from "@/lib/repo";
import { log } from "@/lib/log";

// MIME-driven extension. Never trust user-supplied filenames — `evil.jpg.js`
// would write a JS file to public storage if we used file.name's extension.
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/gif": "gif",
};

// Lazy-initialize Supabase admin client. Building a client at module load
// trips Next.js's "Collecting page data" phase when env vars aren't injected
// yet — defer until first request so the build can finish without secrets.
let _adminClient: SupabaseClient | null = null;
function getAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  _adminClient = createClient(url, key, { auth: { persistSession: false } });
  return _adminClient;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const supabase = getAdminClient();

  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json({ error: "No photo file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const fileExt = MIME_TO_EXT[file.type.toLowerCase()];
    if (!fileExt) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }
    const fileName = `${auth.userId}/${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      log.error("photo upload failed", uploadError, { userId: auth.userId });
      return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    const photoUrl = urlData.publicUrl;

    // Moderate the photo
    const moderationResult = await moderatePhoto(photoUrl);
    const moderationStatus = moderationResult.verdict === "safe" ? "safe" : "flagged";

    // Record moderation result
    await recordPhotoModeration({
      userId: auth.userId,
      photoUrl,
      status: moderationStatus,
      provider: moderationResult.provider ?? undefined,
      scores: moderationResult.scores ?? undefined,
      reason: moderationResult.reason ?? undefined,
    });

    if (moderationResult.verdict !== "safe") {
      // Delete the photo if it's not safe
      await supabase.storage.from("photos").remove([fileName]);
      return NextResponse.json({
        error: "Photo flagged for review",
        reason: moderationResult.reason
      }, { status: 400 });
    }

    return NextResponse.json({
      photoUrl,
      status: "safe"
    });

  } catch (error) {
    log.error("photo upload error", error, { userId: auth.userId });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}