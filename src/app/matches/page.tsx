"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { Match } from "@/lib/types";

type SentIntro = {
  id: string;
  matchId: string;
  matchName: string;
  soulKnockQuestion: string | null;
  receiverAnswered: boolean;
  createdAt: string;
  status: "pending" | "answered";
};

function MatchRow({ match, onConnect }: { match: Match; onConnect: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(145deg, rgba(20,16,28,0.95), rgba(14,12,20,0.98))",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Summary row — always visible */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 20px",
          cursor: "pointer",
        }}
      >
        {/* Avatar initial */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(212,104,138,0.25), rgba(180,140,255,0.15))",
            border: "1px solid rgba(212,104,138,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "#d4688a",
            flexShrink: 0,
          }}
        >
          {match.name?.[0] || "?"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{match.name}</span>
            {match.age && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{match.age}</span>
            )}
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {[match.profession, match.city].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Harmony pill */}
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(79,255,176,0.07)",
            border: "1px solid rgba(79,255,176,0.15)",
            fontSize: 11,
            fontWeight: 600,
            color: "#4FFFB0",
            flexShrink: 0,
          }}
        >
          {(match as unknown as { harmonyScore?: number }).harmonyScore || 82}%
        </div>

        <span
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: 12,
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ›
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {match.narrativeIntro && (
            <p
              style={{
                fontSize: 13,
                fontStyle: "italic",
                color: "rgba(212,104,138,0.85)",
                lineHeight: 1.65,
                margin: "16px 0",
                paddingLeft: 12,
                borderLeft: "2px solid rgba(212,104,138,0.25)",
              }}
            >
              &ldquo;{match.narrativeIntro}&rdquo;
            </p>
          )}

          {match.compatibilitySignals && (
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.25)",
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
                        background: `${color}10`,
                        color,
                        border: `1px solid ${color}25`,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {label}
                    </span>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.55 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {match.frictionPoint && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(245,200,66,0.06)",
                border: "1px solid rgba(245,200,66,0.15)",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#F5C842", margin: "0 0 4px" }}>
                Worth knowing
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                {match.frictionPoint}
              </p>
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onConnect(); }}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              color: "#0A0A0F",
              background: "linear-gradient(135deg, #e8927c, #d4688a)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send intention ✦
          </button>
        </div>
      )}
    </div>
  );
}

export default function ConnectPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [pendingIntros, setPendingIntros] = useState<SentIntro[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/matches/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.matches ?? []);
      if (Array.isArray(list)) setMatches(list);
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  const fetchPendingIntros = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await fetch("/api/intros");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPendingIntros(
          data.filter((intro): intro is SentIntro => Boolean(intro?.id && intro?.matchName)),
        );
      }
    } catch {
      // silent
    }
    setPendingLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }
    fetchMatches();
    fetchPendingIntros();
  }, [profile, authLoading, router, fetchMatches, fetchPendingIntros]);

  if (authLoading || !profile) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        paddingBottom: "calc(90px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Ambient orb */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-10%",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "#d4688a",
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
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#d4688a",
              margin: "0 0 6px",
            }}
          >
            Your connections
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>
            Connect
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "6px 0 0" }}>
            Soul summaries first. Photos unlock after intention.
          </p>
        </div>

        {!pendingLoading && pendingIntros.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "#B48CFF",
                    margin: "0 0 4px",
                  }}
                >
                  Pending on their side
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", margin: 0 }}>
                  Keep track of who already received your intention.
                </p>
              </div>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(180,140,255,0.08)",
                  border: "1px solid rgba(180,140,255,0.15)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#B48CFF",
                }}
              >
                {pendingIntros.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingIntros.map((intro) => (
                <button
                  key={intro.id}
                  onClick={() => router.push(`/matches/${intro.matchId}/preview`)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 18,
                    border: "1px solid rgba(180,140,255,0.12)",
                    background: "linear-gradient(145deg, rgba(22,18,32,0.96), rgba(15,12,22,0.98))",
                    padding: "16px 18px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{intro.matchName}</span>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: intro.status === "answered" ? "#4FFFB0" : "#F5C842",
                            background: intro.status === "answered" ? "rgba(79,255,176,0.09)" : "rgba(245,200,66,0.09)",
                            border: intro.status === "answered" ? "1px solid rgba(79,255,176,0.18)" : "1px solid rgba(245,200,66,0.18)",
                          }}
                        >
                          {intro.status === "answered" ? "They answered" : "Pending"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.46)", margin: "0 0 8px", lineHeight: 1.55 }}>
                        {intro.status === "answered"
                          ? "They replied. Open this connection and keep it moving."
                          : "Your intention is sitting with them now. You don’t need to guess who has it."}
                      </p>
                      {intro.soulKnockQuestion && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "rgba(180,140,255,0.72)",
                            margin: 0,
                            lineHeight: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          You sent: “{intro.soulKnockQuestion}”
                        </p>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Match list */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid rgba(212,104,138,0.25)",
                borderTopColor: "#d4688a",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              Maahi is surfacing your connections…
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                onConnect={() => router.push(`/matches/${match.id}/preview`)}
              />
            ))}
          </div>
        )}

        {/* Refresh */}
        {!loading && matches.length > 0 && (
          <button
            onClick={fetchMatches}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "13px 0",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            Refresh connections
          </button>
        )}

        {/* Maahi note */}
        <div
          style={{
            marginTop: 28,
            padding: "16px 20px",
            borderRadius: 16,
            background: "rgba(180,140,255,0.04)",
            border: "1px solid rgba(180,140,255,0.1)",
          }}
        >
          <p style={{ fontSize: 11, color: "#B48CFF", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Maahi noticed
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
            You tend to connect deeply with people who share your{" "}
            {profile.coreValues?.[0]?.toLowerCase() || "values"} and{" "}
            {profile.attachment?.toLowerCase() || "thoughtful"} way of showing up.
          </p>
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
