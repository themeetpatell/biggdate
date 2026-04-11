import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getAccountHandleByUsername } from "@/lib/repo";

export async function POST(req: Request) {
  let body: { email?: string; username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { email, username, password } = body;
  const identifier =
    typeof username === "string"
      ? username.trim().toLowerCase()
      : typeof email === "string"
        ? email.trim().toLowerCase()
        : "";
  const normalizedPassword = typeof password === "string" ? password : "";

  if (!identifier || !normalizedPassword) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  let normalizedEmail = identifier;
  if (!identifier.includes("@")) {
    try {
      const accountHandle = await getAccountHandleByUsername(identifier);
      if (!accountHandle) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
      normalizedEmail = accountHandle.email;
    } catch {
      return NextResponse.json(
        { error: "Unable to verify username. Try logging in with your email instead." },
        { status: 503 }
      );
    }
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
