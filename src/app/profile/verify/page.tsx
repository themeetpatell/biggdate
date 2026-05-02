"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";

export default function VerifyPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [status, setStatus] = useState<{ isVerified: boolean; hasLinkedin: boolean; hasSelfie: boolean } | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) { router.replace("/auth"); return; }
    fetch("/api/verification/status").then((r) => r.json()).then(setStatus);
  }, [userId, router]);

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSelfiePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      if (linkedinUrl) {
        const r = await fetch("/api/verification/linkedin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedinUrl }),
        });
        if (!r.ok) { setMessage("Invalid LinkedIn URL"); return; }
      }
      if (selfiePreview) {
        const r = await fetch("/api/verification/selfie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selfieUrl: selfiePreview }),
        });
        if (!r.ok) { setMessage("Selfie upload failed"); return; }
      }
      setMessage("Submitted! You'll get your pink tick once our team reviews it.");
      setStatus((prev) => prev
        ? { ...prev, hasLinkedin: Boolean(linkedinUrl || prev.hasLinkedin), hasSelfie: Boolean(selfiePreview || prev.hasSelfie) }
        : prev
      );
    } finally {
      setSaving(false);
    }
  };

  const card: React.CSSProperties = {
    background: "var(--bd-surface)", borderRadius: 16,
    border: "1px solid var(--bd-border)", padding: "18px 20px", marginBottom: 12,
  };

  if (!status) return <LoadingScreen message="Loading verification status…" />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bd-bg)", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 0" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push("/profile");
            }}
            style={{ background: "none", border: "none", color: "var(--bd-text-faint)", cursor: "pointer", fontSize: 22 }}
          >←</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--bd-text)", margin: 0 }}>Get Verified</h1>
        </div>

        {status.isVerified ? (
          <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #e91e8c, #ff6ec7)",
              marginBottom: 16,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--bd-text)", marginBottom: 6 }}>
              You&apos;re a Verified Builder
            </p>
            <p style={{ fontSize: 14, color: "var(--bd-text-faint)" }}>
              Your pink tick appears on all your Pulse posts.
            </p>
          </div>
        ) : (
          <>
            <div style={card}>
              <p style={{ fontSize: 14, color: "var(--bd-text-faint)", lineHeight: 1.6, margin: 0 }}>
                Verify your identity to earn a pink tick on Pulse. Your name stays hidden — the tick just shows you&apos;re a real person in the builder community.
              </p>
            </div>

            {/* LinkedIn */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--bd-text)" }}>LinkedIn Profile</span>
                {status.hasLinkedin && (
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>✓ Submitted</span>
                )}
              </div>
              <input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                style={{
                  width: "100%", background: "var(--bd-bg)",
                  border: "1px solid var(--bd-border)", borderRadius: 10,
                  padding: "10px 14px", fontSize: 14, color: "var(--bd-text)",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Selfie */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--bd-text)" }}>Selfie</span>
                {status.hasSelfie && (
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>✓ Submitted</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "var(--bd-text-faint)", marginBottom: 14 }}>
                A clear photo of your face. Used only for identity verification — never shown publicly.
              </p>
              <label style={{ cursor: "pointer" }}>
                <input type="file" accept="image/*" capture="user" onChange={handleSelfie} style={{ display: "none" }} />
                {selfiePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selfiePreview}
                    alt="Preview"
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12, border: "2px solid #e91e8c" }}
                  />
                ) : (
                  <div style={{
                    width: 100, height: 100, borderRadius: 12,
                    border: "2px dashed var(--bd-border)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 26 }}>📸</span>
                    <span style={{ fontSize: 11, color: "var(--bd-text-faint)" }}>Upload</span>
                  </div>
                )}
              </label>
            </div>

            {message && (
              <p style={{ fontSize: 14, color: "#22c55e", marginBottom: 14, lineHeight: 1.55 }}>{message}</p>
            )}

            <button
              onClick={submit}
              disabled={saving || (!linkedinUrl && !selfiePreview)}
              style={{
                width: "100%", padding: "14px",
                background: (!linkedinUrl && !selfiePreview) ? "var(--bd-border)" : "var(--bd-accent)",
                color: (!linkedinUrl && !selfiePreview) ? "var(--bd-text-faint)" : "black",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: (!linkedinUrl && !selfiePreview) ? "default" : "pointer",
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Submitting…" : "Submit for Verification"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
