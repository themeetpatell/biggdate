"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";
import type { Match } from "@/lib/types";

type IntroSnapshot = {
  id: string;
  status: "pending" | "answered";
  senderAnswered: boolean;
  receiverAnswered: boolean;
};

type CheckinMood = "drained" | "neutral" | "open" | "energized";

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
      style={revealed ? {
        position: "relative",
        zIndex: index,
        cursor: "default",
      } : {
        position: "absolute",
        inset: 0,
        transform: `translateY(${offset}px) rotate(${rotate}deg) scale(${1 - (total - 1 - index) * 0.03})`,
        zIndex: index,
        cursor: "pointer",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          width: "100%",
          ...(revealed ? {} : { height: "100%" }),
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
              {(match as unknown as { harmonyScore?: number }).harmonyScore ?? (78 + (match.id.charCodeAt(match.id.length - 1) % 16))}% harmony
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
  const [poolEmpty, setPoolEmpty] = useState(false);
  const [intention, setIntention] = useState<string>("");
  const [pulsePrompt, setPulsePrompt] = useState<string>("");
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [intros, setIntros] = useState<IntroSnapshot[]>([]);
  const [unreadReplies, setUnreadReplies] = useState(0);
  const [checkinMood, setCheckinMood] = useState<CheckinMood | null>(null);
  const [isSavingCheckin, setIsSavingCheckin] = useState(false);

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
      .then((d) => {
        if (d.poolEmpty) { setPoolEmpty(true); return; }
        const list = Array.isArray(d) ? d : (d.matches ?? []);
        setMatches(list.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setMatchLoading(false));

    // Fetch today's Pulse prompt
    fetch("/api/pulse/prompts/today")
      .then((r) => r.json())
      .then((d) => { if (d.prompt) setPulsePrompt(d.prompt.content); })
      .catch(() => {});

    // Fetch daily intention from Maahi
    fetch("/api/companion/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((d) => setIntention(d.intention || ""))
      .catch(() => {});

    // Fetch Soul Knock snapshot for dashboard counters
    fetch("/api/intros")
      .then((r) => r.json())
      .then((d) => {
        if (!Array.isArray(d)) return;
        const normalized = d.map((row) => ({
          id: String(row?.id ?? ""),
          status: row?.status === "answered" ? "answered" : "pending",
          senderAnswered: Boolean(row?.senderAnswered),
          receiverAnswered: Boolean(row?.receiverAnswered),
        })) as IntroSnapshot[];
        setIntros(normalized);
      })
      .catch(() => {});

    // Fetch unread message count from active threads
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        const threads = Array.isArray(d?.threads) ? d.threads : [];
        const unreadTotal = threads.reduce(
          (sum: number, thread: { unreadCount?: number }) => sum + Number(thread?.unreadCount ?? 0),
          0,
        );
        setUnreadReplies(unreadTotal);
      })
      .catch(() => {});

    // Fetch today's emotional check-in
    fetch("/api/dashboard/checkin")
      .then((r) => r.json())
      .then((d) => {
        const mood = d?.checkin?.mood;
        if (mood === "drained" || mood === "neutral" || mood === "open" || mood === "energized") {
          setCheckinMood(mood);
        }
      })
      .catch(() => {});
  }, [profile, loading, router]);

  const handleIntention = useCallback((match: Match) => {
    router.push(`/matches/${match.id}/preview`);
  }, [router]);

  const handleCheckinMood = useCallback(async (mood: CheckinMood) => {
    setCheckinMood(mood);
    setIsSavingCheckin(true);
    try {
      const res = await fetch("/api/dashboard/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      if (!res.ok) throw new Error("save_failed");
    } catch {
      // Keep optimistic state on the dashboard so the experience stays instant.
    } finally {
      setIsSavingCheckin(false);
    }
  }, []);

  if (loading || !profile) return <LoadingScreen message="Setting up your dashboard…" />;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const pendingSoulKnocks = intros.filter((intro) => intro.status === "pending").length;
  const answeredSoulKnocks = intros.filter((intro) => intro.status === "answered").length;

  const photosDone = (profile.photos?.length ?? 0) >= 2;
  const promptsDone = (profile.prompts?.length ?? 0) >= 2;
  const lifestyleDone = Boolean(profile.drinking && profile.smoking && profile.exercise);
  const summaryDone = Boolean(profile.summary?.trim());

  const profileHealthTasks = [
    { label: "Add photos", done: photosDone },
    { label: "Add prompts", done: promptsDone },
    { label: "Add lifestyle fields", done: lifestyleDone },
    { label: "Complete soul summary", done: summaryDone },
  ];

  const profileHealth = Math.round(
    (profileHealthTasks.filter((task) => task.done).length / profileHealthTasks.length) * 100,
  );

  const baseNextAction = answeredSoulKnocks > 0
    ? {
      title: "You have a Soul Knock answer waiting",
      subtitle: "Open your match and keep the energy moving.",
      cta: "View matches",
      href: "/matches",
    }
    : unreadReplies > 0
      ? {
        title: `You have ${unreadReplies} unread ${unreadReplies === 1 ? "reply" : "replies"}`,
        subtitle: "Respond while the conversation is still warm.",
        cta: "Open messages",
        href: "/messages",
      }
      : profileHealth < 70
        ? {
          title: "Your profile can convert better",
          subtitle: "A fuller profile unlocks stronger matches.",
          cta: "Complete profile",
          href: "/profile",
        }
        : {
          title: "Your ritual is ready",
          subtitle: "Reveal today’s stack and send your intention.",
          cta: "Go to matches",
          href: "/matches",
        };

  const nextAction = checkinMood === "drained"
    && answeredSoulKnocks === 0
    && unreadReplies === 0
    ? {
      title: "Take 2 calm minutes with Maahi",
      subtitle: "Reset your energy first, then reconnect from a better place.",
      cta: "Do a gentle check-in",
      href: "/companion",
    }
    : checkinMood === "energized"
      && answeredSoulKnocks === 0
      && unreadReplies === 0
      && matches.length > 0
      ? {
        title: "You’re in a high-signal state",
        subtitle: "Use it now. Send one intentional Soul Knock while your clarity is strong.",
        cta: "Open today’s matches",
        href: "/matches",
      }
      : baseNextAction;

  const moodLine = checkinMood === "drained"
    ? "You checked in as drained. Keep today soft."
    : checkinMood === "neutral"
      ? "You checked in as neutral. Small progress counts today."
      : checkinMood === "open"
        ? "You checked in as open. Great day for a sincere message."
        : checkinMood === "energized"
          ? "You checked in as energized. Make one bold move."
          : null;

  const matchOfTheDay = matches[
    revealedIndex !== null ? revealedIndex : (matches.length > 0 ? matches.length - 1 : 0)
  ];

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
          maxWidth: "var(--bd-app-max-w)",
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

        {/* Today snapshot */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            {
              label: "Pending Soul Knocks",
              value: pendingSoulKnocks,
              tone: "rgba(233,30,140,0.3)",
              text: "#ff7ab8",
            },
            {
              label: "Unread Replies",
              value: unreadReplies,
              tone: "rgba(79,255,176,0.24)",
              text: "#4FFFB0",
            },
            {
              label: "Profile Health",
              value: `${profileHealth}%`,
              tone: "rgba(180,140,255,0.22)",
              text: "#B48CFF",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: "12px 10px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.38)",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  lineHeight: 1.3,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: item.text,
                  textShadow: `0 0 18px ${item.tone}`,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Next best action */}
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(130deg, rgba(212,104,138,0.14), rgba(180,140,255,0.08))",
            padding: "18px 18px 16px",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 8px",
            }}
          >
            Next Best Action
          </p>
          <p style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700, color: "#fff" }}>
            {nextAction.title}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
            {nextAction.subtitle}
          </p>
          <button
            onClick={() => router.push(nextAction.href)}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#0A0A0F",
              background: "linear-gradient(135deg, #ff8cb8, #d4688a)",
            }}
          >
            {nextAction.cta}
          </button>
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
          ) : poolEmpty ? (
            <div
              style={{
                height: 280,
                borderRadius: 24,
                border: "1px solid rgba(168,85,247,0.15)",
                background: "rgba(168,85,247,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                textAlign: "center",
                padding: "0 28px",
              }}
            >
              <span style={{ fontSize: 36 }}>🌱</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>
                Maahi is still building your pool
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.6 }}>
                More people are joining every day. When someone who fits your profile signs up, they&apos;ll be here waiting.
              </p>
              <p style={{ fontSize: 11, color: "rgba(168,85,247,0.6)", margin: 0 }}>
                Check back tomorrow
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
              {showAllMatches ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      paddingBottom: 10,
                      margin: "0 -4px",
                      paddingInline: 4,
                    }}
                  >
                    {matches.map((match, i) => (
                      <div
                        key={match.id}
                        style={{
                          minWidth: "88%",
                          scrollSnapAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        <SealedCard
                          match={match}
                          index={i}
                          total={1}
                          revealed
                          onReveal={() => {}}
                          onIntention={() => handleIntention(match)}
                        />
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      margin: "8px 0 0",
                    }}
                  >
                    Swipe through all 3. Send intention when one lands.
                  </p>

                  <button
                    onClick={() => {
                      setShowAllMatches(false);
                      setRevealedIndex(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "11px 0",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.42)",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      marginTop: 14,
                    }}
                  >
                    ← Back to stacked reveal
                  </button>
                </>
              ) : (
                <>
                  {/* Card fan — front card is last in array (highest z-index) */}
                  <div
                    style={{
                      position: "relative",
                      height: revealedIndex !== null ? "auto" : 320,
                      minHeight: revealedIndex !== null ? 0 : 320,
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
                          onReveal={() => {
                            setShowAllMatches(false);
                            setRevealedIndex(i);
                          }}
                          onIntention={() => handleIntention(match)}
                        />
                      ) : null
                    )}
                  </div>

                  {revealedIndex === null && matches.length > 1 && (
                    <>
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

                      <button
                        onClick={() => {
                          setShowAllMatches(true);
                          setRevealedIndex(null);
                        }}
                        style={{
                          width: "100%",
                          padding: "13px 0",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0A0A0F",
                          background: "linear-gradient(135deg, #ff7ab8, #d4688a)",
                          border: "none",
                          cursor: "pointer",
                          marginTop: 14,
                          boxShadow: "0 16px 36px rgba(212,104,138,0.28)",
                        }}
                      >
                        ✦ Heart blast all {matches.length}
                      </button>
                    </>
                  )}

                  {revealedIndex !== null && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                      <button
                        onClick={() => {
                          setShowAllMatches(true);
                          setRevealedIndex(null);
                        }}
                        style={{
                          width: "100%",
                          padding: "13px 0",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0A0A0F",
                          background: "linear-gradient(135deg, #ff7ab8, #d4688a)",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 16px 36px rgba(212,104,138,0.28)",
                        }}
                      >
                        ✦ Heart blast all {matches.length}
                      </button>

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
                        }}
                      >
                        ← Back to stacked reveal
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Connection momentum */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Pending",
              hint: "On their side",
              value: pendingSoulKnocks,
              color: "#ff7ab8",
            },
            {
              label: "Answered",
              hint: "They replied",
              value: answeredSoulKnocks,
              color: "#4FFFB0",
            },
            {
              label: "Needs Reply",
              hint: "In messages",
              value: unreadReplies,
              color: "#B48CFF",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                padding: "12px",
              }}
            >
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {item.label}
              </p>
              <p style={{ margin: "6px 0 4px", fontSize: 20, color: item.color, fontWeight: 700 }}>
                {item.value}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {item.hint}
              </p>
            </div>
          ))}
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

        {/* Match of the day */}
        {matchOfTheDay && (
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(212,104,138,0.22)",
              background: "linear-gradient(140deg, rgba(212,104,138,0.09), rgba(15,12,22,0.96))",
              padding: "20px 20px 18px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Match of the Day
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: "#fff" }}>
              {matchOfTheDay.name}
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.42)" }}>
              {[matchOfTheDay.age, matchOfTheDay.profession, matchOfTheDay.city].filter(Boolean).join(" · ")}
            </p>

            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#4FFFB0", fontWeight: 700 }}>Why this could work</p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.74)", lineHeight: 1.55 }}>
              {matchOfTheDay.compatibilitySignals?.values || matchOfTheDay.connectionHook}
            </p>

            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#F5C842", fontWeight: 700 }}>Be intentional here</p>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.55 }}>
              {matchOfTheDay.tensionPoint || matchOfTheDay.frictionPoint}
            </p>

            <button
              onClick={() => router.push(`/matches/${matchOfTheDay.id}/preview`)}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                color: "#0A0A0F",
                background: "linear-gradient(135deg, #ff8cb8, #d4688a)",
              }}
            >
              Send Soul Knock
            </button>
          </div>
        )}

        {/* Emotional check-in */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            padding: "16px 16px 14px",
            marginBottom: 12,
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(255,255,255,0.46)", textTransform: "uppercase", letterSpacing: "0.09em" }}>
            30s Emotional Check-in
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "rgba(255,255,255,0.78)" }}>
            How are you showing up today?
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {[
              { value: "drained", label: "Drained" },
              { value: "neutral", label: "Neutral" },
              { value: "open", label: "Open" },
              { value: "energized", label: "Energized" },
            ].map((option) => {
              const active = checkinMood === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleCheckinMood(option.value as CheckinMood)}
                  disabled={isSavingCheckin}
                  style={{
                    padding: "10px 0",
                    borderRadius: 999,
                    border: active ? "1px solid rgba(212,104,138,0.55)" : "1px solid rgba(255,255,255,0.13)",
                    background: active ? "rgba(212,104,138,0.22)" : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.72)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: isSavingCheckin ? "default" : "pointer",
                    opacity: isSavingCheckin ? 0.9 : 1,
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {moodLine && (
            <p style={{ margin: "10px 2px 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
              {moodLine}
            </p>
          )}
        </div>

        {/* Pulse prompt widget */}
        {pulsePrompt && (
          <div
            onClick={() => router.push("/pulse")}
            style={{
              background: "linear-gradient(135deg, rgba(233,30,140,0.09), rgba(233,30,140,0.02))",
              border: "1px solid rgba(233,30,140,0.2)",
              borderRadius: 18, padding: "16px 20px", marginBottom: 12, cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 11, color: "#e91e8c", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>
              Today on Pulse
            </p>
            <p style={{
              fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.55,
              margin: "0 0 8px",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            } as React.CSSProperties}>
              {pulsePrompt}
            </p>
            <p style={{ fontSize: 12, color: "rgba(233,30,140,0.65)", margin: 0 }}>
              Respond anonymously →
            </p>
          </div>
        )}

        {/* Profile progress */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
            padding: "16px 18px",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 10,
              color: "rgba(255,255,255,0.38)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Profile Progress
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
            Health score {profileHealth}%
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {profileHealthTasks.slice(0, 3).map((task) => (
              <div key={task.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13 }}>{task.done ? "✓" : "○"}</span>
                <span style={{ fontSize: 13, color: task.done ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.82)" }}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/profile")}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              color: "#0A0A0F",
              background: "linear-gradient(135deg, #f5c842, #e8927c)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Complete profile
          </button>
        </div>

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
