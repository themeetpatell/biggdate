"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

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
    hint: "Use the email tied to your BiggDate account.",
  },
  signup: {
    eyebrow: "Private beta access",
    title: "Create the account behind your soul profile.",
    subtitle:
      "We keep the entry flow minimal so you can get into onboarding and start building real match context fast.",
    cta: "Create Account",
    hint: "Password must be at least 6 characters.",
  },
};

const TRUST_SIGNALS = [
  "Supabase-secured email auth",
  "Redirects you to onboarding only when your profile is still empty",
  "Keeps your session state in sync after sign in",
];

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
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const content = MODE_CONTENT[mode];
  const normalizedEmail = email.trim().toLowerCase();
  const canSubmit = normalizedEmail.length > 0 && password.length >= 6;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = email.trim().toLowerCase();

    if (!isValidEmail(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);
    setEmail(nextEmail);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password }),
      });
      const data = await readAuthResponse(res);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="page-enter max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--bd-gold)]"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Sparkles className="size-3.5" />
            BiggDate Access
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--bd-text-faint)]">
                {content.eyebrow}
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {content.title}
              </h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--bd-text-muted)] sm:text-lg">
              {content.subtitle}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {TRUST_SIGNALS.map((signal, index) => (
              <div
                key={signal}
                className={cn(
                  "rounded-3xl border p-4 text-sm leading-6 text-[var(--bd-text-muted)] backdrop-blur-sm page-enter",
                  index === 1 && "page-enter-delay-1",
                  index === 2 && "page-enter-delay-2"
                )}
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "linear-gradient(180deg, rgba(10,18,36,0.86), rgba(10,18,36,0.6))",
                }}
              >
                <ShieldCheck className="mb-3 size-4 text-[var(--bd-green)]" />
                {signal}
              </div>
            ))}
          </div>
        </section>

        <Card
          className="page-enter page-enter-delay-1 border-0 backdrop-blur-xl"
          style={{
            background: "linear-gradient(180deg, rgba(10,18,36,0.96), rgba(5,9,20,0.92))",
            boxShadow: "0 30px 120px rgba(0,0,0,0.45)",
          }}
        >
          <CardContent className="p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{mode === "login" ? "Log in" : "Create account"}</h2>
                <p className="mt-1 text-sm text-[var(--bd-text-muted)]">{content.hint}</p>
              </div>
              <div
                className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  color: "var(--bd-text-faint)",
                }}
              >
                Secure Flow
              </div>
            </div>

            <div
              className="mb-6 grid grid-cols-2 rounded-2xl border p-1"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              {(["signup", "login"] as AuthMode[]).map((value) => {
                const active = value === mode;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => switchMode(value)}
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      background: active ? "linear-gradient(135deg, rgba(255,0,255,0.18), rgba(0,102,255,0.2))" : "transparent",
                      color: active ? "var(--bd-text)" : "var(--bd-text-muted)",
                    }}
                  >
                    {value === "signup" ? "Sign up" : "Log in"}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--bd-text-muted)]">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--bd-text-faint)]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-2xl border-[var(--bd-border)] bg-[rgba(255,255,255,0.03)] pl-11 text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)]"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--bd-text-muted)]">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--bd-text-faint)]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-2xl border-[var(--bd-border)] bg-[rgba(255,255,255,0.03)] px-11 text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)]"
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
                className="h-12 w-full rounded-2xl border-0 text-base font-semibold text-black"
                style={{ background: "linear-gradient(135deg, var(--bd-accent), #ff4fd8)" }}
              >
                {loading ? "Working..." : content.cta}
                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-[var(--bd-text-muted)]">
              {mode === "signup" ? "Already registered? " : "Need a new account? "}
              <button
                type="button"
                onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
                className="font-semibold text-[var(--bd-text)] underline decoration-[var(--bd-border-glow)] underline-offset-4"
              >
                {mode === "signup" ? "Log in instead" : "Create one here"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
