import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GLOSSARY_ENTRIES,
  getGlossaryEntry,
} from "@/content/glossary";
import {
  breadcrumbSchema,
  definedTermSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) return {};

  const title = `${entry.term} · BiggDate glossary`;
  const description = entry.oneLiner;
  const canonical = `${APP_URL}/glossary/${entry.slug}`;

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

export default async function GlossaryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();

  const canonical = `${APP_URL}/glossary/${entry.slug}`;

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Glossary", url: `${APP_URL}/glossary` },
    { name: entry.term, url: canonical },
  ]);
  const term = definedTermSchema({
    term: entry.term,
    description: entry.oneLiner,
    url: canonical,
    alternateNames: entry.alternateNames,
  });

  const related = entry.relatedSlugs
    .map((s) => getGlossaryEntry(s))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(term) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main
        className="mx-auto max-w-3xl px-6 py-16 text-[15px] leading-[1.75]"
        style={{ color: "var(--bd-text)" }}
      >
        <header className="mb-10">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--bd-accent)" }}
          >
            <Link href="/glossary" className="hover:underline">
              Glossary
            </Link>
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            {entry.term}
          </h1>
          {entry.alternateNames?.length ? (
            <p
              className="mt-2 text-[13px]"
              style={{ color: "var(--bd-text-faint)" }}
            >
              Also known as: {entry.alternateNames.join(" · ")}
            </p>
          ) : null}
          <p
            className="mt-5 max-w-2xl text-base"
            style={{ color: "var(--bd-text-muted)" }}
          >
            {entry.oneLiner}
          </p>
        </header>

        <article className="space-y-5">
          {entry.body.map((p, i) => (
            <p key={i} style={{ color: "var(--bd-text-muted)" }}>
              {p}
            </p>
          ))}
        </article>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2
              className="text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--bd-text-faint)" }}
            >
              Related terms
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/glossary/${r.slug}`}
                    className="group block rounded-xl border p-4"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(20,24,40,0.4)",
                    }}
                  >
                    <span className="text-base font-medium group-hover:underline">
                      {r.term}
                    </span>
                    <span
                      className="mt-1 block text-[13px]"
                      style={{ color: "var(--bd-text-faint)" }}
                    >
                      {r.oneLiner}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {entry.seeAlso.length > 0 ? (
          <p
            className="mt-12 text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            See also:{" "}
            {entry.seeAlso.map((s, i) => (
              <span key={s.href}>
                <Link href={s.href} className="underline">
                  {s.label}
                </Link>
                {i < entry.seeAlso.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        ) : null}
      </main>
    </>
  );
}
