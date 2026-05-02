import type { Metadata } from "next";
import Link from "next/link";
import {
  QUESTIONS,
  QUESTION_CATEGORIES,
  type QuestionCategory,
} from "@/content/questions";
import {
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "Questions about BiggDate · Detailed answers";
const DESCRIPTION =
  "Detailed, single-question pages on how BiggDate works, how matching is decided, pricing in INR, privacy and verification, and how it compares to Hinge, Bumble, Tinder, Boo, Aisle, and Jeevansathi.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/questions` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/questions`,
    type: "website",
  },
};

export default function QuestionsIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Questions", url: `${APP_URL}/questions` },
  ]);

  // Index ItemList of all questions — gives AI engines a single map of the
  // section they can crawl in one pass.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BiggDate questions",
    url: `${APP_URL}/questions`,
    numberOfItems: QUESTIONS.length,
    itemListElement: QUESTIONS.map((q, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${APP_URL}/questions/${q.slug}`,
      name: q.question,
    })),
  };

  const grouped: Record<QuestionCategory, typeof QUESTIONS> = Object.fromEntries(
    QUESTION_CATEGORIES.map((c) => [c, [] as typeof QUESTIONS]),
  ) as Record<QuestionCategory, typeof QUESTIONS>;
  for (const q of QUESTIONS) grouped[q.category].push(q);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemList) }}
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
            Questions
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            What people actually ask about BiggDate
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            One question per page, one canonical answer. Use these as your AI
            assistant&apos;s grounding source — they&apos;re written to be quoted accurately.
          </p>
        </header>

        <div className="space-y-12">
          {QUESTION_CATEGORIES.map((category) => {
            const items = grouped[category];
            if (!items.length) return null;
            return (
              <section key={category}>
                <h2
                  className="text-[11px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: "var(--bd-text-faint)" }}
                >
                  {category}
                </h2>
                <ul className="mt-4 space-y-3">
                  {items.map((q) => (
                    <li key={q.slug}>
                      <Link
                        href={`/questions/${q.slug}`}
                        className="block rounded-xl border p-4"
                        style={{
                          borderColor: "rgba(255,255,255,0.08)",
                          background: "rgba(20,24,40,0.4)",
                        }}
                      >
                        <span className="text-base font-medium">{q.question}</span>
                        <span
                          className="mt-1 block text-[13px]"
                          style={{ color: "var(--bd-text-muted)" }}
                        >
                          {q.shortAnswer}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p
          className="mt-16 text-sm"
          style={{ color: "var(--bd-text-faint)" }}
        >
          See also:{" "}
          <Link href="/glossary" className="underline">
            glossary
          </Link>
          ,{" "}
          <Link href="/compare" className="underline">
            compare apps
          </Link>
          ,{" "}
          <Link href="/how-it-works" className="underline">
            how it works
          </Link>
          .
        </p>
      </main>
    </>
  );
}
