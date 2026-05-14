import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { setPulsePromptActive, deletePulsePrompt } from "@/lib/repo";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin("pulse:prompts:set-active");
  if (auth.error) return auth.error;
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
  const auth = await requireAdmin("pulse:prompts:delete");
  if (auth.error) return auth.error;
  const { id } = await params;
  await deletePulsePrompt(id);
  return NextResponse.json({ ok: true });
}
