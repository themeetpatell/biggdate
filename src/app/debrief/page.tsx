"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageResponse } from "@/components/ai-elements/message";

export default function DebriefPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [matchName, setMatchName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");

  useEffect(() => {
    if (!authLoading && !profile) router.push("/onboarding");
  }, [profile, authLoading, router]);

  const handleSubmit = async () => {
    if (!feedback.trim() || !matchName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dates/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchName, matchId: "manual", feedback }),
      });
      const data = await res.json();
      setInsight(data.insight || "");
      setStep("result");
    } catch {
      // silent
    }
    setLoading(false);
  };

  if (authLoading || !profile) return null;

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-gold)", animation: "orb1 15s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-[var(--bd-text-muted)] mb-6"
        >
          ← Dashboard
        </Button>

        {step === "input" ? (
          <div className="page-enter">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>
                📝
              </div>
              <h1 className="text-2xl font-bold mb-2">Post-Date Debrief</h1>
              <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                Tell me about your date. I&apos;ll help you see patterns and grow.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: "var(--bd-text-faint)" }}>
                  Who did you go out with?
                </label>
                <input
                  type="text"
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="Their name..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] text-sm"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: "var(--bd-text-faint)" }}>
                  How did it go? Be honest.
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What happened? How did you feel? What surprised you? What worried you?"
                  className="min-h-[140px] bg-[var(--bd-surface)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] rounded-xl"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !feedback.trim() || !matchName.trim()}
                className="w-full bg-[var(--bd-accent)] text-black font-bold rounded-xl py-5"
              >
                {loading ? "Analyzing your date..." : "Get Insights"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">💡</div>
              <h2 className="text-xl font-bold">Your Debrief with {matchName}</h2>
            </div>

            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-6">
              <CardContent className="p-6">
                <MessageResponse>{insight || ""}</MessageResponse>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => { setStep("input"); setFeedback(""); setMatchName(""); setInsight(null); }}
                variant="outline"
                className="flex-1 rounded-xl border-[var(--bd-border)] text-[var(--bd-text-muted)]"
              >
                Another Debrief
              </Button>
              <Button
                onClick={() => router.push("/companion")}
                className="flex-1 rounded-xl bg-[var(--bd-accent)] text-black font-semibold"
              >
                Talk to Aura
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
