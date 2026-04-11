"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading: authLoading, logout } = useAuth();

  const handleReset = async () => {
    if (confirm("This will log you out. Continue?")) {
      await logout();
    }
  };

  if (authLoading || !profile) {
    if (!authLoading && !profile) router.push("/onboarding");
    return null;
  }

  const zodiacEmoji = profile.zodiac ? ZODIAC_EMOJI[profile.zodiac] || "" : "";

  const details = [
    { label: "Age", value: profile.age },
    { label: "City", value: profile.city },
    { label: "Gender", value: profile.gender },
    { label: "Orientation", value: profile.orientation },
    { label: "Intent", value: profile.intent },
    { label: "Love Language", value: profile.loveLanguage },
    { label: "Attachment", value: `${profile.attachment} (${profile.attachmentScore}/100)` },
    { label: "Drinking", value: profile.drinking },
    { label: "Smoking", value: profile.smoking },
    { label: "Exercise", value: profile.exercise },
    { label: "Has Kids", value: profile.hasKids === null ? "—" : profile.hasKids ? "Yes" : "No" },
    { label: "Wants Kids", value: profile.wantsKids || "—" },
    { label: "Partner Age", value: profile.partnerAgeMin || profile.partnerAgeMax ? `${profile.partnerAgeMin || "?"} – ${profile.partnerAgeMax || "?"}` : "—" },
  ].filter((d) => d.value);

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-rose)", animation: "orb2 18s ease-in-out infinite" }}
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

        {/* Profile header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: "var(--bd-surface)", border: "2px solid var(--bd-accent)" }}>
            {zodiacEmoji || profile.name?.[0]?.toUpperCase() || "?"}
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm" style={{ color: "var(--bd-text-muted)" }}>
            {profile.zodiac && `${profile.zodiac} · `}{profile.city}
          </p>
        </div>

        {/* Summary */}
        <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-4">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed" style={{ color: "var(--bd-text-muted)" }}>
              {profile.summary}
            </p>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="space-y-3 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>Strengths</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(profile.strengths || []).map((s) => (
                <Badge key={s} className="bg-[var(--bd-green)]/15 text-[var(--bd-green)] border-none text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>Values</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(profile.coreValues || []).map((v) => (
                <Badge key={v} className="bg-[var(--bd-accent-soft)] text-[var(--bd-accent)] border-none text-xs">{v}</Badge>
              ))}
            </div>
          </div>
          {profile.dealbreakers?.length > 0 && (
            <div>
              <span className="text-xs uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>Dealbreakers</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {profile.dealbreakers.map((d) => (
                  <Badge key={d} className="bg-[var(--bd-rose)]/15 text-[var(--bd-rose)] border-none text-xs">{d}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] mb-8">
          <CardContent className="p-5 space-y-3">
            {details.map((d, i) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--bd-text-faint)" }}>{d.label}</span>
                  <span>{d.value}</span>
                </div>
                {i < details.length - 1 && <Separator className="mt-3 bg-[var(--bd-border)]" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/onboarding")}
            variant="outline"
            className="w-full rounded-full border-[var(--bd-border)] text-[var(--bd-text-muted)]"
          >
            Redo Soul Discovery
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full rounded-full border-[var(--bd-rose)]/30 text-[var(--bd-rose)] hover:bg-[var(--bd-rose)]/10"
          >
            Reset Everything
          </Button>
        </div>
      </div>
    </div>
  );
}
