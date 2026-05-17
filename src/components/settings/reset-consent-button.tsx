"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const CONSENT_KEY = "bd_analytics_consent";

export function ResetConsentButton() {
  const [status, setStatus] = useState<"idle" | "cleared">("idle");

  const handleReset = () => {
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch {
      // localStorage can throw in private mode; fall through and still notify
      // listeners so any in-memory state resets.
    }
    window.dispatchEvent(new CustomEvent("bd:consent-changed"));
    setStatus("cleared");
    window.setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="flex w-full items-center gap-4 rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg-strong)] px-4 py-4 text-left transition hover:bg-white/[0.04]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04]">
        <ShieldCheck className="size-4 text-[var(--bd-text)]" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block text-base font-semibold text-[var(--bd-text)]">
          Privacy &amp; analytics
        </span>
        <span className="block text-xs text-[var(--bd-text-muted)]">
          {status === "cleared"
            ? "Cleared. The consent prompt will reappear on the next page load."
            : "Re-show the consent prompt to change your analytics choice."}
        </span>
      </span>
    </button>
  );
}
