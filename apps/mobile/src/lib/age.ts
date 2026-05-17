/**
 * Minimum age accepted by the client age gate. The server enforces the
 * same MIN_AGE at /api/onboarding/basics — keep them in sync.
 */
export const MIN_AGE = 18;

/**
 * Whole years between `birthday` and `today`. Returns 0 for a future
 * date. The day-of-month comparison matters: someone born on Mar 5 is
 * not 18 until Mar 5, even if the year math says otherwise.
 */
export function ageInYears(birthday: Date, today: Date = new Date()): number {
  let years = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    years -= 1;
  }
  return Math.max(years, 0);
}

export function isUnderage(birthday: Date, today: Date = new Date()): boolean {
  return ageInYears(birthday, today) < MIN_AGE;
}
