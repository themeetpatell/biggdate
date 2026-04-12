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
  "Mixed/Multiracial", "Prefer not to say",
] as const;

export const RELIGION_OPTIONS = [
  "Agnostic", "Atheist", "Buddhist", "Catholic", "Christian",
  "Hindu", "Jewish", "Muslim", "Sikh", "Spiritual",
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
  "Direct communicator", "Need time to process", "Collaborative",
  "Tend to avoid conflict",
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

export const INTERESTS_GROUPS: Record<string, readonly string[]> = {
  "Arts & Culture": ["Photography", "Museums", "Theater", "Art galleries", "Design"],
  "Food & Drink": ["Cooking", "Fine dining", "Wine", "Coffee", "Baking", "Food markets"],
  "Fitness": ["Gym", "Running", "Yoga", "Pilates", "Cycling", "Hiking", "Climbing", "Swimming"],
  "Music": ["Live music", "Concerts", "Festivals", "Playing instruments", "DJing"],
  "Entertainment": ["Films", "TV shows", "Gaming", "Podcasts", "Reading", "Comics"],
  "Travel": ["Backpacking", "Luxury travel", "Road trips", "Solo travel", "Weekend getaways"],
  "Social": ["Dinner parties", "Brunches", "Dancing", "Volunteering", "Community"],
  "Tech & Work": ["Startups", "AI", "Coding", "Product", "Finance", "Investing"],
  "Outdoors": ["Nature walks", "Camping", "Beach", "Skiing", "Surfing"],
  "Mindfulness": ["Meditation", "Journaling", "Spirituality", "Wellness", "Therapy"],
};

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
