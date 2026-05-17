"use client";

import { Sparkles, RefreshCw } from "lucide-react";

interface AIChatFallbackProps {
  // Hook this to whatever retry surface the host chat exposes — useChat's
  // `regenerate` (or a custom retry function) is the natural target.
  onRetry: () => void;
  // Surface-specific copy.
  retryLabel?: string;
  hint?: string;
}

// Shared error-state for chat surfaces that use @ai-sdk/react useChat. Mirrors
// the matches/page.tsx inline fallback so users see a consistent "Maahi is
// catching her breath" experience whenever the AI side fails. Keeps AI
// degradation distinguishable from a healthy empty state.
export function AIChatFallback({
  onRetry,
  retryLabel = "Try again",
  hint,
}: AIChatFallbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: "20px 22px",
        borderRadius: 18,
        border: "1px solid rgba(245,200,66,0.22)",
        background: "linear-gradient(145deg, rgba(28,22,12,0.6), rgba(20,16,8,0.78))",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        margin: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles aria-hidden size={18} style={{ color: "var(--bd-warning)" }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--bd-warning)" }}>
          Maahi is catching her breath
        </p>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>
        {hint ??
          "Our AI side is briefly degraded. Your conversation is saved. Tap below to retry the last step in a moment."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        style={{
          marginTop: 2,
          padding: "10px 14px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          color: "var(--bd-bg)",
          background: "var(--bd-warning)",
          border: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          alignSelf: "flex-start",
        }}
      >
        <RefreshCw aria-hidden size={14} />
        {retryLabel}
      </button>
    </div>
  );
}
