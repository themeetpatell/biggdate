import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getIntrosForUser } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const intros = getIntrosForUser(auth.userId);
  return NextResponse.json(intros);
}
