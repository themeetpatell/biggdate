"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeatureItem {
  label: string;
  hint: string;
  href: string;
}

export type CelebrationKind = "premium" | "addon";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: CelebrationKind;
  addonLabel?: string;
  addonHref?: string;
  addonHint?: string;
}

const PREMIUM_FEATURES: FeatureItem[] = [
  { label: "Maahi sessions",    hint: "15 deep coaching sessions a week", href: "/companion" },
  { label: "See who liked you", hint: "No more guessing",                 href: "/dashboard" },
  { label: "Life Preview",      hint: "2 vivid future-self previews/mo",  href: "/matches"   },
  { label: "Profile Boost",     hint: "Rise to the top once a week",      href: "/profile"   },
];

const SPARKLE_POSITIONS: Array<{ top: string; left: string; delay: string; size: string }> = [
  { top: "8%",  left: "12%", delay: "0ms",   size: "8px"  },
  { top: "14%", left: "82%", delay: "120ms", size: "10px" },
  { top: "28%", left: "6%",  delay: "240ms", size: "6px"  },
  { top: "22%", left: "92%", delay: "60ms",  size: "12px" },
  { top: "45%", left: "4%",  delay: "300ms", size: "9px"  },
  { top: "52%", left: "94%", delay: "180ms", size: "7px"  },
  { top: "68%", left: "10%", delay: "360ms", size: "10px" },
  { top: "72%", left: "86%", delay: "90ms",  size: "8px"  },
  { top: "85%", left: "20%", delay: "210ms", size: "6px"  },
  { top: "88%", left: "76%", delay: "330ms", size: "11px" },
  { top: "5%",  left: "48%", delay: "150ms", size: "9px"  },
  { top: "92%", left: "50%", delay: "270ms", size: "7px"  },
];

export function UpgradeCelebrationModal({
  open,
  onOpenChange,
  kind,
  addonLabel,
  addonHref = "/profile",
  addonHint,
}: Props) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (open) {
      setShowSparkles(true);
      const t = setTimeout(() => setShowSparkles(false), 2400);
      return () => clearTimeout(t);
    }
  }, [open]);

  const isPremium = kind === "premium";
  const title = isPremium ? "Welcome to Premium" : `${addonLabel ?? "Add-on"} unlocked`;
  const subtitle = isPremium
    ? "You just unlocked the full BiggDate experience. Here's what's new for you:"
    : addonHint ?? "Your perk is active right now. Use it whenever you're ready.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[460px] border-white/8 bg-[#0c0e1a] p-0 overflow-hidden gap-0"
      >
        {showSparkles && (
          <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
            {SPARKLE_POSITIONS.map((p, i) => (
              <span
                key={i}
                className="absolute animate-[sparkle_1.6s_ease-out_forwards] opacity-0"
                style={{
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                }}
              >
                <Sparkles
                  className="h-full w-full text-[#f58bc2]"
                  style={{ filter: "drop-shadow(0 0 6px rgba(245,139,194,0.7))" }}
                />
              </span>
            ))}
          </div>
        )}

        <div className="relative overflow-hidden border-b border-white/8 px-6 pt-8 pb-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,104,138,0.28),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,139,194,0.6),transparent)]" />

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] text-white/50 transition hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d4688a,#b48cff)] shadow-[0_0_36px_rgba(212,104,138,0.55)]">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <DialogTitle className="mt-4 text-[22px] font-bold tracking-tight text-white leading-tight">
              {title}
            </DialogTitle>
            <p className="mt-1.5 max-w-[340px] text-[13px] text-white/60 leading-snug">
              {subtitle}
            </p>
          </div>
        </div>

        {isPremium ? (
          <>
            <div className="px-5 py-4">
              <ul className="flex flex-col gap-1">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f.label}>
                    <Link
                      href={f.href}
                      onClick={() => onOpenChange(false)}
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-white/8 hover:bg-white/[0.04]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d4688a]/15 text-[#f58bc2]">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-semibold text-white/90 leading-tight">
                          {f.label}
                        </span>
                        <span className="block text-[11px] text-white/40 leading-tight mt-0.5">
                          {f.hint}
                        </span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-white/6 bg-white/[0.02] px-5 py-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full rounded-xl bg-[linear-gradient(135deg,#d4688a,#b48cff)] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(212,104,138,0.35)] transition hover:opacity-95"
              >
                Start exploring
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-5">
            <Link
              href={addonHref}
              onClick={() => onOpenChange(false)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#d4688a,#b48cff)] px-4 py-3 text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(212,104,138,0.35)] transition hover:opacity-95"
            >
              Use it now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-2 w-full rounded-xl px-4 py-2 text-[12px] font-semibold text-white/55 transition hover:text-white/80"
            >
              Maybe later
            </button>
          </div>
        )}
      </DialogContent>

      <style jsx global>{`
        @keyframes sparkle {
          0%   { opacity: 0; transform: scale(0.3) rotate(0deg); }
          30%  { opacity: 1; transform: scale(1.2) rotate(45deg); }
          70%  { opacity: 1; transform: scale(1) rotate(120deg); }
          100% { opacity: 0; transform: scale(0.6) rotate(180deg); }
        }
      `}</style>
    </Dialog>
  );
}
