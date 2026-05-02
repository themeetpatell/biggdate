import Link from "next/link";
import Image from "next/image";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";

const PRIMARY_LINKS = [
  { href: "/#demo", label: "Product" },
  { href: "/#how", label: "How it works" },
  { href: "/#hacks", label: "Dating intel" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const LEARN_LINKS = [
  { href: "/how-it-works", label: "How BiggDate works" },
  { href: "/compare", label: "Compare apps" },
  { href: "/vs", label: "Per-app comparisons" },
  { href: "/glossary", label: "Glossary" },
  { href: "/questions", label: "Questions" },
  { href: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/auth", label: "Join beta" },
  { href: "/auth", label: "Log in" },
];

export function MarketingFooter() {
  return (
    <footer
      className="relative z-10"
      style={{
        background: "var(--bd-footer-bg)",
        borderTop: "1px solid var(--bd-border)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--bd-pink-glow), transparent)",
        }}
      />

      <div className="mx-auto max-w-5xl px-6 pb-10 pt-10">
        <div
          className="rounded-[28px] px-5 py-5 backdrop-blur-xl sm:px-6"
          style={{
            background: "var(--bd-glass-bg)",
            border: "1px solid var(--bd-border)",
          }}
        >
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--bd-pink)" }}
              >
                Follow us on socials
              </span>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--bd-text-muted)" }}
              >
                Stay close to product drops, dating intel, and updates from
                BiggDate.
              </p>
            </div>

            <div className="grid grid-cols-4 justify-items-center gap-3 sm:flex sm:flex-wrap sm:items-center">
              {MARKETING_SOCIAL_LINKS.map((item) => {
                const iconButton = (
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
                    style={{
                      background: "var(--bd-surface)",
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
                    rel={
                      item.href.startsWith("http") ? "noreferrer" : undefined
                    }
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
            </div>
          </div>
        </div>

        <div
          className="my-8 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--bd-border), transparent)",
          }}
        />

        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
          <Link
            href="/"
            className="mx-auto flex items-center gap-3 text-center transition-opacity hover:opacity-90 sm:mx-0 sm:text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl">
              <Image
                src="/Biggdate-logo.png"
                alt="BiggDate"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl"
              />
            </div>
            <div>
              <span
                className="block text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--bd-text)" }}
              >
                BiggDate
              </span>
              <span
                className="block text-[11px]"
                style={{ color: "var(--bd-text-faint)" }}
              >
                Dating that respects your time
              </span>
            </div>
          </Link>

          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-center text-sm transition-all sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left"
                style={{
                  background: "var(--bd-surface)",
                  border: "1px solid var(--bd-border)",
                  color: "var(--bd-text-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="mt-8 rounded-[24px] px-5 py-5 sm:rounded-[28px]"
          style={{
            background: "var(--bd-surface)",
            border: "1px solid var(--bd-border)",
          }}
        >
          <span
            className="block text-center text-[11px] font-semibold uppercase tracking-[0.3em] sm:text-left"
            style={{ color: "var(--bd-pink)" }}
          >
            Learn
          </span>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3">
            {LEARN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-center text-xs transition-colors sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                style={{
                  background: "var(--bd-surface-sunken)",
                  border: "1px solid var(--bd-border)",
                  color: "var(--bd-text-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[24px] px-5 py-5 sm:px-0 sm:py-0">
          <p
            className="text-center text-xs sm:text-left"
            style={{ color: "var(--bd-text-faint)" }}
          >
            Built for people who are done settling for mid.
          </p>
          <div className="mt-4 grid w-full grid-cols-2 gap-3 text-xs sm:mt-4 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-3 py-2 text-center transition-colors sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
                style={{
                  background: "var(--bd-surface-sunken)",
                  border: "1px solid var(--bd-border)",
                  color: "var(--bd-text-faint)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:meet@biggventures.com"
              className="col-span-2 rounded-xl px-3 py-2 text-center transition-colors sm:col-span-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
              style={{
                background: "var(--bd-surface-sunken)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text-faint)",
              }}
            >
              meet@biggventures.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
