# Upgrade Sheet Redesign — 3-Tier Plans + Add-ons

**Date:** 2026-04-12  
**Status:** Approved

---

## Overview

Redesign `src/components/upgrade-sheet.tsx` from a single-plan (Premium only) sheet to a three-tier pricing sheet (Free / Premium / Pro) with a monthly/quarterly billing toggle and an Add-ons section at the bottom.

---

## Sheet Width

Increase from `max-w-[320px]` to `max-w-[420px]`. Full width on narrow viewports.

---

## Billing Toggle

- Two options: `Monthly` | `Quarterly`
- Default: `Monthly`
- Quarterly shows a `SAVE ~25%` green badge
- Toggle is a pill segmented control, sits above the plan cards
- State: `billingInterval: "monthly" | "quarterly"`

---

## Plan Cards (3 columns)

Each plan renders as a compact card column. The three sit side-by-side in a single row.

| | Free | Premium | Pro |
|---|---|---|---|
| Monthly price | $0 | $19.99/mo | $34.99/mo |
| Quarterly price | — | $14.99/mo | $24.99/mo |
| Quarterly billed | — | $44.97/qtr | $74.97/qtr |
| CTA label | Current (if on free) | Start 7-Day Free Trial | Get Pro |
| Visual treatment | Muted | Pink/purple glow border + `★ Most Popular` badge | Elevated |

- Active plan shows "Current plan" with dimmed CTA (no action)
- `planId` type: `"free" | "premium" | "pro"`
- Prices are placeholder — Stripe price IDs wired via env vars (see below)

---

## Feature Comparison Table

Rendered below the plan cards as a grid. Feature name on the left, one column per plan.

| Feature | Free | Premium | Pro |
|---|---|---|---|
| Daily matches | 5 | 20 | ∞ |
| Intro requests | 3 | 15 | ∞ |
| Maahi sessions | 3/wk | 15/wk | ∞ |
| Life Preview | — | 2/mo | ∞ |
| Profile Boost | — | 1/wk | 3/wk |
| See who liked you | — | ✓ | ✓ |
| Priority matching | — | — | ✓ |
| Undo last swipe | — | ✓ | ✓ |
| Incognito browse | — | — | ✓ |

- ✓ = pink checkmark icon
- ∞ = infinity symbol, white/80
- — = white/20 dash (no feature)
- Numeric limits = plain text

---

## Add-ons Section

Heading: `Add-ons` (replaces previous "or buy once" divider pattern).

Rendered as a 2-column grid of cards. Each card: name, short description, price, `Add` button.

| Add-on | Price | Description |
|---|---|---|
| Profile Boost | $4.99 | Rise to the top for 1 hour |
| Life Preview | $2.99 | One single preview with a match |
| 3× Life Previews | $5.99 | Best value bundle |
| Super Like | $1.99 | Send a standout signal to one match |
| Read Receipts | $3.99/mo | See when your intros are read |
| Incognito Mode | $4.99/mo | Browse without appearing in others' stacks |
| Profile Review by Maahi | $6.99 | AI audit + rewrite suggestions |
| Spotlight 24hr | $7.99 | Featured placement for a full day |

- `Add` button triggers Stripe one-time checkout (existing `startCheckout("payment", priceId)` pattern)
- Recurring add-ons (Read Receipts, Incognito Mode) use `"subscription"` type

---

## Env Vars Required (new, to be added)

```
# Subscriptions
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_QUARTERLY
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_PRO_QUARTERLY

# Add-ons (one-time)
NEXT_PUBLIC_STRIPE_PRICE_SUPER_LIKE
NEXT_PUBLIC_STRIPE_PRICE_READ_RECEIPTS
NEXT_PUBLIC_STRIPE_PRICE_INCOGNITO
NEXT_PUBLIC_STRIPE_PRICE_PROFILE_REVIEW
NEXT_PUBLIC_STRIPE_PRICE_SPOTLIGHT

# Existing (keep)
NEXT_PUBLIC_STRIPE_PRICE_BOOST
NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW
NEXT_PUBLIC_STRIPE_PRICE_LIFE_PREVIEW_3
```

Old `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` and `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` are superseded by the new Premium/Pro vars.

---

## Component Architecture

All logic stays inside `upgrade-sheet.tsx`. No new files needed.

**Internal sub-components (not exported):**
- `BillingToggle` — monthly/quarterly pill
- `PlanCard` — single plan column (name, price, CTA)
- `FeatureTable` — comparison grid
- `AddOnCard` — individual add-on tile
- `AddOnsGrid` — wraps `AddOnCard` in 2-col layout

**State:**
- `billingInterval: "monthly" | "quarterly"` — default `"monthly"`
- `loadingPlan: string | null` — tracks which plan CTA is loading
- `loadingAddon: string | null` — tracks which add-on is loading

**Props (unchanged):**
```ts
{ open: boolean; onOpenChange: (open: boolean) => void; context?: string }
```

**`currentPlan` prop (new, optional):**
```ts
currentPlan?: "free" | "premium" | "pro"
```
Defaults to `"free"` if not provided. Used to dim the active plan's CTA.

---

## Checkout Flow

Subscriptions: existing `startCheckout("subscription", priceId)` — no changes needed.  
Add-ons (one-time): `startCheckout("payment", priceId)` — no changes needed.  
Add-ons (recurring): `startCheckout("subscription", priceId)` — no changes needed.

---

## Out of Scope

- Pricing changes (placeholder values used; update env vars later)
- Backend plan enforcement (already handled by `user_plans` table)
- Stripe product/price creation (done separately in Stripe dashboard)
