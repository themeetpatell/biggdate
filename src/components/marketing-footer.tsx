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

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-gradient-to-b from-[#06060e] to-[#08081a]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff1493]/15 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 pb-10 pt-10">
        <div className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff6ac7]">
                Follow us on socials
              </span>
              <p className="mt-2 text-sm text-[#8b8da3]">
                Stay close to product drops, dating intel, and updates from BiggDate.
              </p>
            </div>

            <div className="grid grid-cols-4 justify-items-center gap-3 sm:flex sm:flex-wrap sm:items-center">
              {MARKETING_SOCIAL_LINKS.map((item) => {
                const iconButton = (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[#f0ebe3] transition-all hover:border-[#ff1493]/22 hover:bg-white/[0.07] hover:text-[#ff6ac7]">
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
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-center sm:justify-between sm:items-start">
          <Link
            href="/"
            className="mx-auto flex items-center gap-3 text-center transition-opacity hover:opacity-90 sm:mx-0 sm:text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl">
              <Image src="/Biggdate-logo.png" alt="BiggDate" width={40} height={40} className="h-10 w-10 rounded-xl" />
            </div>
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-[#c8c9d8]">
                BiggDate
              </span>
              <span className="block text-[11px] text-[#7d7f96]">
                Dating that respects your time
              </span>
            </div>
          </Link>

          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-sm text-[#8b8da3] transition-all hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-[#f0ebe3] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/[0.06] bg-white/[0.02] px-5 py-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <p className="text-center text-xs text-[#5a5c72] sm:text-left">
            Built for people who are done settling for mid.
          </p>
          <div className="mt-4 grid w-full grid-cols-2 gap-3 text-xs text-[#5a5c72] sm:mt-4 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:gap-5">
            <Link
              href="/about"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-center transition-colors hover:text-[#a8aabe] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-center transition-colors hover:text-[#a8aabe] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              Contact
            </Link>
            <Link
              href="/auth"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-center transition-colors hover:text-[#a8aabe] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              Join beta
            </Link>
            <Link
              href="/auth"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-center transition-colors hover:text-[#a8aabe] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              Log in
            </Link>
            <a
              href="mailto:hello@biggdate.com"
              className="col-span-2 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2 text-center transition-colors hover:text-[#a8aabe] sm:col-span-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              hello@biggdate.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
