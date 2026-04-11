"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageResponse } from "@/components/ai-elements/message";

const QUESTIONS = [
  { id: "chemistry", label: "Chemistry", prompt: "Did you feel chemistry? Tell me what you noticed — moments, feelings, body language, anything." },
  { id: "surprise", label: "Surprise", prompt: "What surprised you — about them or about yourself on this date?" },
  { id: "decision", label: "Decision", prompt: "Would you see them again? Be honest about why or why not." },
];

function DebriefContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, loading: authLoading } = useAuth();
  const [matchName, setMatchName] = useState(searchParams.get("name") || "");
  const [matchId] = useState(searchParams.get("matchId") || "unknown");
  const [step, setStep] = useState<"name" | 0 | 1 | 2 | "result">(matchName ? 0 : "name");
  const [answers, setAnswers] = useState({ chemistry: "", surprise: "", decision: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ insight: string; growthNote: string; nextMatchHint: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !profile) router.push("/onboarding");
  }, [profile, authLoading, router]);

  const currentQ = typeof step === "number" ? QUESTIONS[step] : null;
  const currentAnswer = currentQ ? answers[currentQ.id as keyof typeof answers] : "";

  const handleNext = async () => {
    if (step === "name") { setStep(0); return; }
    if (typeof step === "number") {
      if (step < 2) { setStep((step + 1) as 0 | 1 | 2); return; }
      // Submit
      setLoading(true);
      try {
        const res = await fetch("/api/debrief/structured", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchName, matchId, ...answers }),
        });
        const data = await res.json();
        setResult({ insight: data.aiInsight || data.insight || "", growthNote: data.growthNote || "", nextMatchHint: data.nextMatchHint || "" });
        setStep("result");
      } catch { /* silent */ }
      setLoading(false);
    }
  };

  if (authLoading || !profile) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-gold)", animation: "orb1 15s ease-in-out infinite" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}
          className="text-[var(--bd-text-muted)] mb-6">← Dashboard</Button>

        {step === "name" && (
          <div className="page-enter">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>📝</div>
              <h1 className="text-2xl font-bold mb-2">Post-Date Reflection</h1>
              <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>Three honest questions. Real growth.</p>
            </div>
            <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color: "var(--bd-text-faint)" }}>Who did you go out with?</label>
            <input type="text" value={matchName} onChange={(e) => setMatchName(e.target.value)}
              placeholder="Their name..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] text-sm mb-4" />
            <Button onClick={handleNext} disabled={!matchName.trim()}
              className="w-full bg-[var(--bd-accent)] text-black font-bold rounded-xl py-5">Begin Reflection →</Button>
          </div>
        )}

        {typeof step === "number" && currentQ && (
          <div className="page-enter" key={step}>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {QUESTIONS.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i <= step ? "var(--bd-accent)" : "var(--bd-border)" }} />
              ))}
            </div>
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-accent)" }}>
                Question {step + 1} of 3 · {currentQ.label}
              </div>
              <h2 className="text-xl font-semibold">{currentQ.prompt}</h2>
            </div>
            <Textarea value={currentAnswer}
              onChange={(e) => setAnswers((a) => ({ ...a, [currentQ.id]: e.target.value }))}
              placeholder="Be honest — this is just for you..."
              className="min-h-[140px] bg-[var(--bd-surface)] border-[var(--bd-border)] text-[var(--bd-text)] placeholder:text-[var(--bd-text-faint)] rounded-xl mb-4" />
            <Button onClick={handleNext}
              disabled={loading || currentAnswer.trim().length < 10}
              className="w-full bg-[var(--bd-accent)] text-black font-bold rounded-xl py-5">
              {loading ? "Analyzing..." : step < 2 ? "Next →" : "Get Insights"}
            </Button>
          </div>
        )}

        {step === "result" && result && (
          <div className="page-enter">
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">💡</div>
              <h2 className="text-xl font-bold">Your debrief with {matchName}</h2>
            </div>
            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-4">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--bd-accent)" }}>What This Reveals</h3>
                <MessageResponse>{result.insight}</MessageResponse>
              </CardContent>
            </Card>
            {result.growthNote && (
              <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-4">
                <CardContent className="p-5">
                  <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-gold)" }}>Growth Note</h3>
                  <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>{result.growthNote}</p>
                </CardContent>
              </Card>
            )}
            {result.nextMatchHint && (
              <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-6">
                <CardContent className="p-5">
                  <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-green)" }}>Next Time, Look For</h3>
                  <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>{result.nextMatchHint}</p>
                </CardContent>
              </Card>
            )}
            <div className="flex gap-3">
              <Button onClick={() => { setStep("name"); setMatchName(""); setAnswers({ chemistry: "", surprise: "", decision: "" }); setResult(null); }}
                variant="outline" className="flex-1 rounded-xl border-[var(--bd-border)] text-[var(--bd-text-muted)]">Another Debrief</Button>
              <Button onClick={() => router.push("/companion")}
                className="flex-1 rounded-xl bg-[var(--bd-accent)] text-black font-semibold">Talk to Aura</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DebriefPage() {
  return (
    <Suspense>
      <DebriefContent />
    </Suspense>
  );
}
