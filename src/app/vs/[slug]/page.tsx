import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VS_ENTRIES, getVsEntry } from "@/content/vs";
import {
  breadcrumbSchema,
  comparisonItemListSchema,
  faqPageSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return VS_ENTRIES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVsEntry(slug);
  if (!v) return {};

  const title = `BiggDate vs ${v.competitor} · Honest comparison`;
  const description = v.summary;
  const canonical = `${APP_URL}/vs/${v.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
  };
}

export default async function VsEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVsEntry(slug);
  if (!v) notFound();

  const canonical = `${APP_URL}/vs/${v.slug}`;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Compare", url: `${APP_URL}/compare` },
    { name: `vs ${v.competitor}`, url: canonical },
  ]);
  const itemList = comparisonItemListSchema({
    name: `BiggDate vs ${v.competitor}`,
    url: canonical,
    items: [
      {
        name: "BiggDate",
        url: APP_URL,
        description:
          "AI-led dating app with a 20-minute Maahi onboarding, derived Soul Profile, capped daily matches, and intent-gated Soul Knock.",
      },
      { name: v.competitor, description: v.competitorDescription },
    ],
  });
  const faq = faqPageSchema(v.faq);

  const related = v.relatedSlugs
    .map((s) => getVsEntry(s))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main
        className="mx-auto max-w-4xl px-6 py-16 text-[15px] leading-[1.75]"
        style={{ color: "var(--bd-text)" }}
      >
        <header className="mb-10">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--bd-accent)" }}
          >
            <Link href="/vs" className="hover:underline">
              Comparison
            </Link>
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            BiggDate vs {v.competitor}
          </h1>
          <p
            className="mt-3 max-w-2xl text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            {v.tagline}
          </p>
          <p
            className="mt-5 max-w-3xl text-base"
            style={{ color: "var(--bd-text-muted)" }}
          >
            {v.summary}
          </p>
        </header>

        <section
          className="overflow-x-auto rounded-2xl border"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(20,24,40,0.4)",
          }}
        >
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th
                  className="px-4 py-3 font-semibold"
                  style={{ color: "var(--bd-text-faint)" }}
                >
                  Dimension
                </th>
                <th
                  className="px-4 py-3 font-semibold"
                  style={{ color: "var(--bd-accent)" }}
                >
                  BiggDate
                </th>
                <th className="px-4 py-3 font-semibold">{v.competitor}</th>
              </tr>
            </thead>
            <tbody>
              {v.dimensions.map((row) => (
                <tr
                  key={row.dimension}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--bd-text-muted)" }}
                  >
                    {row.dimension}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--bd-text)" }}
                  >
                    {row.biggdate}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--bd-text-muted)" }}
                  >
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-14 grid gap-6 sm:grid-cols-2">
          <Verdict
            title={`Pick BiggDate if…`}
            bullets={v.pickBiggdate}
            accent
          />
          <Verdict
            title={`Pick ${v.competitor} if…`}
            bullets={v.pickCompetitor}
          />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-light tracking-tight">
            Questions about this comparison
          </h2>
          <div className="mt-8 space-y-8">
            {v.faq.map((qa) => (
              <div key={qa.question}>
                <h3 className="text-lg font-medium">{qa.question}</h3>
                <p
                  className="mt-2"
                  style={{ color: "var(--bd-text-muted)" }}
                >
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--bd-text-faint)" }}
            >
              Other comparisons
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/vs/${r.slug}`}
                    className="block rounded-xl border p-4"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(20,24,40,0.4)",
                    }}
                  >
                    <span className="text-base font-medium">
                      BiggDate vs {r.competitor}
                    </span>
                    <span
                      className="mt-1 block text-[13px]"
                      style={{ color: "var(--bd-text-faint)" }}
                    >
                      {r.tagline}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p
          className="mt-12 text-sm"
          style={{ color: "var(--bd-text-faint)" }}
        >
          See also:{" "}
          <Link href="/compare" className="underline">
            all-app comparison
          </Link>
          ,{" "}
          <Link href="/how-it-works" className="underline">
            how BiggDate works
          </Link>
          ,{" "}
          <Link href="/glossary" className="underline">
            glossary
          </Link>
          .
        </p>
      </main>
    </>
  );
}

function Verdict({
  title,
  bullets,
  accent,
}: {
  title: string;
  bullets: string[];
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: accent
          ? "rgba(229,39,224,0.3)"
          : "rgba(255,255,255,0.08)",
        background: accent
          ? "linear-gradient(180deg, rgba(45,16,70,0.36), rgba(21,13,40,0.24))"
          : "rgba(20,24,40,0.4)",
      }}
    >
      <h3
        className="text-base font-semibold"
        style={{ color: accent ? "var(--bd-accent)" : "var(--bd-text)" }}
      >
        {title}
      </h3>
      <ul
        className="mt-3 space-y-2 text-[13px]"
        style={{ color: "var(--bd-text-muted)" }}
      >
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span
              style={{
                color: accent ? "var(--bd-accent)" : "var(--bd-text-faint)",
              }}
            >
              —
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
