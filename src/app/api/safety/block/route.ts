import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { blockUser, invalidateMatchCache } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { blockedId }: { blockedId: string } = await req.json();
  if (!blockedId) {
    return NextResponse.json({ error: "blockedId required" }, { status: 400 });
  }

  await blockUser(auth.userId, blockedId);
  await invalidateMatchCache(auth.userId);

  return NextResponse.json({ success: true });
}
