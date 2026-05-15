"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

const HIDDEN_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/auth",
  "/onboarding",
  "/soul-snapshot",
  "/simulation",
  "/compare",
  "/faq",
  "/how-it-works",
  "/glossary",
  "/questions",
  "/vs",
  "/privacy",
  "/terms",
  "/profile",
  "/messages",
];

/**
 * Floating top-right messages entry. Renders inside protected app surfaces
 * that do not already have their own top-right action controls.
 * Hidden on marketing/auth/onboarding routes — those have their own header
 * with auth CTAs.
 */
export function ProfileLauncher() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Hide on routes that already have their own top-right CTA, plus auth/onboarding.
  const isHidden =
    HIDDEN_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`),
    ) || pathname.startsWith("/admin");
  const shouldRender = Boolean(userId) && !isHidden;

  useEffect(() => {
    // When hidden, the component returns null and the badge state is unobservable.
    // Skip the fetch loop entirely; the next render with shouldRender=true will
    // remount this effect and load a fresh count.
    if (!shouldRender) return;
    const load = () => {
      fetch("/api/messages")
        .then((r) => r.json())
        .then((d) => {
          const total = (d.threads ?? []).reduce(
            (sum: number, t: { unreadCount?: number }) => sum + (t.unreadCount ?? 0),
            0,
          );
          setUnreadCount(total);
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [shouldRender]);

  if (!shouldRender) return null;

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
          href="/messages"
          aria-label="Open messages"
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
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, rgba(180,140,255,0.18), rgba(68,200,255,0.12))",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <MessageGlyph />
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                minWidth: 18,
                height: 18,
                borderRadius: 999,
                background: "linear-gradient(135deg, #f43f5e, #a855f7)",
                border: "2px solid var(--bd-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

function MessageGlyph() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "#f4f7ff" }}
    >
      <path d="M12 20.5c4.97 0 9-3.58 9-8s-4.03-8-9-8-9 3.58-9 8c0 2.07.9 3.95 2.39 5.37L5 21l3.42-1.79A9.9 9.9 0 0 0 12 20.5Z" />
      <path d="M8.5 11.5h7" />
      <path d="M8.5 14.5h4.5" />
    </svg>
  );
}
