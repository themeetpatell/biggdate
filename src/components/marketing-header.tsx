"use client";

import Link from "next/link";
import { ArrowRight, Heart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[rgba(10,12,22,0.78)] px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at top left, rgba(212,104,138,0.18), transparent 36%), radial-gradient(circle at top right, rgba(123,159,255,0.14), transparent 34%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <Link
          href="/"
          className="relative flex min-w-0 items-center gap-3 rounded-2xl transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#d4688a]/32 via-white/[0.08] to-[#7b9fff]/28 shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-[1px] rounded-[15px] bg-[#121522]/90" />
            <Heart className="relative size-4 text-[#f19bc5]" />
          </div>

          <div className="min-w-0">
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8f92ab] sm:block">
              BiggDate
            </span>
            <span className="block truncate text-sm font-medium text-[#f0ebe3]">
              BiggDate
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.key === activePage;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-all ${
                  isActive
                    ? "bg-[#7b9fff]/[0.14] text-[#f0ebe3]"
                    : "text-[#9ea2ba] hover:bg-[#7b9fff]/[0.14] hover:text-[#f0ebe3]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="relative flex items-center gap-2">
          <Link
            href="/auth"
            className="hidden h-11 items-center rounded-full border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 text-sm font-medium text-[#d7d9e5] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-[#f0ebe3] sm:inline-flex"
          >
            Enter BiggDate
          </Link>
          <Link
            href="/auth"
            className="group relative inline-flex h-11 items-center overflow-hidden rounded-full px-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,20,147,0.3),0_12px_32px_rgba(212,104,138,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(255,20,147,0.4),0_16px_40px_rgba(212,104,138,0.5)] sm:px-6"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff1493] via-[#d4688a] to-[#a855f7]" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff6ac7] via-[#f04fb8] to-[#b86ef7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <span className="hidden sm:inline">Join beta</span>
              <span className="sm:hidden">Beta</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Sheet>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08] md:hidden"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] border-white/[0.08] bg-[#0b0d17]/95 text-[#f0ebe3] backdrop-blur-2xl sm:max-w-sm"
            >
              <SheetHeader className="border-b border-white/[0.06] px-5 py-5">
                <SheetTitle className="text-[#f0ebe3]">Navigate BiggDate</SheetTitle>
                <SheetDescription className="text-[#8f92ab]">
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
                      className={`rounded-2xl border px-4 py-4 text-sm font-medium transition-all ${
                        isActive
                          ? "border-[#ff1493]/20 bg-[#ff1493]/10 text-[#f8c6e8]"
                          : "border-white/[0.06] bg-white/[0.03] text-[#c2c5d8] hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-[#f0ebe3]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-white/[0.06] px-5 py-5">
                <div className="grid gap-3">
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-medium text-[#f0ebe3] transition-all hover:border-white/[0.14] hover:bg-white/[0.08]"
                  >
                    Enter BiggDate
                  </Link>
                  <a
                    href="mailto:hello@biggdate.com"
                    className="inline-flex items-center justify-center rounded-full border border-[#ff1493]/18 bg-[#ff1493]/10 px-5 py-3 text-sm font-medium text-[#f8c6e8] transition-all hover:border-[#ff1493]/30 hover:bg-[#ff1493]/14"
                  >
                    hello@biggdate.com
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
