import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getFlaggedPhotos, resolvePhotoModeration } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdmin("photo-moderation:list");
  if (auth.error) return auth.error;

  const entries = await getFlaggedPhotos();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const auth = await requireAdmin("photo-moderation:resolve");
  if (auth.error) return auth.error;

  let body: { id?: string; status?: "safe" | "rejected" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.id || (body.status !== "safe" && body.status !== "rejected")) {
    return NextResponse.json(
      { error: "id and status (safe|rejected) required" },
      { status: 400 },
    );
  }

  await resolvePhotoModeration(body.id, auth.userId, body.status);
  return NextResponse.json({ ok: true });
}
