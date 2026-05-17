"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

// Messages is in the nav because it's the single highest-frequency
// destination for an engaged user. Pulse moved off the bottom rail —
// community lives one tap deeper.
const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Today" },
  { href: "/matches", icon: "heart", label: "Connect" },
  { href: "/messages", icon: "message", label: "Chats" },
  { href: "/companion", icon: "sparkle", label: "Maahi" },
  { href: "/profile", icon: "user", label: "Profile" },
] as const;

function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
      <path d="M12 3L2 12h3v9h5v-5h4v5h5v-9h3L12 3z" />
    </svg>
  ) : (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "white" : "none"} stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SparkleIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="white">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  ) : (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  );
}

function UserIcon({ active, avatarUrl }: { active: boolean; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          overflow: "hidden",
          border: active ? "2px solid white" : "2px solid rgba(255,255,255,0.4)",
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatarUrl} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "white" : "none"} stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MessageIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "white" : "none"}
      stroke="white" strokeWidth={active ? 0 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const avatarUrl = profile?.photos?.[0];
  const [unreadChats, setUnreadChats] = useState(0);

  // Poll the messages list for an unread badge. Cheap call — the API already
  // sums unread per thread server-side. We refresh on path change so opening
  // a thread clears the dot immediately.
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        type ThreadLite = { unreadCount?: number };
        const threads: ThreadLite[] = Array.isArray(d?.threads) ? d.threads : [];
        const total = threads.reduce((sum, t) => sum + (t.unreadCount ?? 0), 0);
        setUnreadChats(total);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [profile, pathname]);

  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/auth" ||
    pathname === "/onboarding" ||
    pathname === "/soul-snapshot" ||
    pathname === "/simulation"
  ) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))", paddingLeft: 16, paddingRight: 16 }}
    >
      <nav
        style={{
          background: "#262626",
          borderRadius: 9999,
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                borderRadius: 9999,
                background: active ? "#3a3a3a" : "transparent",
                transition: "background 0.15s ease, opacity 0.1s ease",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onTouchStart={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onTouchEnd={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {item.icon === "home" && <HomeIcon active={active} />}
              {item.icon === "heart" && <HeartIcon active={active} />}
              {item.icon === "message" && (
                <div style={{ position: "relative" }}>
                  <MessageIcon active={active} />
                  {unreadChats > 0 && !active && (
                    <div style={{
                      position: "absolute", top: -4, right: -6,
                      minWidth: 16, height: 16, padding: "0 4px",
                      borderRadius: 999,
                      background: "#e91e8c", border: "2px solid #262626",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "#fff",
                    }}>
                      {unreadChats > 9 ? "9+" : unreadChats}
                    </div>
                  )}
                </div>
              )}
              {item.icon === "sparkle" && <SparkleIcon active={active} />}
              {item.icon === "user" && <UserIcon active={active} avatarUrl={avatarUrl} />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
