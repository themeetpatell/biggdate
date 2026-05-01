import type { Metadata } from "next";
import {
  faqPageSchema,
  breadcrumbSchema,
  jsonLdString,
  type FaqQA,
} from "@/lib/structured-data";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://biggdate.app";

const TITLE = "Frequently Asked Questions · BiggDate";
const DESCRIPTION =
  "How BiggDate works, what makes it different from Bumble and Tinder, pricing, privacy, and how the AI relationship profiler Maahi builds your psychological profile.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${APP_URL}/faq` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${APP_URL}/faq`,
    type: "article",
  },
};

const FAQ: FaqQA[] = [
  {
    question: "What is BiggDate?",
    answer:
      "BiggDate is an AI-led dating app for serious-minded adults. Instead of swipe feeds, a relationship profiler named Maahi runs a 20-minute conversation that builds a psychological profile (attachment style, conflict pattern, love languages, dealbreakers), then surfaces 1–5 high-fit matches per day. It is India-first, headquartered in Ahmedabad.",
  },
  {
    question: "How is BiggDate different from Bumble, Tinder, and Hinge?",
    answer:
      "BiggDate replaces the swipe feed with curated daily matches and gates contact behind a Soul Knock — both users must answer a question for each other before photos unlock and a chat opens. Bumble, Tinder, and Hinge are photo-led and use forms or short prompts for onboarding; BiggDate uses a structured 20-minute AI conversation to derive attachment style, love language, and conflict pattern.",
  },
  {
    question: "Is BiggDate free?",
    answer:
      "Yes, BiggDate has a free tier with a small daily match limit. Premium and Pro plans expand match count, Soul Knock budget, and Maahi companion access. There is a 7-day free trial on paid plans. Subscriptions are billed in INR by Stripe.",
  },
  {
    question: "How long does BiggDate onboarding take?",
    answer:
      "About 20 minutes. Account creation takes under a minute. Onboarding with Maahi is split into two phases — about 3 minutes of basic facts (location, birthday, gender, partner gender, age range, intent, lifestyle) and 7–8 minutes of psychological depth (relationship history, conflict, love languages, dealbreakers).",
  },
  {
    question: "What is the Soul Profile?",
    answer:
      "It's the structured psychological profile BiggDate builds from your onboarding conversation. It includes attachment style (Secure / Anxious / Avoidant / Fearful-Avoidant), conflict style, love language given vs received, core values, growth areas, dealbreakers, and a written summary of who you are emotionally.",
  },
  {
    question: "What is a Soul Knock?",
    answer:
      "BiggDate's intent-based contact mechanism. To start a conversation with a match, you compose a question for them. They see it and answer. You then answer a reciprocal question. Only after both sides answer do photos unlock and a chat thread open. This filters out low-effort interest before any photos are exposed.",
  },
  {
    question: "Who is Maahi?",
    answer:
      "Maahi is BiggDate's AI relationship profiler and companion, built on top of Google Gemini with custom prompting and per-user memory. She runs your onboarding conversation, helps with post-date debriefs, and is available between events as an emotionally-aware confidant who remembers your patterns.",
  },
  {
    question: "Is BiggDate for casual dating or hookups?",
    answer:
      "No. BiggDate is built for users who want a real relationship — marriage-track, ready for real love, or seriously exploring. The depth of onboarding self-selects users who are willing to invest in something deliberate. If you want quick casual matches, other apps will serve you better.",
  },
  {
    question: "Is BiggDate available outside India?",
    answer:
      "Yes. The app works globally with an English UI. The product is India-first in pricing (INR) and market context (Ahmedabad-headquartered, DPDP-compliant, English UI tuned for Indian professionals), but anyone over 18 can sign up.",
  },
  {
    question: "Is my data safe on BiggDate?",
    answer:
      "BiggDate is DPDP-compliant (India's Digital Personal Data Protection Act). Data is encrypted in transit and at rest. We do not sell user data to advertisers or data brokers. Maahi conversations are used only to build your profile and improve your experience — they are not used to train third-party models. Account deletion is one-click from Settings and erases all data within 30 days.",
  },
  {
    question: "How does BiggDate prevent fake profiles?",
    answer:
      "Photos are gated behind a Soul Knock — a fake account can't show photos until both users have demonstrated intent. We run automated NSFW, weapon, and minor detection on every uploaded photo. There is an optional pink-tick verification badge that requires manual review of LinkedIn URL plus selfie. Users can report and bidirectionally block other users.",
  },
  {
    question: "What is the minimum age to use BiggDate?",
    answer:
      "18 years old. Age confirmation is required at signup, and BiggDate does not knowingly collect data from anyone under 18. If we discover a minor account, it is removed immediately.",
  },
  {
    question: "What attachment styles does BiggDate recognize?",
    answer:
      "BiggDate uses the four-style framework: Secure, Anxious, Avoidant, and Fearful-Avoidant (sometimes called Disorganized). Maahi infers your style from how you describe past relationships, conflict moments, and how you give and receive care — never from a self-report quiz.",
  },
  {
    question: "Can I edit my Soul Profile after onboarding?",
    answer:
      "Yes. You can edit basic facts (location, work, lifestyle, photos, partner preferences) anytime from Settings. The psychological profile (attachment style, growth areas, summary) is derived from your conversation with Maahi and is updated as you continue talking to her over time.",
  },
  {
    question: "How does BiggDate make money?",
    answer:
      "Subscription revenue from Premium and Pro plans. BiggDate does not run ads, sell user data, or rely on engagement-bait mechanics like \"who liked you\" reveals.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "From the Settings drawer, you can manage or cancel your subscription via the Stripe customer portal. Cancellation takes effect at the end of your current paid period — you keep access until then. Refunds follow Indian consumer law.",
  },
];

export default function FAQPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: APP_URL },
    { name: "FAQ", url: `${APP_URL}/faq` },
  ]);
  const faq = faqPageSchema(FAQ);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }}
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--bd-accent)" }}>
            FAQ
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--bd-text-faint)" }}>
            How BiggDate works, what makes it different, and how Maahi builds your Soul Profile.
          </p>
        </header>

        <div className="space-y-8">
          {FAQ.map((qa) => (
            <section key={qa.question}>
              <h2 className="text-lg font-medium">{qa.question}</h2>
              <p className="mt-2" style={{ color: "var(--bd-text-muted)" }}>
                {qa.answer}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-16 text-sm" style={{ color: "var(--bd-text-faint)" }}>
          Still have a question? Email{" "}
          <a href="mailto:hello@biggdate.app" className="underline">
            hello@biggdate.app
          </a>
          . See also: <a href="/compare" className="underline">how BiggDate compares</a>,{" "}
          <a href="/how-it-works" className="underline">how it works</a>,{" "}
          <a href="/privacy" className="underline">Privacy</a>,{" "}
          <a href="/terms" className="underline">Terms</a>.
        </p>
      </main>
    </>
  );
}
