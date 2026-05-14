import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { approveVerification } from "@/lib/repo";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin("verification:approve");
  if (auth.error) return auth.error;
  const { userId } = await params;
  const result = await approveVerification(userId);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
