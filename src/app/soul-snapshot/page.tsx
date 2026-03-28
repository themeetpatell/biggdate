"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ATTACHMENT_DESC: Record<string, string> = {
  Secure: "You approach love with openness and consistency.",
  Anxious: "You love deeply and crave closeness — learning to trust the process.",
  Avoidant: "You value independence, working toward deeper vulnerability.",
  "Fearful-Avoidant": "You want deep connection while navigating fear — your growth edge.",
};

function ReadinessRing({ score }: { score: number }) {
  const r = 36, circ = 2 * Math.PI * r;
  const color = score >= 70 ? "var(--bd-green)" : score >= 45 ? "var(--bd-gold)" : "var(--bd-rose)";
  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--bd-border)" strokeWidth="5" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
          className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
        <span className="text-[8px] uppercase" style={{ color: "var(--bd-text-faint)" }}>Ready</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)]">
      <CardContent className="p-5">
        <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--bd-text-faint)" }}>{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

export default function SoulSnapshotPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !profile) router.push("/onboarding");
  }, [profile, loading, router]);

  if (loading || !profile) return null;

  const intentLabel: Record<string, string> = {
    serious: "Serious relationship",
    casual: "Casual dating",
    marriage: "Marriage-minded",
    exploring: "Open to exploring",
  };

  return (
    <div className="relative min-h-screen pb-32">
      <div className="pointer-events-none fixed top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 page-enter">
          <div className="text-4xl mb-3" style={{ animation: "float 3s ease-in-out infinite" }}>🪞</div>
          <h1 className="text-2xl font-bold mb-2">Here&apos;s what I learned about you</h1>
          <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
            This is your soul profile. We use it to find your matches and coach you.
          </p>
        </div>

        <div className="space-y-4 stagger-children">
          {/* Identity */}
          <Section title="You">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: "var(--bd-accent-soft)", color: "var(--bd-accent)" }}>
                {profile.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                  {[profile.age && `${profile.age}`, profile.city, profile.zodiac].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="ml-auto">
                <ReadinessRing score={profile.readinessScore || 50} />
              </div>
            </div>
          </Section>

          {/* Attachment */}
          <Section title="Attachment Style">
            <div className="flex items-start gap-3">
              <Badge className="shrink-0 text-xs bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">
                {profile.attachment}
              </Badge>
              <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
                {ATTACHMENT_DESC[profile.attachment] || ""}
              </p>
            </div>
            {profile.loveLanguage && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--bd-text-faint)" }}>Love language:</span>
                <Badge className="text-xs bg-[var(--bd-rose)]/15 text-[var(--bd-rose)] border-none">{profile.loveLanguage}</Badge>
              </div>
            )}
          </Section>

          {/* What they want */}
          <Section title="What You&apos;re Looking For">
            <div className="flex flex-wrap gap-2">
              {profile.intent && <Badge className="text-xs bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)]">{intentLabel[profile.intent] || profile.intent}</Badge>}
              {profile.wantsKids && <Badge className="text-xs bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)]">Kids: {profile.wantsKids}</Badge>}
              {(profile.partnerAgeMin || profile.partnerAgeMax) && (
                <Badge className="text-xs bg-[var(--bd-surface)] border border-[var(--bd-border)] text-[var(--bd-text)]">
                  Ages {profile.partnerAgeMin || "any"}–{profile.partnerAgeMax || "any"}
                </Badge>
              )}
            </div>
          </Section>

          {/* Values */}
          {(profile.coreValues || []).length > 0 && (
            <Section title="Your Core Values">
              <div className="flex flex-wrap gap-2">
                {(profile.coreValues || []).map((v) => (
                  <Badge key={v} className="text-xs bg-[var(--bd-green)]/15 text-[var(--bd-green)] border-none">{v}</Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Strengths + Growth */}
          {((profile.strengths || []).length > 0 || (profile.growthAreas || []).length > 0) && (
            <Section title="Your Profile">
              {(profile.strengths || []).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs mb-1.5" style={{ color: "var(--bd-text-faint)" }}>Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.strengths || []).map((s) => <Badge key={s} className="text-[10px] bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none">{s}</Badge>)}
                  </div>
                </div>
              )}
              {(profile.growthAreas || []).length > 0 && (
                <div>
                  <p className="text-xs mb-1.5" style={{ color: "var(--bd-text-faint)" }}>Growth areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.growthAreas || []).map((g) => <Badge key={g} variant="outline" className="text-[10px] border-[var(--bd-border)] text-[var(--bd-text-faint)]">{g}</Badge>)}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* L3 depth dimensions */}
          {(profile.conflictStyle || profile.familyExpectations || profile.lifeArchitecture) && (
            <Section title="How You Love & Live">
              <div className="space-y-3">
                {profile.conflictStyle && (
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--bd-text-faint)" }}>Conflict style</p>
                    <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>{profile.conflictStyle}</p>
                  </div>
                )}
                {profile.familyExpectations && (
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--bd-text-faint)" }}>Family & approval</p>
                    <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>{profile.familyExpectations}</p>
                  </div>
                )}
                {profile.lifeArchitecture && (
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: "var(--bd-text-faint)" }}>Life in 3 years</p>
                    <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>{profile.lifeArchitecture}</p>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t px-6 py-4"
        style={{ background: "var(--bd-bg)", borderColor: "var(--bd-border)" }}>
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button onClick={() => router.push("/onboarding")} variant="outline"
            className="flex-1 rounded-full border-[var(--bd-border)] text-[var(--bd-text-muted)] text-sm">
            Something&apos;s off
          </Button>
          <Button onClick={() => router.push("/report")}
            className="flex-2 bg-[var(--bd-accent)] text-black font-bold rounded-full px-8">
            This is me →
          </Button>
        </div>
      </div>
    </div>
  );
}
