export type CountryPhoneOption = {
  iso2: string;
  name: string;
  dialCode: string;
};

export const COUNTRY_PHONE_OPTIONS: CountryPhoneOption[] = [
  { iso2: "IN", name: "India", dialCode: "+91" },
  { iso2: "AE", name: "UAE", dialCode: "+971" },
  { iso2: "US", name: "United States", dialCode: "+1" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { iso2: "MY", name: "Malaysia", dialCode: "+60" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44" },
  { iso2: "CA", name: "Canada", dialCode: "+1" },
  { iso2: "OM", name: "Oman", dialCode: "+968" },
  { iso2: "KW", name: "Kuwait", dialCode: "+965" },
  { iso2: "QA", name: "Qatar", dialCode: "+974" },
  { iso2: "SG", name: "Singapore", dialCode: "+65" },
  { iso2: "AU", name: "Australia", dialCode: "+61" },
  { iso2: "ZA", name: "South Africa", dialCode: "+27" },
  { iso2: "BH", name: "Bahrain", dialCode: "+973" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64" },
];

export const TIMEZONE_TO_ISO2: Record<string, string> = {
  "Asia/Kolkata": "IN",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Muscat": "OM",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Singapore": "SG",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
  "America/Toronto": "CA",
  "Australia/Sydney": "AU",
  "Africa/Johannesburg": "ZA",
  "Pacific/Auckland": "NZ",
};

const VALID_ISO2 = new Set(COUNTRY_PHONE_OPTIONS.map((option) => option.iso2));

const TIER_1_2_CITIES_BY_COUNTRY: Record<string, string[]> = {
  IN: [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Chandigarh",
  ],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Al Ain"],
  US: [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "San Francisco",
    "Seattle",
    "Boston",
    "Austin",
    "Dallas",
    "Atlanta",
    "Miami",
    "San Diego",
  ],
  SA: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina", "Khobar"],
  MY: ["Kuala Lumpur", "Johor Bahru", "Penang", "Shah Alam", "Ipoh", "Kota Kinabalu"],
  GB: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Edinburgh"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
  OM: ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Barka"],
  KW: ["Kuwait City", "Hawalli", "Salmiya", "Farwaniya", "Jahra", "Ahmadi"],
  QA: ["Doha", "Al Rayyan", "Al Wakrah", "Lusail", "Umm Salal", "Al Khor"],
  SG: ["Singapore"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  BH: ["Manama", "Riffa", "Muharraq", "Hamad Town", "A'ali", "Isa Town"],
  NZ: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"],
};

export function normalizeCountryIso2(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const next = value.trim().toUpperCase();
  return VALID_ISO2.has(next) ? next : null;
}

export function inferCountryIso2FromPhone(phoneNumber: string | null | undefined): string | null {
  if (!phoneNumber) return null;
  const normalized = `+${phoneNumber.replace(/\D/g, "")}`;
  const sorted = [...COUNTRY_PHONE_OPTIONS].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const match = sorted.find((option) => normalized.startsWith(option.dialCode));
  return match?.iso2 ?? null;
}

export function getTier1Tier2CitiesForCountry(iso2: string | null | undefined): string[] {
  const normalizedIso2 = normalizeCountryIso2(iso2) ?? "IN";
  return TIER_1_2_CITIES_BY_COUNTRY[normalizedIso2] ?? TIER_1_2_CITIES_BY_COUNTRY.IN;
}
