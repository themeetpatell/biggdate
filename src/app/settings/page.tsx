import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings — BiggDate",
  description: "Manage your BiggDate account.",
};

const SECTIONS = [
  {
    href: "/settings/billing",
    label: "Membership",
    description: "Access status, redeem codes, and upgrade.",
    icon: CreditCard,
  },
] as const;

export default function Page() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--bd-text)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--bd-text-muted)]">
          Manage your account.
        </p>
      </header>

      <nav aria-label="Settings sections">
        <ul className="flex flex-col gap-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--bd-border)] bg-[var(--bd-glass-bg-strong)] px-4 py-4 transition hover:bg-white/[0.04]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04]">
                    <Icon className="size-4 text-[var(--bd-text)]" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-base font-semibold text-[var(--bd-text)]">
                      {section.label}
                    </span>
                    <span className="block text-xs text-[var(--bd-text-muted)]">
                      {section.description}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-[var(--bd-text-faint)]" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
