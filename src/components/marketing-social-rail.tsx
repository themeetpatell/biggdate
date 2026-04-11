"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";

export function MarketingSocialRail() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div
        className="pointer-events-auto flex items-center transition-transform duration-500 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(calc(100% - 44px))",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group flex h-28 w-11 flex-col items-center justify-center gap-3 rounded-l-full border border-white/[0.08] border-r-0 bg-[linear-gradient(180deg,rgba(20,22,34,0.96),rgba(13,12,22,0.92))] text-[#f0ebe3] shadow-[-10px_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all hover:border-white/[0.14]"
          aria-label={open ? "Hide social rail" : "Show social rail"}
          aria-expanded={open}
        >
          {open ? (
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          )}
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ff6ac7] [writing-mode:vertical-rl]">
            Follow
          </div>
        </button>

        <aside className="w-72 rounded-l-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(19,22,36,0.96),rgba(12,12,22,0.92))] p-5 shadow-[-18px_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
            <Share2 className="size-3.5" />
            Follow BiggDate
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {MARKETING_SOCIAL_LINKS.map((item) => {
              const content = (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-black/15 text-[#f0ebe3]">
                    <item.Icon className="size-4" />
                  </span>
                  <span className="mt-3 text-sm font-medium text-[#d7d9e5]">
                    {item.label}
                  </span>
                </>
              );

              const baseClassName =
                "group flex min-h-[86px] flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.04] px-4 py-4 transition-all hover:border-white/[0.14] hover:bg-white/[0.06]";

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className={baseClassName}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={item.label}
                  className={`${baseClassName} cursor-default opacity-75`}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
