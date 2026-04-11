"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Match } from "@/lib/types";

function MatchCard({ match, onPreview }: { match: Match; onPreview: () => void }) {
  return (
    <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] hover:border-[var(--bd-accent)]/30 bd-card-hover overflow-hidden">
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">{match.emoji || "✨"}</span>
            <h3 className="text-lg font-bold">{match.name}</h3>
            <span className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
              {match.age}
            </span>
          </div>
          <p className="text-xs mb-2" style={{ color: "var(--bd-text-muted)" }}>
            {match.profession} · {match.city}
          </p>
          {match.narrativeIntro && (
            <p className="text-sm italic leading-snug" style={{ color: "var(--bd-accent)" }}>
              &ldquo;{match.narrativeIntro}&rdquo;
            </p>
          )}
        </div>

        {/* Compatibility Signals */}
        {match.compatibilitySignals && (
          <div className="space-y-2 mb-4">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>
              Why you connect
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
                  Values
                </Badge>
                <p className="text-xs leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.values}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-rose)]/15 text-[var(--bd-rose)] border-none">
                  Communication
                </Badge>
                <p className="text-xs leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.communication}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="text-[10px] shrink-0 bg-[var(--bd-gold)]/15 text-[var(--bd-gold)] border-none">
                  Life Direction
                </Badge>
                <p className="text-xs leading-snug" style={{ color: "var(--bd-text-muted)" }}>
                  {match.compatibilitySignals.lifeDirection}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Friction Point */}
        {match.frictionPoint && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-xl mb-4"
            style={{ background: "rgba(255,107,138,0.07)", border: "1px solid rgba(255,107,138,0.15)" }}
          >
            <span className="text-[10px] uppercase tracking-wider shrink-0 pt-0.5" style={{ color: "var(--bd-rose)" }}>
              Worth knowing
            </span>
            <p className="text-xs leading-snug" style={{ color: "var(--bd-text-muted)" }}>
              {match.frictionPoint}
            </p>
          </div>
        )}

        {/* Opening Question */}
        {match.openingQuestion && (
          <div
            className="px-3 py-2 rounded-xl mb-4"
            style={{ background: "rgba(180,140,255,0.06)", border: "1px solid rgba(180,140,255,0.15)" }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--bd-accent)" }}>
              If you connect, you&apos;ll both answer:
            </p>
            <p className="text-xs italic leading-snug" style={{ color: "var(--bd-text-muted)" }}>
              &ldquo;{match.openingQuestion}&rdquo;
            </p>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={onPreview}
          className="w-full bg-[var(--bd-accent)] text-black font-semibold rounded-xl"
        >
          🔮 See Life Preview
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MatchesPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/matches/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMatches(data);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/onboarding");
      return;
    }
    let cancelled = false;

    fetch("/api/matches/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setMatches(data);
        }
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile, authLoading, router]);

  if (authLoading || !profile) return null;

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Your Matches</h1>
            <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
              Tap any match to see your Life Preview
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-[var(--bd-text-muted)]"
          >
            ← Back
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-8 h-8 rounded-full animate-pulse mb-4"
              style={{ background: "var(--bd-accent)" }}
            />
            <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
              Your AI agent is finding compatible souls...
            </p>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onPreview={() => router.push(`/matches/${match.id}/preview`)}
              />
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <Button
            onClick={() => generateMatches()}
            disabled={loading}
            variant="outline"
            className="w-full mt-6 rounded-full border-[var(--bd-border)] text-[var(--bd-text-muted)]"
          >
            {loading ? "Finding matches..." : "Refresh Matches"}
          </Button>
        )}
      </div>
    </div>
  );
}
