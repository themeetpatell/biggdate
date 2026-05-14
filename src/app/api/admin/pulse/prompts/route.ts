import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAllPulsePrompts, createPulsePrompt } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdmin("pulse:prompts:list");
  if (auth.error) return auth.error;
  const prompts = await getAllPulsePrompts();
  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  const auth = await requireAdmin("pulse:prompts:create");
  if (auth.error) return auth.error;
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
