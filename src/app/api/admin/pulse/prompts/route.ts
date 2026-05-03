import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getAllPulsePrompts, createPulsePrompt } from "@/lib/repo";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const prompts = await getAllPulsePrompts();
  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  if (!ADMIN_USER_IDS.includes(auth.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => ({}))) as { content?: unknown };
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content.length < 10) {
    return NextResponse.json({ error: "Prompt too short (min 10 chars)" }, { status: 400 });
  }
  if (content.length > 200) {
    return NextResponse.json({ error: "Prompt too long (max 200 chars)" }, { status: 400 });
  }
  const id = await createPulsePrompt(content);
  return NextResponse.json({ id });
}
