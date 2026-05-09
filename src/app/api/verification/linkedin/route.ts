import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";
import { saveVerificationSubmission } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  let body: { linkedinUrl?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const linkedinUrl = typeof body.linkedinUrl === "string" ? body.linkedinUrl.trim() : "";
  let parsedLinkedin: URL;
  try {
    parsedLinkedin = new URL(linkedinUrl);
  } catch {
    return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
  }
  if (parsedLinkedin.hostname !== "www.linkedin.com" && parsedLinkedin.hostname !== "linkedin.com") {
    return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
  }

  const rows = await sql`SELECT selfie_url FROM profiles WHERE user_id = ${auth.userId} LIMIT 1`;
  const selfieUrl = rows.length ? ((rows[0] as Record<string, unknown>).selfie_url as string) ?? "" : "";

  await saveVerificationSubmission(auth.userId, linkedinUrl, selfieUrl);
  return NextResponse.json({ ok: true });
}
