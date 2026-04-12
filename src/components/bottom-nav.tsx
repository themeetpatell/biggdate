"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Today" },
  { href: "/matches", icon: "heart", label: "Connect" },
  { href: "/companion", icon: "sparkle", label: "Maahi" },
  { href: "/profile", icon: "user", label: "You" },
];

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

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const avatarUrl = profile?.photos?.[0];

  if (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/auth" ||
    pathname === "/onboarding" ||
    pathname === "/soul-snapshot"
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
              {item.icon === "sparkle" && <SparkleIcon active={active} />}
              {item.icon === "user" && <UserIcon active={active} avatarUrl={avatarUrl} />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
