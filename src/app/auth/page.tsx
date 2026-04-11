"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type AuthMode = "login" | "signup" | "forgot" | "reset";

type AuthResponse = {
  error?: string;
  message?: string;
  status?: "authenticated" | "pending_confirmation";
};

const MODE_CONTENT: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    hint: string;
  }
> = {
  login: {
    eyebrow: "Welcome back",
    title: "Pick up where your story left off.",
    subtitle:
      "Step back into your dashboard, date briefs, and coaching without the usual friction.",
    cta: "Log In",
    hint: "Use your username and password.",
  },
  signup: {
    eyebrow: "Private beta access",
    title: "Create the account behind your soul profile.",
    subtitle:
      "We keep the entry flow minimal so you can get into onboarding and start building real match context fast.",
    cta: "Create Account",
    hint: "Password must be at least 6 characters.",
  },
  forgot: {
    eyebrow: "Password recovery",
    title: "Reset your password.",
    subtitle:
      "Enter the email you signed up with and we'll send you a link to set a new password.",
    cta: "Send Reset Link",
    hint: "Enter the email you signed up with.",
  },
  reset: {
    eyebrow: "Almost there",
    title: "Set a new password.",
    subtitle:
      "Choose a strong password to secure your account.",
    cta: "Update Password",
    hint: "Password must be at least 6 characters.",
  },
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readAuthResponse(response: Response): Promise<AuthResponse> {
  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return {};
  }
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "reset" || modeParam === "forgot") {
      setMode(modeParam);
    }
    const errorParam = searchParams.get("error");
    if (errorParam === "auth_code_exchange_failed") {
      setError("The link has expired or was already used. Please try again.");
    } else if (errorParam === "missing_code") {
      setError("Invalid link. Please request a new one.");
    }
  }, [searchParams]);

  const content = MODE_CONTENT[mode];
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();
  const normalizedUsername = username.trim().toLowerCase();

  let canSubmit = false;
  if (mode === "signup") {
    canSubmit =
      normalizedFullName.length > 0 &&
      normalizedUsername.length >= 3 &&
      normalizedEmail.length > 0 &&
      password.length >= 6;
  } else if (mode === "login") {
    canSubmit = loginIdentifier.trim().length >= 3 && password.length >= 6;
  } else if (mode === "forgot") {
    canSubmit = normalizedEmail.length > 0;
  } else if (mode === "reset") {
    canSubmit = password.length >= 6 && confirmPassword.length >= 6;
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    const nextFullName = fullName.trim();
    const nextUsername = username.trim().toLowerCase();
    const nextLoginIdentifier = loginIdentifier.trim().toLowerCase();

    /* ── validation ── */
    if (mode === "signup" && !nextFullName) {
      setError("Enter your full name.");
      return;
    }
    if (mode === "signup" && nextUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (mode === "signup" && !/^[a-z0-9._]+$/.test(nextUsername)) {
      setError("Username can only use letters, numbers, periods, and underscores.");
      return;
    }
    if ((mode === "signup" || mode === "login" || mode === "reset") && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "reset" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if ((mode === "signup" || mode === "forgot") && !isValidEmail(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "login" && nextLoginIdentifier.length < 3) {
      setError("Enter your username.");
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);

    try {
      /* ── forgot password ── */
      if (mode === "forgot") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: nextEmail }),
        });
        const data = await readAuthResponse(res);
        if (!res.ok) {
          setError(data.error || "Something went wrong");
          return;
        }
        setNotice(data.message || "If an account exists with that email, you will receive a reset link.");
        return;
      }

      /* ── reset password ── */
      if (mode === "reset") {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await readAuthResponse(res);
        if (!res.ok) {
          setError(data.error || "Something went wrong");
          return;
        }
        setNotice("Password updated! Redirecting...");
        setPassword("");
        setConfirmPassword("");
        await refresh();
        setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 1500);
        return;
      }

      /* ── signup / login ── */
      if (mode === "signup") {
        setEmail(nextEmail);
      } else {
        setLoginIdentifier(nextLoginIdentifier);
      }

      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: mode === "signup" ? nextEmail : undefined,
          password,
          fullName: mode === "signup" ? nextFullName : undefined,
          username: mode === "signup" ? nextUsername : nextLoginIdentifier,
        }),
      });
      const data = await readAuthResponse(res);

      if (!res.ok) {
        if ((data as AuthResponse & { code?: string }).code === "email_not_confirmed") {
          setError("Please confirm your email before logging in. Check your inbox.");
        } else {
          setError(data.error || "Something went wrong");
        }
        return;
      }

      if (data.status === "pending_confirmation") {
        setNotice(data.message || "Check your inbox to confirm your email, then log in.");
        setPassword("");
        setMode("login");
        return;
      }

      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const me = await readAuthResponse(meRes) as AuthResponse & {
        hasProfile?: boolean;
      };

      if (!meRes.ok) {
        setError("Your session was created, but we could not load your account. Refresh and try once more.");
        return;
      }

      await refresh();
      router.replace(me.hasProfile ? "/dashboard" : "/onboarding");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
      <div
        className="pointer-events-none fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.1))",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <section className="page-enter max-w-lg">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{
              borderColor: "rgba(255,0,255,0.25)",
              background: "rgba(255,0,255,0.08)",
              color: "var(--bd-accent)",
            }}
          >
            <Sparkles className="size-3.5" />
            BiggDate Access
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--bd-text-faint)]">
              {content.eyebrow}
            </p>
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl">
              {content.title}
            </h1>
          </div>

          <div className="mt-8 h-px w-16" style={{ background: "linear-gradient(90deg, var(--bd-accent), transparent)" }} />
        </section>

        <Card
          className="page-enter page-enter-delay-1 backdrop-blur-xl"
          style={{
            background: "linear-gradient(180deg, rgba(10,18,36,0.96), rgba(5,9,20,0.92))",
            border: "1px solid rgba(255,0,255,0.15)",
            boxShadow: "0 0 0 1px rgba(0,102,255,0.08), 0 30px 120px rgba(0,0,0,0.5), 0 0 80px rgba(255,0,255,0.06)",
          }}
        >
          <CardContent className="p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                {mode === "login" && "Log in"}
                {mode === "signup" && "Create account"}
                {mode === "forgot" && "Reset password"}
                {mode === "reset" && "New password"}
              </h2>
                <p className="mt-1 text-sm text-[var(--bd-text-muted)]">{content.hint}</p>
              </div>
              <div
                className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "rgba(255,0,255,0.15)",
                  color: "var(--bd-accent)",
                  background: "rgba(255,0,255,0.06)",
                }}
              >
                Secure Flow
              </div>
            </div>

            {(mode === "signup" || mode === "login") && (
              <div
                className="mb-6 grid grid-cols-2 rounded-2xl border p-1"
                style={{ borderColor: "rgba(255,0,255,0.12)", background: "rgba(255,0,255,0.04)" }}
              >
                {(["signup", "login"] as AuthMode[]).map((value) => {
                  const active = value === mode;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => switchMode(value)}
                      className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                      style={{
                        background: active ? "linear-gradient(135deg, rgba(255,0,255,0.28), rgba(0,102,255,0.28))" : "transparent",
                        color: active ? "#fff" : "var(--bd-text-muted)",
                        boxShadow: active ? "0 0 20px rgba(255,0,255,0.2)" : "none",
                      }}
                    >
                      {value === "signup" ? "Sign up" : "Log in"}
                    </button>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* ── signup-only fields ── */}
              {mode === "signup" && (
                <>
                  <label className="block space-y-2">
                    <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                      Full name
                    </span>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                      <Input
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                        style={{
                          background: "rgba(22,26,42,0.94)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      />
                    </div>
                  </label>

                  <label className="block space-y-2">
                    <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                      Username
                    </span>
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                      <Input
                        type="text"
                        placeholder="Choose a username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                        style={{
                          background: "rgba(22,26,42,0.94)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      />
                    </div>
                  </label>
                </>
              )}

              {/* ── email field: signup & forgot ── */}
              {(mode === "signup" || mode === "forgot") && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                    Email
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={{
                        background: "rgba(22,26,42,0.94)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </label>
              )}

              {/* ── username field: login ── */}
              {mode === "login" && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                    Username
                  </span>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                    <Input
                      type="text"
                      placeholder="Your username"
                      autoComplete="username"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={{
                        background: "rgba(22,26,42,0.94)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </label>
              )}

              {/* ── password field: signup, login, reset ── */}
              {(mode === "signup" || mode === "login" || mode === "reset") && (
                <label className="block space-y-2">
                  <span className="flex items-center justify-between pl-1 pr-1">
                    <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                      {mode === "reset" ? "New password" : "Password"}
                    </span>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-[13px] font-medium text-[var(--bd-text-muted)] transition-colors hover:text-[var(--bd-text)]"
                      >
                        Forgot password?
                      </button>
                    )}
                  </span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" || mode === "reset" ? "At least 6 characters" : "Enter your password"}
                      autoComplete={mode === "signup" || mode === "reset" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-14 rounded-[1.8rem] px-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={{
                        background: "rgba(22,26,42,0.94)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--bd-text-faint)] transition-colors hover:text-[var(--bd-text)]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>
              )}

              {/* ── confirm password field: reset only ── */}
              {mode === "reset" && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[#b8c7e8]">
                    Confirm password
                  </span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7088ab]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-14 rounded-[1.8rem] px-12 text-lg text-[var(--bd-text)] placeholder:text-[#7088ab] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={{
                        background: "rgba(22,26,42,0.94)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                </label>
              )}

              {(error || notice) && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: error ? "rgba(255,20,147,0.3)" : "rgba(0,204,255,0.24)",
                    background: error ? "rgba(255,20,147,0.08)" : "rgba(0,204,255,0.08)",
                    color: error ? "#ff86c8" : "#8fe8ff",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {error ? (
                      <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    )}
                    <p>{error || notice}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !canSubmit}
                className="h-12 w-full rounded-2xl border-0 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-100"
                style={{
                  background: canSubmit
                    ? "linear-gradient(135deg, #e8927c, #d4688a, #a855f7)"
                    : "rgba(255,255,255,0.06)",
                  color: canSubmit ? "#fff" : "var(--bd-text-faint)",
                }}
              >
                {loading ? "Working..." : content.cta}
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--bd-text-muted)]">
              {mode === "signup" && (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-[var(--bd-text)] underline decoration-[var(--bd-border-glow)] underline-offset-4"
                  >
                    Log in instead
                  </button>
                </>
              )}
              {mode === "login" && (
                <>
                  Need a new account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-[var(--bd-text)] underline decoration-[var(--bd-border-glow)] underline-offset-4"
                  >
                    Create one here
                  </button>
                </>
              )}
              {mode === "forgot" && (
                <>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-[var(--bd-text)] underline decoration-[var(--bd-border-glow)] underline-offset-4"
                  >
                    Back to login
                  </button>
                </>
              )}
              {mode === "reset" && (
                <>
                  Want to log in instead?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-[var(--bd-text)] underline decoration-[var(--bd-border-glow)] underline-offset-4"
                  >
                    Back to login
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
