import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { setPulsePostVisibility } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { isHidden } = await req.json();
  await setPulsePostVisibility(id, Boolean(isHidden));
  return NextResponse.json({ ok: true });
}
