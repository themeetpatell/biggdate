import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getFlaggedPulsePosts } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const posts = await getFlaggedPulsePosts();
  return NextResponse.json({ posts });
}
