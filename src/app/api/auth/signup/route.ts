import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getAccountHandleByUsername, upsertAccountHandle } from "@/lib/repo";

export async function POST(req: Request) {
  let body: {
    email?: string;
    password?: string;
    fullName?: string;
    username?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { email, password, fullName, username } = body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedPassword = typeof password === "string" ? password : "";
  const normalizedFullName = typeof fullName === "string" ? fullName.trim() : "";
  const normalizedUsername = typeof username === "string" ? username.trim().toLowerCase() : "";

  if (!normalizedEmail || !normalizedPassword) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (!normalizedFullName) {
    return NextResponse.json({ error: "Full name required" }, { status: 400 });
  }
  if (!normalizedUsername || normalizedUsername.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
  }
  if (!/^[a-z0-9._]+$/.test(normalizedUsername)) {
    return NextResponse.json(
      { error: "Username can only use letters, numbers, periods, and underscores" },
      { status: 400 }
    );
  }
  if (normalizedPassword.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  try {
    const existingHandle = await getAccountHandleByUsername(normalizedUsername);
    if (existingHandle) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  } catch {
    // DB unreachable — skip username uniqueness check; the upsert will catch duplicates later
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: normalizedPassword,
    options: {
      data: {
        full_name: normalizedFullName,
        username: normalizedUsername,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    const alreadyExists =
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("exists");
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

  try {
    await upsertAccountHandle({
      userId: data.user.id,
      email: normalizedEmail,
      username: normalizedUsername,
      fullName: normalizedFullName,
    });
  } catch (handleError) {
    const message =
      handleError instanceof Error ? handleError.message.toLowerCase() : "";
    return NextResponse.json(
      {
        error: message.includes("username")
          ? "Username already taken"
          : "We created the account, but could not save your username. Try logging in with email once, then retry.",
      },
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
