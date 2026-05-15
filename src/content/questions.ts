/**
 * One question per page, one canonical answer. These are the long-tail
 * queries we want AI engines (ChatGPT search, Perplexity, Gemini, Google AI
 * Overviews) to cite when a user asks them about BiggDate.
 *
 * Authoring rules:
 * - `question`: phrase exactly as a real person would type it into a search
 *   bar or AI assistant. Not headline-ese.
 * - `slug`: lowercase-kebab. URL is `/questions/{slug}`.
 * - `category`: groups the question on the index page. Keep groups small.
 * - `shortAnswer`: 2–3 sentences, ≤320 chars. This is what AI engines lift
 *   verbatim. Must be a complete answer on its own — assume the reader sees
 *   no other context.
 * - `longAnswer`: 3–5 paragraphs of supporting context, examples, edge cases.
 * - `relatedSlugs`: other questions someone reading this would explore next.
 * - `seeAlso`: glossary terms or pages on this site.
 */

export type QuestionCategory =
  | "Getting started"
  | "How matching works"
  | "Privacy & safety"
  | "Pricing & plans"
  | "Comparisons"
  | "India context";

export interface QuestionEntry {
  slug: string;
  question: string;
  category: QuestionCategory;
  shortAnswer: string;
  longAnswer: string[];
  relatedSlugs: string[];
  seeAlso: { label: string; href: string }[];
}

export const QUESTIONS: QuestionEntry[] = [
  // Getting started
  {
    slug: "what-is-biggdate",
    question: "What is BiggDate?",
    category: "Getting started",
    shortAnswer:
      "BiggDate is an AI-led dating app for serious-minded adults. Instead of a swipe feed, an AI relationship profiler named Maahi runs a 20-minute onboarding conversation, builds a psychological profile of you, and surfaces 1–5 carefully chosen matches per day.",
    longAnswer: [
      "BiggDate is a dating app built for people who actually want a relationship — founders, operators, professionals, and ambitious 20–35-year-olds who are tired of low-effort swipe culture. It is India-first (Ahmedabad-headquartered, DPDP-compliant, INR pricing) but available globally.",
      "The core difference is the onboarding. Most dating apps ask for photos, three prompt answers, and basic facts; BiggDate replaces that with a 20-minute conversation with Maahi, an AI relationship profiler. Maahi asks you 8 quick questions to set up basic facts, then 9 deeper questions about attachment, conflict, love languages, dealbreakers, and growth areas, with adaptive follow-ups when an answer is thin.",
      "From that conversation, BiggDate derives a Soul Profile — your psychological profile — and uses it to surface 1–5 daily matches with a written narrative explaining why each pair would resonate. To start a conversation, both users complete a Soul Knock: each answers a question for the other before photos and chat unlock.",
      "After dates, a structured 3-question debrief tunes future matches. Maahi remains available between events as an ongoing companion who knows your patterns.",
    ],
    relatedSlugs: [
      "how-does-maahi-work",
      "is-biggdate-only-for-india",
      "biggdate-pricing",
    ],
    seeAlso: [
      { label: "How BiggDate works", href: "/how-it-works" },
      { label: "About", href: "/about" },
    ],
  },
  {
    slug: "is-biggdate-free",
    question: "Is BiggDate free to use?",
    category: "Pricing & plans",
    shortAnswer:
      "Right now BiggDate is in early access and Premium is completely free for invited users. We hand out access codes over WhatsApp — message us on +91 98243 41414 and we'll send you one.",
    longAnswer: [
      "BiggDate is in early access. While we're still building, Premium access is free for people we invite — you get the full Maahi onboarding, Soul Profile, daily curated matches, and ongoing access to Maahi as a companion at no cost.",
      "To get access, message us on WhatsApp at +91 98243 41414 and ask for an access code. Redeem it at the in-app membership screen and Premium unlocks instantly.",
      "Paid plans are coming after early access wraps up. We will not run ads, sell data, or use engagement-bait mechanics — the business model is aligned with you finding a relationship and leaving.",
    ],
    relatedSlugs: ["biggdate-pricing", "what-is-biggdate"],
    seeAlso: [{ label: "About BiggDate", href: "/about" }],
  },
  {
    slug: "biggdate-pricing",
    question: "How much does BiggDate cost?",
    category: "Pricing & plans",
    shortAnswer:
      "BiggDate is free during early access. We hand out access codes via WhatsApp (+91 98243 41414). Paid plans launch later — the structure will be a small number of subscription tiers in INR for India, with no ads and no à-la-carte paywalls.",
    longAnswer: [
      "While we're in early access, BiggDate is free for anyone who has an access code. To get one, message us on WhatsApp at +91 98243 41414 — we send codes personally so we can keep early-access membership intentional.",
      "Once we launch paid plans, BiggDate will use a tiered subscription model in INR for India and local currency elsewhere. Expect a small number of tiers (not a long menu of unlocks), and the working price band we'll start from is roughly ₹499 to ₹1,999 per month with quarterly/annual discounts. Final published pricing will appear at /pricing on biggdate.app when paid launches.",
      "We do not run flash sales, urgency timers, or 'see who liked you' paywalls. Soul Knocks remain the only contact mechanic and will not be sold individually as boosts.",
    ],
    relatedSlugs: ["is-biggdate-free", "what-is-biggdate"],
    seeAlso: [{ label: "About BiggDate", href: "/about" }],
  },
  {
    slug: "how-long-does-onboarding-take",
    question: "How long does BiggDate onboarding take?",
    category: "Getting started",
    shortAnswer:
      "BiggDate onboarding takes about 20 minutes — a 3-minute basic-facts phase and a 7–8 minute psychological-depth phase with Maahi, plus reading time for your Soul Snapshot. It is intentionally longer than other dating apps.",
    longAnswer: [
      "The full BiggDate onboarding is roughly 20 minutes end to end. Phase 1 is 3 minutes of basic facts (location, intent, age range, lifestyle). Phase 2 is 7–8 minutes of deeper questions about why you're dating now, your last meaningful relationship, conflict patterns, love languages, dealbreakers, and what you bring to a partnership. Maahi follows up adaptively on answers that are thin or emotionally rich.",
      "After the conversation, you read your Soul Snapshot — a 2–3 sentence written summary of who you are emotionally, plus the structured fields. This takes a few minutes.",
      "Twenty minutes is intentional. A 5-minute form cannot capture attachment style or conflict pattern reliably. The depth of onboarding is also a self-selection filter — anyone unwilling to invest 20 minutes is probably not the user we want.",
      "You complete onboarding once. From day two, BiggDate is a few minutes per day — a curated match or two and any chats in progress.",
    ],
    relatedSlugs: ["how-does-maahi-work", "what-is-biggdate"],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  // How matching works
  {
    slug: "how-does-maahi-work",
    question: "How does Maahi work?",
    category: "How matching works",
    shortAnswer:
      "Maahi is BiggDate's AI relationship profiler. She runs a 20-minute conversation in two phases — basic facts then psychological depth — with adaptive follow-ups, then derives your Soul Profile from your answers. After onboarding, she remains available as a confidant.",
    longAnswer: [
      "Maahi is the AI that conducts BiggDate's onboarding conversation and derives the Soul Profile that the matching system runs on. She is not a chatbot for matches — she is your profiler and afterwards your companion.",
      "Phase 1 is 8 chip-driven questions about basic facts: location, gender, who you want to meet, age range, intent (marriage, serious, exploring), what keeps you busy, and lifestyle. This takes about 3 minutes.",
      "Phase 2 is 9 deeper questions with up to 5 adaptive follow-ups when an answer is thin or emotionally rich. Topics include why you're dating now, your last meaningful relationship, conflict in the first 10 minutes, how you know someone cares about you, how you show up when you love someone, work intensity, date-3 dealbreakers, what you bring that's hard to find, and what a partner needs to understand about you.",
      "From those answers, Maahi derives attachment style, conflict style, love language given vs received, core values, dealbreakers, and growth areas. She returns a written Soul Snapshot summarizing who you are emotionally.",
      "After onboarding, Maahi is available between dates and chats. She has your Soul Profile and recent debriefs as context, so she can help you process anxiety, draft a Soul Knock, or pressure-test whether a dealbreaker is real.",
    ],
    relatedSlugs: [
      "what-is-soul-profile",
      "what-is-soul-knock",
      "how-many-matches-per-day",
    ],
    seeAlso: [
      { label: "How BiggDate works", href: "/how-it-works" },
      { label: "Maahi (glossary)", href: "/glossary/maahi" },
    ],
  },
  {
    slug: "what-is-soul-profile",
    question: "What is a Soul Profile?",
    category: "How matching works",
    shortAnswer:
      "A Soul Profile is BiggDate's structured psychological profile of you, derived from a 20-minute conversation with Maahi. It captures attachment style, conflict pattern, love languages, dealbreakers, core values, and growth areas — the substrate the matching system runs on.",
    longAnswer: [
      "A Soul Profile is the psychological profile BiggDate builds for each user from the Maahi onboarding conversation. It records attachment style (Secure, Anxious, Avoidant, Fearful-Avoidant), conflict style, love language given vs received, core values, dealbreakers, and growth areas, plus a written 2–3 sentence summary called a Soul Snapshot.",
      "Soul Profiles are the matching substrate. When BiggDate surfaces 1–5 daily matches, the system is comparing Soul Profiles — not photos, prompts, or hobby tags. This is why first-day matches on BiggDate tend to be more accurate than first-week matches on swipe apps: the system has more signal from minute one.",
      "Soul Profiles are private. Other users never see your raw profile — they see only a narrative explanation of why a particular pair would resonate, generated for their match card.",
    ],
    relatedSlugs: ["how-does-maahi-work", "what-is-soul-knock"],
    seeAlso: [
      { label: "Soul Profile (glossary)", href: "/glossary/soul-profile" },
    ],
  },
  {
    slug: "what-is-soul-knock",
    question: "What is a Soul Knock?",
    category: "How matching works",
    shortAnswer:
      "A Soul Knock is BiggDate's intent-based contact gate. To start a conversation with a match, both users answer a question for each other; only after both have answered do photos unlock and the chat thread open.",
    longAnswer: [
      "A Soul Knock is how you start contact with a match on BiggDate. Instead of liking a photo or a prompt, you compose a question for the person you're interested in. They see your question and answer it, then ask you a reciprocal question. Once both sides have answered, photos unlock and the chat thread opens.",
      "The point of a Soul Knock is to filter out 0.5-second appearance-based decisions. On most dating apps, a swipe is a coin flip on a photo and a 'match' means almost nothing. On BiggDate, a successful Soul Knock means two people demonstrated effort and curiosity about each other before any chat began.",
      "Soul Knocks are not paid features and don't replace messaging. After both have answered, chat works like any messaging app — but the friction is concentrated at the front of the relationship, not the back.",
    ],
    relatedSlugs: ["what-is-soul-profile", "how-many-matches-per-day"],
    seeAlso: [
      { label: "Soul Knock (glossary)", href: "/glossary/soul-knock" },
    ],
  },
  {
    slug: "how-many-matches-per-day",
    question: "How many matches do you get on BiggDate per day?",
    category: "How matching works",
    shortAnswer:
      "BiggDate surfaces 1 to 5 carefully curated matches per day on paid plans, and a smaller weekly cadence on the free tier. There is no endless feed and no swipe stack — match volume is intentionally low so each one is worth your attention.",
    longAnswer: [
      "BiggDate is built around scarcity, not abundance. Paid users see 1 to 5 curated matches per day — typically 2 or 3 — selected from the global candidate pool by comparing Soul Profiles. Free users see a smaller weekly cadence.",
      "Each match comes with a written narrative: why this pair would resonate, where the friction is likely to be, and one opening question that would be meaningful to both of you. This is the substitute for swiping through 200 photos a night.",
      "There is no endless feed and no swipe stack. If you don't act on a match within a few days, it cycles out and a new one comes in. The constraint is intentional — it forces deliberate decision-making and prevents the dating-app behavior loop where you treat humans as inventory.",
    ],
    relatedSlugs: [
      "what-is-soul-profile",
      "what-is-soul-knock",
      "how-does-matching-work",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "how-does-matching-work",
    question: "How does BiggDate decide who to show me?",
    category: "How matching works",
    shortAnswer:
      "BiggDate compares your Soul Profile to other users' profiles across attachment style, conflict pattern, love languages, values, dealbreakers, intent, and lifestyle. Each daily match is selected for fit, not popularity, and comes with a narrative explaining why.",
    longAnswer: [
      "BiggDate's matching runs on Soul Profiles, the structured psychological profiles Maahi derives during onboarding. The system compares your profile to other users along multiple axes: attachment style and how it pairs with theirs, conflict style and recovery patterns, love language given vs received, core values, dealbreakers (yours and theirs), intent, and lifestyle.",
      "The system does not prioritize 'popularity' (how many people have liked someone) the way feed-based apps do. There is no Elo score and no swipe-rate weighting. Two people the system thinks would resonate get surfaced regardless of how 'attractive' the broader pool finds either of them.",
      "Each match comes with a narrative that is generated specifically for the pair: why this could work, where the predictable friction is, and one opening question that would land for both of you. Date debriefs after the date update the system on what genuinely lands for you.",
    ],
    relatedSlugs: [
      "how-many-matches-per-day",
      "what-is-soul-profile",
      "what-is-date-debrief",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "what-is-date-debrief",
    question: "What is a date debrief on BiggDate?",
    category: "How matching works",
    shortAnswer:
      "A date debrief is a structured 3-question reflection after a date — chemistry, what surprised you, and your decision (continue, pause, end). It tunes future matches and gives you a clearer read on your own pattern over time.",
    longAnswer: [
      "After a date arranged through BiggDate, the app prompts a structured reflection: what was the chemistry like, what surprised you, and what is your decision (continue, pause, or end). It takes about two minutes.",
      "Debriefs serve two purposes. First, the matching system uses them to tune future curation — what genuinely lands gets reinforced, what consistently misfires gets de-weighted. Second, the debrief log gives you a clearer view of your own pattern. Most people cannot articulate why they keep dating the same kind of person; written debriefs over a few months make that pattern visible.",
      "Debriefs are private. They are never shared with the date or any other user. Maahi uses them as private context if you want to talk through what happened.",
    ],
    relatedSlugs: ["how-does-matching-work", "how-does-maahi-work"],
    seeAlso: [
      { label: "Date Debrief (glossary)", href: "/glossary/date-debrief" },
    ],
  },
  // Privacy & safety
  {
    slug: "is-biggdate-safe",
    question: "Is BiggDate safe?",
    category: "Privacy & safety",
    shortAnswer:
      "BiggDate is built with verification, gated contact, and DPDP-compliant data handling. Every account passes selfie-and-document verification before getting the Pink Tick, photos are hidden until both users complete a Soul Knock, and you can revoke access to any user at any time.",
    longAnswer: [
      "Three things drive BiggDate's safety model. First, every account verifies identity via a live selfie compared to a government ID before earning the Pink Tick. This is the structural defense against catfishing and bot accounts. Second, photos are hidden until both users complete a Soul Knock — so you cannot be screenshotted or saved by someone who has put in zero effort. Third, you can block, report, and revoke access to any user at any time, and reports are reviewed by a human moderation team.",
      "On data: BiggDate is built to be DPDP-compliant (India's Digital Personal Data Protection Act, 2023). Your Soul Profile and conversations with Maahi are encrypted at rest, never sold, and not used to train external models. You can export your data and delete your account end-to-end from settings.",
      "No system is perfectly safe. BiggDate's design choices — verification gate, intent gate, no public photo feed — substantially reduce the most common dating-app harms. We continue to invest in moderation and safety as the user base grows.",
    ],
    relatedSlugs: [
      "is-biggdate-private",
      "what-is-pink-tick",
      "how-does-verification-work",
    ],
    seeAlso: [
      { label: "Privacy", href: "/privacy" },
      { label: "Pink Tick (glossary)", href: "/glossary/pink-tick-verification" },
    ],
  },
  {
    slug: "is-biggdate-private",
    question: "Is my BiggDate data private?",
    category: "Privacy & safety",
    shortAnswer:
      "Yes. Your Soul Profile, conversations with Maahi, and date debriefs are encrypted at rest, never sold, and never used to train external AI models. BiggDate is DPDP-compliant in India, and you can export or delete your data at any time.",
    longAnswer: [
      "Your psychological profile, conversations with Maahi, date debriefs, and Pulse posts are private to you. Other users never see your raw Soul Profile — they see only the per-pair narrative the system generates for a match card. Maahi is hosted within BiggDate's infrastructure and your conversation data is not used to train external AI models.",
      "BiggDate is built to be DPDP-compliant in India. We minimize data collection, store data in encrypted form, and provide self-serve export and deletion in account settings. We do not sell data and do not run programmatic advertising.",
      "If you delete your account, your Soul Profile and conversation history are removed end-to-end within the deletion window specified in our Privacy Policy. Backups are purged on a defined cycle.",
    ],
    relatedSlugs: ["is-biggdate-safe", "what-is-pink-tick"],
    seeAlso: [{ label: "Privacy", href: "/privacy" }],
  },
  {
    slug: "what-is-pink-tick",
    question: "What is the Pink Tick on BiggDate?",
    category: "Privacy & safety",
    shortAnswer:
      "The Pink Tick is BiggDate's identity verification mark, awarded after you pass selfie-and-document verification. It signals that the account belongs to a real person whose name and face match the profile, not a bot or catfish.",
    longAnswer: [
      "The Pink Tick is BiggDate's identity verification mark. You earn it by completing selfie-and-document verification — a live selfie compared to a government ID — confirming that the account belongs to the real person whose name and face are on the profile.",
      "The Pink Tick is required to post on the Pulse Feed and is shown on user profiles to other users. It does not unlock paid features — it is a trust signal, not a paywall.",
      "Why pink: it is BiggDate's brand accent and visually distinct from the blue ticks of social platforms. The shape signals 'verified identity,' not 'celebrity' or 'official account,' which is the meaning of blue ticks elsewhere.",
    ],
    relatedSlugs: ["how-does-verification-work", "is-biggdate-safe"],
    seeAlso: [
      {
        label: "Pink Tick (glossary)",
        href: "/glossary/pink-tick-verification",
      },
    ],
  },
  {
    slug: "how-does-verification-work",
    question: "How does BiggDate verify users?",
    category: "Privacy & safety",
    shortAnswer:
      "BiggDate uses selfie-and-document verification: you take a live selfie that is compared to a government ID. After review, your account is awarded the Pink Tick. The ID is used only for verification and is not shown to other users.",
    longAnswer: [
      "Verification on BiggDate is a one-time process. You take a live selfie in the app and submit a government ID. The system checks that the face on the ID matches the live selfie and that the document is genuine. After review, your account earns the Pink Tick.",
      "Your government ID is used for verification only. It is not displayed on your profile, never shared with matches, and stored encrypted. Once verification is complete, only the Pink Tick and your name and photos (after Soul Knock) are visible to other users.",
      "Verification is required for Pulse posting and recommended for all serious accounts. Verified accounts are also surfaced first in matching, since identity confidence is part of the trust model.",
    ],
    relatedSlugs: ["what-is-pink-tick", "is-biggdate-safe"],
    seeAlso: [{ label: "Privacy", href: "/privacy" }],
  },
  // Comparisons
  {
    slug: "biggdate-vs-hinge",
    question: "Is BiggDate better than Hinge?",
    category: "Comparisons",
    shortAnswer:
      "BiggDate and Hinge are both designed for serious relationships, but they differ structurally. Hinge keeps a swipe-and-like feed with prompts; BiggDate replaces the feed with a 20-minute Maahi conversation, a derived Soul Profile, 1–5 daily curated matches, and a Soul Knock that hides photos until both users have answered a question for each other.",
    longAnswer: [
      "If you're in the US/UK and want a familiar feed model with more depth than Tinder, Hinge is a strong choice. If you're explicitly marriage-track or in India, BiggDate is purpose-built for that.",
      "Hinge has prompts and likes-with-comments, which is closer in spirit to BiggDate than Tinder is. The two structural differences: Hinge keeps photos visible from the first impression; BiggDate hides them until a Soul Knock completes. And Hinge's profile is what you fill in; BiggDate's profile is what Maahi derives from a directed interview, which captures attachment and conflict patterns a self-fill profile cannot.",
      "On India context: Hinge is not localized. BiggDate is India-first — DPDP-compliant, INR pricing, and onboarding that includes questions about family approval and arranged-vs-self-chosen dynamics that matter in this market.",
    ],
    relatedSlugs: ["biggdate-vs-bumble", "biggdate-vs-tinder", "what-is-biggdate"],
    seeAlso: [
      { label: "BiggDate vs Hinge", href: "/vs/hinge" },
      { label: "Compare all apps", href: "/compare" },
    ],
  },
  {
    slug: "biggdate-vs-bumble",
    question: "BiggDate vs Bumble — which is better for serious dating?",
    category: "Comparisons",
    shortAnswer:
      "BiggDate is purpose-built for serious dating; Bumble is a mixed-intent app with a women-first messaging mechanic. If you want depth — a derived psychological profile, curated daily matches, gated contact — BiggDate fits. If you want women-led contact dynamics on a high-volume feed, Bumble fits.",
    longAnswer: [
      "Bumble's defining mechanic is that women send the first message within 24 hours of a match. This addresses one specific dating-app pathology (men spamming photos with low-effort openers) but doesn't change the structure of the rest of the experience — it's still a swipe feed with photos as the primary signal.",
      "BiggDate addresses a different pathology: that photo-first feeds train people to make 0.5-second decisions on appearance. The Soul Knock gates contact behind effort from both sides; photos unlock only after both have answered a question for each other.",
      "If your friction with dating apps is 'men opening with hi or worse,' Bumble fixes that. If your friction is 'I keep matching and meeting people who turned out to be wrong on attachment or values,' BiggDate is the structural fix.",
    ],
    relatedSlugs: ["biggdate-vs-hinge", "biggdate-vs-tinder", "what-is-biggdate"],
    seeAlso: [
      { label: "BiggDate vs Bumble", href: "/vs/bumble" },
      { label: "Compare all apps", href: "/compare" },
    ],
  },
  {
    slug: "biggdate-vs-tinder",
    question: "BiggDate vs Tinder — which one should I use?",
    category: "Comparisons",
    shortAnswer:
      "BiggDate and Tinder are designed for opposite intents. Tinder is high-volume and casual-leaning; BiggDate is low-volume and serious-relationship-track. If you want maximum people, fastest match speed, and casual energy, Tinder fits. If you want curated matches, intent-gated contact, and a derived psychological profile, BiggDate fits.",
    longAnswer: [
      "Tinder optimizes for volume and speed. The swipe is fast, the match is fast, the chat is fast, and the funnel is wide. This is the right design if you want maximum volume and casual energy — for example, while traveling, or when you're not specifically looking for a long-term relationship.",
      "BiggDate optimizes for fit. Onboarding is 20 minutes, daily matches are capped at 1–5, contact requires a Soul Knock from both sides. The funnel is narrow on purpose. This is the right design if you've cycled through Tinder and discovered that volume isn't the bottleneck — fit is.",
      "There is no shame in either. Tinder for some seasons, BiggDate for others. They solve different problems.",
    ],
    relatedSlugs: ["biggdate-vs-hinge", "biggdate-vs-bumble", "what-is-biggdate"],
    seeAlso: [
      { label: "BiggDate vs Tinder", href: "/vs/tinder" },
      { label: "Compare all apps", href: "/compare" },
    ],
  },
  // India context
  {
    slug: "is-biggdate-only-for-india",
    question: "Is BiggDate only for India?",
    category: "India context",
    shortAnswer:
      "No. BiggDate is India-first — Ahmedabad-headquartered, DPDP-compliant, with INR pricing and onboarding that includes India-specific context — but available globally. Users outside India onboard in English with regional pricing and locally relevant questions.",
    longAnswer: [
      "BiggDate is India-first and globally available. India-first means: the company is headquartered in Ahmedabad, the data layer is DPDP-compliant, pricing is in INR, and Maahi's onboarding includes India-specific questions (e.g., how much family approval matters, intent around marriage timelines) that don't appear by default in apps designed for other markets.",
      "Outside India, BiggDate works in English. Pricing is in local currency. Onboarding adapts so India-specific questions don't appear, and Maahi's tone shifts. Matching is global by default but you can constrain it to your city or country.",
      "The India focus is positioning, not exclusion. We built India-first because that's the market we know best and where the gap was clearest, but the underlying product — psychological profile, gated contact, AI companion — works anywhere.",
    ],
    relatedSlugs: ["what-is-biggdate", "biggdate-vs-arranged-marriage-apps"],
    seeAlso: [{ label: "About BiggDate", href: "/about" }],
  },
  {
    slug: "biggdate-vs-arranged-marriage-apps",
    question: "How is BiggDate different from arranged-marriage apps in India?",
    category: "India context",
    shortAnswer:
      "BiggDate is not an arranged-marriage platform. There is no biodata exchange, no family setup, and no parent-driven decision making. BiggDate is for adults choosing their own partners, with onboarding that takes 'how much family approval matters to you' into account without making the experience family-led.",
    longAnswer: [
      "Arranged-marriage platforms like Shaadi, Jeevansathi, and BharatMatrimony are built around biodata exchange and parent-led conversation. The user is often not the primary decision maker; the family is. The unit of matching is the family-approved candidate.",
      "BiggDate is built for adults choosing their own partners. The user is the decision maker. There is no biodata exchange, no parent login, and no family-side workflow. 'Marriage eventually' is one supported intent alongside 'ready for real love' and 'just exploring' — but the path to it is two adults deciding for themselves.",
      "BiggDate does ask, in onboarding, how much family approval matters to you. This surfaces compatibility around a question that is real in this market without making the experience family-led.",
    ],
    relatedSlugs: ["is-biggdate-only-for-india", "what-is-biggdate"],
    seeAlso: [
      { label: "BiggDate vs Jeevansathi", href: "/vs/jeevansathi" },
      { label: "About BiggDate", href: "/about" },
    ],
  },
];

export const QUESTIONS_BY_SLUG: Record<string, QuestionEntry> =
  Object.fromEntries(QUESTIONS.map((q) => [q.slug, q]));

export function getQuestion(slug: string): QuestionEntry | undefined {
  return QUESTIONS_BY_SLUG[slug];
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  "Getting started",
  "How matching works",
  "Privacy & safety",
  "Pricing & plans",
  "Comparisons",
  "India context",
];
