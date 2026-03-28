import { NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/repo";

export async function POST(req: Request) {
  const { name, email, city, intent } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const entry = await addToWaitlist(name || "", email, city || "", intent || "");
  if (!entry) {
    return NextResponse.json({ error: "Already on waitlist" }, { status: 409 });
  }

  return NextResponse.json(entry);
}
