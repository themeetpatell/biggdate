import type { Metadata } from "next";
import Link from "next/link";
import { VS_ENTRIES } from "@/content/vs";
import {
  breadcrumbSchema,
  jsonLdString,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "BiggDate vs other dating apps · Per-app comparisons";
const DESCRIPTION =
  "Honest, dimension-by-dimension comparisons of BiggDate against Hinge, Bumble, Tinder, Boo, Aisle, and Jeevansathi. Pick the right app for your intent — serious dating, casual, marriage, India context, or arranged matrimony.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/vs` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/vs`,
    type: "website",
  },
};

export default function VsIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Compare", url: `${APP_URL}/compare` },
    { name: "Per-app", url: `${APP_URL}/vs` },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "BiggDate vs other dating apps",
    url: `${APP_URL}/vs`,
    numberOfItems: VS_ENTRIES.length,
    itemListElement: VS_ENTRIES.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${APP_URL}/vs/${v.slug}`,
      name: `BiggDate vs ${v.competitor}`,
    })),
  };

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
            Per-app comparisons
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            BiggDate vs the other dating apps
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            One page per competitor with the dimensions, tradeoffs, and verdicts
            specific to that app. For a single side-by-side table of all five
            major apps, see{" "}
            <Link href="/compare" className="underline">
              the comparison page
            </Link>
            .
          </p>
        </header>

        <ul className="space-y-4">
          {VS_ENTRIES.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/vs/${v.slug}`}
                className="block rounded-2xl border p-5"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(20,24,40,0.4)",
                }}
              >
                <h2 className="text-lg font-medium">
                  BiggDate vs {v.competitor}
                </h2>
                <p
                  className="mt-2 text-[14px]"
                  style={{ color: "var(--bd-text-muted)" }}
                >
                  {v.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p
          className="mt-16 text-sm"
          style={{ color: "var(--bd-text-faint)" }}
        >
          See also:{" "}
          <Link href="/compare" className="underline">
            all-app comparison
          </Link>
          ,{" "}
          <Link href="/glossary" className="underline">
            glossary
          </Link>
          ,{" "}
          <Link href="/questions" className="underline">
            questions
          </Link>
          .
        </p>
      </main>
    </>
  );
}
