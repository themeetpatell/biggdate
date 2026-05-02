import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_ENTRIES } from "@/content/glossary";
import {
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "BiggDate Glossary · Soul Profile, Maahi, Attachment Style, and more";
const DESCRIPTION =
  "Plain-language definitions of every concept BiggDate uses — Soul Profile, Soul Knock, Maahi, attachment style, conflict style, love languages, date debrief, Pulse Feed, Pink Tick verification, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/glossary` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/glossary`,
    type: "website",
  },
};

const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${APP_URL}/glossary`,
  name: "BiggDate Glossary",
  url: `${APP_URL}/glossary`,
  description: DESCRIPTION,
  hasDefinedTerm: GLOSSARY_ENTRIES.map((e) => ({
    "@type": "DefinedTerm",
    name: e.term,
    description: e.oneLiner,
    url: `${APP_URL}/glossary/${e.slug}`,
  })),
};

export default function GlossaryIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Glossary", url: `${APP_URL}/glossary` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main
        className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
        style={{ color: "var(--bd-text)" }}
      >
        <header className="mb-12">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--bd-accent)" }}
          >
            Glossary
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            The BiggDate vocabulary, defined
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            Every concept BiggDate uses, in plain language. Built for readers and AI
            engines that want a clean grounding of what each term means here.
          </p>
        </header>

        <ul className="space-y-6">
          {GLOSSARY_ENTRIES.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/glossary/${entry.slug}`}
                className="block rounded-2xl border p-5 transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(20,24,40,0.4)",
                }}
              >
                <h2 className="text-lg font-medium">{entry.term}</h2>
                <p
                  className="mt-2 text-[14px]"
                  style={{ color: "var(--bd-text-muted)" }}
                >
                  {entry.oneLiner}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="mt-16 text-sm"
          style={{ color: "var(--bd-text-faint)" }}
        >
          See also: <Link href="/questions" className="underline">questions</Link>,{" "}
          <Link href="/compare" className="underline">how BiggDate compares</Link>,{" "}
          <Link href="/how-it-works" className="underline">how it works</Link>.
        </p>
      </main>
    </>
  );
}
