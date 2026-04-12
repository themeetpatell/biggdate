"use client";

import { useState } from "react";
import { X, Check, Zap } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

/* ── Types ── */

type BillingInterval = "monthly" | "quarterly";
type PlanId = "free" | "premium" | "pro";

interface PlanDef {
  id: PlanId;
  name: string;
  monthlyPrice: number | null;
  quarterlyPrice: number | null;
  quarterlyBilled: number | null;
  ctaLabel: string;
  envKeyMonthly: string;
  envKeyQuarterly: string;
  featured?: boolean;
}

type FeatureValue = "—" | "✓" | string;

interface FeatureRow {
  label: string;
  free: FeatureValue;
  premium: FeatureValue;
  pro: FeatureValue;
}

interface AddOnDef {
  name: string;
  desc: string;
  price: string;
  envKey: string;
  type: "payment" | "subscription";
}

/* ── Data ── */

const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    quarterlyPrice: null,
    quarterlyBilled: null,
    ctaLabel: "Free",
    envKeyMonthly: "",
    envKeyQuarterly: "",
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 19.99,
    quarterlyPrice: 14.99,
    quarterlyBilled: 44.97,
    ctaLabel: "Start Free Trial",
    envKeyMonthly: "NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY",
    envKeyQuarterly: "NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY",
    featured: true,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 34.99,
    quarterlyPrice: 24.99,
    quarterlyBilled: 74.97,
    ctaLabel: "Get Pro",
    envKeyMonthly: "NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY",
    envKeyQuarterly: "NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY",
  },
];

const FEATURE_ROWS: FeatureRow[] = [
  { label: "Daily matches",     free: "5",     premium: "20",    pro: "∞"    },
  { label: "Intro requests",    free: "3",     premium: "15",    pro: "∞"    },
  { label: "Maahi sessions",    free: "3/wk",  premium: "15/wk", pro: "∞"    },
  { label: "Life Preview",      free: "—",     premium: "2/mo",  pro: "∞"    },
  { label: "Profile Boost",     free: "—",     premium: "1/wk",  pro: "3/wk" },
  { label: "See who liked you", free: "—",     premium: "✓",     pro: "✓"    },
  { label: "Priority matching", free: "—",     premium: "—",     pro: "✓"    },
  { label: "Undo last swipe",   free: "—",     premium: "✓",     pro: "✓"    },
  { label: "Incognito browse",  free: "—",     premium: "—",     pro: "✓"    },
];

const ADDONS: AddOnDef[] = [
  { name: "Profile Boost",      desc: "Rise to top for 1 hour",          price: "$4.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_BOOST",           type: "payment"      },
  { name: "Life Preview",       desc: "One preview with a match",         price: "$2.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW",    type: "payment"      },
  { name: "3× Life Previews",   desc: "Best value bundle",                price: "$5.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3",  type: "payment"      },
  { name: "Super Like",         desc: "Stand out to one match",           price: "$1.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_SUPER_LIKE",      type: "payment"      },
  { name: "Read Receipts",      desc: "See when intros are read",         price: "$3.99/mo", envKey: "NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS",   type: "subscription" },
  { name: "Incognito Mode",     desc: "Browse without appearing",         price: "$4.99/mo", envKey: "NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO",       type: "subscription" },
  { name: "Profile Review",     desc: "Maahi audits + rewrites you",      price: "$6.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_PROFILE_REVIEW",  type: "payment"      },
  { name: "Spotlight 24hr",     desc: "Featured placement all day",       price: "$7.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT",       type: "payment"      },
];

const ENV_MAP: Record<string, string | undefined> = {
  NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY:   process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY,
  NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY,
  NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY:       process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
  NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY:     process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY,
  NEXT_PUBLIC_STRIPE_PRICE_BOOST:             process.env.NEXT_PUBLIC_STRIPE_PRICE_BOOST,
  NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW:      process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW,
  NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3:    process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3,
  NEXT_PUBLIC_STRIPE_PRICE_SUPER_LIKE:        process.env.NEXT_PUBLIC_STRIPE_PRICE_SUPER_LIKE,
  NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS:     process.env.NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS,
  NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO:         process.env.NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO,
  NEXT_PUBLIC_STRIPE_PRICE_PROFILE_REVIEW:    process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFILE_REVIEW,
  NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT:         process.env.NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT,
};

/* ── Helpers ── */

function getPriceId(envKey: string): string {
  return ENV_MAP[envKey] ?? "";
}

async function startCheckout(type: "subscription" | "payment", priceId: string) {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, priceId }),
  });
  const data = await res.json() as { url?: string };
  if (data.url) window.location.href = data.url;
}

/* ── Sub-components ── */

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === "—") {
    return <span className="text-[11px] text-white/20">—</span>;
  }
  if (value === "✓") {
    return (
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#d4688a]/20">
        <Check className="h-2.5 w-2.5 text-[#f58bc2]" />
      </span>
    );
  }
  return <span className="text-[11px] font-medium text-white/70">{value}</span>;
}

/* ── Main Component ── */

export function UpgradeSheet({
  open,
  onOpenChange,
  context,
  currentPlan = "free",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
  currentPlan?: PlanId;
}) {
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [loadingAddon, setLoadingAddon] = useState<string | null>(null);

  const handleSubscribe = async (plan: PlanDef) => {
    if (plan.id === "free" || plan.id === currentPlan) return;
    setLoadingPlan(plan.id);
    const envKey = billing === "monthly" ? plan.envKeyMonthly : plan.envKeyQuarterly;
    try {
      await startCheckout("subscription", getPriceId(envKey));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleAddon = async (addon: AddOnDef) => {
    setLoadingAddon(addon.envKey);
    try {
      await startCheckout(addon.type, getPriceId(addon.envKey));
    } finally {
      setLoadingAddon(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-[420px] border-white/8 bg-[#0c0e1a] p-0 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#0c0e1a] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#f58bc2]" />
            <span className="text-[13px] font-semibold bg-[linear-gradient(90deg,#f58bc2,#b48cff)] bg-clip-text text-transparent">
              BiggDate Plans
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.07] text-white/50 transition hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden px-4 pb-4 pt-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,104,138,0.18),transparent_60%)]" />
          <h2 className="relative text-xl font-bold tracking-tight text-white leading-tight">
            Go deeper.<br />Connect better.
          </h2>
          {context && (
            <p className="relative mt-1.5 text-[12px] text-white/45 leading-4">{context}</p>
          )}
        </div>

        {/* Billing toggle */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="flex rounded-lg bg-white/[0.06] p-1 gap-0.5 w-fit">
            {(["monthly", "quarterly"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setBilling(opt)}
                className={[
                  "rounded-md px-4 py-1.5 text-[12px] font-semibold transition",
                  billing === opt ? "bg-white/15 text-white" : "text-white/40 hover:text-white/60",
                ].join(" ")}
              >
                {opt === "monthly" ? "Monthly" : "Quarterly"}
              </button>
            ))}
          </div>
          {billing === "quarterly" && (
            <span className="rounded-full bg-[#4FFFB0]/15 px-2 py-0.5 text-[9px] font-bold text-[#4FFFB0] leading-none">
              SAVE 25%
            </span>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-3 gap-2 px-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const price =
              billing === "quarterly" && plan.quarterlyPrice != null
                ? plan.quarterlyPrice
                : plan.monthlyPrice;
            const billedNote =
              billing === "quarterly" && plan.quarterlyBilled != null
                ? `$${plan.quarterlyBilled}/qtr`
                : null;

            return (
              <div
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-xl border p-2.5",
                  plan.featured
                    ? "border-[#d4688a]/45 bg-[#d4688a]/[0.06] shadow-[0_0_24px_rgba(212,104,138,0.1)]"
                    : "border-white/8 bg-white/[0.03]",
                ].join(" ")}
              >
                {plan.featured && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#d4688a,#b48cff)] px-2 py-0.5 text-[8px] font-bold text-white leading-tight">
                    ★ POPULAR
                  </span>
                )}

                <p className="mt-1 text-[11px] font-semibold text-white/45">{plan.name}</p>

                <div className="mt-1 mb-0.5">
                  {price === 0 ? (
                    <p className="text-[15px] font-bold text-white leading-none">Free</p>
                  ) : (
                    <>
                      <p className="text-[15px] font-bold text-white leading-none">
                        ${price}
                        <span className="text-[9px] font-normal text-white/35">/mo</span>
                      </p>
                      {billedNote ? (
                        <p className="text-[9px] text-white/28 mt-0.5">Billed {billedNote}</p>
                      ) : (
                        <p className="text-[9px] text-white/28 mt-0.5">per month</p>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrent || plan.id === "free" || loadingPlan === plan.id}
                  className={[
                    "mt-auto w-full rounded-lg py-1.5 text-[10px] font-bold transition",
                    isCurrent || plan.id === "free"
                      ? "bg-white/[0.06] text-white/28 cursor-default"
                      : plan.featured
                      ? "bg-[linear-gradient(135deg,#d4688a,#b48cff)] text-white shadow-[0_4px_12px_rgba(212,104,138,0.28)] hover:opacity-90"
                      : "bg-white/10 text-white/75 hover:bg-white/15",
                  ].join(" ")}
                >
                  {loadingPlan === plan.id
                    ? "…"
                    : isCurrent
                    ? "Current"
                    : plan.id === "free"
                    ? "Free"
                    : plan.ctaLabel}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <div className="mt-4 px-3">
          <div className="overflow-hidden rounded-xl border border-white/6 bg-white/[0.02]">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_56px_56px_56px] border-b border-white/6 px-3 py-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/22">
                Feature
              </span>
              {PLANS.map((p) => (
                <span
                  key={p.id}
                  className={[
                    "text-center text-[9px] font-semibold uppercase tracking-[0.08em]",
                    p.featured ? "text-[#f58bc2]/60" : "text-white/22",
                  ].join(" ")}
                >
                  {p.name}
                </span>
              ))}
            </div>

            {FEATURE_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={[
                  "grid grid-cols-[1fr_56px_56px_56px] items-center px-3 py-2.5",
                  i < FEATURE_ROWS.length - 1 ? "border-b border-white/[0.04]" : "",
                ].join(" ")}
              >
                <span className="text-[11px] text-white/50 leading-none">{row.label}</span>
                <div className="flex justify-center"><FeatureCell value={row.free} /></div>
                <div className="flex justify-center"><FeatureCell value={row.premium} /></div>
                <div className="flex justify-center"><FeatureCell value={row.pro} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div className="mt-5 px-3 pb-8">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/28">
            Add-ons
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ADDONS.map((addon) => (
              <div
                key={addon.name}
                className="flex flex-col rounded-xl border border-white/6 bg-white/[0.03] p-2.5"
              >
                <p className="text-[12px] font-semibold text-white/85 leading-tight">{addon.name}</p>
                <p className="mt-0.5 flex-1 text-[10px] leading-tight text-white/38">{addon.desc}</p>
                <div className="mt-2.5 flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-white/60">{addon.price}</span>
                  <button
                    type="button"
                    onClick={() => handleAddon(addon)}
                    disabled={loadingAddon === addon.envKey}
                    className="rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[10px] font-semibold text-white/80 transition hover:bg-white/12 disabled:opacity-40"
                  >
                    {loadingAddon === addon.envKey ? "…" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
