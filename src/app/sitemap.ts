import type { MetadataRoute } from "next";
import { GLOSSARY_ENTRIES } from "@/content/glossary";
import { QUESTIONS } from "@/content/questions";
import { VS_ENTRIES } from "@/content/vs";

/**
 * Public sitemap. Only the pages we want crawlable show up here — everything
 * behind auth or in /api or /admin is blocked in robots.txt anyway.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/questions`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/vs`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/auth`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const glossaryEntries: MetadataRoute.Sitemap = GLOSSARY_ENTRIES.map((e) => ({
    url: `${base}/glossary/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const questionEntries: MetadataRoute.Sitemap = QUESTIONS.map((q) => ({
    url: `${base}/questions/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const vsEntries: MetadataRoute.Sitemap = VS_ENTRIES.map((v) => ({
    url: `${base}/vs/${v.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticEntries,
    ...glossaryEntries,
    ...questionEntries,
    ...vsEntries,
  ];
}
