"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { UpgradeSheet } from "@/components/upgrade-sheet";
import type { Match } from "@/lib/types";

interface ExistingIntro {
  id: string;
  matchId: string;
  matchedUserId: string | null;
  soulKnockQuestion: string | null;
  status: "pending" | "answered";
  createdAt: string;
}

// ─── Soul Knock questions ─────────────────────────────────────────────────────
// Curated last-resort fallbacks. Used only when the AI endpoint is unreachable
// AND match.openingQuestion is also missing — the Soul Knock surface must
// never be empty.
const CURATED_SOUL_KNOCK_FALLBACK: string[] = [
  "What does it feel like when someone truly sees you?",
  "When you love someone, how do they know? What does it look like from the outside?",
  "What would end things on date three — and why does that thing matter so much to you?",
];

// First paint uses match.openingQuestion (already per-match from the matching
// engine) + 2 curated so the UI isn't empty while the AI call runs.
function getInitialSoulKnockQuestions(match: Match): string[] {
  const q1 = match.openingQuestion?.trim() || CURATED_SOUL_KNOCK_FALLBACK[0];
  return [q1, CURATED_SOUL_KNOCK_FALLBACK[1], CURATED_SOUL_KNOCK_FALLBACK[2]];
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

function Pill({ children, color = "#4FFFB0" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "5px 13px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: `${color}14`, color, border: `1px solid ${color}28` }}>
      {children}
    </span>
  );
}

// ─── Match Hero (no photos in Match type — use gradient + emoji) ───────────────
function MatchHero({ match, onBack }: { match: Match; onBack: () => void }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "52svh", overflow: "hidden" }}>
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(145deg, rgba(212,104,138,0.14) 0%, rgba(180,140,255,0.10) 50%, rgba(0,102,255,0.08) 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <div style={{
          width: 110, height: 110, borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(212,104,138,0.22), rgba(180,140,255,0.16))",
          border: "1.5px solid rgba(212,104,138,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52, boxShadow: "0 20px 60px rgba(212,104,138,0.15)",
        }}>
          {match.emoji || "✨"}
        </div>
        {match.intentAlignment && (
          <div style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: match.intentAlignment === "High" ? "rgba(79,255,176,0.12)" : match.intentAlignment === "Medium" ? "rgba(245,200,66,0.12)" : "rgba(212,104,138,0.12)",
            color: match.intentAlignment === "High" ? "#4FFFB0" : match.intentAlignment === "Medium" ? "#F5C842" : "#d4688a",
            border: `1px solid ${match.intentAlignment === "High" ? "rgba(79,255,176,0.22)" : match.intentAlignment === "Medium" ? "rgba(245,200,66,0.22)" : "rgba(212,104,138,0.22)"}`,
          }}>
            {match.intentAlignment} Intent Alignment
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #0A0A0F, transparent)", pointerEvents: "none" }} />
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
}

// ─── Tab: Soul ────────────────────────────────────────────────────────────────
function SoulTab({ match }: { match: Match }) {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 26 }}>
      {match.narrativeIntro && (
        <div>
          <SLabel>Who they are</SLabel>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            &ldquo;{match.narrativeIntro}&rdquo;
          </p>
        </div>
      )}

      {match.connectionHook && (
        <div style={{ padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(180,140,255,0.18)", background: "rgba(180,140,255,0.06)" }}>
          <SLabel>Why you might connect</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>{match.connectionHook}</p>
        </div>
      )}

      {match.compatibilitySignals && (
        <div>
          <SLabel>Compatibility signals</SLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Values", value: match.compatibilitySignals.values, color: "#4FFFB0" },
              { label: "Communication", value: match.compatibilitySignals.communication, color: "#d4688a" },
              { label: "Life Direction", value: match.compatibilitySignals.lifeDirection, color: "#F5C842" },
            ].filter(s => s.value).map(s => (
              <div key={s.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25`, flexShrink: 0, marginTop: 1 }}>
                  {s.label}
                </span>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.6, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {match.profession && (
        <div>
          <SLabel>What they do</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>{match.profession}</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Chemistry ───────────────────────────────────────────────────────────
function ChemistryTab({ match }: { match: Match }) {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
      {match.tensionPoint && (
        <div style={{ padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(245,200,66,0.18)", background: "rgba(245,200,66,0.05)" }}>
          <SLabel>The honest challenge</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{match.tensionPoint}</p>
        </div>
      )}

      {match.frictionPoint && (
        <div style={{ padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(212,104,138,0.15)", background: "rgba(212,104,138,0.05)" }}>
          <SLabel>Worth knowing</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{match.frictionPoint}</p>
        </div>
      )}

      {match.openingQuestion && (
        <div>
          <SLabel>The question between you</SLabel>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
            &ldquo;{match.openingQuestion}&rdquo;
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: "8px 0 0" }}>This becomes your Soul Knock if you choose it below.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Life ────────────────────────────────────────────────────────────────
function LifeTab({ match }: { match: Match }) {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <SLabel>About them</SLabel>
        {[
          { label: "Age", value: match.age },
          { label: "City", value: match.city },
          { label: "Profession", value: match.profession },
        ].filter(r => r.value).map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{r.label}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div>
        <SLabel>Intent alignment</SLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill color={match.intentAlignment === "High" ? "#4FFFB0" : match.intentAlignment === "Medium" ? "#F5C842" : "#d4688a"}>
            {match.intentAlignment} alignment
          </Pill>
        </div>
      </div>

      {match.narrativeIntro && (
        <div style={{ padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
          <SLabel>Their story</SLabel>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            &ldquo;{match.narrativeIntro}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Already-sent state — replaces the Soul Knock send UI when an intro exists ─

function AlreadySent({
  match,
  intro,
  onWithdraw,
  onModify,
  onViewConnect,
  modifyDraft,
  onModifyDraftChange,
  onModifySubmit,
  modifying,
}: {
  match: Match;
  intro: ExistingIntro;
  onWithdraw: () => Promise<void>;
  onModify: () => void;
  onViewConnect: () => void;
  modifyDraft: string | null;
  onModifyDraftChange: (v: string) => void;
  onModifySubmit: () => Promise<void>;
  modifying: boolean;
}) {
  const sentAt = intro.createdAt
    ? new Date(intro.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;
  const isAnswered = intro.status === "answered";
  const accent = isAnswered ? "#4FFFB0" : "#F5C842";

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div
        style={{
          padding: "20px 20px 16px",
          borderRadius: 22,
          border: `1px solid ${accent}28`,
          background: `${accent}0A`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14, color: accent }}>✦</span>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: accent,
              margin: 0,
            }}
          >
            {isAnswered ? "They answered" : "Soul Knock sent"}
          </p>
          {sentAt && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "rgba(255,255,255,0.32)",
              }}
            >
              {sentAt}
            </span>
          )}
        </div>

        {intro.soulKnockQuestion ? (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.3)",
                margin: "0 0 8px",
              }}
            >
              You asked
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.78)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;{intro.soulKnockQuestion}&rdquo;
            </p>
          </div>
        ) : (
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
              margin: "0 0 14px",
            }}
          >
            Your intention is with {match.name}.
          </p>
        )}

        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.55,
            margin: "0 0 16px",
          }}
        >
          {isAnswered
            ? `${match.name} answered. Open Connect to see their reply.`
            : `Pending on ${match.name}'s side. You don't need to send another.`}
        </p>

        {/* Withdraw + Modify */}
        {!isAnswered && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => void onWithdraw()}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
              >
                Withdraw
              </button>
              <button
                onClick={modifyDraft == null ? onModify : () => onModifyDraftChange("")}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid rgba(212,104,138,0.28)",
                  background: "rgba(212,104,138,0.1)",
                  color: "#f58bc2",
                  cursor: "pointer",
                }}
              >
                {modifyDraft == null ? "Modify" : "Cancel"}
              </button>
            </div>
            {modifyDraft != null && (
              <div style={{ marginBottom: 12 }}>
                <textarea
                  value={modifyDraft}
                  onChange={(e) => onModifyDraftChange(e.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="Edit your Soul Knock question…"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(212,104,138,0.3)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontSize: 14,
                    color: "#fff",
                    resize: "none",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => void onModifySubmit()}
                  disabled={modifying || !modifyDraft.trim()}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: "12px 0",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    background: modifyDraft.trim() ? "#f58bc2" : "rgba(245,139,194,0.3)",
                    color: modifyDraft.trim() ? "#1a0d10" : "rgba(255,255,255,0.3)",
                    cursor: modifyDraft.trim() && !modifying ? "pointer" : "default",
                  }}
                >
                  {modifying ? "Saving…" : "Save"}
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={onViewConnect}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            background: isAnswered
              ? "linear-gradient(135deg, #4FFFB0, #2dd4bf)"
              : "rgba(255,255,255,0.06)",
            color: isAnswered ? "#0A0A0F" : "rgba(255,255,255,0.65)",
            letterSpacing: "0.01em",
          }}
        >
          {isAnswered ? "Open in Connect →" : "Back to Connect"}
        </button>
      </div>
    </div>
  );
}

// ─── Soul Knock UI ────────────────────────────────────────────────────────────
function SoulKnock({ match, onSend, onPass, sending, sent, onViewPending }: {
  match: Match;
  onSend: (question: string) => void;
  onPass: () => void;
  sending: boolean;
  sent: boolean;
  onViewPending: () => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>(() => getInitialSoulKnockQuestions(match));
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [scoring, setScoring] = useState(false);

  // Fetch per-match Soul Knock candidates once we know the match. The AI route
  // returns 3 questions tailored to *this* pairing; we fall back to the curated
  // set silently on any error so the UI never blocks.
  useEffect(() => {
    let cancelled = false;
    setSuggestionsLoading(true);
    fetch(`/api/matches/${encodeURIComponent(match.id)}/soul-knock-questions`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { questions?: unknown } | null) => {
        if (cancelled || !data || !Array.isArray(data.questions)) return;
        const cleaned = data.questions
          .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          .slice(0, 3);
        if (cleaned.length === 3) setSuggestions(cleaned);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSuggestionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [match.id]);
  // Set when a custom question scored weak under an enforcing experiment.
  // While set, the send button becomes an explicit "send anyway".
  const [softBlock, setSoftBlock] = useState<{ coaching: string } | null>(null);

  const activeQuestion = showCustom ? custom.trim() : selected !== null ? suggestions[selected] : null;

  async function handleSend() {
    if (!activeQuestion || sending || scoring) return;

    // Maahi's own suggestions are pre-vetted — send directly. Only custom
    // questions go through quality scoring.
    if (!showCustom) {
      onSend(activeQuestion);
      return;
    }

    // Second click after a soft-block: the user chose to send anyway.
    if (softBlock) {
      onSend(activeQuestion);
      return;
    }

    setScoring(true);
    try {
      const res = await fetch("/api/intros/score-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: activeQuestion, matchId: match.id }),
      });
      const data = await res.json();
      if (res.ok && data.enforce && data.verdict === "weak") {
        // Soft-block — surface coaching; the next click sends anyway.
        setSoftBlock({ coaching: data.coaching || "Try asking something more specific." });
        return;
      }
      onSend(activeQuestion);
    } catch {
      // Scoring outage must never block a user from connecting.
      onSend(activeQuestion);
    } finally {
      setScoring(false);
    }
  }

  if (sent) {
    return (
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ padding: "20px 22px", borderRadius: 20, background: "rgba(79,255,176,0.07)", border: "1px solid rgba(79,255,176,0.2)", textAlign: "center" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#4FFFB0", margin: "0 0 4px" }}>Intention sent ✦</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            {match.name} can see it now. This is pending on their side until they answer.
          </p>
          <button
            onClick={onViewPending}
            style={{
              marginTop: 14,
              padding: "11px 18px",
              borderRadius: 999,
              border: "1px solid rgba(79,255,176,0.22)",
              background: "rgba(79,255,176,0.08)",
              color: "#dfffea",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Connect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div style={{ padding: "20px 20px 16px", borderRadius: 22, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#d4688a" }}>✦</span>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            Maahi suggests{suggestionsLoading ? " · tuning…" : ""}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {suggestions.map((q, i) => (
            <button key={i}
              onClick={() => { setSelected(i); setShowCustom(false); }}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12, textAlign: "left", cursor: "pointer",
                border: `1px solid ${selected === i && !showCustom ? "rgba(212,104,138,0.4)" : "rgba(255,255,255,0.07)"}`,
                background: selected === i && !showCustom ? "rgba(212,104,138,0.08)" : "transparent",
                color: selected === i && !showCustom ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.45)",
                fontSize: 13, lineHeight: 1.5, transition: "all 0.15s ease",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
              <span style={{ color: selected === i && !showCustom ? "#d4688a" : "rgba(255,255,255,0.2)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {selected === i && !showCustom ? "●" : "○"}
              </span>
              {q}
            </button>
          ))}

          {/* Write your own */}
          {!showCustom ? (
            <button onClick={() => { setShowCustom(true); setSelected(null); }}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, textAlign: "left", cursor: "pointer", border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "rgba(255,255,255,0.28)", fontSize: 13, display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s" }}>
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.2)" }}>+</span>
              Write your own...
            </button>
          ) : (
            <div>
              <textarea
                value={custom}
                onChange={e => { setCustom(e.target.value); setSoftBlock(null); }}
                placeholder="Ask something that matters..."
                maxLength={140}
                rows={2}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(212,104,138,0.35)", background: "rgba(212,104,138,0.06)", color: "#fff", fontSize: 13, lineHeight: 1.5, resize: "none", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <button onClick={() => { setShowCustom(false); }} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Cancel</button>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{custom.length}/140</span>
              </div>
            </div>
          )}
        </div>

        {/* Soft-block coaching — shown when a custom question scored weak */}
        {softBlock && (
          <div style={{ marginBottom: 10, padding: "11px 13px", borderRadius: 12, border: "1px solid rgba(232,146,124,0.35)", background: "rgba(232,146,124,0.08)" }}>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.7)" }}>
              <span style={{ color: "#e8927c", fontWeight: 700 }}>Make it land. </span>
              {softBlock.coaching}
            </p>
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!activeQuestion || sending || scoring}
          style={{
            width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: "none", cursor: activeQuestion && !scoring ? "pointer" : "default",
            background: activeQuestion ? "linear-gradient(135deg, #e8927c, #d4688a)" : "rgba(255,255,255,0.06)",
            color: activeQuestion ? "#fff" : "rgba(255,255,255,0.2)",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
          }}>
          {sending ? "Sending..." : scoring ? "Checking…" : softBlock ? "Send anyway ✦" : "Send Soul Knock ✦"}
        </button>

        {/* Not this chapter */}
        <button onClick={onPass}
          style={{ display: "block", width: "100%", textAlign: "center", marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.22)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          Not this chapter
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  "Fake profile",
  "Inappropriate content",
  "Harassment",
  "Other",
];

function ReportSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    await onSubmit(selected);
    setSubmitting(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }} />
      {/* Sheet */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "var(--bd-app-max-w)", zIndex: 51, background: "#161620", borderRadius: "20px 20px 0 0", padding: "24px 20px calc(28px + env(safe-area-inset-bottom, 0px))" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 20px" }} />
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Report or Block</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 20px", lineHeight: 1.5 }}>
          They&apos;ll be blocked immediately and removed from your matches.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {REPORT_REASONS.map((r) => (
            <button key={r} onClick={() => setSelected(r)} style={{
              background: selected === r ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${selected === r ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12,
              padding: "13px 16px",
              fontSize: 14,
              color: selected === r ? "#a855f7" : "rgba(255,255,255,0.6)",
              textAlign: "left",
              cursor: "pointer",
              fontWeight: selected === r ? 600 : 400,
            }}>
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          style={{
            width: "100%",
            background: selected ? "#ef4444" : "rgba(239,68,68,0.2)",
            color: selected ? "#fff" : "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontSize: 15,
            fontWeight: 700,
            cursor: selected ? "pointer" : "default",
          }}
        >
          {submitting ? "Submitting…" : "Block & Report"}
        </button>
      </div>
    </>
  );
}

export default function MatchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"soul" | "chemistry" | "life">("soul");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [existingIntro, setExistingIntro] = useState<ExistingIntro | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<string | undefined>();
  const [withdrawing, setWithdrawing] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [modifyDraft, setModifyDraft] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    let cancelled = false;
    Promise.all([
      fetch("/api/matches").then((r) => r.json() as Promise<Match[] | unknown>),
      fetch("/api/intros").then((r) => r.json() as Promise<ExistingIntro[] | unknown>),
    ])
      .then(([matchesRes, introsRes]) => {
        if (cancelled) return;
        const matches = Array.isArray(matchesRes) ? (matchesRes as Match[]) : [];
        const m = matches.find((x) => x.id === id) ?? null;
        if (!m) { router.push("/matches"); return; }
        setMatch(m);

        const intros = Array.isArray(introsRes) ? (introsRes as ExistingIntro[]) : [];
        const existing =
          intros.find(
            (intro) =>
              intro.matchId === m.id ||
              (m.matchedUserId != null && intro.matchedUserId === m.matchedUserId),
          ) ?? null;
        setExistingIntro(existing);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, profile, authLoading, router]);

  const handleSend = useCallback(async (question: string) => {
    if (!match || !profile || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/intros/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          matchName: match.name,
          matchedUserId: match.matchedUserId,
          soulKnockQuestion: question,
        }),
      });
      const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      if (data && typeof data.id === "string") {
        const intro: ExistingIntro = {
          id: data.id,
          matchId: typeof data.matchId === "string" ? data.matchId : match.id,
          matchedUserId:
            typeof data.matchedUserId === "string"
              ? data.matchedUserId
              : (match.matchedUserId ?? null),
          soulKnockQuestion:
            typeof data.soulKnockQuestion === "string" ? data.soulKnockQuestion : question,
          status: data.status === "answered" ? "answered" : "pending",
          createdAt:
            typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
        };
        setExistingIntro(intro);
      }
      setSent(true);
    } catch {
      // best-effort
    }
    setSending(false);
  }, [match, profile, sending]);

  const openUpgrade = useCallback((context: string) => {
    setUpgradeContext(context);
    setUpgradeOpen(true);
  }, []);

  const handleWithdraw = useCallback(async () => {
    if (!existingIntro || withdrawing) return;
    setWithdrawing(true);
    try {
      const res = await fetch("/api/intros/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introId: existingIntro.id }),
      });
      if (res.ok) {
        setExistingIntro(null);
        setSent(false);
      }
    } catch {
      // best-effort
    }
    setWithdrawing(false);
  }, [existingIntro, withdrawing]);

  const handleModifyOpen = useCallback(() => {
    if (!existingIntro) return;
    setModifyDraft(existingIntro.soulKnockQuestion ?? "");
  }, [existingIntro]);

  const handleModifySubmit = useCallback(async () => {
    if (!existingIntro || modifying || modifyDraft == null) return;
    const soulKnockQuestion = modifyDraft.trim().slice(0, 280);
    if (!soulKnockQuestion) return;

    setModifying(true);
    try {
      const res = await fetch("/api/intros/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ introId: existingIntro.id, soulKnockQuestion }),
      });

      if (res.status === 403) {
        openUpgrade("modify_soul_knock");
        setModifyDraft(null);
        return;
      }

      if (res.ok) {
        setExistingIntro((prev) => {
          if (!prev) return prev;
          return { ...prev, soulKnockQuestion };
        });
        setModifyDraft(null);
      }
    } catch {
      // best-effort
    } finally {
      setModifying(false);
    }
  }, [existingIntro, modifying, modifyDraft, openUpgrade]);

  const handlePass = useCallback(async () => {
    if (!match) return;
    try {
      await fetch("/api/intros/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, matchName: match.name }),
      });
    } catch {}
    router.push("/matches");
  }, [match, router]);

  const handleReport = useCallback(async (reason: string) => {
    if (!match?.matchedUserId) return;
    await fetch("/api/safety/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedId: match.matchedUserId, reason }),
    });
    setShowReportSheet(false);
    router.push("/matches");
  }, [match, router]);

  if (loading || !match) {
    return (
      <div style={{ minHeight: "100dvh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(212,104,138,0.3)", borderTopColor: "#d4688a", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const TABS = [
    { key: "soul" as const, label: "Soul" },
    { key: "chemistry" as const, label: "Chemistry" },
    { key: "life" as const, label: "Life" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#0A0A0F", paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}>
      <div aria-hidden style={{ position: "fixed", top: "-8%", right: "-12%", width: 300, height: 300, borderRadius: "50%", background: "#d4688a", opacity: 0.055, filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "var(--bd-app-max-w)", margin: "0 auto" }}>
        <MatchHero
          match={match}
          onBack={() => {
            if (typeof window !== "undefined" && window.history.length > 1) router.back();
            else router.push("/matches");
          }}
        />

        {/* Identity strip */}
        <div style={{ position: "relative", zIndex: 10, padding: "22px 20px 0", background: "#0A0A0F" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.025em" }}>
              {match.name}{match.age ? `, ${match.age}` : ""}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", margin: 0 }}>
              {[match.city, match.profession].filter(Boolean).join("  ·  ")}
            </p>
          </div>
          {match.matchedUserId && (
            <button
              onClick={() => setShowReportSheet(true)}
              aria-label="Report or block this person"
              title="Report or block"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {/* Explicit shield icon — kebab was being read as decoration */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          )}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 3, gap: 2 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.15s ease", background: tab === t.key ? "#fff" : "transparent", color: tab === t.key ? "#0A0A0F" : "rgba(255,255,255,0.32)" }}>
              {t.label}
            </button>
          ))}
        </div>
        </div>

        {/* Tab content */}
        <div style={{ position: "relative", zIndex: 10 }}>
          {tab === "soul" && <SoulTab match={match} />}
          {tab === "chemistry" && <ChemistryTab match={match} />}
          {tab === "life" && <LifeTab match={match} />}
        </div>

        {/* Soul Knock — switches between send UI and already-sent state */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto" }}>
          {existingIntro ? (
            <AlreadySent
              match={match}
              intro={existingIntro}
              onWithdraw={handleWithdraw}
              onModify={handleModifyOpen}
              onViewConnect={() => router.push("/matches")}
              modifyDraft={modifyDraft}
              onModifyDraftChange={setModifyDraft}
              onModifySubmit={handleModifySubmit}
              modifying={modifying}
            />
          ) : (
            <SoulKnock
              match={match}
              onSend={handleSend}
              onPass={handlePass}
              sending={sending}
              sent={sent}
              onViewPending={() => router.push("/matches")}
            />
          )}
        </div>
      </div>

      {showReportSheet && (
        <ReportSheet
          onClose={() => setShowReportSheet(false)}
          onSubmit={handleReport}
        />
      )}

      <UpgradeSheet
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        context={upgradeContext}
      />
    </div>
  );
}
