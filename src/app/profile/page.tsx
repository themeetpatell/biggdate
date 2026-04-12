"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import type { Profile } from "@/lib/types";

// ─── 10 Dimensions ────────────────────────────────────────────────────────────
const DIMENSIONS = [
  { id: "D1", label: "Emotional Intelligence", weight: 20, color: "#d4688a", desc: "How you attach, regulate, and hold space emotionally." },
  { id: "D2", label: "Values & Beliefs",        weight: 18, color: "#4FFFB0", desc: "The principles that guide your choices and non-negotiables." },
  { id: "D3", label: "Intellectual",             weight: 14, color: "#B48CFF", desc: "Curiosity, depth of thought, and how you explore ideas." },
  { id: "D4", label: "Relational Patterns",      weight: 13, color: "#00ccff", desc: "How you give and receive love, and navigate closeness." },
  { id: "D5", label: "Life Architecture",        weight: 12, color: "#F5C842", desc: "How you structure ambition, rest, and what success means." },
  { id: "D6", label: "Family & Future",          weight: 11, color: "#ff8c61", desc: "Your relationship with family, tradition, and building forward." },
  { id: "D7", label: "Financial Alignment",      weight: 8,  color: "#a8ff78", desc: "How you relate to money — security, abundance, and risk." },
  { id: "D8", label: "Physical & Lifestyle",     weight: 7,  color: "#60a5fa", desc: "Health, energy, and how you inhabit your body and time." },
  { id: "D9", label: "Spiritual & Meaning",      weight: 5,  color: "#f472b6", desc: "Your relationship to purpose, transcendence, and meaning." },
  { id: "D10", label: "Astrological",            weight: 2,  color: "#fbbf24", desc: "Cosmic patterns and their resonance with your nature." },
];

// ─── Derive scores from profile data ─────────────────────────────────────────
function deriveDimensionScores(profile: Profile): number[] {
  const d1 = profile.attachment === "Secure" ? 88 : profile.attachment === "Anxious" ? 65 : profile.attachment === "Avoidant" ? 58 : 50;
  const d2 = Math.min(95, 55 + (profile.coreValues?.length || 0) * 9);
  const summaryLen = (profile.summary || "").length;
  const d3 = summaryLen > 200 ? 84 : summaryLen > 100 ? 72 : 60;
  const d4 = profile.loveLanguage ? 78 : 62;
  const d5 = profile.lifeArchitecture ? 80 : 65;
  const d6 = profile.familyExpectations ? (profile.wantsKids ? 86 : 74) : (profile.wantsKids ? 68 : 58);
  const d7 = profile.intent === "serious" || profile.intent === "marriage" ? 80 : 68;
  const ex = profile.exercise === "often" ? 90 : profile.exercise === "sometimes" ? 70 : 45;
  const dr = profile.drinking === "never" ? 95 : profile.drinking === "social" ? 78 : 55;
  const d8 = Math.round((ex + dr) / 2);
  const d9 = Math.min(90, Math.round(52 + (profile.readinessScore || 50) * 0.32));
  const d10 = profile.zodiac ? 75 : 55;
  return [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];
}

function getDimensionInsight(dimId: string, score: number, profile: Profile): string {
  switch (dimId) {
    case "D1": return score >= 75
      ? `Your ${profile.attachment} attachment style reflects genuine emotional availability. You can hold space for others without losing yourself — that's rare.`
      : `Your attachment patterns (${profile.attachment}) show areas for growth. Awareness is the first step to transformation.`;
    case "D2": return score >= 75
      ? `You've articulated ${profile.coreValues?.length || 0} core values clearly. That clarity is rare and deeply attractive to the right person.`
      : "Deepening your value vocabulary will sharpen who you look for and what you're building toward.";
    case "D3": return score >= 75
      ? "Your responses show nuanced thinking and genuine curiosity. You'd thrive with someone who can match your depth."
      : "Intellectual connection grows through shared curiosity — you're actively building it.";
    case "D4": return profile.loveLanguage
      ? `Your love language (${profile.loveLanguage}) is clear, which means you can ask for what you need instead of waiting to be seen.`
      : "Understanding how you give and receive love will transform your relationships from the inside out.";
    case "D5": return profile.lifeArchitecture
      ? "Your life architecture is intentional. You know what balance looks like for you — that's a gift to whoever shares your life."
      : "Clarifying what success looks like across all domains will attract someone whose direction aligns with yours.";
    case "D6": return profile.familyExpectations
      ? "Your family expectations are clearly held. That groundedness is essential for long-term compatibility."
      : "Your family vision is still forming — that openness can be a strength when held with intention.";
    case "D7": return score >= 75
      ? "Your relationship intent signals financial seriousness and stability. That's deeply reassuring to a partner building something real."
      : "Financial alignment becomes more important as relationships deepen. Worth sitting with.";
    case "D8": return score >= 75
      ? "Your lifestyle habits show you value your body and energy. That vitality is contagious and deeply attractive."
      : score >= 55 ? "Your lifestyle is balanced — room to grow in either direction. Small shifts compound."
      : "Energy is the foundation of everything. Small improvements here create outsized returns.";
    case "D9": return "Your relationship to meaning and purpose shapes who you'll build a life with — and what kind of life that becomes.";
    case "D10": return profile.zodiac
      ? `As a ${profile.zodiac}, your cosmic blueprint adds a layer of self-understanding that many overlook. Maahi uses it as one of 10 lenses.`
      : "Add your birthday to unlock your astrological dimension — the final 2% that rounds out your soul profile.";
    default: return "";
  }
}

// ─── Radar Chart ──────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: number[] }) {
  const cx = 110, cy = 110, maxR = 82;
  const n = scores.length;
  const step = (2 * Math.PI) / n;
  const start = -Math.PI / 2;

  const getXY = (i: number, r: number) => ({
    x: cx + r * Math.cos(start + i * step),
    y: cy + r * Math.sin(start + i * step),
  });

  const scorePts = scores.map((s, i) => getXY(i, (s / 100) * maxR));
  const polyStr = scorePts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const shortLabels = ["Emo", "Val", "Int", "Rel", "Life", "Fam", "Fin", "Phy", "Spi", "Ast"];

  return (
    <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
      {gridLevels.map((lvl, gi) => (
        <polygon key={gi}
          points={Array.from({ length: n }, (_, i) => {
            const p = getXY(i, lvl * maxR);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8"
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const end = getXY(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />;
      })}
      <polygon points={polyStr} fill="rgba(212,104,138,0.13)" stroke="#d4688a" strokeWidth="1.5" strokeLinejoin="round" />
      {scorePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={DIMENSIONS[i].color} opacity={0.9} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const lp = getXY(i, maxR + 18);
        return (
          <text key={i} x={lp.x} y={lp.y} fontSize="7" fill="rgba(255,255,255,0.38)"
            textAnchor="middle" dominantBaseline="middle">
            {shortLabels[i]}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Photo Carousel ───────────────────────────────────────────────────────────
function PhotoCarousel({ photos, name, zodiacEmoji, onEdit }: {
  photos: string[];
  name: string;
  zodiacEmoji: string;
  onEdit?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const has = photos.length > 0;

  const next = () => setIdx(i => (i + 1) % photos.length);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "62svh", background: "#0d0d14", overflow: "hidden" }}
      onTouchStart={e => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={e => {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        setTouchStart(null);
      }}
    >
      {has ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[idx]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {photos.length > 1 && (
            <>
              <div onClick={prev} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "40%", cursor: "pointer" }} />
              <div onClick={next} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "40%", cursor: "pointer" }} />
              <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
                {photos.map((_, i) => (
                  <div key={i} style={{ width: i === idx ? 20 : 6, height: 3, borderRadius: 999, background: i === idx ? "#fff" : "rgba(255,255,255,0.38)", transition: "all 0.2s" }} />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, rgba(212,104,138,0.10), rgba(180,140,255,0.07))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,104,138,0.2), rgba(180,140,255,0.15))", border: "1.5px solid rgba(212,104,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>
            {zodiacEmoji || name?.[0]?.toUpperCase() || "?"}
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>Add photos to your profile</p>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "linear-gradient(to top, #0A0A0F, transparent)", pointerEvents: "none" }} />
      {onEdit && (
        <button onClick={onEdit} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Pill({ children, color = "#4FFFB0" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "5px 13px", borderRadius: 999, fontSize: 12, fontWeight: 500, background: `${color}14`, color, border: `1px solid ${color}28` }}>
      {children}
    </span>
  );
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
    </div>
  );
}

// ─── Tab: Soul ────────────────────────────────────────────────────────────────
function SoulTab({ profile }: { profile: Profile }) {
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 28 }}>
      {(profile.offers || []).length > 0 ? (
        <div>
          <SLabel>What I bring</SLabel>
          {(profile.offers || []).map((o, i) => (
            <p key={i} style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 8px", fontStyle: "italic" }}>
              &ldquo;{o}&rdquo;
            </p>
          ))}
        </div>
      ) : profile.summary ? (
        <div>
          <SLabel>About me</SLabel>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            &ldquo;{profile.summary}&rdquo;
          </p>
        </div>
      ) : null}

      {(profile.coreValues || []).length > 0 && (
        <div>
          <SLabel>Core Values</SLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.coreValues || []).map((v, i) => <Pill key={`${v}-${i}`} color="#4FFFB0">{v}</Pill>)}
          </div>
        </div>
      )}

      {(profile.strengths || []).length > 0 && (
        <div>
          <SLabel>Strengths</SLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.strengths || []).map((s, i) => <Pill key={`${s}-${i}`} color="#d4688a">{s}</Pill>)}
          </div>
        </div>
      )}

      <div>
        <SLabel>Looking for</SLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {profile.intent && <Pill color="#B48CFF">{profile.intent === "serious" ? "Serious relationship" : profile.intent === "marriage" ? "Marriage" : profile.intent === "casual" ? "Something casual" : "Still exploring"}</Pill>}
          {profile.wantsKids && <Pill color="#B48CFF">{profile.wantsKids === "yes" ? "Wants kids" : profile.wantsKids === "no" ? "No kids" : "Open to kids"}</Pill>}
          {profile.hasKids != null && <Pill color="#B48CFF">{profile.hasKids ? "Has kids" : "No kids yet"}</Pill>}
        </div>
      </div>

      <div>
        <SLabel>Lifestyle</SLabel>
        <InfoRow label="Exercise" value={profile.exercise} />
        <InfoRow label="Drinking" value={profile.drinking} />
        <InfoRow label="Smoking" value={profile.smoking} />
      </div>
    </div>
  );
}

// ─── Tab: Dimensions ──────────────────────────────────────────────────────────
function DimensionsTab({ profile }: { profile: Profile }) {
  const scores = deriveDimensionScores(profile);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <RadarChart scores={scores} />
      </div>

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "0 0 24px", letterSpacing: "0.06em" }}>
        Tap any dimension to see Maahi&apos;s insight
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {DIMENSIONS.map((dim, i) => {
          const score = scores[i];
          const open = expanded === i;
          return (
            <div key={dim.id} onClick={() => setExpanded(open ? null : i)}
              style={{ borderRadius: 14, border: `1px solid ${open ? dim.color + "35" : "rgba(255,255,255,0.06)"}`, background: open ? `${dim.color}09` : "rgba(255,255,255,0.02)", padding: "13px 15px", cursor: "pointer", transition: "all 0.18s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: dim.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{dim.label}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 8 }}>{dim.weight}%</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: dim.color, marginRight: 10 }}>{score}</span>
                <div style={{ width: 52, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ height: "100%", width: `${score}%`, background: dim.color, borderRadius: 999, transition: "width 0.9s ease" }} />
                </div>
              </div>
              {open && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${dim.color}18` }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: "0 0 12px" }}>{dim.desc}</p>
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: `${dim.color}0b`, border: `1px solid ${dim.color}1e` }}>
                    <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: dim.color, margin: "0 0 6px" }}>Maahi sees</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
                      {getDimensionInsight(dim.id, score, profile)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Life ────────────────────────────────────────────────────────────────
function LifeTab({ profile }: { profile: Profile }) {
  const zodiacEmoji = profile.zodiac ? (ZODIAC_EMOJI[profile.zodiac] || "") : "";
  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
      {profile.familyExpectations && (
        <div>
          <SLabel>Family expectations</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{profile.familyExpectations}</p>
        </div>
      )}
      {profile.conflictStyle && (
        <div>
          <SLabel>How I handle conflict</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{profile.conflictStyle}</p>
        </div>
      )}
      {profile.lifeArchitecture && (
        <div>
          <SLabel>Life architecture</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>{profile.lifeArchitecture}</p>
        </div>
      )}
      {(profile.dealbreakers || []).length > 0 && (
        <div>
          <SLabel>Dealbreakers</SLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.dealbreakers || []).map(d => (
              <span key={d} style={{ display: "inline-block", padding: "5px 13px", borderRadius: 999, fontSize: 12, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>{d}</span>
            ))}
          </div>
        </div>
      )}
      {(profile.partnerAgeMin || profile.partnerAgeMax) && (
        <div>
          <SLabel>Partner age range</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", margin: 0 }}>
            {profile.partnerAgeMin && profile.partnerAgeMax ? `${profile.partnerAgeMin} – ${profile.partnerAgeMax} years` : profile.partnerAgeMin ? `${profile.partnerAgeMin}+` : `Up to ${profile.partnerAgeMax}`}
          </p>
        </div>
      )}
      {profile.zodiac && (
        <div>
          <SLabel>Astrological</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", margin: 0 }}>
            {zodiacEmoji} {profile.zodiac} · D10 compatibility considered in matching
          </p>
        </div>
      )}
      <div>
        <SLabel>Partner preferences</SLabel>
        <InfoRow label="Gender seeking" value={profile.partnerGender} />
        <InfoRow label="Orientation" value={profile.orientation} />
      </div>
    </div>
  );
}

// ─── Tab: You (private soul mirror) ──────────────────────────────────────────
function YouTab({ profile, onLogout, onRedo }: { profile: Profile; onLogout: () => void; onRedo: () => void }) {
  const score = profile.readinessScore || 50;
  const arcColor = score >= 70 ? "#4FFFB0" : score >= 45 ? "#F5C842" : "#d4688a";
  const r = 52, circ = 2 * Math.PI * r;
  const arcLen = (240 / 360) * circ;
  const filled = (score / 100) * arcLen;

  return (
    <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "fit-content" }}>
        <span style={{ fontSize: 10 }}>🔒</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Only you see this</span>
      </div>

      {/* Readiness */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 20px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ position: "relative", width: 96, height: 76, flexShrink: 0 }}>
          <svg viewBox="0 0 120 96" style={{ width: "100%", height: "100%" }}>
            <circle cx="60" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arcLen} ${circ}`} transform="rotate(150 60 68)" />
            <circle cx="60" cy="68" r={r} fill="none" stroke={arcColor} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${filled} ${circ}`} transform="rotate(150 60 68)" style={{ transition: "stroke-dasharray 1.4s ease" }} />
          </svg>
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: arcColor, display: "block", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}>Readiness</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 5px" }}>Love Readiness</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
            {score >= 70 ? "You're emotionally available and actively choosing love."
              : score >= 45 ? "Building toward readiness — some edges still to smooth."
              : "Meaningful growth ahead before you fully invite love in."}
          </p>
        </div>
      </div>

      {/* Attachment */}
      <div style={{ padding: "18px 20px", borderRadius: 18, border: "1px solid rgba(212,104,138,0.18)", background: "rgba(212,104,138,0.05)" }}>
        <SLabel>Attachment Profile</SLabel>
        <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{profile.attachment}</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", margin: 0, lineHeight: 1.65 }}>
          {profile.attachment === "Secure" && "You can hold space for others without losing yourself. That's genuinely rare."}
          {profile.attachment === "Anxious" && "You feel deeply and love hard. Your growth edge is trusting that love doesn't require chasing."}
          {profile.attachment === "Avoidant" && "You protect what matters. Your growth edge is letting closeness feel safe, not threatening."}
          {profile.attachment === "Fearful-Avoidant" && "You want closeness and safety both. They can coexist — that's your journey."}
        </p>
      </div>

      {/* Love language + needs */}
      {profile.loveLanguage && (
        <div>
          <SLabel>Love Language</SLabel>
          <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{profile.loveLanguage}</p>
          {(profile.needs || []).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {(profile.needs || []).map(n => (
                <span key={n} style={{ display: "inline-block", padding: "5px 13px", borderRadius: 999, fontSize: 12, color: "rgba(180,140,255,0.85)", border: "1px solid rgba(180,140,255,0.22)", background: "rgba(180,140,255,0.07)" }}>{n}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Growth areas */}
      {(profile.growthAreas || []).length > 0 && (
        <div>
          <SLabel>Growing toward</SLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(profile.growthAreas || []).map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "#d4688a", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{g}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching focus */}
      {profile.coachingFocus && (
        <div style={{ padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(180,140,255,0.18)", background: "rgba(180,140,255,0.06)" }}>
          <SLabel>Maahi&apos;s focus for you</SLabel>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
            &ldquo;{profile.coachingFocus}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={onRedo} style={{ width: "100%", padding: "14px 0", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.48)", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
          Redo soul discovery
        </button>
        <button onClick={onLogout} style={{ width: "100%", padding: "14px 0", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "rgba(212,104,138,0.7)", background: "transparent", border: "1px solid rgba(212,104,138,0.2)", cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function YouPage() {
  const router = useRouter();
  const { profile, loading, logout } = useAuth();
  const [tab, setTab] = useState<"soul" | "dimensions" | "life" | "you">("soul");

  useEffect(() => {
    if (!loading && !profile) router.push("/onboarding");
  }, [loading, profile, router]);

  if (loading || !profile) return null;

  const zodiacEmoji = profile.zodiac ? (ZODIAC_EMOJI[profile.zodiac] || "") : "";
  const readiness = profile.readinessScore || 50;
  const readyColor = readiness >= 70 ? "#4FFFB0" : readiness >= 45 ? "#F5C842" : "#d4688a";

  const TABS = [
    { key: "soul" as const, label: "Soul" },
    { key: "dimensions" as const, label: "Dimensions" },
    { key: "life" as const, label: "Life" },
    { key: "you" as const, label: "You" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#0A0A0F", paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}>
      {/* Ambient */}
      <div aria-hidden style={{ position: "fixed", top: "-8%", left: "-12%", width: 320, height: 320, borderRadius: "50%", background: "#d4688a", opacity: 0.055, filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />

      <PhotoCarousel photos={profile.photos || []} name={profile.name} zodiacEmoji={zodiacEmoji} onEdit={() => {}} />

      {/* Identity strip */}
      <div style={{ position: "relative", zIndex: 10, padding: "22px 20px 0", background: "#0A0A0F" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.025em" }}>
              {profile.name}{profile.age ? `, ${profile.age}` : ""}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", margin: 0 }}>
              {[profile.city, zodiacEmoji ? `${zodiacEmoji} ${profile.zodiac}` : profile.zodiac].filter(Boolean).join("  ·  ")}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
            {profile.intent && (
              <span style={{ fontSize: 11, padding: "4px 11px", borderRadius: 999, background: "rgba(180,140,255,0.12)", color: "#B48CFF", border: "1px solid rgba(180,140,255,0.22)", textTransform: "capitalize" }}>
                {profile.intent}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: readyColor, boxShadow: `0 0 8px ${readyColor}` }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>{readiness}% ready</span>
            </div>
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

      <div style={{ position: "relative", zIndex: 10 }}>
        {tab === "soul" && <SoulTab profile={profile} />}
        {tab === "dimensions" && <DimensionsTab profile={profile} />}
        {tab === "life" && <LifeTab profile={profile} />}
        {tab === "you" && <YouTab profile={profile} onLogout={logout} onRedo={() => router.push("/onboarding")} />}
      </div>
    </div>
  );
}
