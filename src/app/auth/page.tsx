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
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { trackSignUp, trackLogin } from "@/lib/gtm";
import { COUNTRY_PHONE_OPTIONS, TIMEZONE_TO_ISO2 } from "@/lib/location-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type AuthMode = "login" | "signup" | "forgot" | "reset";

type AuthResponse = {
  error?: string;
  message?: string;
  status?: "authenticated" | "pending_confirmation";
  userId?: string | null;
  hasProfile?: boolean;
};

function iso2ToFlag(iso2: string) {
  return String.fromCodePoint(
    ...iso2
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}

function formatPhoneOptionLabel(option: (typeof COUNTRY_PHONE_OPTIONS)[number]) {
  return `${iso2ToFlag(option.iso2)} ${option.dialCode} ${option.iso2}`;
}

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

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function isValidPhone(value: string) {
  return /^\+\d{8,15}$/.test(value);
}

function inferIso2FromBrowser(): string {
  if (typeof navigator !== "undefined") {
    const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    for (const locale of locales) {
      const parts = locale.split("-");
      const region = parts[parts.length - 1]?.toUpperCase();
      if (region && COUNTRY_PHONE_OPTIONS.some((option) => option.iso2 === region)) {
        return region;
      }
    }
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_ISO2[tz]) {
      return TIMEZONE_TO_ISO2[tz];
    }
  } catch {
    // no-op
  }

  return "IN";
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
  const [phone, setPhone] = useState("");
  const [phoneCountryIso2, setPhoneCountryIso2] = useState("IN");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [sessionLoadFailed, setSessionLoadFailed] = useState(false);
  const [retryingSession, setRetryingSession] = useState(false);

  useEffect(() => {
    setPhoneCountryIso2(inferIso2FromBrowser());
  }, []);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "login" || modeParam === "signup" || modeParam === "reset" || modeParam === "forgot") {
      setMode(modeParam);
    }
    if (searchParams.get("confirmed") === "1") {
      setNotice("Email confirmed. You're in — log in below.");
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
  const normalizedPhone = normalizePhone(phone);
  const normalizedFullName = fullName.trim();
  const normalizedUsername = username.trim().toLowerCase();
  const selectedPhoneOption =
    COUNTRY_PHONE_OPTIONS.find((option) => option.iso2 === phoneCountryIso2) || COUNTRY_PHONE_OPTIONS[0];
  const fullPhoneNumber = `${selectedPhoneOption.dialCode}${normalizedPhone}`;
  const fieldSurfaceStyle = {
    background: "var(--bd-surface)",
    border: "1px solid var(--bd-border)",
    color: "var(--bd-text)",
    boxShadow:
      "inset 0 1px 0 var(--bd-surface-overlay), 0 12px 28px rgba(0,0,0,0.08)",
  } as const;

  let canSubmit = false;
  if (mode === "signup") {
    canSubmit =
      normalizedFullName.length > 0 &&
      normalizedUsername.length >= 3 &&
      normalizedEmail.length > 0 &&
      isValidPhone(fullPhoneNumber) &&
      password.length >= 6 &&
      ageConfirmed;
  } else if (mode === "login") {
    const loginValue = loginIdentifier.trim().toLowerCase();
    canSubmit = (isValidEmail(loginValue) || loginValue.length >= 3) && password.length >= 6;
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
    const nextPhone = normalizePhone(phone);
    const nextPhoneOption =
      COUNTRY_PHONE_OPTIONS.find((option) => option.iso2 === phoneCountryIso2) || COUNTRY_PHONE_OPTIONS[0];
    const nextFullPhone = `${nextPhoneOption.dialCode}${nextPhone}`;
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
    if (mode === "signup" && !isValidPhone(nextFullPhone)) {
      setError("Enter a valid phone number.");
      return;
    }
    if (mode === "login" && !isValidEmail(nextLoginIdentifier) && nextLoginIdentifier.length < 3) {
      setError("Enter your username or email.");
      return;
    }
    if (mode === "signup" && !ageConfirmed) {
      setError("You must confirm you are 18 or older to use BiggDate.");
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
          phone: mode === "signup" ? nextFullPhone : undefined,
          phoneCountryIso2: mode === "signup" ? nextPhoneOption.iso2 : undefined,
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
      const me = await readAuthResponse(meRes);

      if (!meRes.ok || !me.userId) {
        setError("Your session was created, but we could not load your account.");
        setSessionLoadFailed(true);
        return;
      }

      if (mode === "signup") trackSignUp();
      if (mode === "login") trackLogin();

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
    <div
      className="relative -mb-[calc(88px+env(safe-area-inset-bottom,0px))] overflow-hidden px-6 py-4 sm:px-8 sm:py-10 lg:mb-0 lg:min-h-screen lg:px-10"
      style={{ background: "var(--bd-bg)", color: "var(--bd-text)" }}
    >
      <div
        className="pointer-events-none fixed left-[-10%] top-[-14%] h-[560px] w-[560px] rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, var(--bd-accent-glow) 0%, var(--bd-blue-glow) 48%, transparent 72%)",
          animation: "orb1 15s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-[-22%] right-[-8%] h-[460px] w-[460px] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--bd-blue-glow) 0%, var(--bd-pink-glow) 52%, transparent 78%)",
          animation: "orb2 18s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--bd-text-faint) 1px, transparent 1px), linear-gradient(90deg, var(--bd-text-faint) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.1))",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-8 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20">
        <section className="page-enter relative max-w-xl lg:pt-0">
          <div
            className="pointer-events-none absolute -left-10 top-8 h-52 w-52 rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,0,255,0.18) 0%, rgba(255,0,255,0.04) 58%, transparent 80%)",
            }}
          />
          <div className="mt-7 space-y-4 sm:mt-10 sm:space-y-5">
            <p
              className="text-sm font-medium uppercase tracking-[0.24em]"
              style={{ color: "var(--bd-text-muted)" }}
            >
              {content.eyebrow}
            </p>
            <h1
              className="max-w-[16ch] text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:max-w-[15ch] sm:text-5xl sm:leading-[1.04] sm:tracking-[-0.05em] md:max-w-[12ch] md:text-6xl"
              style={{ color: "var(--bd-text)" }}
            >
              {content.title}
            </h1>
          </div>

          <div
            className="mt-7 h-px w-20 sm:mt-10 sm:w-24"
            style={{
              background:
                "linear-gradient(90deg, var(--bd-accent), var(--bd-blue), transparent)",
              opacity: 0.7,
            }}
          />
        </section>

        <Card
          className="page-enter page-enter-delay-1 backdrop-blur-xl"
          style={{
            background: "var(--bd-glass-bg)",
            border: "1px solid var(--bd-border)",
            color: "var(--bd-text)",
            boxShadow:
              "inset 0 1px 0 var(--bd-surface-overlay), 0 0 0 1px var(--bd-border-glow), 0 32px 90px rgba(0,0,0,0.18)",
          }}
        >
          <CardContent className="relative overflow-hidden p-5 sm:p-7">
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-24"
              style={{
                background:
                  "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 72%)",
              }}
            />
            <div
              className="pointer-events-none absolute -right-20 top-10 h-44 w-44 rounded-full blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,0,255,0.14) 0%, rgba(255,0,255,0.03) 62%, transparent 80%)",
              }}
            />
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-2xl font-semibold tracking-[-0.03em]"
                  style={{ color: "var(--bd-text)" }}
                >
                  {mode === "login" && "Log in"}
                  {mode === "signup" && "Create account"}
                  {mode === "forgot" && "Reset password"}
                  {mode === "reset" && "New password"}
                </h2>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--bd-text-muted)" }}
                >
                  {content.hint}
                </p>
              </div>
            </div>

            {(mode === "signup" || mode === "login") && (
              <div
                className="mb-6 grid grid-cols-2 rounded-[22px] p-1.5"
                style={{
                  border: "1px solid var(--bd-border)",
                  background: "var(--bd-surface-sunken)",
                }}
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
                        background: active
                          ? "linear-gradient(135deg, rgba(161,44,214,0.82), rgba(60,92,219,0.72))"
                          : "transparent",
                        color: active ? "#fff" : "var(--bd-text-muted)",
                        boxShadow: active
                          ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(123,72,255,0.28)"
                          : "none",
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
                    <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                      Full name
                    </span>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                      <Input
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                        style={fieldSurfaceStyle}
                      />
                    </div>
                  </label>

                  <label className="block space-y-2">
                    <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                      Username
                    </span>
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                      <Input
                        type="text"
                        placeholder="Choose a username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                        style={fieldSurfaceStyle}
                      />
                    </div>
                  </label>
                </>
              )}

              {/* ── email field: signup & forgot ── */}
              {(mode === "signup" || mode === "forgot") && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                    Email
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={fieldSurfaceStyle}
                    />
                  </div>
                </label>
              )}

              {mode === "signup" && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                    Phone number
                  </span>
                  <div className="grid grid-cols-[144px_1fr] gap-2">
                    <div className="relative">
                      <select
                        value={phoneCountryIso2}
                        onChange={(e) => setPhoneCountryIso2(e.target.value)}
                        className="h-14 w-full appearance-none rounded-[1.2rem] pl-4 pr-8 text-sm text-[var(--bd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                        style={fieldSurfaceStyle}
                        aria-label="Country code"
                      >
                        {COUNTRY_PHONE_OPTIONS.map((option) => (
                          <option key={`${option.iso2}-${option.dialCode}`} value={option.iso2}>
                            {formatPhoneOptionLabel(option)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={fieldSurfaceStyle}
                    />
                    </div>
                  </div>
                </label>
              )}

              {/* ── username field: login ── */}
              {mode === "login" && (
                <label className="block space-y-2">
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                    Username or email
                  </span>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                    <Input
                      type="text"
                      placeholder="username or you@example.com"
                      autoComplete="username"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      className="h-14 rounded-[1.8rem] pl-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={fieldSurfaceStyle}
                    />
                  </div>
                </label>
              )}

              {/* ── password field: signup, login, reset ── */}
              {(mode === "signup" || mode === "login" || mode === "reset") && (
                <label className="block space-y-2">
                  <span className="flex items-center justify-between pl-1 pr-1">
                    <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
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
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" || mode === "reset" ? "At least 6 characters" : "Enter your password"}
                      autoComplete={mode === "signup" || mode === "reset" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-14 rounded-[1.8rem] px-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={fieldSurfaceStyle}
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
                  <span className="pl-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--bd-text)]">
                    Confirm password
                  </span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--bd-text-faint)]" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-14 rounded-[1.8rem] px-12 text-lg text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] focus-visible:border-[rgba(255,0,255,0.3)] focus-visible:ring-2 focus-visible:ring-[rgba(255,0,255,0.08)]"
                      style={fieldSurfaceStyle}
                    />
                  </div>
                </label>
              )}

              {mode === "signup" && (
                <label
                  className="flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 text-[13px] leading-snug transition-colors"
                  style={{
                    border: `1px solid ${ageConfirmed ? "var(--bd-border-glow)" : "var(--bd-border)"}`,
                    background: ageConfirmed
                      ? "var(--bd-accent-soft)"
                      : "var(--bd-surface-sunken)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#e527e0]"
                    aria-label="Confirm you are 18 or older and agree to terms"
                  />
                  <span style={{ color: "var(--bd-text-muted)" }}>
                    I confirm I am 18 or older and I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--bd-text)" }}>
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--bd-text)" }}>
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              )}

              {(error || notice) && (
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  role="alert"
                  aria-live="polite"
                  style={{
                    border: `1px solid ${error ? "rgba(219,39,119,0.4)" : "rgba(8,145,178,0.4)"}`,
                    background: error
                      ? "var(--bd-pink-glow)"
                      : "var(--bd-cyan-glow)",
                    color: error ? "var(--bd-pink)" : "var(--bd-cyan)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {error ? (
                      <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p>{error || notice}</p>
                      {sessionLoadFailed && (
                        <button
                          type="button"
                          disabled={retryingSession}
                          onClick={async () => {
                            setRetryingSession(true);
                            try {
                              const res = await fetch("/api/auth/me", { cache: "no-store" });
                              if (res.ok) {
                                const me = (await res.json()) as AuthResponse;
                                if (!me.userId) return;
                                setSessionLoadFailed(false);
                                setError("");
                                await refresh();
                                router.replace(me.hasProfile ? "/dashboard" : "/onboarding");
                                router.refresh();
                              }
                            } catch {
                              // leave error in place
                            } finally {
                              setRetryingSession(false);
                            }
                          }}
                          className="mt-2 rounded-lg px-3 py-1.5 text-xs font-semibold underline disabled:opacity-50"
                        >
                          {retryingSession ? "Retrying…" : "Try again"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !canSubmit}
                className="h-12 w-full rounded-2xl border-0 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-100"
                style={{
                  background: canSubmit
                    ? "linear-gradient(135deg, #eb987f 0%, #d8698c 42%, #6d58ff 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
                  color: canSubmit ? "#fff" : "var(--bd-text-faint)",
                  boxShadow: canSubmit
                    ? "inset 0 1px 0 rgba(255,255,255,0.16), 0 16px 34px rgba(153,87,255,0.26)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
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

            <p className="mt-4 text-center text-[11px] text-[var(--bd-text-faint)]">
              <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--bd-text-muted)]">
                Privacy
              </a>
              <span className="mx-2 opacity-50">·</span>
              <a href="/terms" className="underline underline-offset-2 hover:text-[var(--bd-text-muted)]">
                Terms
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
