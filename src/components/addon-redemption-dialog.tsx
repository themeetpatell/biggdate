"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RedeemResponse {
  ok?: boolean;
  alreadyActive?: boolean;
  addonId?: string;
  addonLabel?: string;
  kind?: "one_time" | "subscription";
  usesRemaining?: number | null;
  expiresAt?: string | null;
  error?: string;
}

export interface AddonRedemptionTarget {
  addonId: string;
  name: string;
  desc: string;
  price: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: AddonRedemptionTarget | null;
  whatsappNumber: string;
  onRedeemed: (result: RedeemResponse) => void;
}

function whatsappLink(number: string, message: string): string {
  const cleaned = number.replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function AddonRedemptionDialog({
  open,
  onOpenChange,
  target,
  whatsappNumber,
  onRedeemed,
}: Props) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setCode("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!target) return null;

  const whatsappMessage = `Hi! I'd like a code for ${target.name} on BiggDate.`;
  const waHref = whatsappLink(whatsappNumber, whatsappMessage);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/billing/redeem-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const body = (await res.json()) as RedeemResponse;
      if (!res.ok || !body.ok) {
        setError(body.error ?? "That code didn't work. Try again.");
        return;
      }
      onRedeemed(body);
      onOpenChange(false);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[420px] border-white/8 bg-[#0c0e1a] p-0 overflow-hidden gap-0"
      >
        <div className="relative border-b border-white/8 px-5 pt-5 pb-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,104,138,0.18),transparent_60%)]" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#f58bc2]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f58bc2]">
                  Early Access
                </span>
              </div>
              <DialogTitle className="text-[18px] font-bold tracking-tight text-white leading-tight">
                Unlock {target.name}
              </DialogTitle>
              <p className="mt-1 text-[12px] text-white/55 leading-snug">{target.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-white/50 transition hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">
            Step 1 · Get your code
          </p>
          <p className="mt-1 text-[13px] text-white/70 leading-snug">
            DM us on WhatsApp and we&apos;ll send you a free code for {target.name}.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Message us on WhatsApp
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pt-5 pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40">
            Step 2 · Redeem it
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code"
              aria-label={`Access code for ${target.name}`}
              autoComplete="off"
              spellCheck={false}
              maxLength={64}
              disabled={submitting}
              className="h-10 flex-1"
            />
            <Button
              type="submit"
              disabled={submitting || code.trim().length === 0}
              className="h-10"
            >
              {submitting ? (
                "Checking…"
              ) : (
                <>
                  <Check className="size-3.5 mr-1" /> Redeem
                </>
              )}
            </Button>
          </div>
          {error && (
            <p role="alert" className="mt-3 text-[12px] text-[#ef8cab]">
              {error}
            </p>
          )}
        </form>

        <div className="border-t border-white/6 bg-white/[0.02] px-5 py-3">
          <p className="text-[10px] text-white/35 leading-tight">
            Paid plans launch later. Early-access members unlock add-ons free with a code.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
