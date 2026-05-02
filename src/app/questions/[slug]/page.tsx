import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  QUESTIONS,
  getQuestion,
} from "@/content/questions";
import {
  breadcrumbSchema,
  jsonLdString,
  qaPageSchema,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

export const dynamicParams = false;

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) return {};

  const title = `${q.question} · BiggDate`;
  const description = q.shortAnswer;
  const canonical = `${APP_URL}/questions/${q.slug}`;

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

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) notFound();

  const canonical = `${APP_URL}/questions/${q.slug}`;
  const fullAnswer = [q.shortAnswer, ...q.longAnswer].join("\n\n");

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "Questions", url: `${APP_URL}/questions` },
    { name: q.question, url: canonical },
  ]);
  const qaSchema = qaPageSchema({
    question: q.question,
    answer: fullAnswer,
    url: canonical,
    authorName: "BiggDate",
  });

  const related = q.relatedSlugs
    .map((s) => getQuestion(s))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(qaSchema) }}
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
            <Link href="/questions" className="hover:underline">
              {q.category}
            </Link>
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-[34px]">
            {q.question}
          </h1>
        </header>

        <div
          className="rounded-2xl border p-5 text-base"
          style={{
            borderColor: "rgba(229,39,224,0.3)",
            background:
              "linear-gradient(180deg, rgba(45,16,70,0.36), rgba(21,13,40,0.24))",
            color: "var(--bd-text)",
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--bd-accent)" }}
          >
            Short answer
          </p>
          <p className="mt-2">{q.shortAnswer}</p>
        </div>

        <article className="mt-10 space-y-5">
          {q.longAnswer.map((p, i) => (
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
              Related questions
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/questions/${r.slug}`}
                    className="block rounded-xl border p-4"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(20,24,40,0.4)",
                    }}
                  >
                    <span className="text-base font-medium">{r.question}</span>
                    <span
                      className="mt-1 block text-[13px]"
                      style={{ color: "var(--bd-text-faint)" }}
                    >
                      {r.shortAnswer}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {q.seeAlso.length > 0 ? (
          <p
            className="mt-12 text-sm"
            style={{ color: "var(--bd-text-faint)" }}
          >
            See also:{" "}
            {q.seeAlso.map((s, i) => (
              <span key={s.href}>
                <Link href={s.href} className="underline">
                  {s.label}
                </Link>
                {i < q.seeAlso.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
        ) : null}
      </main>
    </>
  );
}
