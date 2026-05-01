import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAuth } from "@/lib/require-auth";
import { moderatePhoto } from "@/lib/photo-moderation";
import { recordPhotoModeration } from "@/lib/repo";

// Initialize Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false }
  }
);

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

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

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${auth.userId}/${Date.now()}.${fileExt}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
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
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}