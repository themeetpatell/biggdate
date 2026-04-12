"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import type { Match } from "@/lib/types";

// ─── Soul Knock questions (AI suggestion + curated fallbacks) ─────────────────
function getSoulKnockQuestions(match: Match): string[] {
  const q1 = match.openingQuestion || "What does it feel like when someone truly sees you?";
  return [
    q1,
    "When you love someone, how do they know? What does it look like from the outside?",
    "What would end things on date three — and why does that thing matter so much to you?",
  ];
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
function MatchHero({ match }: { match: Match }) {
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
        onClick={() => history.back()}
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

// ─── Soul Knock UI ────────────────────────────────────────────────────────────
function SoulKnock({ match, onSend, onPass, sending, sent }: {
  match: Match;
  onSend: (question: string) => void;
  onPass: () => void;
  sending: boolean;
  sent: boolean;
}) {
  const suggestions = getSoulKnockQuestions(match);
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const activeQuestion = showCustom ? custom.trim() : selected !== null ? suggestions[selected] : null;

  if (sent) {
    return (
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ padding: "20px 22px", borderRadius: 20, background: "rgba(79,255,176,0.07)", border: "1px solid rgba(79,255,176,0.2)", textAlign: "center" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#4FFFB0", margin: "0 0 4px" }}>Soul Knock sent ✦</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
            {match.name} will see your question. If they respond, you&apos;re connected.
          </p>
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
            Maahi suggests
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
                onChange={e => setCustom(e.target.value)}
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

        {/* Send button */}
        <button
          onClick={() => activeQuestion && onSend(activeQuestion)}
          disabled={!activeQuestion || sending}
          style={{
            width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: "none", cursor: activeQuestion ? "pointer" : "default",
            background: activeQuestion ? "linear-gradient(135deg, #e8927c, #d4688a)" : "rgba(255,255,255,0.06)",
            color: activeQuestion ? "#fff" : "rgba(255,255,255,0.2)",
            transition: "all 0.2s ease",
            letterSpacing: "0.01em",
          }}>
          {sending ? "Sending..." : "Send Soul Knock ✦"}
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
export default function MatchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"soul" | "chemistry" | "life">("soul");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!profile) { router.push("/onboarding"); return; }

    fetch("/api/matches")
      .then(r => r.json())
      .then((matches: Match[]) => {
        const m = Array.isArray(matches) ? matches.find(x => x.id === id) : null;
        if (!m) { router.push("/matches"); return; }
        setMatch(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, profile, authLoading, router]);

  const handleSend = useCallback(async (question: string) => {
    if (!match || !profile || sending) return;
    setSending(true);
    try {
      await fetch("/api/intros/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, matchName: match.name, userName: profile.name, message: question }),
      });
      setSent(true);
    } catch {
      // best-effort
    }
    setSending(false);
  }, [match, profile, sending]);

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

      <MatchHero match={match} />

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

      {/* Soul Knock */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto" }}>
        <SoulKnock match={match} onSend={handleSend} onPass={handlePass} sending={sending} sent={sent} />
      </div>
    </div>
  );
}
