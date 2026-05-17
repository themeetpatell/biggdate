import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isPulseEnabled } from "@/lib/feature-flags";

const PUBLIC_PATHS = [
  "/", "/auth", "/about", "/contact",
  "/simulation", "/how-it-works", "/faq", "/glossary",
  "/terms", "/privacy", "/vs", "/compare", "/onboarding",
  "/region-blocked",
  // Sentry tunnel route (configured via tunnelRoute in next.config.ts). Must
  // be reachable by anonymous browsers so client-side error reports aren't
  // redirected into /auth and silently dropped.
  "/monitoring",
];

// EEA + UK + Switzerland. BiggDate does not currently offer service in these
// regions — see /privacy and /terms — and lacks the GDPR Art. 27 / UK-GDPR
// representatives required to do so. This list is checked against the
// Vercel-provided `x-vercel-ip-country` header on every non-API request.
const BLOCKED_COUNTRIES = new Set([
  // EU 27
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA non-EU
  "IS", "LI", "NO",
  // United Kingdom + Switzerland
  "GB", "CH",
]);

function isGeoBlocked(request: NextRequest): boolean {
  // Local opt-out for dev / staging. Set BLOCK_EU_REGIONS=false on Vercel
  // preview environments where you intentionally want EU smoke-testing.
  if (process.env.BLOCK_EU_REGIONS === "false") return false;
  const country = (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    ""
  ).toUpperCase();
  if (!country) return false;
  return BLOCKED_COUNTRIES.has(country);
}

function isPulsePath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/pulse/") ||
    pathname.startsWith("/api/admin/pulse/") ||
    pathname === "/api/pulse" ||
    pathname === "/api/admin/pulse"
  );
}

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(p + "/")),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Feature gate: Pulse is disabled by default. Centralized so we don't have
  // to thread the check through 11 individual route handlers. Page hierarchies
  // are gated by their own layout.tsx via notFound().
  if (isPulsePath(pathname) && !isPulseEnabled()) {
    return NextResponse.json(
      { error: "Pulse is not available." },
      { status: 503 },
    );
  }

  // Geo gate — runs BEFORE the API/static bypass below so EU visitors hitting
  // signup/login JSON endpoints also get rejected, not just page navigations.
  // The /region-blocked page itself + static assets must remain reachable so
  // the redirect target can render and load its CSS/JS.
  if (
    pathname !== "/region-blocked" &&
    !pathname.startsWith("/_next/") &&
    !pathname.startsWith("/monitoring") &&
    !pathname.includes(".") &&
    isGeoBlocked(request)
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "BiggDate is not available in your region." },
        { status: 451 },
      );
    }
    const blockedUrl = new URL("/region-blocked", request.url);
    return NextResponse.redirect(blockedUrl);
  }

  // Skip API routes (they handle auth themselves) and static assets
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Public paths don't need auth
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check Supabase session
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
