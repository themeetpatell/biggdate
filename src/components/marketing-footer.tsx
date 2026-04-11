import Link from "next/link";
import { Heart } from "lucide-react";

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

      <div className="mx-auto max-w-5xl px-6 pb-10 pt-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#ff1493]/20 to-[#7b9fff]/20">
              <Heart className="size-4 text-[#ff1493]" />
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

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#8b8da3]">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#f0ebe3]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[#5a5c72]">
            Built for people who are done settling for mid.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#5a5c72]">
            <Link href="/about" className="transition-colors hover:text-[#a8aabe]">
              About
            </Link>
            <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />
            <Link href="/contact" className="transition-colors hover:text-[#a8aabe]">
              Contact
            </Link>
            <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />
            <Link href="/auth" className="transition-colors hover:text-[#a8aabe]">
              Join beta
            </Link>
            <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />
            <Link href="/auth" className="transition-colors hover:text-[#a8aabe]">
              Log in
            </Link>
            <span className="hidden h-3 w-px bg-white/[0.08] sm:block" />
            <a
              href="mailto:hello@biggdate.com"
              className="transition-colors hover:text-[#a8aabe]"
            >
              hello@biggdate.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
