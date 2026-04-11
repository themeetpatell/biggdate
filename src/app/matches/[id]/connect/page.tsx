"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@/lib/types";

interface Venue { name: string; why: string; vibe: string; }

export default function ConnectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingIce, setLoadingIce] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venueVisible, setVenueVisible] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    // Load today's matches from cache
    fetch("/api/matches").then((r) => r.json()).then((matches: Match[]) => {
      const m = Array.isArray(matches) ? matches.find((x) => x.id === id) : null;
      if (!m) { router.push("/matches"); return; }
      setMatch(m);

      // Generate icebreakers
      fetch("/api/intros/icebreakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match: m, introId: null }),
      })
        .then((r) => r.json())
        .then((d) => { setIcebreakers(d.icebreakers || []); setLoadingIce(false); })
        .catch(() => setLoadingIce(false));
    }).catch(() => setLoadingIce(false));
  }, [id, profile, authLoading, router]);

  const loadVenues = () => {
    if (!match) return;
    setVenueVisible(true);
    setLoadingVenues(true);
    fetch("/api/dates/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match }),
    })
      .then((r) => r.json())
      .then((d) => { setVenues(d.venues || []); setLoadingVenues(false); })
      .catch(() => setLoadingVenues(false));
  };

  const copyIcebreaker = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  if (authLoading || !profile) return null;

  return (
    <div className="relative min-h-screen pb-24">
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/matches")}
          className="text-[var(--bd-text-muted)] mb-6">← Matches</Button>

        {match && (
          <>
            {/* Match header */}
            <div className="text-center mb-8 page-enter">
              <div className="text-4xl mb-3">{match.emoji || "✨"}</div>
              <h1 className="text-2xl font-bold mb-1">You & {match.name}</h1>
              <p className="text-sm italic px-6" style={{ color: "var(--bd-accent)" }}>
                &ldquo;{match.narrativeIntro}&rdquo;
              </p>
              {match.connectionHook && (
                <p className="text-xs mt-2 px-4" style={{ color: "var(--bd-text-muted)" }}>{match.connectionHook}</p>
              )}
            </div>

            {/* Icebreakers */}
            <div className="mb-6">
              <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--bd-text-faint)" }}>
                💬 Your Conversation Starters
              </h2>
              {loadingIce ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--bd-surface)" }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {icebreakers.map((ice, i) => (
                    <Card key={i} className="bg-[var(--bd-surface)] border-[var(--bd-border)] cursor-pointer hover:border-[var(--bd-accent)]/40 transition-colors"
                      onClick={() => copyIcebreaker(ice, i)}>
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <p className="text-sm flex-1" style={{ color: "var(--bd-text)" }}>{ice}</p>
                        <span className="text-xs shrink-0" style={{ color: "var(--bd-text-faint)" }}>
                          {copied === i ? "Copied ✓" : "Copy"}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Move-offline nudge */}
            <Card className="mb-6 border-[var(--bd-gold)]/30" style={{ background: "rgba(245,200,66,0.05)" }}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--bd-gold)" }}>Ready to meet?</p>
                    <p className="text-xs mb-3" style={{ color: "var(--bd-text-muted)" }}>
                      Great conversations go further in person. When you feel the moment is right, suggest a date.
                    </p>
                    {!venueVisible && (
                      <Button size="sm" onClick={loadVenues}
                        className="bg-[var(--bd-gold)] text-black font-semibold rounded-lg text-xs">
                        Get Date Ideas
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date concierge venues */}
            {venueVisible && (
              <div className="mb-6 page-enter">
                <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--bd-text-faint)" }}>
                  📍 Date Ideas For You Two
                </h2>
                {loadingVenues ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--bd-surface)" }} />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {venues.map((v, i) => (
                      <Card key={i} className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold mb-0.5">{v.name}</p>
                              <p className="text-xs" style={{ color: "var(--bd-text-muted)" }}>{v.why}</p>
                            </div>
                            <Badge className="text-[10px] border-none shrink-0 bg-[var(--bd-accent-soft)] text-[var(--bd-accent)]">{v.vibe}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Post-date CTA */}
            <Card className="border-[var(--bd-border)]" style={{ background: "var(--bd-surface)" }}>
              <CardContent className="p-5 text-center">
                <p className="text-sm mb-3" style={{ color: "var(--bd-text-muted)" }}>After your date, come back and reflect.</p>
                <Button onClick={() => router.push(`/debrief?name=${encodeURIComponent(match.name)}&matchId=${match.id}`)}
                  variant="outline" className="rounded-xl border-[var(--bd-border)] text-[var(--bd-text-muted)]">
                  Post-Date Debrief
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {!match && !loadingIce && (
          <div className="text-center py-20">
            <p style={{ color: "var(--bd-text-muted)" }}>Match not found.</p>
            <Button onClick={() => router.push("/matches")} className="mt-4">Back to Matches</Button>
          </div>
        )}
      </div>
    </div>
  );
}
