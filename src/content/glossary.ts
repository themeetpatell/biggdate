/**
 * Glossary entries — one entity per page. Each entry is a `DefinedTerm` in
 * the BiggDate-specific knowledge graph used by AI engines (Google AI
 * Overviews, Perplexity, ChatGPT, Gemini) to ground concepts in citations.
 *
 * Authoring rules:
 * - `term`: human-readable canonical name. Used in <h1> and schema.
 * - `slug`: lowercase-kebab. URL is `/glossary/{slug}`.
 * - `oneLiner`: one sentence, ≤180 chars. Used as meta description and
 *   schema `description`. Must define the term standalone.
 * - `body`: 3–6 paragraphs. First paragraph repeats the one-liner expanded
 *   to 2–3 sentences (this is what AI engines quote). Then context, examples,
 *   and how it differs from related concepts.
 * - `relatedSlugs`: glossary terms a reader would explore next.
 * - `seeAlso`: external pages on this site (e.g. /how-it-works, /vs/hinge).
 */

export interface GlossaryEntry {
  slug: string;
  term: string;
  alternateNames?: string[];
  oneLiner: string;
  body: string[];
  relatedSlugs: string[];
  seeAlso: { label: string; href: string }[];
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    slug: "soul-profile",
    term: "Soul Profile",
    alternateNames: ["BiggDate psychological profile", "Maahi profile"],
    oneLiner:
      "BiggDate's structured psychological profile, derived from a 20-minute conversation with Maahi, that captures attachment style, conflict pattern, love languages, dealbreakers, and growth areas.",
    body: [
      "A Soul Profile is BiggDate's structured psychological profile of a user. It is derived from a 20-minute onboarding conversation with Maahi, BiggDate's AI relationship profiler, and captures attachment style, conflict pattern, love language given vs received, core values, dealbreakers, and growth areas. Unlike a form-based bio, it is built from the user's actual answers to adaptive questions, not from selected dropdowns.",
      "The Soul Profile is the matching substrate. When BiggDate surfaces 1–5 daily matches, it is comparing Soul Profiles — not photos, prompts, or hobby tags. This is why first-day matches on BiggDate are typically more accurate than first-week matches on swipe apps: the system has more signal to work with from minute one.",
      "A Soul Profile is private to the user and visible to them as a Soul Snapshot — a written 2–3 sentence summary plus the structured fields. It is never shown to other users in raw form. Matches see only a narrative explanation of why a particular pair would resonate.",
      "Compare to: traditional dating apps where the 'profile' is photos plus 3–4 prompt answers. Compare to: MBTI-based apps like Boo, where the 'profile' is a personality type label rather than a derived behavioral model.",
    ],
    relatedSlugs: ["maahi", "soul-knock", "attachment-style", "love-languages"],
    seeAlso: [
      { label: "How BiggDate works", href: "/how-it-works" },
      { label: "Compare to other apps", href: "/compare" },
    ],
  },
  {
    slug: "soul-knock",
    term: "Soul Knock",
    alternateNames: ["BiggDate Knock", "intent gate"],
    oneLiner:
      "BiggDate's intent-based contact gate: to start a conversation, both users answer a question for each other. Photos and chat unlock only after both have answered.",
    body: [
      "A Soul Knock is BiggDate's mechanism for starting contact. To open a conversation with a match, you compose a question for them. They see your question and answer it. They then ask you a reciprocal question. Only after both sides have answered does the chat thread open and photos unlock.",
      "The purpose of a Soul Knock is to filter out 0.5-second appearance-based decisions. On most dating apps, a swipe is a coin flip on a photo, and 'match' means almost nothing. On BiggDate, a successful Soul Knock means two people demonstrated effort and curiosity about each other before any chat began.",
      "Soul Knocks are not paid features and do not replace messaging. After both have answered, chat works like any messaging app — but the friction is concentrated at the front of the relationship, not the back.",
      "Compare to: Hinge's 'like a prompt + comment' mechanic, which is closer in spirit but still keeps photos visible from the start. Compare to: Bumble's 24-hour first-message rule, which addresses ghosting but not the photo-first problem.",
    ],
    relatedSlugs: ["soul-profile", "maahi", "pulse-feed"],
    seeAlso: [
      { label: "How BiggDate works", href: "/how-it-works" },
      { label: "BiggDate vs Hinge", href: "/vs/hinge" },
    ],
  },
  {
    slug: "maahi",
    term: "Maahi",
    alternateNames: [
      "BiggDate AI",
      "BiggDate AI companion",
      "AI relationship profiler",
    ],
    oneLiner:
      "Maahi is BiggDate's AI relationship profiler and ongoing companion. She conducts the onboarding conversation, derives your Soul Profile, and remains available afterward as a confidant who knows your patterns.",
    body: [
      "Maahi is BiggDate's AI relationship profiler. She conducts the 20-minute onboarding conversation in two phases: 8 quick questions to set up basic facts (location, intent, lifestyle), then 9 deeper questions with up to 5 adaptive follow-ups that map attachment style, conflict pattern, love languages, dealbreakers, and growth areas. She derives your Soul Profile from the conversation.",
      "Maahi remains available after onboarding. She is not a chatbot replacement for matches — she is a confidant who knows your psychological profile and can help you debrief after a date, work through anxiety before sending a message, or pressure-test whether a dealbreaker is real or a habit.",
      "Maahi is named for the Hindi/Punjabi term of endearment that loosely translates to 'beloved' or 'soul-friend.' The naming is intentional: the AI is positioned as a warm presence, not a clinical tool.",
      "Compare to: chatbots embedded in other dating apps, which typically generate icebreakers or moderate content. Maahi is a profiler and counselor, not a content tool.",
    ],
    relatedSlugs: ["soul-profile", "soul-knock", "date-debrief"],
    seeAlso: [
      { label: "How BiggDate works", href: "/how-it-works" },
      { label: "About BiggDate", href: "/about" },
    ],
  },
  {
    slug: "attachment-style",
    term: "Attachment Style",
    alternateNames: ["adult attachment style", "attachment pattern"],
    oneLiner:
      "Attachment style is the pattern of how a person seeks and avoids closeness in adult relationships, typically classified as Secure, Anxious, Avoidant, or Fearful-Avoidant.",
    body: [
      "Attachment style is the pattern of how a person seeks and avoids closeness in adult relationships. The four standard categories — Secure, Anxious, Avoidant, and Fearful-Avoidant — come from attachment theory, originally developed by John Bowlby and Mary Ainsworth and extended to adult relationships by Hazan and Shaver in the 1980s.",
      "BiggDate uses attachment style as a primary matching axis. Maahi infers it from how a user describes past conflict, withdrawal, reassurance-seeking, and emotional regulation — not from a self-reported quiz, which tends to be unreliable.",
      "Two Secure people tend to be the cleanest pairing. Anxious-Avoidant pairings are the most common cause of dating-app dysfunction (the 'I'm into them but they pull away' pattern). BiggDate does not refuse to match across attachment styles — sometimes the chemistry is real and the work is worth it — but it surfaces the dynamic in the match narrative so both people understand what they are signing up for.",
      "Attachment style is not destiny. People become more secure with the right partner and time. BiggDate also tracks growth areas alongside style.",
    ],
    relatedSlugs: [
      "anxious-attachment",
      "avoidant-attachment",
      "secure-attachment",
      "soul-profile",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "anxious-attachment",
    term: "Anxious Attachment",
    alternateNames: ["preoccupied attachment", "anxious-preoccupied"],
    oneLiner:
      "Anxious attachment is the pattern of seeking closeness intensely and feeling activated when a partner is unavailable, often manifesting as reassurance-seeking, hypervigilance to mood, and protest behavior.",
    body: [
      "Anxious attachment is one of four adult attachment styles. People with anxious attachment seek closeness intensely and feel activated — anxious, preoccupied, hypervigilant — when a partner is unavailable or emotionally distant. Common manifestations: reassurance-seeking, replaying conversations, sensitivity to tone, and 'protest behavior' (texting more, picking fights, or threatening withdrawal to provoke a response).",
      "Anxious attachment is not a character flaw. It is a learned pattern, usually developed when a caregiver was inconsistently available — sometimes warm, sometimes withdrawn — so the child stayed alert to maintain connection.",
      "On BiggDate, Maahi infers anxious attachment from how a user describes conflict, withdrawal, and reassurance — for example, 'I send a follow-up text if they don't reply for a few hours' or 'I rehearse what I'll say to avoid upsetting them.' BiggDate flags Anxious-Avoidant pairings in the match narrative because the dynamic is high-volatility.",
      "Anxious attachment pairs cleanly with Secure partners. Two Anxious people can work but tend to escalate together.",
    ],
    relatedSlugs: [
      "attachment-style",
      "avoidant-attachment",
      "secure-attachment",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "avoidant-attachment",
    term: "Avoidant Attachment",
    alternateNames: ["dismissive attachment", "avoidant-dismissive"],
    oneLiner:
      "Avoidant attachment is the pattern of valuing independence and self-reliance, deactivating under emotional pressure, and pulling away when a partner seeks closeness.",
    body: [
      "Avoidant attachment is one of four adult attachment styles. People with avoidant attachment value independence and self-reliance and deactivate — go quiet, withdraw, focus on work — when a partner seeks closeness or emotional intensity. Common manifestations: needing space after conflict, finding 'too much' affection suffocating, and a tendency to leave relationships that feel constraining.",
      "Avoidant attachment is not coldness. It is usually a learned strategy: the child of a caregiver who was overwhelmed or rejecting of bids for closeness learned that self-soothing was safer than reaching out.",
      "On BiggDate, Maahi infers avoidant attachment from withdrawal patterns under pressure — for example, 'I need a couple of days alone after a fight' or 'I felt suffocated when she wanted to text every day.' BiggDate flags Anxious-Avoidant pairings in the match narrative because the pursue-withdraw dance is high-cost for both sides.",
      "Avoidant attachment pairs cleanly with Secure partners. Avoidant-Avoidant pairs work but can drift apart from low engagement.",
    ],
    relatedSlugs: [
      "attachment-style",
      "anxious-attachment",
      "secure-attachment",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "secure-attachment",
    term: "Secure Attachment",
    alternateNames: ["secure base"],
    oneLiner:
      "Secure attachment is the pattern of comfortably seeking closeness and tolerating distance, communicating directly, and recovering from conflict without escalation.",
    body: [
      "Secure attachment is one of four adult attachment styles and the one associated with the most stable relationships. People with secure attachment are comfortable seeking closeness and tolerating distance, communicate directly under stress, and recover from conflict without escalating into protest behavior or withdrawal.",
      "Roughly half of adults are securely attached. Secure attachment can be earned later in life through stable relationships, therapy, or a partner who is reliably available.",
      "On BiggDate, Maahi infers secure attachment from how a user describes conflict resolution and emotional regulation — for example, 'I tell them what I need without getting heated' or 'I can sit with the uncomfortable feeling for a day before raising it.' Two Secure people are the cleanest pairing in the match graph.",
      "Note: secure does not mean conflict-free. It means conflict is a problem-solving event, not a survival event.",
    ],
    relatedSlugs: [
      "attachment-style",
      "anxious-attachment",
      "avoidant-attachment",
    ],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "conflict-style",
    term: "Conflict Style",
    alternateNames: ["conflict pattern", "fight style"],
    oneLiner:
      "Conflict style is the pattern of how a person behaves in the first 10 minutes of a disagreement — typical patterns include direct confrontation, withdrawal, repair-seeking, or escalation.",
    body: [
      "Conflict style is the pattern of how a person behaves in the first 10 minutes of a disagreement with a partner. BiggDate's Maahi probes this directly because conflict in early minutes is the strongest signal of long-term compatibility — relationships rarely fail because of disagreement, they fail because of how disagreement is handled.",
      "Common patterns: direct confrontation (raise the issue immediately, tone may be sharp), withdrawal (go silent, shut down, need space), repair-seeking (pause and try to restore connection before unpacking), pursuit (follow into another room, escalate to demand resolution), and stonewalling (refuse to engage, dismiss).",
      "BiggDate uses conflict style alongside attachment style to predict friction in a pair. Two confronters can work if both are direct and recover quickly. Confronter + withdrawer is the most common bad pattern.",
      "Conflict style is not a moral judgment. It is information.",
    ],
    relatedSlugs: ["attachment-style", "soul-profile", "love-languages"],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "love-languages",
    term: "Love Languages",
    alternateNames: ["the five love languages", "love language"],
    oneLiner:
      "Love languages are the five categories of how people prefer to give and receive affection: words of affirmation, quality time, acts of service, physical touch, and receiving gifts.",
    body: [
      "Love languages are the five categories of how people prefer to give and receive affection, popularized by Gary Chapman in 1992: words of affirmation, quality time, acts of service, physical touch, and receiving gifts. The framework's central insight is that giving and receiving languages are often different, and mismatches create the felt experience of 'I show love but they don't feel it.'",
      "BiggDate captures love language as two distinct fields: how a user gives love and how they need to receive it. Maahi probes both directly — for example, asking 'how do you know someone cares about you' versus 'how do you show up when you love someone.' Recording them separately reveals the give/receive gap, which is a common source of relationship dysfunction.",
      "Love languages are not a personality test. They are preferences that can shift, and a healthy relationship usually involves both partners stretching into each other's languages.",
      "Pairs that share a primary receive language tend to feel naturally seen. Pairs with mismatched receive languages can work — but require explicit translation early on.",
    ],
    relatedSlugs: ["soul-profile", "attachment-style", "conflict-style"],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "date-debrief",
    term: "Date Debrief",
    alternateNames: ["post-date debrief", "BiggDate debrief"],
    oneLiner:
      "A Date Debrief is BiggDate's structured 3-question post-date reflection — chemistry, what surprised you, and your decision — that improves future matches and gives you a clearer read on your own pattern.",
    body: [
      "A Date Debrief is BiggDate's structured post-date reflection. After a date, BiggDate prompts the user with three questions: what was the chemistry like, what surprised you (positively or negatively), and what is your decision (continue, pause, end). The reflection takes about two minutes.",
      "Debriefs serve two purposes. First, they update the matching system — feedback on chemistry and surprises tunes future curation away from patterns the user is reacting against and toward what genuinely lands. Second, they give the user a clearer read on their own pattern over time. Most people cannot articulate why they keep dating the same kind of person; a debrief log makes the pattern visible.",
      "Debriefs are private. They are never shared with the date or any other user. Maahi uses them as private context when the user wants to talk through what happened.",
      "Compare to: leaving a star rating or 'continue / unmatch' button on most dating apps, which captures yes/no but not why. The why is the signal.",
    ],
    relatedSlugs: ["maahi", "soul-profile", "soul-knock"],
    seeAlso: [{ label: "How BiggDate works", href: "/how-it-works" }],
  },
  {
    slug: "pulse-feed",
    term: "Pulse Feed",
    alternateNames: ["BiggDate Pulse", "Pulse"],
    oneLiner:
      "Pulse is BiggDate's anonymous prompt-based community feed where users respond to dating, relationship, and life prompts under a verified identity, without revealing their name or photo.",
    body: [
      "Pulse is BiggDate's anonymous prompt-based community feed. Each day, BiggDate posts a small set of prompts about dating, relationships, intent, and modern life. Users respond anonymously — their name, photo, and matching profile are not attached to the post.",
      "Pulse is verified-anonymous, not fully anonymous: posts come from real, identity-verified BiggDate users (the pink tick), but the public face of the post is just the prompt and the response. This is the structural difference from Reddit-style anonymous communities, which struggle with bot accounts and bad-faith posts.",
      "Pulse exists to give users an outlet for the parts of dating that don't fit a profile or a chat — what they're scared of, what they want, what they regret. It is also a discovery surface: a particularly resonant Pulse response can lead to a Soul Knock, with consent on both sides.",
      "Pulse is moderated. Posts that violate community guidelines (harassment, doxxing, dehumanizing language) are removed.",
    ],
    relatedSlugs: ["pink-tick-verification", "soul-knock", "soul-profile"],
    seeAlso: [
      { label: "About BiggDate", href: "/about" },
      { label: "How BiggDate works", href: "/how-it-works" },
    ],
  },
  {
    slug: "pink-tick-verification",
    term: "Pink Tick Verification",
    alternateNames: ["BiggDate verification", "pink tick"],
    oneLiner:
      "The Pink Tick is BiggDate's identity verification mark, awarded after a user passes selfie-and-document verification, that signals their account belongs to a real person, not a bot or catfish.",
    body: [
      "The Pink Tick is BiggDate's identity verification mark. A user earns it by passing selfie-and-document verification — a live selfie compared to a government ID — confirming that the account belongs to the real person whose name and face are on the profile.",
      "The Pink Tick is required for Pulse posts and is shown on user profiles to other users. It does not unlock features beyond visibility — it is a trust signal, not a paywall.",
      "Why pink: it is BiggDate's brand accent and visually distinct from the blue ticks of social platforms. The shape signals 'verified identity,' not 'celebrity' or 'official account,' which is the meaning of blue ticks elsewhere.",
      "Verification protects two things: women on the platform from catfishing and harassment, and the integrity of the Pulse feed from bot accounts.",
    ],
    relatedSlugs: ["pulse-feed", "soul-knock"],
    seeAlso: [
      { label: "About BiggDate", href: "/about" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const GLOSSARY_BY_SLUG: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY_ENTRIES.map((e) => [e.slug, e]),
);

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY_BY_SLUG[slug];
}
