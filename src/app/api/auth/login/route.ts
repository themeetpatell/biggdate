import { NextResponse } from "next/server";
import { authenticateUser, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ id: user.id, email: user.email });
}
