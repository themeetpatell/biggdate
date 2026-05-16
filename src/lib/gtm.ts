/**
 * GTM dataLayer helper
 *
 * Push structured events to window.dataLayer.  All events follow the
 * GA4 recommended event schema so the same names work in GA4, GTM, and
 * any analytics destination connected via GTM.
 *
 * Usage:
 *   import { gtmEvent } from "@/lib/gtm";
 *   gtmEvent({ event: "sign_up", method: "email" });
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function gtmEvent(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

// Meta Pixel passthrough. Base pixel is loaded in src/app/layout.tsx.
// No-op when fbq isn't on window (SSR, ad-blocked, or before script loads).
function fbqEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", event, params);
  else window.fbq("track", event);
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export function trackSignUp(method: "email" = "email") {
  gtmEvent({ event: "sign_up", method });
  fbqEvent("Lead");
}

export function trackLogin(method: "email" = "email") {
  gtmEvent({ event: "login", method });
}

// ─── Onboarding ───────────────────────────────────────────────────────────

export function trackOnboardingStart() {
  gtmEvent({ event: "onboarding_start" });
}

export function trackOnboardingPhase(phase: "psychological") {
  gtmEvent({ event: "onboarding_phase", phase });
}

export function trackOnboardingComplete() {
  gtmEvent({ event: "onboarding_complete" });
  fbqEvent("CompleteRegistration");
}

// ─── Matches ──────────────────────────────────────────────────────────────

export function trackMatchViewed(matchId: string) {
  gtmEvent({ event: "match_viewed", match_id: matchId });
}

export function trackMatchConnect(matchId: string) {
  gtmEvent({ event: "match_connect", match_id: matchId });
}

export function trackMatchRespond(matchId: string, action: "accept" | "decline") {
  gtmEvent({ event: "match_respond", match_id: matchId, action });
}

// ─── Messages ─────────────────────────────────────────────────────────────

export function trackMessageSent(threadId: string) {
  gtmEvent({ event: "message_sent", thread_id: threadId });
}

// ─── Pulse ────────────────────────────────────────────────────────────────

export function trackPulsePostCreated() {
  gtmEvent({ event: "pulse_post_created" });
}

export function trackPulseReaction(postId: string, reaction: string) {
  gtmEvent({ event: "pulse_reaction", post_id: postId, reaction });
}

// ─── Billing ──────────────────────────────────────────────────────────────

export function trackBeginCheckout(
  plan: string,
  interval: "monthly" | "quarterly" | "one_time",
  value: number,
) {
  gtmEvent({
    event: "begin_checkout",
    currency: "USD",
    value,
    items: [{ item_name: plan, item_category: interval }],
  });
}

export function trackUpgradeSheetOpen(context?: string) {
  gtmEvent({ event: "upgrade_sheet_open", context: context ?? "unknown" });
}

// ─── Engagement ───────────────────────────────────────────────────────────

export function trackCoachSessionStarted() {
  gtmEvent({ event: "coach_session_started" });
}

export function trackCompanionSessionStarted() {
  gtmEvent({ event: "companion_session_started" });
}

export function trackSoulCardViewed() {
  gtmEvent({ event: "soul_card_viewed" });
}

export function trackSoulSnapshotViewed() {
  gtmEvent({ event: "soul_snapshot_viewed" });
}

export function trackProfileComplete() {
  gtmEvent({ event: "profile_complete" });
}

export function trackVerificationStarted(type: "linkedin" | "selfie") {
  gtmEvent({ event: "verification_started", type });
}
