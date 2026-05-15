import { computeAgeFromBirthday } from "@/lib/zodiac";

/**
 * Minimum age to use BiggDate. Enforced at every surface that accepts a
 * birthday — the signup checkbox is a declaration, this is the real gate.
 */
export const MIN_AGE = 18;

/**
 * True when a birthday is present AND implies an age below MIN_AGE.
 * Absent/unparseable birthdays return false — they're handled by the
 * "birthday required" validation elsewhere, not the age gate.
 */
export function isUnderageBirthday(birthday: string | null | undefined): boolean {
  if (!birthday) return false;
  const age = computeAgeFromBirthday(birthday);
  return age !== null && age < MIN_AGE;
}

export const UNDERAGE_ERROR = "You must be 18 or older to use BiggDate.";
