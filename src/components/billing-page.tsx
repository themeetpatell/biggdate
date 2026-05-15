"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BillingMode = "early_access" | "stripe";

type StatusBody = {
  plan: "free" | "premium" | "pro";
  status: "active" | "trialing" | "canceled" | "inactive";
  isPremium: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
};

interface Props {
  mode: BillingMode;
  whatsappNumber: string;
}

function whatsappLink(number: string, message: string): string {
  const cleaned = number.replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

function displayNumber(number: string): string {
  // Light formatting for India numbers: +91 98243 41414
  const digits = number.replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return number;
}

export function BillingPage({ mode, whatsappNumber }: Props) {
  const [status, setStatus] = useState<StatusBody | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/status");
      if (res.ok) {
        const data = (await res.json()) as StatusBody;
        setStatus(data);
      }
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  async function handleRedeem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/billing/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const body = (await res.json()) as { ok?: boolean; alreadyActive?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error ?? "Something went wrong. Try again.");
        return;
      }
      setCode("");
      setSuccess(
        body.alreadyActive
          ? "You're already on Premium. Nothing to do."
          : "Welcome to Premium. Refresh anywhere in the app to see your new perks.",
      );
      await loadStatus();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isPremium = status?.isPremium ?? false;
  const planLabel = status?.plan ?? "free";

  const message = `Hi! I'd like an early-access code for BiggDate.`;
  const wa = whatsappLink(whatsappNumber, message);

  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--bd-text)]">
          Membership
        </h1>
        <p className="mt-1 text-sm text-[var(--bd-text-muted)]">
          Your access status and how to upgrade.
        </p>
      </header>

      <section
        className="mb-6 rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg-strong)] p-5"
        aria-live="polite"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--bd-text-faint)]">
          Current plan
        </p>
        <div className="mt-2 flex items-center gap-2">
          {statusLoading ? (
            <span className="text-base text-[var(--bd-text-muted)]">Loading…</span>
          ) : (
            <>
              <span className="text-xl font-semibold capitalize text-[var(--bd-text)]">
                {planLabel}
              </span>
              {isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#d4688a]/15 px-2 py-0.5 text-[10px] font-bold text-[#f58bc2]">
                  <Sparkles className="size-3" aria-hidden /> Active
                </span>
              )}
            </>
          )}
        </div>
      </section>

      {mode === "early_access" ? (
        <>
          <section className="rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg-strong)] p-5">
            <h2 className="text-lg font-semibold text-[var(--bd-text)]">
              Got an access code?
            </h2>
            <p className="mt-1 text-sm text-[var(--bd-text-muted)]">
              We&apos;re in early access. Redeem your code below to unlock Premium for free.
            </p>

            <form onSubmit={handleRedeem} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter your code"
                aria-label="Access code"
                autoComplete="off"
                spellCheck={false}
                maxLength={64}
                disabled={submitting || isPremium}
                className="h-11 flex-1"
              />
              <Button
                type="submit"
                disabled={submitting || isPremium || code.trim().length === 0}
                className="h-11"
              >
                {submitting ? "Checking…" : isPremium ? "Already Premium" : "Redeem"}
              </Button>
            </form>

            {error && (
              <p role="alert" className="mt-3 text-sm text-[#ef8cab]">
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="mt-3 flex items-center gap-1.5 text-sm text-[#4FFFB0]"
              >
                <Check className="size-4" aria-hidden /> {success}
              </p>
            )}
          </section>

          <section className="mt-6 rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg)] p-5">
            <h2 className="text-base font-semibold text-[var(--bd-text)]">
              Don&apos;t have a code yet?
            </h2>
            <p className="mt-1 text-sm text-[var(--bd-text-muted)]">
              DM us on WhatsApp and we&apos;ll send you one personally.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--bd-border)] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[var(--bd-text)] transition hover:bg-white/[0.08]"
            >
              Message us on WhatsApp
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <p className="mt-3 text-xs text-[var(--bd-text-faint)]">
              {displayNumber(whatsappNumber)}
            </p>
          </section>

          <p className="mt-8 text-center text-xs text-[var(--bd-text-faint)]">
            Paid plans launch later. While we&apos;re building, early-access members get Premium for free.
          </p>
        </>
      ) : (
        <section className="rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg-strong)] p-5">
          <h2 className="text-lg font-semibold text-[var(--bd-text)]">Manage subscription</h2>
          <p className="mt-1 text-sm text-[var(--bd-text-muted)]">
            Open the plans sheet to subscribe or update billing.
          </p>
          <a
            href="/profile?upgrade=1"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d4688a,#b48cff)] px-4 py-2 text-sm font-semibold text-white"
          >
            See plans
          </a>
        </section>
      )}
    </main>
  );
}
