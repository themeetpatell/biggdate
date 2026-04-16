import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";
import { saveVerificationSubmission } from "@/lib/repo";

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { selfieUrl } = await req.json();
  if (!selfieUrl || typeof selfieUrl !== "string") {
    return NextResponse.json({ error: "selfieUrl is required" }, { status: 400 });
  }

  const rows = await sql`SELECT linkedin_url FROM profiles WHERE user_id = ${auth.userId} LIMIT 1`;
  const linkedinUrl = rows.length ? ((rows[0] as Record<string, unknown>).linkedin_url as string) ?? "" : "";

  await saveVerificationSubmission(auth.userId, linkedinUrl, selfieUrl);
  return NextResponse.json({ ok: true });
}
