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
          className="group flex h-36 w-[52px] flex-col items-center justify-center gap-3 rounded-l-full backdrop-blur-xl transition-all"
          style={{
            background: "var(--bd-glass-bg-strong)",
            border: "1px solid var(--bd-border)",
            borderRight: "0",
            color: "var(--bd-text)",
            boxShadow: "-14px 22px 60px rgba(0,0,0,0.18)",
          }}
          aria-label={open ? "Hide social icons" : "Show social icons"}
          aria-expanded={open}
        >
          {open ? (
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          )}
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.32em] [writing-mode:vertical-rl]"
            style={{ color: "var(--bd-pink)" }}
          >
            Follow us
          </span>
        </button>

        <aside
          className="flex flex-col gap-2 rounded-l-[32px] px-3 py-4 backdrop-blur-xl"
          style={{
            background: "var(--bd-glass-bg-strong)",
            border: "1px solid var(--bd-border)",
            borderRight: "0",
            boxShadow: "-18px 28px 80px rgba(0,0,0,0.18)",
          }}
        >
          {MARKETING_SOCIAL_LINKS.map((item) => {
            const iconButton = (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                style={{
                  background: "var(--bd-surface-sunken)",
                  border: "1px solid var(--bd-border)",
                  color: "var(--bd-text)",
                }}
              >
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
              <div
                key={item.label}
                aria-label={item.label}
                className="opacity-75"
              >
                {iconButton}
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
