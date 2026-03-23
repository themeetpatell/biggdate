"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ReadinessRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "var(--bd-green)" : score >= 40 ? "var(--bd-gold)" : "var(--bd-rose)";

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bd-border)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [intention, setIntention] = useState<string>("");

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.push("/onboarding");
      return;
    }

    // Fetch daily intention
    fetch("/api/companion/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((d) => setIntention(d.intention || ""))
      .catch(() => {});
  }, [profile, loading, router]);

  if (loading || !profile) return null;

  const actions = [
    {
      icon: "🔮",
      title: "Life Previews",
      desc: "See your future with someone",
      href: "/matches",
      color: "var(--bd-accent)",
    },
    {
      icon: "✨",
      title: "Aura",
      desc: "Your AI companion",
      href: "/companion",
      color: "var(--bd-accent)",
    },
    {
      icon: "📝",
      title: "Debrief",
      desc: "Post-date insights",
      href: "/debrief",
      color: "var(--bd-gold)",
    },
    {
      icon: "🪞",
      title: "Soul Card",
      desc: "Share your soul profile",
      href: "/soul-card",
      color: "var(--bd-rose)",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "var(--bd-accent)", animation: "orb1 15s ease-in-out infinite" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <h1 className="text-2xl font-bold">Hey, {profile.name}</h1>
            <p className="text-sm mt-1" style={{ color: "var(--bd-text-muted)" }}>
              {profile.attachment} · {profile.zodiac || "Unknown sign"}
            </p>
          </div>
          <ReadinessRing score={profile.readinessScore || 0} />
        </div>

        {/* Daily intention */}
        {intention && (
          <div
            className="rounded-2xl p-5 mb-6 border"
            style={{
              background: "linear-gradient(135deg, var(--bd-surface), rgba(180,140,255,0.05))",
              borderColor: "var(--bd-border-glow)",
            }}
          >
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--bd-accent)" }}>
              Today&apos;s Intention
            </div>
            <p className="text-sm leading-relaxed">{intention}</p>
          </div>
        )}

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3 mb-8 stagger-children">
          {actions.map((a) => (
            <Link key={a.title} href={a.href}>
              <Card className="bg-[var(--bd-surface)] border-[var(--bd-border)] hover:border-[var(--bd-accent)]/30 bd-card-hover cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="text-sm font-semibold mb-1">{a.title}</div>
                  <div className="text-xs" style={{ color: "var(--bd-text-muted)" }}>
                    {a.desc}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Growth snapshot */}
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "var(--bd-surface)", borderColor: "var(--bd-border)" }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--bd-text-faint)" }}>
            Growth Snapshot
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold" style={{ color: "var(--bd-accent)" }}>
                {profile.readinessScore || 0}
              </div>
              <div className="text-[10px] uppercase" style={{ color: "var(--bd-text-faint)" }}>Readiness</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: "var(--bd-green)" }}>
                {profile.strengths?.length || 0}
              </div>
              <div className="text-[10px] uppercase" style={{ color: "var(--bd-text-faint)" }}>Strengths</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: "var(--bd-gold)" }}>
                {profile.growthAreas?.length || 0}
              </div>
              <div className="text-[10px] uppercase" style={{ color: "var(--bd-text-faint)" }}>Growth Areas</div>
            </div>
          </div>
        </div>

        {/* Aura companion widget */}
        <div
          className="mt-6 rounded-2xl p-5 border cursor-pointer bd-card-hover"
          style={{
            background: "linear-gradient(135deg, var(--bd-surface), rgba(180,140,255,0.03))",
            borderColor: "var(--bd-border-glow)",
          }}
          onClick={() => router.push("/companion")}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: "linear-gradient(135deg, var(--bd-accent), var(--bd-rose))" }}
            >
              ✨
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">Talk to Aura</div>
              <p className="text-xs truncate" style={{ color: "var(--bd-text-muted)" }}>
                Your AI companion knows your soul. Ask anything.
              </p>
            </div>
            <span className="text-xs" style={{ color: "var(--bd-accent)" }}>→</span>
          </div>
        </div>

        {/* Quick CTA */}
        <Button
          onClick={() => router.push("/matches")}
          className="w-full mt-4 bg-[var(--bd-accent)] text-black font-bold rounded-full py-6 text-base"
        >
          See Your Life Previews
        </Button>
      </div>
    </div>
  );
}
