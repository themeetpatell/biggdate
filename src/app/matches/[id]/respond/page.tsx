"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { Match } from "@/lib/types";

export default function RespondPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [introId, setIntroId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [mutual, setMutual] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    // Load the intro from received intros — find the one tied to match id (or use id as introId)
    fetch("/api/intros/received")
      .then((r) => r.json())
      .then((d) => {
        if (d.locked) { router.push("/matches"); return; }
        const intro = (d.intros || []).find(
          (i: { id: string; matchId: string; soulKnockQuestion: string | null }) =>
            i.id === id || i.matchId === id,
        );
        if (!intro) { router.push("/matches"); return; }
        setIntroId(intro.id);
        setQuestion(intro.soulKnockQuestion || "What does it feel like when someone truly sees you?");

        // Load match data for the sender's profile display
        fetch("/api/matches")
          .then((r) => r.json())
          .then((data) => {
            const list = Array.isArray(data) ? data : (data.matches ?? []);
            const m = list.find((x: Match) => x.id === intro.matchId);
            if (m) setMatch(m);
          })
          .catch(() => {})
          .finally(() => setPageLoading(false));
      })
      .catch(() => { setPageLoading(false); router.push("/matches"); });
  }, [id, profile, authLoading, router]);

  const handleSubmit = async () => {
    if (!response.trim() || !introId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/intros/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introId, response: response.trim() }),
      });
      const data = await res.json();
      setMutual(data.mutual);
      setThreadId(data.thread?.id ?? null);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || pageLoading || !profile) return null;

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>{mutual ? "💜" : "✨"}</div>
          {mutual ? (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
                You&apos;re connected
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 28px" }}>
                Both of you answered each other&apos;s Soul Knock. Your chat is now open.
              </p>
              <button
                onClick={() => threadId ? router.push(`/messages/${threadId}`) : router.push("/messages")}
                style={{ background: "#a855f7", color: "#fff", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}
              >
                Open Chat
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
                Answer sent
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: "0 0 28px" }}>
                Waiting for the other person to answer too. You&apos;ll be notified when they do.
              </p>
              <button
                onClick={() => router.push("/matches")}
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}
              >
                Back to Matches
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>
      {/* Ambient orb */}
      <div style={{ position: "fixed", top: "-5%", right: "-10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px" }}>
        {/* Back */}
        <button onClick={() => router.push("/matches")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 14, cursor: "pointer", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>

        {/* Match avatar */}
        {match && (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,104,138,0.2), rgba(168,85,247,0.2))", border: "1.5px solid rgba(212,104,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>
              {match.emoji || "✨"}
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: 0 }}>
              Soul Knock from
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "4px 0 0" }}>{match.name}</p>
          </div>
        )}

        {/* The question */}
        <div style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: "20px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(168,85,247,0.7)", margin: "0 0 10px" }}>
            They asked
          </p>
          <p style={{ fontSize: 17, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.5 }}>
            &ldquo;{question}&rdquo;
          </p>
        </div>

        {/* Response textarea */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 10px" }}>
            Your answer
          </p>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value.slice(0, 280))}
            placeholder="Be honest. Be yourself. Max 280 characters."
            rows={5}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "16px",
              fontSize: 15,
              color: "#fff",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "6px 0 0", textAlign: "right" }}>
            {response.length}/280
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!response.trim() || submitting}
          style={{
            width: "100%",
            background: response.trim() ? "#a855f7" : "rgba(168,85,247,0.2)",
            color: response.trim() ? "#fff" : "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: 14,
            padding: "16px",
            fontSize: 16,
            fontWeight: 700,
            cursor: response.trim() ? "pointer" : "default",
            transition: "background 0.2s",
          }}
        >
          {submitting ? "Sending…" : "Send My Answer"}
        </button>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "16px 0 0", lineHeight: 1.5 }}>
          Once you both answer, your chat opens and photos unlock.
        </p>
      </div>
    </div>
  );
}
