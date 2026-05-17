/**
 * Response contracts for the backend `/api/*` routes consumed by native
 * clients. These mirror the JSON shapes returned by the route handlers.
 * Keep them in sync when a route's response shape changes.
 */

/** Response from `GET /api/auth/me`. */
export interface MeResponse {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
  phoneCountryIso2: string | null;
  hasProfile: boolean;
  profile: unknown | null;
}

export interface BillingAddon {
  addonId: string;
  usesRemaining: number | null;
  expiresAt: string | null;
}

/** Response from `GET /api/billing/status`. */
export interface BillingStatusResponse {
  plan: string;
  status: string;
  isPremium: boolean;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  addons: BillingAddon[];
}

/** Error envelope returned by route handlers on failure. */
export interface ApiErrorResponse {
  error: string;
}
