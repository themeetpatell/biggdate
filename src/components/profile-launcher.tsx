"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

/**
 * Floating top-right profile entry. Renders inside the protected app
 * (dashboard, matches, messages, pulse, companion, coach, debrief, profile).
 * Hidden on marketing/auth/onboarding routes — those have their own header
 * with auth CTAs.
 */
export function ProfileLauncher() {
  const pathname = usePathname();
  const { profile, userId } = useAuth();

  // Hide on routes that already have their own top-right CTA, plus auth/onboarding
  const hiddenRoutes = [
    "/",
    "/about",
    "/contact",
    "/auth",
    "/onboarding",
    "/soul-snapshot",
    "/compare",
    "/faq",
    "/how-it-works",
    "/glossary",
    "/questions",
    "/vs",
    "/privacy",
    "/terms",
  ];
  const isHidden =
    hiddenRoutes.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`),
    ) || pathname.startsWith("/admin");

  if (isHidden) return null;

  // Don't render until we know auth state — avoids a flash of the launcher
  // for visitors who hit a protected page while logged out.
  if (!userId) return null;

  const avatarUrl = profile?.photos?.[0];
  const initials = getInitials(profile?.name);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-50"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div
        className="relative mx-auto px-4 sm:px-6"
        style={{ maxWidth: "var(--bd-app-max-w)" }}
      >
        <Link
          href="/profile"
          aria-label="Open your profile"
          className="pointer-events-auto absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full transition-all hover:scale-[1.04] sm:right-6 sm:top-6"
          style={{
            background: "var(--bd-glass-bg-strong)",
            border: "1px solid var(--bd-border)",
            boxShadow:
              "inset 0 1px 0 var(--bd-surface-overlay), 0 8px 24px rgba(0,0,0,0.18)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase"
              style={{
                background:
                  "linear-gradient(135deg, var(--bd-accent), var(--bd-blue))",
                color: "#fff",
              }}
            >
              {initials}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

function getInitials(name: string | undefined): string {
  if (!name) return "·";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
