"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ZODIAC_EMOJI } from "@/lib/zodiac";

function ReadinessArc({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  // Arc spans 240 degrees (from 150° to 30° going clockwise, top-centered)
  const arcLength = (240 / 360) * circ;
  const filled = (score / 100) * arcLength;
  const color = score >= 70 ? "#4FFFB0" : score >= 45 ? "#F5C842" : "#d4688a";

  return (
    <div style={{ position: "relative", width: 120, height: 96 }}>
      <svg viewBox="0 0 120 96" style={{ width: "100%", height: "100%" }}>
        {/* Track arc */}
        <circle
          cx="60" cy="68" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circ}`}
          strokeDashoffset={0}
          transform="rotate(150 60 68)"
        />
        {/* Filled arc */}
        <circle
          cx="60" cy="68" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={0}
          transform="rotate(150 60 68)"
          style={{ transition: "stroke-dasharray 1.4s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, color, display: "block", lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)" }}>
          Readiness
        </span>
      </div>
    </div>
  );
}

function Pill({
  children,
  color = "#4FFFB0",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: `${color}12`,
        color,
        border: `1px solid ${color}28`,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.3)",
        margin: "0 0 12px",
      }}
    >
      {children}
    </p>
  );
}

export default function YouPage() {
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
          top: "-8%",
          left: "-12%",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "#d4688a",
          opacity: 0.06,
          filter: "blur(90px)",
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
        {/* Soul Card */}
        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(212,104,138,0.15)",
            background: "linear-gradient(145deg, rgba(22,16,30,0.97), rgba(14,11,20,0.99))",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,104,138,0.05)",
            padding: "28px 24px",
            marginBottom: 20,
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div>
              {/* Avatar */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(212,104,138,0.2), rgba(180,140,255,0.15))",
                  border: "1.5px solid rgba(212,104,138,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  marginBottom: 10,
                }}
              >
                {zodiacEmoji || profile.name?.[0]?.toUpperCase() || "?"}
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>
                {profile.name}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {[profile.zodiac, profile.city].filter(Boolean).join(" · ")}
              </p>
            </div>
            <ReadinessArc score={profile.readinessScore || 50} />
          </div>

          {/* Summary */}
          {profile.summary && (
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.65,
                margin: "0 0 22px",
                fontStyle: "italic",
              }}
            >
              {profile.summary}
            </p>
          )}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(212,104,138,0.15), transparent)",
              marginBottom: 22,
            }}
          />

          {/* Attachment */}
          <div style={{ marginBottom: 22 }}>
            <SectionLabel>Attachment Style</SectionLabel>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
              {profile.attachment}
            </p>
            {profile.loveLanguage && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
                Love language: {profile.loveLanguage}
              </p>
            )}
          </div>

          {/* Core Values */}
          {(profile.coreValues || []).length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <SectionLabel>Core Values</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(profile.coreValues || []).map((v) => (
                  <Pill key={v} color="#4FFFB0">{v}</Pill>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {(profile.strengths || []).length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <SectionLabel>Strengths</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(profile.strengths || []).map((s) => (
                  <Pill key={s} color="#d4688a">{s}</Pill>
                ))}
              </div>
            </div>
          )}

          {/* Growth Areas */}
          {(profile.growthAreas || []).length > 0 && (
            <div>
              <SectionLabel>Growing toward</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(profile.growthAreas || []).slice(0, 3).map((g) => (
                  <span
                    key={g}
                    style={{
                      display: "inline-block",
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Card footer */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              BiggDate
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>
              biggdate.app
            </span>
          </div>
        </div>

        {/* Details strip */}
        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            padding: "4px 0",
            marginBottom: 20,
          }}
        >
          {[
            { label: "Age", value: profile.age },
            { label: "Gender", value: profile.gender },
            { label: "Orientation", value: profile.orientation },
            { label: "Intent", value: profile.intent },
            { label: "Drinking", value: profile.drinking },
            { label: "Smoking", value: profile.smoking },
          ]
            .filter((d) => d.value)
            .map((d, i, arr) => (
              <div key={d.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "13px 20px",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{d.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{d.value}</span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 20px" }} />
                )}
              </div>
            ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => router.push("/onboarding")}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            Redo soul discovery
          </button>
          <button
            onClick={handleReset}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(212,104,138,0.7)",
              background: "transparent",
              border: "1px solid rgba(212,104,138,0.2)",
              cursor: "pointer",
            }}
          >
            Reset &amp; log out
          </button>
        </div>
      </div>
    </div>
  );
}
