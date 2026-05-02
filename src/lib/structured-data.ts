/**
 * JSON-LD structured-data builders for AEO (Answer Engine Optimization) and
 * GEO (Generative Engine Optimization). Output is written into a
 * `<script type="application/ld+json">` tag so Google AI Overviews,
 * Perplexity, ChatGPT search, Gemini, and traditional rich-snippet crawlers
 * can extract canonical facts about BiggDate.
 *
 * Always co-locate the schema with the page that exposes the content — never
 * put unrelated schema on a page where the visible content can't back it up.
 */

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${APP_URL}#organization`,
    name: "BiggDate",
    url: APP_URL,
    logo: `${APP_URL}/icon.png`,
    description:
      "AI-led dating app for serious-minded adults. Maahi conducts a 20-minute conversation that builds a psychological profile, then surfaces 1–5 high-fit matches per day.",
    foundingLocation: {
      "@type": "Place",
      name: "Ahmedabad, Gujarat, India",
    },
    areaServed: { "@type": "Country", name: "India" },
    sameAs: [],
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${APP_URL}#app`,
    name: "BiggDate",
    operatingSystem: "Web",
    applicationCategory: "LifestyleApplication",
    applicationSubCategory: "Dating",
    url: APP_URL,
    description:
      "BiggDate is an AI-led dating app for serious-minded adults. Instead of swipe feeds, a relationship profiler named Maahi runs a 20-minute conversation, builds a psychological profile (attachment style, conflict pattern, love languages), and surfaces 1–5 carefully chosen matches per day.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "0",
      highPrice: "1999",
      offerCount: "3",
    },
    publisher: { "@id": `${APP_URL}#organization` },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${APP_URL}#website`,
    url: APP_URL,
    name: "BiggDate",
    publisher: { "@id": `${APP_URL}#organization` },
    inLanguage: "en-IN",
  };
}

export interface FaqQA {
  question: string;
  answer: string;
}

export function faqPageSchema(qas: FaqQA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export function howToSchema(params: {
  name: string;
  description: string;
  totalTime?: string;
  steps: HowToStep[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.totalTime ? { totalTime: params.totalTime } : {}),
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * `DefinedTerm` is the entity AI engines use to ground concepts in their
 * knowledge graphs. One term per page, scoped to a `DefinedTermSet` that
 * represents the BiggDate glossary as a whole.
 */
export function definedTermSchema(params: {
  term: string;
  description: string;
  url: string;
  alternateNames?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: params.term,
    description: params.description,
    url: params.url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${APP_URL}/glossary`,
      name: "BiggDate Glossary",
      url: `${APP_URL}/glossary`,
    },
    ...(params.alternateNames?.length
      ? { alternateName: params.alternateNames }
      : {}),
  };
}

/**
 * `QAPage` is the right schema for single-question pages (one URL, one
 * question, one canonical answer). `FAQPage` is for multi-question pages
 * — they're not interchangeable for AI Overviews and Perplexity citations.
 */
export function qaPageSchema(params: {
  question: string;
  answer: string;
  url: string;
  dateAuthored?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: params.question,
      text: params.question,
      ...(params.dateAuthored ? { dateCreated: params.dateAuthored } : {}),
      ...(params.authorName
        ? { author: { "@type": "Organization", name: params.authorName } }
        : {}),
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: params.answer,
        url: params.url,
        ...(params.dateAuthored ? { dateCreated: params.dateAuthored } : {}),
        ...(params.authorName
          ? { author: { "@type": "Organization", name: params.authorName } }
          : {}),
      },
    },
  };
}

/**
 * Comparison pages benefit from an `ItemList` whose elements are the products
 * being compared. Pair this with `faqPageSchema` for the questions on the page.
 */
export interface ComparedProduct {
  name: string;
  url?: string;
  description?: string;
}

export function comparisonItemListSchema(params: {
  name: string;
  url: string;
  items: ComparedProduct[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.name,
    url: params.url,
    numberOfItems: params.items.length,
    itemListElement: params.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: item.name,
        applicationCategory: "LifestyleApplication",
        applicationSubCategory: "Dating",
        ...(item.url ? { url: item.url } : {}),
        ...(item.description ? { description: item.description } : {}),
      },
    })),
  };
}

/**
 * Render a JSON-LD payload as a string suitable for direct injection into a
 * <script type="application/ld+json"> tag. We collapse to a single line and
 * escape `</` to defeat any future XSS sneakery on the payload boundary.
 */
export function jsonLdString(payload: unknown): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
