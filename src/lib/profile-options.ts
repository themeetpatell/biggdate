// Single source of truth for all profile field options

export const GENDER_OPTIONS = [
  "Man", "Woman", "Non-binary", "Genderqueer", "Genderfluid",
  "Trans man", "Trans woman", "Agender",
] as const;

export const PRONOUNS_OPTIONS = [
  "He/Him", "She/Her", "They/Them", "He/They", "She/They", "Ze/Zir",
] as const;

export const ORIENTATION_OPTIONS = [
  "Straight", "Gay", "Lesbian", "Bisexual", "Pansexual",
  "Demisexual", "Asexual", "Queer",
] as const;

export const ETHNICITY_OPTIONS = [
  "South Asian", "East Asian", "Southeast Asian", "Middle Eastern/MENA",
  "Black/African", "White/Caucasian", "Hispanic/Latino", "Indigenous",
  "Mixed/Multiracial",
] as const;

export const RELIGION_OPTIONS = [
  "Agnostic", "Atheist", "Buddhist", "Catholic", "Christian",
  "Hindu", "Jewish", "Muslim", "Sikh", "Spiritual", "Prefer not to say",
] as const;

export const POLITICS_OPTIONS = [
  "Very liberal", "Liberal", "Moderate", "Conservative",
  "Very conservative", "Apolitical", "Prefer not to say",
] as const;

export const PARTNER_GENDER_OPTIONS = [
  "Men", "Women", "Non-binary people", "Everyone",
] as const;

export const RELATIONSHIP_STYLE_OPTIONS = [
  "Monogamy", "Open to monogamy", "Open relationship",
  "ENM/Polyamorous", "Unsure",
] as const;

export const LOVE_LANGUAGE_OPTIONS = [
  "Words of Affirmation", "Quality Time", "Physical Touch",
  "Acts of Service", "Receiving Gifts",
] as const;

export const CONFLICT_STYLE_OPTIONS = [
  "Direct", "Needs space first", "Collaborative", "Avoids conflict",
] as const;

export const DIET_OPTIONS = [
  "No restrictions", "Vegetarian", "Vegan", "Pescatarian",
  "Halal", "Kosher", "Gluten-free", "Keto",
] as const;

export const PETS_OPTIONS = [
  "Has a dog", "Has a cat", "Has other pets",
  "Loves animals", "Allergic to pets", "Not a pet person",
] as const;

export const WEEKEND_STYLE_OPTIONS = [
  "Slow mornings", "Social plans", "Outdoors", "Gym/fitness",
  "Exploring the city", "Cozy at home", "Day trips", "Creative projects",
] as const;

export const TRAVEL_STYLE_OPTIONS = [
  "Always traveling", "Frequent traveler", "Annual big trip",
  "Occasional weekends", "Homebody",
] as const;

export const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Arabic", "Urdu", "Mandarin", "French",
  "Spanish", "German", "Portuguese", "Japanese", "Korean",
  "Tamil", "Bengali", "Italian", "Russian",
] as const;

export const INTERESTS_GROUPS = {
  "Travel style": ["Backpacking", "Luxury travel", "Cultural immersion", "Spontaneous trips", "Solo travel", "Road trips"],
  "Fitness style": ["Discipline-driven", "Social fitness", "Aesthetic goals", "Health-focused", "Competitive sport", "Mindful movement"],
  "Food culture": ["Home cooking", "Fine dining", "Street food", "Baking & pastry", "Wine & cocktails", "Coffee culture"],
  "Arts & culture": ["Museums & galleries", "Theater & live arts", "Photography", "Design & aesthetics", "Film & cinema", "Street art"],
  "Mind & growth": ["Reading", "Podcasts", "Philosophy", "Personal development", "Journaling", "Deep conversations"],
  "Tech & building": ["Startups & founding", "Product & design", "AI & machine learning", "Side projects", "Investing", "VC & finance"],
  "Music & nights": ["Live concerts", "Music festivals", "DJ culture", "Playing instruments", "Late nights out", "Intimate venues"],
  "Nature & outdoors": ["Hiking & trails", "Camping", "Beach days", "Skiing & snowboard", "Surfing", "Nature photography"],
  "Social life": ["Hosting dinners", "Brunches", "Volunteering", "Sports leagues", "Game nights", "Community building"],
  "Wellbeing": ["Therapy & healing", "Spirituality", "Yoga & pilates", "Wellness rituals", "Meditation", "Sound baths"],
} as const;

export const CORE_VALUES_OPTIONS = [
  "Family", "Honesty", "Ambition", "Creativity", "Kindness",
  "Adventure", "Stability", "Faith", "Independence", "Growth",
  "Humor", "Loyalty", "Health", "Spirituality", "Freedom",
] as const;

export const DEALBREAKERS_OPTIONS = [
  "Dishonesty", "Smoking", "Different values", "No ambition",
  "Emotional unavailability", "Different family goals", "Excessive drinking",
  "Distance", "Unkindness", "No physical chemistry",
] as const;

export const STRENGTHS_OPTIONS = [
  "Empathetic", "Funny", "Loyal", "Ambitious", "Creative",
  "Calm under pressure", "Adventurous", "Reliable", "Curious",
  "Thoughtful", "Direct", "Nurturing",
] as const;

export const GROWTH_AREAS_OPTIONS = [
  "Communication", "Setting boundaries", "Vulnerability", "Career clarity",
  "Work-life balance", "Confidence", "Emotional regulation",
  "Trust", "Patience", "Self-care",
] as const;

// ─── Enrichment v2 ────────────────────────────────────────────────────────────

export const ATTRACTION_OPTIONS = [
  "Intellectual stimulation", "Emotional depth", "Physical chemistry",
  "Drive & ambition", "Humor", "Energy & vibe", "Confidence", "Kindness",
] as const;

export const TURN_ON_OPTIONS = [
  "Deep conversations", "Being challenged", "Independence", "Spontaneity",
  "Thoughtfulness", "Being direct", "Sense of style", "Physical presence",
  "Intellectual curiosity", "Drive & ambition",
] as const;

export const TURN_OFF_OPTIONS = [
  "Inconsistency", "Passive aggression", "Low ambition", "Emotional unavailability",
  "Arrogance", "Poor communication", "Flakiness", "Closed-mindedness",
  "Negativity", "Lack of curiosity",
] as const;

export const RELATIONSHIP_TIMELINE_OPTIONS = [
  "Just exploring", "6–12 months, seeing where it goes",
  "Ready for something serious", "Marriage-timeline serious",
] as const;

export const DATING_STAGE_OPTIONS = [
  "Not dating anyone", "Casually dating", "Focused on one person", "Taking a break",
] as const;

export const LONG_DISTANCE_OPTIONS = ["Yes", "No", "Depends"] as const;

export const EMOTIONAL_AVAILABILITY_OPTIONS = [
  "Fully available", "Mostly available", "Working on it",
] as const;

export const RESIDENCY_STATUS_OPTIONS = [
  "UAE resident", "UAE citizen", "Relocating to UAE",
  "Just visiting", "Open to relocating", "Not in UAE",
] as const;

export const RELOCATION_OPTIONS = ["Yes", "No", "Depends on the person"] as const;

export const WORK_INTENSITY_OPTIONS = [
  "Chill", "Balanced", "High-growth", "Workaholic (proudly)",
] as const;

export const FAMILY_INVOLVEMENT_OPTIONS = ["Low", "Moderate", "High"] as const;

export const CULTURAL_ALIGNMENT_OPTIONS = [
  "Not important", "Somewhat important", "Very important",
] as const;

export const MARRIAGE_TYPE_OPTIONS = [
  "Love marriage", "Arranged marriage", "Hybrid / semi-arranged",
] as const;
