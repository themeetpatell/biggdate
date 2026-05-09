import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { blockUser, invalidateMatchCache } from "@/lib/repo";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { blockedId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const blockedId =
    typeof body.blockedId === "string" ? body.blockedId.trim() : "";

  if (!UUID_RE.test(blockedId)) {
    return NextResponse.json({ error: "Invalid blockedId" }, { status: 400 });
  }
  if (blockedId === auth.userId) {
    return NextResponse.json({ error: "Cannot block yourself" }, { status: 400 });
  }

  await blockUser(auth.userId, blockedId);
  await invalidateMatchCache(auth.userId);

  return NextResponse.json({ success: true });
}
