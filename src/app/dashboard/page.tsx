"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { Match } from "@/lib/types";

// ── Sealed match card ────────────────────────────────────────────────────────

function SealedCard({
  match,
  index,
  total,
  revealed,
  onReveal,
  onIntention,
}: {
  match: Match;
  index: number;
  total: number;
  revealed: boolean;
  onReveal: () => void;
  onIntention: () => void;
}) {
  // Stack offsets so cards fan behind the front card
  const isFront = index === total - 1;
  const offset = (total - 1 - index) * 6; // px behind
  const rotate = (index - Math.floor(total / 2)) * 3; // deg tilt

  return (
    <div
      onClick={!revealed ? onReveal : undefined}
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateY(${offset}px) rotate(${rotate}deg) scale(${1 - (total - 1 - index) * 0.03})`,
        zIndex: index,
        cursor: revealed ? "default" : "pointer",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          border: revealed
            ? "1px solid rgba(212,104,138,0.25)"
            : "1px solid rgba(255,255,255,0.08)",
          background: revealed
            ? "linear-gradient(145deg, rgba(24,18,30,0.97), rgba(18,14,24,0.99))"
            : "linear-gradient(145deg, rgba(20,16,28,0.97), rgba(14,12,20,0.99))",
          boxShadow: isFront
            ? "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 8px 20px rgba(0,0,0,0.4)",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {!revealed ? (
          /* Sealed state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            {/* Lock orb */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(212,104,138,0.08)",
                border: "1px solid rgba(212,104,138,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🔒
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                Soul Match #{index + 1}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>
                Tap to reveal who Maahi
                <br />found for you today
              </p>
            </div>
            {/* Compatibility orb */}
            <div
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(79,255,176,0.06)",
                border: "1px solid rgba(79,255,176,0.15)",
                fontSize: 12,
                color: "#4FFFB0",
                fontWeight: 600,
              }}
            >
              {(match as unknown as { harmonyScore?: number }).harmonyScore || Math.floor(78 + Math.random() * 15)}% harmony
            </div>
          </div>
        ) : (
          /* Revealed state — soul summary only, no photo */
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name + meta */}
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
                {match.name}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                {[match.age, match.profession, match.city].filter(Boolean).join(" · ")}
              </p>
            </div>

            {match.narrativeIntro && (
              <p
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: "rgba(212,104,138,0.9)",
                  lineHeight: 1.6,
                  margin: 0,
                  paddingLeft: 12,
                  borderLeft: "2px solid rgba(212,104,138,0.3)",
                }}
              >
                &ldquo;{match.narrativeIntro}&rdquo;
              </p>
            )}

            {/* Why you connect */}
            {match.compatibilitySignals && (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.3)",
                    margin: "0 0 10px",
                  }}
                >
                  Why you connect
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Values", value: match.compatibilitySignals.values, color: "#4FFFB0" },
                    { label: "Communication", value: match.compatibilitySignals.communication, color: "#d4688a" },
                    { label: "Life Direction", value: match.compatibilitySignals.lifeDirection, color: "#F5C842" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 999,
                          background: `${color}12`,
                          color,
                          border: `1px solid ${color}28`,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {label}
                      </span>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intention button */}
            <button
              onClick={(e) => { e.stopPropagation(); onIntention(); }}
              style={{
                padding: "13px 0",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 700,
                color: "#0A0A0F",
                background: "linear-gradient(135deg, #e8927c, #d4688a)",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Send intention ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [intention, setIntention] = useState<string>("");
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!profile) { router.push("/onboarding"); return; }

    // Fetch matches
    fetch("/api/matches/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setMatches(d.slice(0, 3)); })
      .catch(() => {})
      .finally(() => setMatchLoading(false));

    // Fetch daily intention from Maahi
    fetch("/api/companion/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((d) => setIntention(d.intention || ""))
      .catch(() => {});
  }, [profile, loading, router]);

  const handleIntention = useCallback((match: Match) => {
    router.push(`/matches/${match.id}/preview`);
  }, [router]);

  if (loading || !profile) return null;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-10%",
          right: "-15%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "#d4688a",
          opacity: 0.07,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "15%",
          left: "-12%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "#B48CFF",
          opacity: 0.06,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 520,
          margin: "0 auto",
          padding: "48px 20px 0",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.3)",
              margin: "0 0 6px",
            }}
          >
            {todayLabel}
          </p>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Hey, {profile.name} ✨
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              margin: "6px 0 0",
            }}
          >
            Maahi found {matches.length || "your"} connection{matches.length !== 1 ? "s" : ""} today
          </p>
        </div>

        {/* Daily ritual — match card stack */}
        <div style={{ marginBottom: 40 }}>
          {matchLoading ? (
            <div
              style={{
                height: 340,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid rgba(212,104,138,0.3)",
                  borderTopColor: "#d4688a",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
                Maahi is finding your matches…
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div
              style={{
                height: 280,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                textAlign: "center",
                padding: "0 24px",
              }}
            >
              <span style={{ fontSize: 36 }}>🌙</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>
                Come back tomorrow
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.5 }}>
                Your daily ritual refreshes at midnight.
                <br />Good things are worth waiting for.
              </p>
            </div>
          ) : (
            <>
              {/* Card fan — front card is last in array (highest z-index) */}
              <div
                style={{
                  position: "relative",
                  height: revealedIndex !== null ? "auto" : 320,
                  minHeight: 320,
                  marginBottom: revealedIndex !== null ? 16 : 0,
                }}
              >
                {matches.map((match, i) =>
                  revealedIndex === null || revealedIndex === i ? (
                    <SealedCard
                      key={match.id}
                      match={match}
                      index={i}
                      total={revealedIndex !== null ? 1 : matches.length}
                      revealed={revealedIndex === i}
                      onReveal={() => setRevealedIndex(i)}
                      onIntention={() => handleIntention(match)}
                    />
                  ) : null
                )}
              </div>

              {/* Card dots */}
              {revealedIndex === null && matches.length > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 16,
                  }}
                >
                  {matches.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background:
                          i === matches.length - 1
                            ? "#d4688a"
                            : "rgba(255,255,255,0.2)",
                        transition: "background 0.2s",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Back button when revealed */}
              {revealedIndex !== null && (
                <button
                  onClick={() => setRevealedIndex(null)}
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.4)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  ← See all {matches.length} matches
                </button>
              )}
            </>
          )}
        </div>

        {/* Daily intention from Maahi */}
        {intention && (
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(180,140,255,0.14)",
              background: "rgba(180,140,255,0.04)",
              padding: "20px 22px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#B48CFF",
                margin: "0 0 10px",
              }}
            >
              Maahi&apos;s intention for you today
            </p>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;{intention}&rdquo;
            </p>
          </div>
        )}

        {/* Maahi shortcut */}
        <div
          onClick={() => router.push("/companion")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            padding: "16px 20px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4688a, #B48CFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ✨
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>
              Talk to Maahi
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              She knows your soul. Ask anything.
            </p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>→</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
