"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Check, Zap, Sparkles } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { trackBeginCheckout, trackUpgradeSheetOpen } from "@/lib/gtm";
import {
  AddonRedemptionDialog,
  type AddonRedemptionTarget,
} from "@/components/addon-redemption-dialog";
import { UpgradeCelebrationModal } from "@/components/upgrade-celebration-modal";

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
  addonId: string;
  name: string;
  desc: string;
  price: string;
  envKey: string;
  type: "payment" | "subscription";
}

interface StatusBody {
  plan: PlanId;
  status: "active" | "trialing" | "canceled" | "inactive";
  isPremium: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  addons: Array<{
    addonId: string;
    usesRemaining: number | null;
    expiresAt: string | null;
  }>;
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
  { label: "Daily matches",     free: "5",      premium: "20",     pro: "∞"    },
  { label: "Intro requests",    free: "3/day",  premium: "15/day", pro: "∞"    },
  { label: "Maahi sessions",    free: "3/wk",   premium: "15/wk",  pro: "∞"    },
  { label: "Life Preview",      free: "—",      premium: "2/mo",   pro: "∞"    },
  { label: "Profile Boost",     free: "—",      premium: "1/wk",   pro: "3/wk" },
  { label: "See who liked you", free: "—",      premium: "✓",      pro: "✓"    },
];

const ADDONS: AddOnDef[] = [
  { addonId: "profile_boost",  name: "Profile Boost",      desc: "Rise to top for 1 hour",       price: "$4.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_BOOST",          type: "payment"      },
  { addonId: "life_preview",   name: "Life Preview",       desc: "One preview with a match",     price: "$2.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW",   type: "payment"      },
  { addonId: "life_preview_3", name: "3× Life Previews",   desc: "Best value bundle",            price: "$5.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3", type: "payment"      },
  { addonId: "read_receipts",  name: "Read Receipts",      desc: "See when intros are read",     price: "$3.99/mo", envKey: "NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS",  type: "subscription" },
  { addonId: "incognito",      name: "Incognito Mode",     desc: "Browse without appearing",     price: "$4.99/mo", envKey: "NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO",      type: "subscription" },
  { addonId: "spotlight",      name: "Spotlight 24hr",     desc: "Featured placement all day",   price: "$7.99",    envKey: "NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT",      type: "payment"      },
];

const ENV_MAP: Record<string, string | undefined> = {
  NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY:   process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY,
  NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY,
  NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY:       process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
  NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY:     process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY,
  NEXT_PUBLIC_STRIPE_PRICE_BOOST:             process.env.NEXT_PUBLIC_STRIPE_PRICE_BOOST,
  NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW:      process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW,
  NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3:    process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3,
  NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS:     process.env.NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS,
  NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO:         process.env.NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO,
  NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT:         process.env.NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT,
};

const BILLING_MODE =
  process.env.NEXT_PUBLIC_BILLING_MODE === "stripe" ? "stripe" : "early_access";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "meet@biggventures.com";

function getPriceId(envKey: string): string {
  return ENV_MAP[envKey] ?? "";
}

async function startStripeCheckout(
  type: "subscription" | "payment",
  priceId: string,
) {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, priceId }),
  });
  const data = (await res.json()) as { url?: string };
  if (data.url) window.location.href = data.url;
}

function formatExpiry(iso: string | null): string {
  if (!iso) return "Active";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Active";
  const m = d.toLocaleString("en-US", { month: "short" });
  return `Until ${m} ${d.getDate()}`;
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
}) {
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [status, setStatus] = useState<StatusBody | null>(null);
  const [redemptionTarget, setRedemptionTarget] =
    useState<AddonRedemptionTarget | null>(null);
  const [celebration, setCelebration] = useState<{
    open: boolean;
    kind: "premium" | "addon";
    addonLabel?: string;
    addonHref?: string;
    addonHint?: string;
  }>({ open: false, kind: "addon" });

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/billing/status");
      if (res.ok) {
        const data = (await res.json()) as StatusBody;
        setStatus(data);
      }
    } catch {
      // best-effort; sheet still renders with no entitlement info
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadStatus();
    }
  }, [open, loadStatus]);

  const currentPlan: PlanId = status?.plan ?? "free";
  const isPremium = status?.isPremium ?? false;

  const entitlements = new Map<string, StatusBody["addons"][number]>();
  for (const a of status?.addons ?? []) {
    entitlements.set(a.addonId, a);
  }

  const handleSubscribe = async (plan: PlanDef) => {
    if (plan.id === "free" || plan.id === currentPlan) return;

    if (BILLING_MODE === "early_access") {
      window.location.href = "/settings/billing";
      return;
    }

    setLoadingPlan(plan.id);
    const envKey = billing === "monthly" ? plan.envKeyMonthly : plan.envKeyQuarterly;
    const price = billing === "monthly" ? (plan.monthlyPrice ?? 0) : (plan.quarterlyPrice ?? 0);
    trackBeginCheckout(plan.name, billing, price);
    try {
      await startStripeCheckout("subscription", getPriceId(envKey));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleAddon = async (addon: AddOnDef) => {
    const priceNum = parseFloat(addon.price.replace(/[^0-9.]/g, "")) || 0;
    trackBeginCheckout(addon.name, "one_time", priceNum);

    if (BILLING_MODE === "early_access") {
      setRedemptionTarget({
        addonId: addon.addonId,
        name: addon.name,
        desc: addon.desc,
        price: addon.price,
      });
      return;
    }

    await startStripeCheckout(addon.type, getPriceId(addon.envKey));
  };

  const handleAddonRedeemed = (result: {
    addonId?: string;
    addonLabel?: string;
    expiresAt?: string | null;
    usesRemaining?: number | null;
  }) => {
    loadStatus();
    setCelebration({
      open: true,
      kind: "addon",
      addonLabel: result.addonLabel ?? redemptionTarget?.name ?? "Add-on",
      addonHref: "/profile",
      addonHint:
        result.expiresAt
          ? `Active until ${formatExpiry(result.expiresAt).replace("Until ", "")}.`
          : result.usesRemaining != null
          ? `You have ${result.usesRemaining} use${result.usesRemaining === 1 ? "" : "s"} ready.`
          : undefined,
    });
    setRedemptionTarget(null);
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(v) => {
          if (v) trackUpgradeSheetOpen(context);
          onOpenChange(v);
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full max-w-[420px] border-white/8 bg-[#0c0e1a] p-0 overflow-y-auto"
        >
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

          <div className="relative overflow-hidden px-4 pb-4 pt-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,104,138,0.18),transparent_60%)]" />
            {isPremium ? (
              <>
                <div className="relative inline-flex items-center gap-1.5 rounded-full bg-[#d4688a]/15 px-2.5 py-1 mb-2">
                  <Sparkles className="h-3 w-3 text-[#f58bc2]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#f58bc2]">
                    Premium active
                  </span>
                </div>
                <h2 className="relative text-xl font-bold tracking-tight text-white leading-tight">
                  Power up further.<br />Pick an add-on.
                </h2>
                <p className="relative mt-1.5 text-[12px] text-white/45 leading-4">
                  You&apos;re on Premium. Add-ons stack on top.
                </p>
              </>
            ) : (
              <>
                <h2 className="relative text-xl font-bold tracking-tight text-white leading-tight">
                  Go deeper.<br />Connect better.
                </h2>
                {context && (
                  <p className="relative mt-1.5 text-[12px] text-white/45 leading-4">
                    {context}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="px-4 pb-3 flex items-center gap-3">
            <div className="flex rounded-lg bg-white/[0.06] p-1 gap-0.5 w-fit">
              {(["monthly", "quarterly"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBilling(opt)}
                  className={[
                    "rounded-md px-4 py-1.5 text-[12px] font-semibold transition",
                    billing === opt
                      ? "bg-white/15 text-white"
                      : "text-white/40 hover:text-white/60",
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

              let ctaText: string = plan.ctaLabel;
              let ctaDisabled = false;
              if (isCurrent) {
                ctaText = "Current";
                ctaDisabled = true;
              } else if (plan.id === "free") {
                ctaText = isPremium ? "Downgrade" : "Free";
                ctaDisabled = true;
              } else if (plan.id === "pro") {
                ctaText = "Coming soon";
                ctaDisabled = true;
              } else if (loadingPlan === plan.id) {
                ctaText = "…";
              }

              return (
                <div
                  key={plan.id}
                  className={[
                    "relative flex flex-col rounded-xl border p-2.5",
                    isCurrent
                      ? "border-[#4FFFB0]/35 bg-[#4FFFB0]/[0.04]"
                      : plan.featured
                      ? "border-[#d4688a]/45 bg-[#d4688a]/[0.06] shadow-[0_0_24px_rgba(212,104,138,0.1)]"
                      : "border-white/8 bg-white/[0.03]",
                  ].join(" ")}
                >
                  {plan.featured && !isCurrent && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#d4688a,#b48cff)] px-2 py-0.5 text-[8px] font-bold text-white leading-tight">
                      ★ POPULAR
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#4FFFB0]/20 px-2 py-0.5 text-[8px] font-bold text-[#4FFFB0] leading-tight">
                      ✓ ACTIVE
                    </span>
                  )}

                  <p className="mt-1 text-[11px] font-semibold text-white/45">
                    {plan.name}
                  </p>

                  <div className="mt-1 mb-0.5">
                    {price === 0 ? (
                      <p className="text-[15px] font-bold text-white leading-none">
                        Free
                      </p>
                    ) : (
                      <>
                        <p className="text-[15px] font-bold text-white leading-none">
                          ${price}
                          <span className="text-[9px] font-normal text-white/35">/mo</span>
                        </p>
                        {billedNote ? (
                          <p className="text-[9px] text-white/28 mt-0.5">
                            Billed {billedNote}
                          </p>
                        ) : (
                          <p className="text-[9px] text-white/28 mt-0.5">per month</p>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubscribe(plan)}
                    disabled={ctaDisabled || loadingPlan === plan.id}
                    className={[
                      "mt-auto w-full rounded-lg py-1.5 text-[10px] font-bold transition",
                      ctaDisabled
                        ? isCurrent
                          ? "bg-[#4FFFB0]/15 text-[#4FFFB0] cursor-default"
                          : "bg-white/[0.06] text-white/28 cursor-default"
                        : plan.featured
                        ? "bg-[linear-gradient(135deg,#d4688a,#b48cff)] text-white shadow-[0_4px_12px_rgba(212,104,138,0.28)] hover:opacity-90"
                        : "bg-white/10 text-white/75 hover:bg-white/15",
                    ].join(" ")}
                  >
                    {ctaText}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 px-3">
            <div className="overflow-hidden rounded-xl border border-white/6 bg-white/[0.02]">
              <div className="grid grid-cols-[1fr_56px_56px_56px] border-b border-white/6 px-3 py-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/22">
                  Feature
                </span>
                {PLANS.map((p) => (
                  <span
                    key={p.id}
                    className={[
                      "text-center text-[9px] font-semibold uppercase tracking-[0.08em]",
                      p.id === currentPlan
                        ? "text-[#4FFFB0]/70"
                        : p.featured
                        ? "text-[#f58bc2]/60"
                        : "text-white/22",
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
                    i < FEATURE_ROWS.length - 1
                      ? "border-b border-white/[0.04]"
                      : "",
                  ].join(" ")}
                >
                  <span className="text-[11px] text-white/50 leading-none">
                    {row.label}
                  </span>
                  <div className="flex justify-center">
                    <FeatureCell value={row.free} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureCell value={row.premium} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureCell value={row.pro} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 px-3 pb-8">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/28">
              Add-ons
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ADDONS.map((addon) => {
                const ent = entitlements.get(addon.addonId);
                const isActive = !!ent;
                let activeBadge: string | null = null;
                if (ent) {
                  if (ent.expiresAt) {
                    activeBadge = formatExpiry(ent.expiresAt);
                  } else if (ent.usesRemaining != null) {
                    activeBadge = `${ent.usesRemaining} left`;
                  } else {
                    activeBadge = "Active";
                  }
                }

                return (
                  <div
                    key={addon.addonId}
                    className={[
                      "flex flex-col rounded-xl border p-2.5",
                      isActive
                        ? "border-[#4FFFB0]/25 bg-[#4FFFB0]/[0.04]"
                        : "border-white/6 bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <p className="text-[12px] font-semibold text-white/85 leading-tight">
                      {addon.name}
                    </p>
                    <p className="mt-0.5 flex-1 text-[10px] leading-tight text-white/38">
                      {addon.desc}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-1">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#4FFFB0]/15 px-2 py-0.5 text-[9px] font-bold text-[#4FFFB0]">
                          <Check className="h-2.5 w-2.5" />
                          {activeBadge}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-white/60">
                          {addon.price}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAddon(addon)}
                        disabled={isActive}
                        className={[
                          "rounded-lg px-2.5 py-1 text-[10px] font-semibold transition",
                          isActive
                            ? "bg-white/[0.04] text-white/30 cursor-default"
                            : "border border-white/10 bg-white/[0.07] text-white/80 hover:bg-white/12",
                        ].join(" ")}
                      >
                        {isActive ? "Active" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AddonRedemptionDialog
        open={!!redemptionTarget}
        onOpenChange={(v) => {
          if (!v) setRedemptionTarget(null);
        }}
        target={redemptionTarget}
        supportEmail={SUPPORT_EMAIL}
        onRedeemed={handleAddonRedeemed}
      />

      <UpgradeCelebrationModal
        open={celebration.open}
        onOpenChange={(v) =>
          setCelebration((prev) => ({ ...prev, open: v }))
        }
        kind={celebration.kind}
        addonLabel={celebration.addonLabel}
        addonHref={celebration.addonHref}
        addonHint={celebration.addonHint}
      />
    </>
  );
}
