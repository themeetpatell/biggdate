"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";

export function MarketingSocialRail() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div
        className="pointer-events-auto flex items-center transition-transform duration-500 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(calc(100% - 52px))",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex h-36 w-[52px] flex-col items-center justify-center gap-3 rounded-l-full border border-r-0 border-white/[0.08] bg-[linear-gradient(180deg,rgba(19,22,36,0.96),rgba(12,12,22,0.92))] text-[#f0ebe3] shadow-[-14px_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all hover:border-white/[0.14]"
          aria-label={open ? "Hide social icons" : "Show social icons"}
          aria-expanded={open}
        >
          {open ? (
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#ff6ac7] [writing-mode:vertical-rl]">
            Follow us
          </span>
        </button>

        <aside className="flex flex-col gap-2 rounded-l-[32px] border border-r-0 border-white/[0.08] bg-[linear-gradient(180deg,rgba(19,22,36,0.96),rgba(12,12,22,0.92))] px-3 py-4 shadow-[-18px_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          {MARKETING_SOCIAL_LINKS.map((item) => {
            const iconButton = (
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-black/15 text-[#f0ebe3] transition-all hover:border-[#ff1493]/22 hover:bg-white/[0.06] hover:text-[#ff6ac7]">
                <item.Icon className="size-4" />
                <span className="sr-only">{item.label}</span>
              </span>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={item.label}
              >
                {iconButton}
              </a>
            ) : (
              <div key={item.label} aria-label={item.label} className="opacity-75">
                {iconButton}
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
