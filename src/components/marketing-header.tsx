"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/#how", label: "Product" },
  { href: "/#hacks", label: "Dating intel" },
  { href: "/about", label: "About us", key: "about" },
  { href: "/contact", label: "Contact", key: "contact" },
];

export function MarketingHeader({
  activePage,
}: {
  activePage: "about" | "contact";
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-2 overflow-hidden rounded-[28px] px-3 py-3 backdrop-blur-2xl backdrop-saturate-150 sm:gap-3 sm:px-5"
        style={{
          background: "var(--bd-glass-bg)",
          border: "1px solid var(--bd-border)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at top left, var(--bd-pink-glow), transparent 36%), radial-gradient(circle at top right, var(--bd-blue-glow), transparent 34%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--bd-border-strong), transparent)",
          }}
        />

        <Link
          href="/"
          className="relative flex min-w-0 items-center gap-2 rounded-2xl transition-opacity hover:opacity-90 sm:gap-3"
        >
          <Image
            src="/Biggdate-logo.png"
            alt="BiggDate"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl"
          />
          <span
            className="block truncate text-sm font-medium"
            style={{ color: "var(--bd-text)" }}
          >
            BiggDate
          </span>
        </Link>

        <div
          className="hidden items-center gap-1 rounded-full p-1 md:flex"
          style={{
            background: "var(--bd-surface-overlay)",
            border: "1px solid var(--bd-border)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.key === activePage;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-all"
                style={{
                  background: isActive ? "var(--bd-accent-soft)" : "transparent",
                  color: isActive ? "var(--bd-text)" : "var(--bd-text-muted)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="relative flex shrink-0 items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />

          <Link
            href="/auth?mode=login"
            className="hidden h-11 items-center rounded-full px-5 text-sm font-medium transition-all sm:inline-flex"
            style={{
              background: "var(--bd-surface)",
              border: "1px solid var(--bd-border)",
              color: "var(--bd-text)",
              boxShadow: "inset 0 1px 0 var(--bd-surface-overlay)",
            }}
          >
            Enter BiggDate
          </Link>
          <Link
            href="/auth?mode=signup"
            className="group relative inline-flex h-11 items-center overflow-hidden rounded-full px-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] sm:px-6"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255,20,147,0.3), 0 12px 32px rgba(212,104,138,0.4)",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7]" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <span>Start Dating</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Sheet>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-all md:hidden"
              style={{
                background: "var(--bd-surface)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text)",
              }}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] backdrop-blur-2xl sm:max-w-sm"
              style={{
                background: "var(--bd-glass-bg-strong)",
                borderColor: "var(--bd-border)",
                color: "var(--bd-text)",
              }}
            >
              <SheetHeader
                className="px-5 py-5"
                style={{ borderBottom: "1px solid var(--bd-border)" }}
              >
                <SheetTitle style={{ color: "var(--bd-text)" }}>
                  Navigate BiggDate
                </SheetTitle>
                <SheetDescription style={{ color: "var(--bd-text-muted)" }}>
                  Open product sections, About us, and Contact from mobile.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3 px-5 py-5">
                {NAV_LINKS.map((link) => {
                  const isActive = link.key === activePage;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className="rounded-2xl px-4 py-4 text-sm font-medium transition-all"
                      style={{
                        background: isActive
                          ? "var(--bd-accent-soft)"
                          : "var(--bd-surface)",
                        border: `1px solid ${isActive ? "var(--bd-border-glow)" : "var(--bd-border)"}`,
                        color: isActive
                          ? "var(--bd-accent)"
                          : "var(--bd-text-muted)",
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div
                className="mt-auto px-5 py-5"
                style={{ borderTop: "1px solid var(--bd-border)" }}
              >
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                      style={{ color: "var(--bd-text-faint)" }}
                    >
                      Theme
                    </span>
                    <ThemeToggle variant="segment" />
                  </div>
                  <Link
                    href="/auth?mode=login"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all"
                    style={{
                      background: "var(--bd-surface)",
                      border: "1px solid var(--bd-border)",
                      color: "var(--bd-text)",
                    }}
                  >
                    Enter BiggDate
                  </Link>
                  <a
                    href="mailto:meet@biggventures.com"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all"
                    style={{
                      background: "var(--bd-accent-soft)",
                      border: "1px solid var(--bd-border-glow)",
                      color: "var(--bd-accent)",
                    }}
                  >
                    meet@biggventures.com
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
