"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CONSENT_KEY = "bd_analytics_consent";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("bd:consent-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("bd:consent-changed", callback);
  };
}

function readConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

// Cookie consent prompt for GDPR (EU) and India DPDP 2023.
// Visible until the user picks "Accept" or "Decline". Once a choice is made
// the answer persists in localStorage so we never re-prompt for the same
// device. AnalyticsScripts gates GTM/Meta Pixel/Clarity on this key.
//
// useSyncExternalStore avoids the SSR hydration mismatch: the server
// snapshot returns null (banner suppressed) and the client reads
// localStorage after hydration.
export function ConsentBanner() {
  const state = useSyncExternalStore<"granted" | "denied" | null>(
    subscribe,
    readConsent,
    () => null,
  );

  const decide = (next: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // localStorage can throw in private mode / strict ITP — fail open and
      // dispatch the event so any in-memory listeners still react.
    }
    window.dispatchEvent(new CustomEvent("bd:consent-changed"));
  };

  if (state !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics consent"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        zIndex: 80,
        margin: "0 auto",
        maxWidth: 520,
        padding: "16px 18px",
        borderRadius: 18,
        background: "rgba(16,16,22,0.96)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        backdropFilter: "blur(14px)",
        color: "#fff",
        fontSize: 13,
        lineHeight: 1.55,
      }}
    >
      <p style={{ margin: 0, color: "rgba(255,255,255,0.78)" }}>
        We use analytics (Google, Meta, Microsoft Clarity) to understand how
        BiggDate is used and improve it. Essential cookies for sign-in and
        safety always run.
      </p>
      <p style={{ margin: "6px 0 14px", color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
        See our{" "}
        <Link href="/privacy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
          Privacy Policy
        </Link>
        . You can change this any time in Settings.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => decide("denied")}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #eb987f 0%, #d8698c 42%, #6d58ff 100%)",
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Accept analytics
        </button>
      </div>
    </div>
  );
}
