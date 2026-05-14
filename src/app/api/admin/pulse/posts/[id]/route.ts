import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { setPulsePostVisibility } from "@/lib/repo";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin("pulse:posts:set-visibility");
  if (auth.error) return auth.error;

  const { id } = await params;
  const { isHidden } = await req.json();
  await setPulsePostVisibility(id, Boolean(isHidden));
  return NextResponse.json({ ok: true });
}
