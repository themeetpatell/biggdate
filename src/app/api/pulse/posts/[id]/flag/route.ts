import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { flagPulsePost } from "@/lib/repo";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const { reason = "" } = await req.json().catch(() => ({}));
  await flagPulsePost(id, auth.userId, String(reason));
  return NextResponse.json({ ok: true });
}
