"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { getZodiacCompat, ZODIAC_EMOJI } from "@/lib/zodiac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile, Match } from "@/lib/types";

function MatchCard({ match, profile, onPreview }: { match: Match; profile: Profile; onPreview: () => void }) {
  const compat = profile.zodiac && match.zodiac
    ? getZodiacCompat(profile.zodiac, match.zodiac)
    : null;

  return (
    <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] hover:border-[var(--bd-accent)]/30 bd-card-hover overflow-hidden">
      <CardContent className="p-5">
        <div className="mb-3">
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

        {/* Zodiac & Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {match.zodiac && (
            <Badge
              className="text-[10px] border-none"
              style={{
                background: compat ? `${compat.color}20` : "var(--bd-accent-soft)",
                color: compat?.color || "var(--bd-accent)",
              }}
            >
              {ZODIAC_EMOJI[match.zodiac] || ""} {match.zodiac} · {compat?.label || "Unknown"}
            </Badge>
          )}
          <Badge className="text-[10px] bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
            {match.attachment}
          </Badge>
          <Badge className="text-[10px] bg-[var(--bd-rose)]/15 text-[var(--bd-rose)] border-none">
            {match.loveLanguage}
          </Badge>
        </div>

        {/* Why they work */}
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--bd-text-muted)" }}>
          {match.whyTheyWork}
        </p>

        {/* Shared values */}
        <div className="flex gap-1.5 mb-4">
          {(match.sharedValues || []).map((v: string) => (
            <Badge key={v} variant="outline" className="text-[10px] border-[var(--bd-border)] text-[var(--bd-text-faint)]">
              {v}
            </Badge>
          ))}
        </div>

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      router.push("/onboarding");
      return;
    }
    generateMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, authLoading, router]);

  const generateMatches = async () => {
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
  };

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
                profile={profile}
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
