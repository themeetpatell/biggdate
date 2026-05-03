import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { approveVerification } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId } = await params;
  const result = await approveVerification(userId);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
