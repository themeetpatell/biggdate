/**
 * Feature flags evaluated from environment variables. NEXT_PUBLIC_-prefixed
 * vars are inlined at build time so the same helper is safe in client and
 * server components. Default is "off" for every flag — explicit opt-in.
 */

import { NextResponse } from "next/server";

function isOn(value: string | undefined): boolean {
  return value?.toLowerCase() === "true";
}

export function isPulseEnabled(): boolean {
  return isOn(process.env.NEXT_PUBLIC_PULSE_ENABLED);
}

/**
 * Guard for API routes. Returns a 503 response when Pulse is disabled,
 * otherwise returns null. Usage:
 *
 *   const gated = assertPulseEnabled();
 *   if (gated) return gated;
 */
export function assertPulseEnabled(): NextResponse | null {
  if (isPulseEnabled()) return null;
  return NextResponse.json(
    { error: "Pulse is not available." },
    { status: 503 },
  );
}
