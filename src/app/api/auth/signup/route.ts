import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { email, password } = body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedPassword = typeof password === "string" ? password : "";

  if (!normalizedEmail || !normalizedPassword) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (normalizedPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: normalizedPassword,
  });

  if (error) {
    const message = error.message.toLowerCase();
    const alreadyExists = message.includes("already") || message.includes("registered");
    return NextResponse.json(
      { error: alreadyExists ? "Email already registered" : error.message },
      { status: alreadyExists ? 409 : 400 }
    );
  }
  if (!data.user) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }

  if ((data.user.identities?.length ?? 0) === 0) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  if (!data.session) {
    return NextResponse.json(
      {
        id: data.user.id,
        email: data.user.email,
        status: "pending_confirmation",
        message: "Check your inbox to confirm your email, then log in.",
      },
      { status: 201 }
    );
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    status: "authenticated",
  });
}
