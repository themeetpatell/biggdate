import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { sql } from "@/lib/db";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const rows = await sql`
    SELECT is_verified, linkedin_url, selfie_url
    FROM profiles WHERE user_id = ${auth.userId} LIMIT 1
  `;
  if (!rows.length) {
    return NextResponse.json({ isVerified: false, hasLinkedin: false, hasSelfie: false });
  }
  const r = rows[0] as Record<string, unknown>;
  return NextResponse.json({
    isVerified: r.is_verified as boolean,
    hasLinkedin: Boolean(r.linkedin_url),
    hasSelfie: Boolean(r.selfie_url),
  });
}
