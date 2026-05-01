import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getFlaggedPhotos, resolvePhotoModeration } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const entries = await getFlaggedPhotos();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
