"use client";

import {
  computeAgeFromBirthday,
  getZodiacFromBirthday,
  ZODIAC_EMOJI,
} from "@/lib/zodiac";

interface DateOfBirthProps {
  /** ISO date string "YYYY-MM-DD" or null */
  value: string | null;
  /** Called whenever birthday changes with derived age and zodiac */
  onChange: (birthday: string | null, age: number | null, zodiac: string | null) => void;
}

export function DateOfBirth({ value, onChange }: DateOfBirthProps) {
  const age = computeAgeFromBirthday(value);
  const zodiac = getZodiacFromBirthday(value);
  const zodiacEmoji = zodiac ? ZODIAC_EMOJI[zodiac] : null;

  return (
    <div className="space-y-2">
      <input
        type="date"
        aria-label="Date of birth"
        value={value ?? ""}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => {
          const bday = e.target.value || null;
          onChange(bday, computeAgeFromBirthday(bday), getZodiacFromBirthday(bday));
        }}
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-[#b48cff]/40 focus:bg-white/[0.06] [color-scheme:dark]"
      />
      {age !== null && zodiac && (
        <p className="px-1 text-xs text-white/40">
          {age} years old · {zodiacEmoji} {zodiac}
        </p>
      )}
    </div>
  );
}
