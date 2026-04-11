"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

// ─── Attachment descriptions — second person, warm, 2 sentences ───
const ATTACHMENT_DESC: Record<string, string> = {
  Secure:
    "You build trust steadily and show up without needing to be chased. People feel safe with you because your presence is consistent, not conditional.",
  Anxious:
    "You love with your whole chest — when you're in, you're all in. Learning to trust the quiet moments is your edge, and it's closer than you think.",
  Avoidant:
    "You build trust slowly and deeply. Once someone earns it, you're fiercely loyal — and that kind of love is rare.",
  "Fearful-Avoidant":
    "You want deep connection and you've also learned to protect yourself — both things are true and both are valid. Your growth edge is letting someone stay long enough to prove the fear wrong.",
};

function ReadinessRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const color =
    score >= 70 ? "#4FFFB0" : score >= 45 ? "#F5C842" : "#FF6B8A";

  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      <svg
        viewBox="0 0 88 88"
        style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
      >
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
          {score}
        </span>
        <span
          style={{
            fontSize: 8,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Ready
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "#4FFFB0",
        marginBottom: 10,
      }}
    >
      {children}
    </p>
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
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}

export default function SoulSnapshotPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push("/onboarding");
  }, [profile, loading, router]);

  if (loading || !profile) return null;

  const attachmentDesc =
    ATTACHMENT_DESC[profile.attachment] ??
    "You have a unique way of connecting — trust what you know about yourself.";

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `My Relationship Intelligence — ${profile!.attachment} | ${profile!.city} — `;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "My Relationship Intelligence", text, url });
      } catch {
        // user dismissed — no-op
      }
      return;
    }

    // Fallback: copy URL
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        paddingBottom: 100,
        position: "relative",
      }}
    >
      {/* Ambient orb */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-15%",
          right: "-10%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#4FFFB0",
          opacity: 0.06,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: "10%",
          left: "-12%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "#F5C842",
          opacity: 0.05,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 560,
          margin: "0 auto",
          padding: "40px 20px 0",
        }}
      >
        {/* Page title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#4FFFB0",
              marginBottom: 8,
            }}
          >
            Relationship Intelligence
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
            }}
          >
            Your Intelligence Card
          </h1>
        </div>

        {/* ── THE CARD ── */}
        <div
          id="intelligence-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(17,17,24,0.95) 0%, rgba(12,12,18,0.98) 100%)",
            border: "1px solid rgba(79,255,176,0.10)",
            borderRadius: 20,
            padding: "28px 24px",
            boxShadow:
              "0 0 0 1px rgba(79,255,176,0.04), 0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Card header — name + city + readiness ring */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {profile.name}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  margin: "4px 0 0",
                }}
              >
                {[profile.city, profile.zodiac].filter(Boolean).join(" · ")}
              </p>
            </div>
            <ReadinessRing score={profile.readinessScore || 50} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Attachment Style */}
            <div>
              <SectionLabel>Attachment Style</SectionLabel>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fff",
                  margin: "0 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {profile.attachment}
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {attachmentDesc}
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(79,255,176,0.12), transparent)",
              }}
            />

            {/* Core Values */}
            {(profile.coreValues || []).length > 0 && (
              <div>
                <SectionLabel>Core Values</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(profile.coreValues || []).map((v) => (
                    <Pill key={v} color="#4FFFB0">
                      {v}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {/* What You Offer */}
            {(profile.offers || []).length > 0 && (
              <div>
                <SectionLabel>What You Offer</SectionLabel>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(profile.offers || []).map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#4FFFB0",
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.7)",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What You Need */}
            {(profile.needs || []).length > 0 && (
              <div>
                <SectionLabel>What You Need</SectionLabel>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(profile.needs || []).map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#F5C842",
                          flexShrink: 0,
                          marginTop: 6,
                        }}
                      />
                      <p
                        style={{
                          fontSize: 14,
                          color: "rgba(255,255,255,0.7)",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Style */}
            {profile.conflictStyle && (
              <div>
                <SectionLabel>Communication Style</SectionLabel>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {profile.conflictStyle}
                </p>
              </div>
            )}

            {/* Growth Areas */}
            {(profile.growthAreas || []).length > 0 && (
              <div>
                <SectionLabel>Growth Areas</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {(profile.growthAreas || []).slice(0, 3).map((g) => (
                    <span
                      key={g}
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "transparent",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              BiggDate · BiggDate
            </span>
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.06em",
              }}
            >
              biggdate.app
            </span>
          </div>
        </div>

        {/* Share button */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={handleShare}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 24px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              color: "#0A0A0F",
              background: "#4FFFB0",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
          >
            {copied ? "Link copied!" : "Share my card"}
          </button>
        </div>
      </div>

      {/* Sticky action bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "#0A0A0F",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() => router.push("/onboarding")}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
            }}
          >
            Something&apos;s off
          </button>
          <button
            onClick={() => router.push("/report")}
            style={{
              flex: 2,
              padding: "12px 0",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              color: "#0A0A0F",
              background: "#B48CFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            This is me →
          </button>
        </div>
      </div>
    </div>
  );
}
