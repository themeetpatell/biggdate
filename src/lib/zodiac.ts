export const ZODIAC_EMOJI: Record<string, string> = {
  Aries: "\u2648", Taurus: "\u2649", Gemini: "\u264A", Cancer: "\u264B",
  Leo: "\u264C", Virgo: "\u264D", Libra: "\u264E", Scorpio: "\u264F",
  Sagittarius: "\u2650", Capricorn: "\u2651", Aquarius: "\u2652", Pisces: "\u2653",
};

export const ZODIAC_COMPAT: Record<string, { high: string[]; medium: string[] }> = {
  Aries:       { high: ["Leo","Sagittarius","Gemini","Aquarius"],    medium: ["Aries","Libra","Scorpio","Pisces"] },
  Taurus:      { high: ["Virgo","Capricorn","Cancer","Pisces"],       medium: ["Taurus","Scorpio","Libra","Aquarius"] },
  Gemini:      { high: ["Libra","Aquarius","Aries","Leo"],            medium: ["Gemini","Sagittarius","Taurus","Capricorn"] },
  Cancer:      { high: ["Scorpio","Pisces","Taurus","Virgo"],         medium: ["Cancer","Capricorn","Libra","Aries"] },
  Leo:         { high: ["Aries","Sagittarius","Gemini","Libra"],      medium: ["Leo","Aquarius","Virgo","Cancer"] },
  Virgo:       { high: ["Taurus","Capricorn","Cancer","Scorpio"],     medium: ["Virgo","Pisces","Aquarius","Gemini"] },
  Libra:       { high: ["Gemini","Aquarius","Leo","Sagittarius"],     medium: ["Libra","Aries","Taurus","Capricorn"] },
  Scorpio:     { high: ["Cancer","Pisces","Virgo","Capricorn"],       medium: ["Scorpio","Taurus","Leo","Sagittarius"] },
  Sagittarius: { high: ["Aries","Leo","Libra","Aquarius"],            medium: ["Sagittarius","Gemini","Virgo","Pisces"] },
  Capricorn:   { high: ["Taurus","Virgo","Scorpio","Pisces"],         medium: ["Capricorn","Cancer","Leo","Libra"] },
  Aquarius:    { high: ["Gemini","Libra","Aries","Sagittarius"],      medium: ["Aquarius","Leo","Virgo","Taurus"] },
  Pisces:      { high: ["Cancer","Scorpio","Taurus","Capricorn"],     medium: ["Pisces","Virgo","Sagittarius","Gemini"] },
};

export function getZodiacFromBirthday(birthday: string | null): string | null {
  if (!birthday) return null;
  let month: number, day: number;
  const parts = String(birthday).replace(/\s+/g, "-").split("-");
  if (parts.length >= 2) {
    if (parts[0].length === 4) { month = parseInt(parts[1], 10); day = parseInt(parts[2], 10); }
    else { month = parseInt(parts[0], 10); day = parseInt(parts[1], 10); }
  } else return null;
  if (!month || !day || isNaN(month) || isNaN(day)) return null;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

export function getZodiacCompat(sign1: string, sign2: string): { level: string; label: string; color: string } | null {
  if (!sign1 || !sign2) return null;
  const c = ZODIAC_COMPAT[sign1];
  if (!c) return null;
  if (c.high.includes(sign2)) return { level: "high", label: "Cosmic Match", color: "var(--bd-green)" };
  if (c.medium.includes(sign2)) return { level: "medium", label: "Compatible", color: "var(--bd-gold)" };
  return { level: "low", label: "Growth Pairing", color: "var(--bd-accent)" };
}

export function computeAgeFromBirthday(birthday: string | null): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
