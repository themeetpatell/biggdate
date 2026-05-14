import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getFlaggedPulsePosts } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdmin("pulse:posts:list-flagged");
  if (auth.error) return auth.error;
  const posts = await getFlaggedPulsePosts();
  return NextResponse.json({ posts });
}
