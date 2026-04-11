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

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: normalizedPassword,
  });

  if (error || !data.user || !data.session) {
    const message = error?.message?.toLowerCase() || "";
    if (message.includes("confirm") || message.includes("not confirmed")) {
      return NextResponse.json(
        {
          error: "Confirm your email before logging in.",
          code: "email_not_confirmed",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    status: "authenticated",
  });
}
