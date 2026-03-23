"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageResponse } from "@/components/ai-elements/message";
import type { Profile } from "@/lib/types";

function ReadinessRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 70
      ? "var(--bd-green)"
      : score >= 40
        ? "var(--bd-gold)"
        : "var(--bd-rose)";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bd-border)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--bd-text-muted)" }}>
          Readiness
        </span>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [plan, setPlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/onboarding");
    }
  }, [profile, authLoading, router]);

  const fetchPlan = async () => {
    if (!profile || loadingPlan) return;
    setLoadingPlan(true);
    try {
      const res = await fetch("/api/coach/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setPlan(data.plan);
    } catch {
      // silent
    }
    setLoadingPlan(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: "var(--bd-accent)" }} />
      </div>
    );
  }

  const zodiacEmoji = profile.zodiac ? ZODIAC_EMOJI[profile.zodiac] || "" : "";

  return (
    <div className="relative min-h-screen">
      {/* Orb */}
      <div
        className="pointer-events-none fixed top-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>
            {zodiacEmoji || "🧠"}
          </div>
          <h1 className="text-3xl font-bold mb-1">{profile.name}&apos;s Soul Profile</h1>
          <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
            {profile.zodiac && `${profile.zodiac} · `}
            {profile.city && `${profile.city} · `}
            {profile.attachment} Attachment
          </p>
        </div>

        {/* Readiness */}
        <ReadinessRing score={profile.readinessScore || 0} />

        {/* Summary */}
        <div
          className="mt-8 rounded-2xl p-6 border"
          style={{ background: "var(--bd-surface)", borderColor: "var(--bd-border)" }}
        >
          <MessageResponse>{profile.summary || "Your soul profile is being crafted..."}</MessageResponse>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="strengths" className="mt-8">
          <TabsList className="grid grid-cols-4 bg-[var(--bd-surface)]">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {(profile.strengths || []).map((s) => (
                <Badge key={s} className="bg-[var(--bd-green)]/15 text-[var(--bd-green)] border-none">
                  {s}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="growth" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {(profile.growthAreas || []).map((g) => (
                <Badge key={g} className="bg-[var(--bd-gold)]/15 text-[var(--bd-gold)] border-none">
                  {g}
                </Badge>
              ))}
            </div>
            {profile.coachingFocus && (
              <p className="mt-4 text-sm" style={{ color: "var(--bd-text-muted)" }}>
                <strong>Focus:</strong> {profile.coachingFocus}
              </p>
            )}
          </TabsContent>

          <TabsContent value="values" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {(profile.coreValues || []).map((v) => (
                <Badge key={v} className="bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
                  {v}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-2 text-sm" style={{ color: "var(--bd-text-muted)" }}>
            {profile.attachment && <p><strong>Attachment:</strong> {profile.attachment} ({profile.attachmentScore}/100)</p>}
            {profile.loveLanguage && <p><strong>Love Language:</strong> {profile.loveLanguage}</p>}
            {profile.intent && <p><strong>Intent:</strong> {profile.intent}</p>}
            {profile.dealbreakers?.length > 0 && (
              <p><strong>Dealbreakers:</strong> {profile.dealbreakers.join(", ")}</p>
            )}
          </TabsContent>
        </Tabs>

        {/* 30-day plan */}
        <div className="mt-8">
          {!plan ? (
            <Button
              onClick={fetchPlan}
              disabled={loadingPlan}
              className="w-full bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)] hover:border-[var(--bd-accent)]/40 rounded-xl"
            >
              {loadingPlan ? "Generating your plan..." : "Generate 30-Day Growth Plan"}
            </Button>
          ) : (
            <div
              className="rounded-2xl p-6 border"
              style={{ background: "var(--bd-surface)", borderColor: "var(--bd-border)" }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--bd-accent)" }}>
                Your 30-Day Plan
              </h3>
              <MessageResponse>{plan}</MessageResponse>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col gap-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-[var(--bd-accent)] text-black font-bold rounded-full py-6 text-base"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/matches")}
            variant="outline"
            className="rounded-full py-6 border-[var(--bd-border)] text-[var(--bd-text-muted)]"
          >
            See Life Previews
          </Button>
        </div>
      </div>
    </div>
  );
}
