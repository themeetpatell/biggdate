import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { grantAddon, getActiveAddons } from "@/lib/repo";
import { checkRateLimit, clientIp, rateLimitResponse } from "@/lib/rate-limit";
import { log } from "@/lib/log";

// Per-addon coupon redemption for early access.
//
// Each coupon code maps to a single addon_id. ADDON_COUPON_CODES env is a JSON
// object: { "BOOST_FREE": "profile_boost", "SUPERLIKE_FREE": "super_like", ... }
// The addon catalog below is the server-side source of truth for grant terms
// (one-time vs subscription, default uses, default expiry).

type AddonKind = "one_time" | "subscription";

interface AddonSpec {
  kind: AddonKind;
  defaultUses: number | null;
  defaultDays: number | null;
  label: string;
}

const ADDON_CATALOG: Record<string, AddonSpec> = {
  profile_boost:   { kind: "one_time",     defaultUses: 5,    defaultDays: null, label: "Profile Boost"     },
  life_preview:    { kind: "one_time",     defaultUses: 5,    defaultDays: null, label: "Life Preview"      },
  life_preview_3:  { kind: "one_time",     defaultUses: 15,   defaultDays: null, label: "3× Life Previews" },
  super_like:      { kind: "one_time",     defaultUses: 5,    defaultDays: null, label: "Super Like"        },
  profile_review:  { kind: "one_time",     defaultUses: 5,    defaultDays: null, label: "Profile Review"    },
  spotlight:       { kind: "one_time",     defaultUses: 5,    defaultDays: null, label: "Spotlight 24hr"    },
  read_receipts:   { kind: "subscription", defaultUses: null, defaultDays: 90,   label: "Read Receipts"     },
  incognito:       { kind: "subscription", defaultUses: null, defaultDays: 90,   label: "Incognito Mode"    },
};

function getCodeMap(): Map<string, string> {
  const raw = process.env.ADDON_COUPON_CODES ?? "";
  if (!raw.trim()) return new Map();
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const map = new Map<string, string>();
    for (const [code, addonId] of Object.entries(parsed)) {
      if (typeof addonId === "string" && code.trim()) {
        map.set(code.trim(), addonId.trim());
      }
    }
    return map;
  } catch (err: unknown) {
    log.error("ADDON_COUPON_CODES is not valid JSON", err);
    return new Map();
  }
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export async function POST(request: Request) {
  if (process.env.BILLING_MODE !== "early_access") {
    return NextResponse.json(
      { error: "Coupon redemption is not available right now." },
      { status: 503 },
    );
  }

  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const ip = clientIp(request);
  const rl = await checkRateLimit("billing:redeem-addon", ip, { limit: 10, windowSec: 3600 });
  if (!rl.allowed) return rateLimitResponse(rl);

  let body: { code?: unknown };
  try {
    body = (await request.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code || code.length > 64) {
    return NextResponse.json({ error: "Enter your access code." }, { status: 400 });
  }

  const codeMap = getCodeMap();
  if (codeMap.size === 0) {
    log.error("billing/redeem-addon called but ADDON_COUPON_CODES is empty");
    return NextResponse.json({ error: "Redemption is not configured." }, { status: 503 });
  }

  const addonId = codeMap.get(code);
  if (!addonId) {
    log.warn("billing/redeem-addon invalid code", { userId: auth.userId });
    return NextResponse.json(
      { error: "That code didn't work. Double-check or DM us on WhatsApp." },
      { status: 400 },
    );
  }

  const spec = ADDON_CATALOG[addonId];
  if (!spec) {
    log.error("billing/redeem-addon code maps to unknown addon", { addonId });
    return NextResponse.json({ error: "Redemption is not configured." }, { status: 503 });
  }

  const active = await getActiveAddons(auth.userId);
  const existing = active.find((a) => a.addonId === addonId);
  if (existing) {
    return NextResponse.json({
      ok: true,
      alreadyActive: true,
      addonId,
      addonLabel: spec.label,
      kind: spec.kind,
      usesRemaining: existing.usesRemaining,
      expiresAt: existing.expiresAt,
    });
  }

  const granted = await grantAddon(auth.userId, {
    addonId,
    source: "coupon",
    redeemedCode: code,
    usesRemaining: spec.kind === "one_time" ? spec.defaultUses : null,
    expiresAt:
      spec.kind === "subscription" && spec.defaultDays != null
        ? addDaysIso(spec.defaultDays)
        : null,
  });

  log.info("billing/redeem-addon success", { userId: auth.userId, addonId });
  return NextResponse.json({
    ok: true,
    addonId,
    addonLabel: spec.label,
    kind: spec.kind,
    usesRemaining: granted.usesRemaining,
    expiresAt: granted.expiresAt,
  });
}
