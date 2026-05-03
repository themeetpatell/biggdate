import Link from "next/link";
import Image from "next/image";
import { MARKETING_SOCIAL_LINKS } from "@/components/marketing-social-links";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/simulation", label: "Experience it" },
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
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const mobileLinkClass =
  "rounded-xl border px-3 py-2 text-center transition-colors sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0";

const mobilePanelLinkStyle = {
  background: "var(--bd-surface-sunken)",
  borderColor: "var(--bd-border)",
  color: "var(--bd-text-muted)",
} as const;

const mobileSoftLinkStyle = {
  background: "var(--bd-surface-sunken)",
  borderColor: "var(--bd-border)",
  color: "var(--bd-text-faint)",
} as const;

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

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-12">
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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div className="space-y-5">
            <Link
              href="/"
              className="mx-auto flex items-center gap-4 text-center transition-opacity hover:opacity-90 sm:mx-0 sm:text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
                <Image
                  src="/Biggdate-logo.png"
                  alt="BiggDate"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl"
                />
              </div>
              <div>
                <span
                  className="block text-lg font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--bd-text)" }}
                >
                  BiggDate
                </span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--bd-text-faint)" }}
                >
                  Dating that respects your time
                </span>
              </div>
            </Link>

            <p
              className="max-w-xl text-sm leading-7 text-center sm:text-left"
              style={{ color: "var(--bd-text-muted)" }}
            >
              Built for people who are done settling for mid. BiggDate filters for intent,
              emotional maturity, and actual follow-through.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${mobileLinkClass} text-sm sm:font-medium`}
                  style={mobilePanelLinkStyle}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="rounded-[28px] px-5 py-5 sm:px-6"
            style={{
              background: "linear-gradient(180deg, rgba(8, 20, 44, 0.84), rgba(10, 18, 36, 0.96))",
              border: "1px solid rgba(56, 83, 132, 0.28)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <span
              className="block text-center text-[11px] font-semibold uppercase tracking-[0.34em] sm:text-left"
              style={{ color: "var(--bd-pink)" }}
            >
              Learn
            </span>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {LEARN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${mobileLinkClass} text-sm sm:rounded-xl sm:border sm:px-4 sm:py-3 sm:text-left`}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(98, 125, 176, 0.2)",
                    color: "rgba(231, 237, 249, 0.88)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--bd-border)" }}>
          <p className="text-center text-xs sm:text-left" style={{ color: "var(--bd-text-faint)" }}>
            BiggDate is for people who want fewer matches, better conversations, and clearer intent.
          </p>
          <div className="grid w-full grid-cols-2 gap-3 text-xs sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={mobileLinkClass}
                style={mobileSoftLinkStyle}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:meet@biggventures.com"
              className={`col-span-2 ${mobileLinkClass} sm:col-span-1`}
              style={mobileSoftLinkStyle}
            >
              meet@biggventures.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
