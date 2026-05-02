/**
 * Per-competitor comparison entries. Each one becomes a `/vs/{slug}` page
 * targeting the "biggdate vs {competitor}" search and AI-citation surface.
 *
 * Authoring rules:
 * - `slug`: lowercase. URL is `/vs/{slug}`.
 * - `competitor`: human-readable display name.
 * - `tagline`: one sentence positioning the comparison. Used as page lede.
 * - `summary`: 2–3 sentence paragraph used as meta description and the
 *   first paragraph of the body. Must answer "which one should I pick" in
 *   plain language.
 * - `dimensions`: structured rows comparing BiggDate to the competitor on
 *   the axes that matter for this specific competitor (varies — Tinder
 *   needs different rows than Jeevansathi).
 * - `pickBiggdate` / `pickCompetitor`: bullet lists for the verdict cards.
 * - `faq`: 3–5 questions specific to this comparison.
 */

export interface VsDimension {
  dimension: string;
  biggdate: string;
  competitor: string;
}

export interface VsFaq {
  question: string;
  answer: string;
}

export interface VsEntry {
  slug: string;
  competitor: string;
  tagline: string;
  summary: string;
  competitorDescription: string;
  dimensions: VsDimension[];
  pickBiggdate: string[];
  pickCompetitor: string[];
  faq: VsFaq[];
  relatedSlugs: string[];
}

export const VS_ENTRIES: VsEntry[] = [
  {
    slug: "hinge",
    competitor: "Hinge",
    tagline: "Both are designed for serious relationships, but the structure is different.",
    summary:
      "BiggDate and Hinge are both designed for serious dating, not casual hookups. The structural difference is that Hinge keeps a swipe-and-like feed with prompts and visible photos, while BiggDate replaces the feed with a 20-minute Maahi conversation, a derived Soul Profile, 1–5 daily curated matches, and a Soul Knock that hides photos until both users have answered a question for each other.",
    competitorDescription:
      "Hinge is a US-headquartered dating app owned by Match Group, marketed as 'designed to be deleted.' Profiles are built from photos plus three prompt answers. Users like specific photos or prompts to start a conversation.",
    dimensions: [
      {
        dimension: "Primary intent",
        biggdate: "Serious relationships, marriage-track",
        competitor: "Serious, designed to be deleted",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation with Maahi",
        competitor: "10-minute prompts + photos + basic facts",
      },
      {
        dimension: "Profile model",
        biggdate: "Derived psychological profile (attachment, conflict, love languages)",
        competitor: "Self-filled prompts + photos",
      },
      {
        dimension: "Match volume",
        biggdate: "1–5 curated per day, no feed",
        competitor: "Medium curated feed",
      },
      {
        dimension: "Photos before contact",
        biggdate: "Hidden until Soul Knock completes",
        competitor: "Always visible",
      },
      {
        dimension: "Contact mechanic",
        biggdate: "Soul Knock — both must answer first",
        competitor: "Like a prompt + comment",
      },
      {
        dimension: "AI companion after onboarding",
        biggdate: "Yes — Maahi (always available)",
        competitor: "No",
      },
      {
        dimension: "Post-date debrief",
        biggdate: "Yes — structured 3-question reflection",
        competitor: "Light feedback prompt",
      },
      {
        dimension: "India context",
        biggdate: "Yes — DPDP, INR, India-specific onboarding",
        competitor: "No — designed for US/UK markets",
      },
    ],
    pickBiggdate: [
      "You're in India or value India-first context (DPDP, INR, family-approval questions)",
      "You've cycled through Hinge and matched a lot but met few people you actually clicked with",
      "You want a derived psychological profile, not a self-filled bio",
      "You want photos hidden until intent is demonstrated",
      "You want an AI companion that knows your patterns",
    ],
    pickCompetitor: [
      "You're in the US/UK and want a familiar feed model",
      "You like writing prompt answers and don't want a 20-minute conversation",
      "You're comfortable with photos visible from the start",
      "You want a larger pool of people, even if the fit signal per person is lower",
    ],
    faq: [
      {
        question: "Is BiggDate just an Indian Hinge?",
        answer:
          "No. The shared positioning is 'serious dating, not casual,' but the product is structurally different. Hinge is a curated feed of self-filled profiles. BiggDate replaces the feed with a derived psychological profile, capped daily matches, and a Soul Knock that gates contact. The India focus is also real — DPDP compliance, INR pricing, and India-specific onboarding questions Hinge doesn't have.",
      },
      {
        question: "Does Hinge have anything like Maahi?",
        answer:
          "No. Hinge has prompt suggestions and basic AI moderation, but no equivalent to a directed AI relationship profiler that runs a 20-minute interview, derives attachment style and conflict pattern, and remains available after onboarding as a companion.",
      },
      {
        question: "Why does BiggDate hide photos when Hinge shows them?",
        answer:
          "Photos before contact train users to make 0.5-second appearance-based decisions, which selects matches on photogenicity rather than fit. Hinge keeps photos visible because the swipe-and-like model needs them. BiggDate gates photos behind a Soul Knock to filter out low-effort interest and force engagement with who the person is.",
      },
    ],
    relatedSlugs: ["bumble", "tinder", "boo"],
  },
  {
    slug: "bumble",
    competitor: "Bumble",
    tagline: "Different fixes for different dating-app pathologies.",
    summary:
      "BiggDate and Bumble both try to fix something broken about dating apps, but they fix different things. Bumble's defining feature is that women send the first message within 24 hours, which addresses men spamming low-effort openers. BiggDate addresses a different problem: that photo-first feeds train people to make 0.5-second appearance-based decisions. The structural fix is different — BiggDate hides photos until both users complete a Soul Knock.",
    competitorDescription:
      "Bumble is a US-headquartered dating app where, in heterosexual matches, the woman is required to send the first message within 24 hours. Bumble has a high-volume feed and supports both dating and platonic networking modes.",
    dimensions: [
      {
        dimension: "Primary intent",
        biggdate: "Serious relationships, marriage-track",
        competitor: "Mixed (dating + networking)",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation with Maahi",
        competitor: "5-minute form + photos + prompts",
      },
      {
        dimension: "Match volume",
        biggdate: "1–5 curated per day",
        competitor: "High-volume feed",
      },
      {
        dimension: "Photos before contact",
        biggdate: "Hidden until Soul Knock completes",
        competitor: "Always visible",
      },
      {
        dimension: "Contact mechanic",
        biggdate: "Soul Knock — both must answer first",
        competitor: "Match → women send first within 24h",
      },
      {
        dimension: "Psychological profile",
        biggdate: "Attachment, conflict, love languages",
        competitor: "None",
      },
      {
        dimension: "AI relationship companion",
        biggdate: "Yes — Maahi",
        competitor: "No",
      },
      {
        dimension: "India context",
        biggdate: "Yes — DPDP, INR, India-specific onboarding",
        competitor: "Available in India but not designed India-first",
      },
    ],
    pickBiggdate: [
      "Your friction is 'I keep matching with people who turn out to be wrong on attachment or values'",
      "You want depth and curation more than volume",
      "You're in India or value India-first context",
      "You want photos hidden until intent is mutual",
    ],
    pickCompetitor: [
      "Your friction is 'men open with low-effort messages' — Bumble's women-first rule directly fixes that",
      "You want both dating and platonic networking in one app",
      "You're comfortable with a high-volume feed",
      "You want fast, casual-friendly matching alongside dating",
    ],
    faq: [
      {
        question: "Doesn't Bumble already solve the low-effort-opener problem?",
        answer:
          "For one specific pathology — men opening with one-word messages or worse — Bumble's women-first rule is a real fix. But it doesn't change the structure of the rest of the experience: it's still a swipe feed where photos are the primary signal. BiggDate addresses a different problem: appearance-first matching itself.",
      },
      {
        question: "Is BiggDate's 20-minute onboarding worth it vs Bumble's 5 minutes?",
        answer:
          "It depends on what you're looking for. Five minutes is enough to set up a profile; it isn't enough to capture attachment style or conflict pattern with any reliability. If the dating-app failure mode you keep hitting is 'wrong-fit matches,' the extra 15 minutes pays back many times over.",
      },
      {
        question: "Can I use BiggDate for casual dating like Bumble?",
        answer:
          "Yes, but it's not the design center. Onboarding asks for intent (marriage, serious, exploring), and 'just exploring' is a supported answer that surfaces matches with similar intent. If you want fully casual energy and high volume, Bumble or Tinder is a better fit.",
      },
    ],
    relatedSlugs: ["hinge", "tinder", "boo"],
  },
  {
    slug: "tinder",
    competitor: "Tinder",
    tagline: "Opposite designs for opposite intents.",
    summary:
      "BiggDate and Tinder are designed for opposite intents and opposite tradeoffs. Tinder optimizes for volume and speed — the swipe is fast, the match is fast, the funnel is wide. BiggDate optimizes for fit — a 20-minute conversation up front, 1–5 daily matches, gated contact. There is no shame in either; they solve different problems for different seasons.",
    competitorDescription:
      "Tinder is the largest dating app globally, owned by Match Group. It is built around a swipe-based photo feed and is optimized for high match volume and casual-leaning use cases.",
    dimensions: [
      {
        dimension: "Primary intent",
        biggdate: "Serious relationships",
        competitor: "Mostly casual, mixed",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation",
        competitor: "3-minute form + photos",
      },
      {
        dimension: "Match volume",
        biggdate: "1–5 curated per day",
        competitor: "Very high feed",
      },
      {
        dimension: "Profile depth",
        biggdate: "Derived psychological profile",
        competitor: "Photos + short bio",
      },
      {
        dimension: "Photos before contact",
        biggdate: "Hidden until Soul Knock",
        competitor: "Always visible — primary signal",
      },
      {
        dimension: "AI companion",
        biggdate: "Yes — Maahi",
        competitor: "No",
      },
      {
        dimension: "Ad-driven",
        biggdate: "No (subscription only)",
        competitor: "Some ad units",
      },
    ],
    pickBiggdate: [
      "You've cycled through Tinder and discovered that volume isn't the bottleneck — fit is",
      "You want a serious relationship, not casual energy",
      "You want curated matches and gated contact",
      "You want a psychological profile, not a swipe-the-photo experience",
    ],
    pickCompetitor: [
      "You want maximum volume and casual energy",
      "You're traveling and want quick connections",
      "You're not specifically looking for a long-term relationship right now",
      "You like the swipe mechanic and don't want a 20-minute onboarding",
    ],
    faq: [
      {
        question: "Is BiggDate the opposite of Tinder?",
        answer:
          "Roughly, yes — by design. Tinder is high-volume, photo-first, fast-match. BiggDate is low-volume, profile-first, gated-contact. They're not competing for the same use case so much as serving opposite intents.",
      },
      {
        question: "Can I use BiggDate alongside Tinder?",
        answer:
          "Many users do. Tinder for casual and travel, BiggDate for serious. The tools don't conflict; the energy and decision-making are different.",
      },
      {
        question: "Why doesn't BiggDate let me swipe?",
        answer:
          "Swiping trains the brain to evaluate humans on a 0.5-second photo. For serious dating, that's the wrong reflex. BiggDate's matching surfaces a small number of carefully-chosen people with a written narrative on why each one might fit. That's the substitute for swiping.",
      },
    ],
    relatedSlugs: ["bumble", "hinge", "boo"],
  },
  {
    slug: "boo",
    competitor: "Boo",
    tagline: "Both use psychology, but different psychology.",
    summary:
      "BiggDate and Boo both use a psychological lens for matching, but the lens is different. Boo matches on MBTI personality types — Introvert/Extravert, Thinking/Feeling, etc. BiggDate matches on attachment style, conflict pattern, and love languages, derived from a directed conversation rather than a self-reported quiz. Attachment theory has stronger empirical support than MBTI for predicting relationship outcomes.",
    competitorDescription:
      "Boo is a dating app organized around the Myers-Briggs Type Indicator (MBTI). Users self-identify as one of 16 personality types and the app matches based on type compatibility.",
    dimensions: [
      {
        dimension: "Primary intent",
        biggdate: "Serious relationships",
        competitor: "Mixed (dating + friendship)",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation",
        competitor: "MBTI-style quiz + photos",
      },
      {
        dimension: "Psychological frame",
        biggdate: "Attachment + conflict + love languages",
        competitor: "MBTI personality types",
      },
      {
        dimension: "How profile is derived",
        biggdate: "Inferred from directed conversation",
        competitor: "Self-reported quiz",
      },
      {
        dimension: "Match volume",
        biggdate: "1–5 curated per day",
        competitor: "High-volume feed",
      },
      {
        dimension: "Photos before contact",
        biggdate: "Hidden until Soul Knock",
        competitor: "Always visible",
      },
      {
        dimension: "AI relationship companion",
        biggdate: "Yes — Maahi (profiler + counselor)",
        competitor: "AI chatbots, not a profiler",
      },
    ],
    pickBiggdate: [
      "You want attachment-style depth, not MBTI-type matching",
      "You distrust self-reported personality quizzes (test-retest reliability is low for MBTI)",
      "You want curated matches with narrative explanations",
      "You want serious-relationship intent as the design center",
    ],
    pickCompetitor: [
      "You're an MBTI enthusiast and the type framework genuinely resonates with you",
      "You want a high-volume, MBTI-themed feed",
      "You want both dating and friend-finding in one app",
    ],
    faq: [
      {
        question: "Is attachment theory better than MBTI for matching?",
        answer:
          "Empirically, yes — for predicting relationship outcomes. MBTI has well-documented test-retest reliability problems and weak predictive validity for relationship satisfaction. Adult attachment theory has decades of research showing meaningful predictive power for conflict patterns, satisfaction, and stability.",
      },
      {
        question: "Why does BiggDate use a conversation instead of a quiz?",
        answer:
          "Self-reported quizzes are noisy. People answer how they want to be, not how they are, and the same person can score differently on consecutive days. A directed conversation with adaptive follow-ups extracts more reliable signal because the inference is on actual descriptions of behavior, not self-categorization.",
      },
    ],
    relatedSlugs: ["hinge", "bumble", "aisle"],
  },
  {
    slug: "aisle",
    competitor: "Aisle",
    tagline: "Both are India-focused; the depth is different.",
    summary:
      "BiggDate and Aisle are both India-focused dating apps targeting serious relationships rather than casual swiping. Aisle uses a curated feed with 'invite' and 'connect' contact mechanics. BiggDate goes further with a 20-minute Maahi conversation that derives a psychological profile, capped 1–5 daily matches, and a Soul Knock that hides photos until both users have answered a question for each other.",
    competitorDescription:
      "Aisle is an India-headquartered dating app marketed for high-intent serious dating. It uses a curated feed and an 'Invite' mechanic to start contact, with limited daily invites for free users.",
    dimensions: [
      {
        dimension: "Primary intent",
        biggdate: "Serious relationships, marriage-track",
        competitor: "Serious relationships",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation with Maahi",
        competitor: "Form + photos + a few preference questions",
      },
      {
        dimension: "Profile model",
        biggdate: "Derived psychological profile",
        competitor: "Self-filled profile + interests",
      },
      {
        dimension: "Match volume",
        biggdate: "1–5 curated per day",
        competitor: "Curated feed with limited daily invites",
      },
      {
        dimension: "Photos before contact",
        biggdate: "Hidden until Soul Knock",
        competitor: "Visible",
      },
      {
        dimension: "Contact mechanic",
        biggdate: "Soul Knock — both must answer",
        competitor: "Invite (paid) → Connect on accept",
      },
      {
        dimension: "AI companion",
        biggdate: "Yes — Maahi",
        competitor: "No",
      },
      {
        dimension: "India context",
        biggdate: "DPDP, INR, India-specific onboarding",
        competitor: "Yes — India-headquartered",
      },
    ],
    pickBiggdate: [
      "You want the deepest psychological profiling on the Indian market",
      "You want photos hidden until intent is mutual",
      "You want an AI companion who remembers your patterns",
      "You prefer no paid 'Invite' currency — Soul Knock is symmetric and free",
    ],
    pickCompetitor: [
      "You prefer the Invite-and-Connect model and don't want a 20-minute conversation",
      "You want photos visible from the start",
      "You're already on Aisle and the experience is working for you",
    ],
    faq: [
      {
        question: "Is BiggDate just Aisle with more steps?",
        answer:
          "No. The shared positioning is 'serious dating in India,' but the structure is different. Aisle is a curated feed with paid invites; BiggDate is profile-first with capped daily matches and symmetric, free Soul Knocks. The matching substrate is also different — Aisle uses self-filled preferences; BiggDate uses an AI-derived psychological profile.",
      },
      {
        question: "Why use BiggDate over Aisle if I'm in India?",
        answer:
          "If your dating-app friction is 'I keep meeting people who looked great on paper but turned out to be wrong on attachment or conflict,' BiggDate's derived psychological profile is the structural fix. If you want a familiar curated-feed model with India-positioning, Aisle works.",
      },
    ],
    relatedSlugs: ["jeevansathi", "hinge", "bumble"],
  },
  {
    slug: "jeevansathi",
    competitor: "Jeevansathi",
    tagline: "Self-chosen relationships, not arranged matrimony.",
    summary:
      "BiggDate and Jeevansathi serve different intents. Jeevansathi is an arranged-marriage platform — biodata exchange, family involvement, parent-led decision making. BiggDate is for adults choosing their own partners, with a 20-minute psychological onboarding and intent-gated contact. BiggDate does ask, in onboarding, how much family approval matters to you, but the experience is not family-led.",
    competitorDescription:
      "Jeevansathi is an India-headquartered matrimonial platform owned by Info Edge. Profiles include biodata-style fields (caste, sub-community, family details, horoscope). Family involvement in browsing and decision making is common.",
    dimensions: [
      {
        dimension: "Category",
        biggdate: "Dating app for serious relationships",
        competitor: "Matrimonial / arranged-marriage platform",
      },
      {
        dimension: "Decision maker",
        biggdate: "User",
        competitor: "Often family-driven",
      },
      {
        dimension: "Profile fields",
        biggdate: "Psychological (attachment, conflict, love languages)",
        competitor: "Biodata (caste, family, horoscope, education)",
      },
      {
        dimension: "Onboarding",
        biggdate: "20-minute AI conversation",
        competitor: "Long biodata form",
      },
      {
        dimension: "Contact mechanic",
        biggdate: "Soul Knock — both users answer",
        competitor: "Express Interest / parent intro",
      },
      {
        dimension: "Family involvement",
        biggdate: "User-only; family approval surfaced as preference",
        competitor: "Built into the platform",
      },
      {
        dimension: "AI companion",
        biggdate: "Yes — Maahi",
        competitor: "No",
      },
    ],
    pickBiggdate: [
      "You want to choose your own partner without family in the loop",
      "Compatibility on attachment, conflict, and values matters more to you than caste/community",
      "You're marriage-track but not arranged-marriage-track",
      "You want a modern psychological profile, not biodata",
    ],
    pickCompetitor: [
      "Your family is actively involved in finding your partner",
      "Caste, sub-community, and biodata fields are central to your search",
      "You want a horoscope-matching workflow",
      "You prefer the matrimonial format over the dating-app format",
    ],
    faq: [
      {
        question: "Can I use BiggDate if I'm looking for marriage?",
        answer:
          "Yes. 'Marriage eventually' is one of the supported intents you can specify in onboarding, alongside 'ready for real love' and 'just exploring.' The path to marriage on BiggDate runs through self-chosen dating with psychological compatibility, not biodata.",
      },
      {
        question: "Does BiggDate care about caste or community?",
        answer:
          "Not as a matching field. BiggDate does not collect or match on caste. If family approval matters to you, onboarding captures that as a preference and surfaces compatibility around it without making the experience family-led.",
      },
      {
        question: "Is BiggDate replacing Jeevansathi or competing with it?",
        answer:
          "Different category. Jeevansathi is matrimonial; BiggDate is a dating app. Some users use both — Jeevansathi with family involvement, BiggDate for self-driven dating — and decide which path fits as the relationship develops.",
      },
    ],
    relatedSlugs: ["aisle", "hinge"],
  },
];

export const VS_BY_SLUG: Record<string, VsEntry> = Object.fromEntries(
  VS_ENTRIES.map((v) => [v.slug, v]),
);

export function getVsEntry(slug: string): VsEntry | undefined {
  return VS_BY_SLUG[slug];
}
