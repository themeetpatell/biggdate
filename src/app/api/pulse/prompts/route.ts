import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { createPulsePrompt } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { content } = await req.json();
  if (!content || String(content).trim().length < 10) {
    return NextResponse.json({ error: "Prompt too short" }, { status: 400 });
  }

  const id = await createPulsePrompt(String(content).trim());
  return NextResponse.json({ id });
}
