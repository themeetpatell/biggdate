import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getPendingVerifications } from "@/lib/repo";

export async function GET() {
  const auth = await requireAdmin("verification:list-pending");
  if (auth.error) return auth.error;
  const verifications = await getPendingVerifications();
  return NextResponse.json({ verifications });
}
