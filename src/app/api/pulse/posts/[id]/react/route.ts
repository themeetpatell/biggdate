import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { togglePulseReaction } from "@/lib/repo";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { id } = await params;
  const resonated = await togglePulseReaction(id, auth.userId);
  return NextResponse.json({ resonated });
}
