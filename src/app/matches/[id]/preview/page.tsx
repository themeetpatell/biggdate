"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageResponse } from "@/components/ai-elements/message";
import type { Match, LifePreview } from "@/lib/types";

function GrowthScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "var(--bd-green)" : score >= 50 ? "var(--bd-gold)" : "var(--bd-accent)";

  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--bd-border)" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
        <span className="text-[8px] uppercase" style={{ color: "var(--bd-text-faint)" }}>Growth</span>
      </div>
    </div>
  );
}

export default function LifePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [preview, setPreview] = useState<LifePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [introSent, setIntroSent] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    // Load cached matches, then fetch life preview
    fetch("/api/matches")
      .then((r) => r.json())
      .then((matches: Match[]) => {
        const m = Array.isArray(matches) ? matches.find((x) => x.id === id) : null;
        if (!m) { router.push("/matches"); return; }
        setMatch(m);

        // Fetch life preview
        return fetch("/api/life-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ match: m }),
        });
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data) setPreview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, profile, authLoading, router]);

  const requestIntro = async () => {
    if (!match || !profile || requesting) return;
    setRequesting(true);
    try {
      await fetch("/api/intros/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          matchName: match.name,
          userName: profile.name,
        }),
      });
      setIntroSent(true);
    } catch {
      // silent
    }
    setRequesting(false);
  };

  const passMatch = async () => {
    if (!match) return;
    await fetch("/api/intros/pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id, matchName: match.name }),
    });
    router.push("/matches");
  };

  if (loading || !profile || !match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        {/* Cinematic loading */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--bd-accent), var(--bd-rose))",
              animation: "spin-slow 3s linear infinite",
              opacity: 0.5,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--bd-bg)", margin: "4px" }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-3xl"
            style={{ animation: "float 2s ease-in-out infinite" }}
          >
            🔮
          </div>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid var(--bd-accent)",
              animation: "pulseRing 2s ease-out infinite",
            }}
          />
        </div>
        <div className="text-center page-enter page-enter-delay-1">
          <p className="text-base font-semibold mb-1">
            Generating your Life Preview...
          </p>
          <p className="text-xs max-w-xs" style={{ color: "var(--bd-text-faint)" }}>
            Our AI is imagining what your future could look like together, based on both your soul profiles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32">
      {/* Background */}
      <div
        className="pointer-events-none fixed top-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/matches")}
          className="text-[var(--bd-text-muted)] mb-6"
        >
          ← Back to matches
        </Button>

        {/* Header */}
        <div className="text-center mb-8 page-enter">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">{match.emoji || "✨"}</span>
            <h1 className="text-3xl font-bold">Life with {match.name}</h1>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
            <Badge className="text-xs bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
              {match.intentAlignment} Intent Alignment
            </Badge>
          </div>
          {match.narrativeIntro && (
            <p className="text-sm italic px-4" style={{ color: "var(--bd-text-muted)" }}>
              &ldquo;{match.narrativeIntro}&rdquo;
            </p>
          )}
        </div>

        {/* Compatibility Signals */}
        {match.compatibilitySignals && (
          <div
            className="rounded-2xl p-5 mb-6 page-enter page-enter-delay-1"
            style={{ background: "var(--bd-surface)", border: "1px solid var(--bd-border)" }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "var(--bd-text-faint)" }}>
              Why you connect
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
                  Values
                </Badge>
                <p className="text-sm leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.values}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-rose)]/15 text-[var(--bd-rose)] border-none">
                  Communication
                </Badge>
                <p className="text-sm leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.communication}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-gold)]/15 text-[var(--bd-gold)] border-none">
                  Life Direction
                </Badge>
                <p className="text-sm leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.lifeDirection}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Friction Point */}
        {match.frictionPoint && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-2xl mb-6 page-enter page-enter-delay-1"
            style={{ background: "rgba(255,107,138,0.07)", border: "1px solid rgba(255,107,138,0.2)" }}
          >
            <span className="text-[10px] uppercase tracking-wider shrink-0 pt-0.5" style={{ color: "var(--bd-rose)" }}>
              Worth knowing
            </span>
            <p className="text-sm leading-snug" style={{ color: "var(--bd-text-muted)" }}>
              {match.frictionPoint}
            </p>
          </div>
        )}

        {/* Opening Question */}
        {match.openingQuestion && (
          <div
            className="px-4 py-3 rounded-2xl mb-6 page-enter page-enter-delay-2"
            style={{ background: "rgba(180,140,255,0.06)", border: "1px solid rgba(180,140,255,0.2)" }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--bd-accent)" }}>
              If you connect, you&apos;ll both answer:
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: "var(--bd-text-muted)" }}>
              &ldquo;{match.openingQuestion}&rdquo;
            </p>
          </div>
        )}

        {/* Growth Score */}
        {preview?.growthScore && (
          <div className="flex justify-center mb-6">
            <GrowthScoreRing score={preview.growthScore} />
          </div>
        )}

        {/* Transformation note */}
        {preview?.transformationNote && (
          <div
            className="text-center px-6 py-4 mb-8 rounded-2xl border page-enter page-enter-delay-2"
            style={{
              background: "linear-gradient(135deg, var(--bd-surface), rgba(180,140,255,0.05))",
              borderColor: "var(--bd-border-glow)",
            }}
          >
            <p className="text-sm italic" style={{ color: "var(--bd-accent)" }}>
              &ldquo;{preview.transformationNote}&rdquo;
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="story" className="mb-8">
          <TabsList className="grid grid-cols-4 bg-[var(--bd-surface)]">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="day">A Tuesday</TabsTrigger>
            <TabsTrigger value="map">Compatibility</TabsTrigger>
            <TabsTrigger value="truth">Hard Truth</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-4">
            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--bd-accent)" }}>
                  Your First Year Together
                </h3>
                <MessageResponse>{preview?.storyArc || "Generating story..."}</MessageResponse>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="day" className="mt-4">
            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--bd-gold)" }}>
                  An Ordinary Tuesday
                </h3>
                <MessageResponse>{preview?.dayInTheLife || "Generating day..."}</MessageResponse>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="mt-4">
            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-green)" }}>
                    Shared Values
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(preview?.compatibilityMap?.valuesOverlap || []).map((v) => (
                      <Badge key={v} className="bg-[var(--bd-green)]/15 text-[var(--bd-green)] border-none text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-accent)" }}>
                    Communication Fit
                  </h4>
                  <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                    {preview?.compatibilityMap?.communicationFit}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-rose)" }}>
                    How You&apos;d Fight
                  </h4>
                  <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                    {preview?.compatibilityMap?.conflictStyle}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-gold)" }}>
                    Growth Together
                  </h4>
                  <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                    {preview?.compatibilityMap?.growthTrajectory}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="truth" className="mt-4">
            <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
              <CardContent className="p-6">
                <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--bd-rose)" }}>
                  The Honest Truth
                </h3>
                <MessageResponse>{preview?.hardTruth || "Generating truth..."}</MessageResponse>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t px-6 py-4" style={{ background: "var(--bd-bg)", borderColor: "var(--bd-border)" }}>
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button
              onClick={passMatch}
              variant="outline"
              className="flex-1 rounded-full border-[var(--bd-border)] text-[var(--bd-text-muted)]"
            >
              Pass
            </Button>
            {introSent ? (
              <Button disabled className="flex-1 rounded-full bg-[var(--bd-green)] text-black font-bold">
                Intro Sent ✓
              </Button>
            ) : (
              <Button
                onClick={requestIntro}
                disabled={requesting}
                className="flex-1 rounded-full bg-[var(--bd-accent)] text-black font-bold"
              >
                {requesting ? "Sending..." : "I Want This Life 💜"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
