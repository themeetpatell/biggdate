import { MIN_AGE, ageInYears, isUnderage } from './age';

describe('ageInYears', () => {
  it('returns whole years for an exact birthday match', () => {
    const today = new Date(2026, 4, 18); // May 18 2026
    const birthday = new Date(2008, 4, 18);
    expect(ageInYears(birthday, today)).toBe(18);
  });

  it('subtracts a year when this year\'s birthday has not happened yet', () => {
    const today = new Date(2026, 4, 18); // May
    const birthday = new Date(2008, 5, 1); // June
    expect(ageInYears(birthday, today)).toBe(17);
  });

  it('subtracts a year when same month but day not yet reached', () => {
    const today = new Date(2026, 4, 17);
    const birthday = new Date(2008, 4, 18);
    expect(ageInYears(birthday, today)).toBe(17);
  });

  it('returns the post-birthday year when day has passed', () => {
    const today = new Date(2026, 4, 19);
    const birthday = new Date(2008, 4, 18);
    expect(ageInYears(birthday, today)).toBe(18);
  });

  it('returns 0 for a future birthday', () => {
    const today = new Date(2026, 4, 18);
    const birthday = new Date(2030, 0, 1);
    expect(ageInYears(birthday, today)).toBe(0);
  });
});

describe('isUnderage', () => {
  it('treats exactly MIN_AGE years old as not underage', () => {
    const today = new Date(2026, 4, 18);
    const birthday = new Date(today.getFullYear() - MIN_AGE, 4, 18);
    expect(isUnderage(birthday, today)).toBe(false);
  });

  it('flags one day before turning MIN_AGE as underage', () => {
    const today = new Date(2026, 4, 17);
    const birthday = new Date(today.getFullYear() - MIN_AGE, 4, 18);
    expect(isUnderage(birthday, today)).toBe(true);
  });

  it('rejects a 17-year-old', () => {
    const today = new Date(2026, 0, 1);
    const birthday = new Date(2009, 0, 1);
    expect(isUnderage(birthday, today)).toBe(true);
  });

  it('accepts a clearly adult age', () => {
    const today = new Date(2026, 0, 1);
    const birthday = new Date(1990, 0, 1);
    expect(isUnderage(birthday, today)).toBe(false);
  });
});
