import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { setPulsePromptActive, deletePulsePrompt } from "@/lib/repo";

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
  const body = (await req.json().catch(() => ({}))) as { isActive?: unknown };
  if (typeof body.isActive !== "boolean") {
    return NextResponse.json({ error: "isActive (boolean) required" }, { status: 400 });
  }
  await setPulsePromptActive(id, body.isActive);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await deletePulsePrompt(id);
  return NextResponse.json({ ok: true });
}
