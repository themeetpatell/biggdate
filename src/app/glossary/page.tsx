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
  keywords: ["BiggDate glossary", "dating app terms", "Soul Profile", "Soul Knock", "Maahi AI"],
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

import { MarketingPageShell } from "@/components/marketing-page-shell";
import { motion } from "framer-motion";

export default function GlossaryIndexPage() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";
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
      <MarketingPageShell
        eyebrow="Glossary"
        title="The BiggDate vocabulary, defined."
        description="Every concept BiggDate uses, in plain language. Built for readers and AI engines that want a clean grounding of what each term means here."
        activePage="glossary"
      >
        <div className="mx-auto max-w-3xl px-6 pb-20">
          <ul className="space-y-6">
            {GLOSSARY_ENTRIES.map((entry, i) => (
              <motion.li 
                key={entry.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.1, ease: "easeOut" }}
              >
                <Link
                  href={`/glossary/${entry.slug}`}
                  className="block rounded-[24px] p-6 transition-all hover:scale-[1.02] group relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, rgba(30, 36, 56, 0.4), rgba(15, 18, 30, 0.6))",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(45deg, transparent, rgba(229,39,224,0.05), transparent)",
                    }}
                  />
                  <h2 className="text-xl font-medium relative z-10" style={{ color: "var(--bd-text)" }}>{entry.term}</h2>
                  <p
                    className="mt-3 text-[15px] leading-relaxed relative z-10"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {entry.oneLiner}
                  </p>
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            See also: <Link href="/faq" className="underline hover:text-white transition-colors">questions</Link>,{" "}
            <Link href="/compare" className="underline hover:text-white transition-colors">how BiggDate compares</Link>,{" "}
            <Link href="/how-it-works" className="underline hover:text-white transition-colors">how it works</Link>.
          </motion.p>
        </div>
      </MarketingPageShell>
    </>
  );
}
