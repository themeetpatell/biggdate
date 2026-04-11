"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Check if user has a profile
      const meRes = await fetch("/api/auth/me");
      const me = await meRes.json();

      if (me.hasProfile) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Orbs */}
      <div
        className="pointer-events-none fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />

      <div className="relative z-10 w-full max-w-sm page-enter">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--bd-accent)" }}>
            BiggDate
          </h1>
          <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
            {mode === "signup"
              ? "Create your account to discover your soul"
              : "Welcome back. Your soul profile awaits."}
          </p>
        </div>

        <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[var(--bd-bg)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)]"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-[var(--bd-bg)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)]"
                />
              </div>

              {error && (
                <p className="text-xs text-center" style={{ color: "var(--bd-rose)" }}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--bd-accent)] text-black font-bold rounded-xl py-5"
              >
                {loading
                  ? "..."
                  : mode === "signup"
                    ? "Create Account"
                    : "Log In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setError("");
                }}
                className="text-xs hover:underline"
                style={{ color: "var(--bd-text-muted)" }}
              >
                {mode === "signup"
                  ? "Already have an account? Log in"
                  : "New here? Create an account"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
