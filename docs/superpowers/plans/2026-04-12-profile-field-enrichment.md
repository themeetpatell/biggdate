# Profile Field Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace free-text inputs across the profile editor and onboarding with structured types — date picker, selects with custom fallback, multi-select chips, and a dual range slider — backed by a single options file.

**Architecture:** Four reusable UI primitives are built first (`MultiSelectChips`, `DateOfBirth`, `AgeRangeSlider`; `SelectInput` already exists). A new `src/lib/profile-options.ts` file acts as the single source of truth for all option arrays. The profile editor tabs are updated field-by-field. The onboarding `QuickReplies` component is extended with three new inline UI types (`MULTISELECT`, `AGERANGE`, `DATEPICKER`). No DB schema changes — `string | null` fields that logically hold multiple values (diet, weekendStyle, partnerGender, loveLanguage) use comma-joined storage.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing `SelectInput`/`Field`/`TextInput`/`TextArea` wrappers in `src/app/profile/page.tsx`, `@/lib/zodiac` for birthday utilities, Framer Motion (already used in onboarding).

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/profile-options.ts` | Create | All predefined option arrays (single source of truth) |
| `src/lib/zodiac.ts` | Modify | Add `computeAgeFromBirthday` |
| `src/components/ui/multi-select-chips.tsx` | Create | Chip multi-select + custom free-type input |
| `src/components/ui/date-of-birth.tsx` | Create | DOB date picker with auto age+zodiac preview |
| `src/components/ui/age-range-slider.tsx` | Create | Dual-handle range slider for partner age |
| `src/app/profile/page.tsx` | Modify | Replace field inputs in basics, about, dating, lifestyle tabs |
| `src/components/onboarding/quick-replies.tsx` | Modify | Add MULTISELECT, AGERANGE, DATEPICKER parsing and rendering |
| `src/app/onboarding/page.tsx` | Modify | Wire up new inline input callbacks and parsers |

---

### Task 1: Options source of truth + age utility

**Files:**
- Create: `src/lib/profile-options.ts`
- Modify: `src/lib/zodiac.ts`

- [ ] **Step 1: Append `computeAgeFromBirthday` to `src/lib/zodiac.ts`**

Add to the end of the file:

```typescript
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
```

- [ ] **Step 2: Create `src/lib/profile-options.ts`**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/profile-options.ts src/lib/zodiac.ts
git commit -m "feat: add profile-options source of truth + computeAgeFromBirthday"
```

---

### Task 2: MultiSelectChips component

**Files:**
- Create: `src/components/ui/multi-select-chips.tsx`

- [ ] **Step 1: Create `src/components/ui/multi-select-chips.tsx`**

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MultiSelectChipsProps {
  /** Flat list of predefined options. Use either `options` or `groups`, not both. */
  options?: readonly string[];
  /** Grouped options: { "Group Label": readonly string[] }. Renders group headers. */
  groups?: Record<string, readonly string[]>;
  value: string[];
  onChange: (value: string[]) => void;
  /** Maximum selections. Omit for unlimited. */
  max?: number;
  /** Allow typing custom values not in the options list. Default: true */
  allowCustom?: boolean;
  placeholder?: string;
}

export function MultiSelectChips({
  options,
  groups,
  value,
  onChange,
  max,
  allowCustom = true,
  placeholder = "Add your own…",
}: MultiSelectChipsProps) {
  const [customInput, setCustomInput] = useState("");
  const atMax = max !== undefined && value.length >= max;

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      if (atMax) return;
      onChange([...value, option]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || value.includes(trimmed) || atMax) return;
    onChange([...value, trimmed]);
    setCustomInput("");
  };

  const allPredefined: readonly string[] =
    options ?? Object.values(groups ?? {}).flat();

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-[#b48cff]/30 bg-[#b48cff]/10 px-3 py-1 text-xs font-medium text-[#c7a8ff]"
            >
              {item}
              <button
                type="button"
                onClick={() => toggle(item)}
                className="ml-0.5 opacity-60 transition-opacity hover:opacity-100"
                aria-label={`Remove ${item}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Predefined option chips — grouped or flat */}
      {groups ? (
        <div className="space-y-3">
          {Object.entries(groups).map(([groupLabel, groupOptions]) => (
            <div key={groupLabel}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                {groupLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {groupOptions
                  .filter((opt) => !value.includes(opt))
                  .map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggle(opt)}
                      disabled={atMax}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55 transition hover:border-white/20 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {opt}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {allPredefined
            .filter((opt) => !value.includes(opt))
            .map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                disabled={atMax}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55 transition hover:border-white/20 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {opt}
              </button>
            ))}
        </div>
      )}

      {/* Custom free-type input */}
      {allowCustom && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder={atMax ? `Max ${max} selected` : placeholder}
            disabled={atMax}
            className="h-9 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/22 focus:border-[#b48cff]/40 disabled:opacity-40"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim() || atMax}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/55 transition hover:text-white/80 disabled:opacity-30"
          >
            Add
          </button>
        </div>
      )}

      {max !== undefined && (
        <p className="text-[11px] text-white/28">
          {value.length} / {max}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/multi-select-chips.tsx
git commit -m "feat: add MultiSelectChips component with grouped options + custom input"
```

---

### Task 3: DateOfBirth component

**Files:**
- Create: `src/components/ui/date-of-birth.tsx`

- [ ] **Step 1: Create `src/components/ui/date-of-birth.tsx`**

```tsx
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
  const age = computeAgeFromBirthday(value ?? null);
  const zodiac = getZodiacFromBirthday(value ?? null);
  const zodiacEmoji = zodiac ? ZODIAC_EMOJI[zodiac] : null;

  return (
    <div className="space-y-2">
      <input
        type="date"
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/date-of-birth.tsx
git commit -m "feat: add DateOfBirth component (age + zodiac auto-derived)"
```

---

### Task 4: AgeRangeSlider component

**Files:**
- Create: `src/components/ui/age-range-slider.tsx`

- [ ] **Step 1: Create `src/components/ui/age-range-slider.tsx`**

```tsx
"use client";

interface AgeRangeSliderProps {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  /** Lower bound for the slider. Default: 18 */
  minBound?: number;
  /** Upper bound for the slider. Default: 65 */
  maxBound?: number;
}

export function AgeRangeSlider({
  min,
  max,
  onChange,
  minBound = 18,
  maxBound = 65,
}: AgeRangeSliderProps) {
  const minVal = min ?? minBound;
  const maxVal = max ?? maxBound;

  return (
    <div className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">{minVal}</span>
        <span className="text-[11px] text-white/35">to</span>
        <span className="text-sm font-medium text-white/80">{maxVal}</span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="w-7 text-[10px] text-white/28 tabular-nums">{minBound}</span>
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={minVal}
            onChange={(e) => {
              const next = Number(e.target.value);
              onChange(next, Math.max(next + 1, maxVal));
            }}
            className="bd-age-range flex-1"
          />
          <span className="w-7 text-right text-[10px] text-white/28 tabular-nums">{maxBound}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-7 text-[10px] text-white/28 tabular-nums">{minBound}</span>
          <input
            type="range"
            min={minBound}
            max={maxBound}
            value={maxVal}
            onChange={(e) => {
              const next = Number(e.target.value);
              onChange(Math.min(minVal, next - 1), next);
            }}
            className="bd-age-range flex-1"
          />
          <span className="w-7 text-right text-[10px] text-white/28 tabular-nums">{maxBound}</span>
        </div>
      </div>
      <style>{`
        .bd-age-range {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          background: rgba(255,255,255,0.09);
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          width: 100%;
        }
        .bd-age-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4688a, #b48cff);
          cursor: pointer;
          border: 2px solid rgba(180,140,255,0.3);
          box-shadow: 0 2px 8px rgba(180,140,255,0.3);
        }
        .bd-age-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4688a, #b48cff);
          cursor: pointer;
          border: 2px solid rgba(180,140,255,0.3);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/age-range-slider.tsx
git commit -m "feat: add AgeRangeSlider dual-handle component"
```

---

### Task 5: Profile editor — Basics tab

**Files:**
- Modify: `src/app/profile/page.tsx`

All edits are in the `activeTab === "basics"` section (starting around line 1021).

- [ ] **Step 1: Add imports near the top of `src/app/profile/page.tsx`**

After the existing import block (after line 50 `import { SettingsDrawer }`), add:

```tsx
import { DateOfBirth } from "@/components/ui/date-of-birth";
import { MultiSelectChips } from "@/components/ui/multi-select-chips";
import { AgeRangeSlider } from "@/components/ui/age-range-slider";
import {
  GENDER_OPTIONS,
  PRONOUNS_OPTIONS,
  ORIENTATION_OPTIONS,
  ETHNICITY_OPTIONS,
  RELIGION_OPTIONS,
  POLITICS_OPTIONS,
  PARTNER_GENDER_OPTIONS,
  RELATIONSHIP_STYLE_OPTIONS,
  LOVE_LANGUAGE_OPTIONS,
  CONFLICT_STYLE_OPTIONS,
  DIET_OPTIONS,
  PETS_OPTIONS,
  WEEKEND_STYLE_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
  LANGUAGE_OPTIONS,
  INTERESTS_GROUPS,
  CORE_VALUES_OPTIONS,
  DEALBREAKERS_OPTIONS,
  STRENGTHS_OPTIONS,
  GROWTH_AREAS_OPTIONS,
} from "@/lib/profile-options";
```

- [ ] **Step 2: Replace `<Field label="Age">` with `<Field label="Date of birth">`**

Find (lines ~1033–1042):
```tsx
                      <Field label="Age">
                        <TextInput
                          inputMode="numeric"
                          value={draft.age ?? ""}
                          onChange={(event) =>
                            setField("age", event.target.value ? Number(event.target.value) : null)
                          }
                          placeholder="29"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Date of birth">
                        <DateOfBirth
                          value={draft.birthday ?? null}
                          onChange={(birthday, age, zodiac) => {
                            setDraft((prev) =>
                              prev
                                ? { ...prev, birthday: birthday ?? undefined, age: age ?? null, zodiac: zodiac ?? null }
                                : prev,
                            );
                          }}
                        />
                      </Field>
```

- [ ] **Step 3: Replace `<Field label="Pronouns">` with select + custom text fallback**

Find (lines ~1043–1049):
```tsx
                      <Field label="Pronouns">
                        <TextInput
                          value={draft.pronouns || ""}
                          onChange={(event) => setField("pronouns", event.target.value)}
                          placeholder="She/Her"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Pronouns">
                        <SelectInput
                          value={
                            draft.pronouns && PRONOUNS_OPTIONS.includes(draft.pronouns as never)
                              ? draft.pronouns
                              : draft.pronouns
                              ? "Other"
                              : ""
                          }
                          onChange={(e) =>
                            setField("pronouns", e.target.value === "Other" ? "" : e.target.value || null)
                          }
                        >
                          <option value="">Select</option>
                          {PRONOUNS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          <option value="Other">Other (specify)</option>
                        </SelectInput>
                        {draft.pronouns !== null &&
                          draft.pronouns !== undefined &&
                          !PRONOUNS_OPTIONS.includes(draft.pronouns as never) && (
                            <TextInput
                              value={draft.pronouns ?? ""}
                              onChange={(e) => setField("pronouns", e.target.value || null)}
                              placeholder="Your pronouns"
                              className="mt-2"
                            />
                          )}
                      </Field>
```

- [ ] **Step 4: Replace `<Field label="Gender">` with select + custom text fallback**

Find (lines ~1050–1056):
```tsx
                      <Field label="Gender">
                        <TextInput
                          value={draft.gender || ""}
                          onChange={(event) => setField("gender", event.target.value)}
                          placeholder="Woman"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Gender">
                        <SelectInput
                          value={
                            draft.gender && GENDER_OPTIONS.includes(draft.gender as never)
                              ? draft.gender
                              : draft.gender
                              ? "Other"
                              : ""
                          }
                          onChange={(e) =>
                            setField("gender", e.target.value === "Other" ? "" : e.target.value || null)
                          }
                        >
                          <option value="">Select</option>
                          {GENDER_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          <option value="Other">Other (specify)</option>
                        </SelectInput>
                        {draft.gender !== null &&
                          draft.gender !== undefined &&
                          !GENDER_OPTIONS.includes(draft.gender as never) && (
                            <TextInput
                              value={draft.gender ?? ""}
                              onChange={(e) => setField("gender", e.target.value || null)}
                              placeholder="How would you describe your gender?"
                              className="mt-2"
                            />
                          )}
                      </Field>
```

- [ ] **Step 5: Replace `<Field label="Orientation">` with select + custom text fallback**

Find (lines ~1057–1063):
```tsx
                      <Field label="Orientation">
                        <TextInput
                          value={draft.orientation || ""}
                          onChange={(event) => setField("orientation", event.target.value)}
                          placeholder="Straight"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Orientation">
                        <SelectInput
                          value={
                            draft.orientation && ORIENTATION_OPTIONS.includes(draft.orientation as never)
                              ? draft.orientation
                              : draft.orientation
                              ? "Other"
                              : ""
                          }
                          onChange={(e) =>
                            setField("orientation", e.target.value === "Other" ? "" : e.target.value || null)
                          }
                        >
                          <option value="">Select</option>
                          {ORIENTATION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          <option value="Other">Other (specify)</option>
                        </SelectInput>
                        {draft.orientation !== null &&
                          draft.orientation !== undefined &&
                          !ORIENTATION_OPTIONS.includes(draft.orientation as never) && (
                            <TextInput
                              value={draft.orientation ?? ""}
                              onChange={(e) => setField("orientation", e.target.value || null)}
                              placeholder="How would you describe your orientation?"
                              className="mt-2"
                            />
                          )}
                      </Field>
```

- [ ] **Step 6: Replace `<Field label="Ethnicity">` with select**

Find (lines ~1116–1122):
```tsx
                      <Field label="Ethnicity">
                        <TextInput
                          value={draft.ethnicity || ""}
                          onChange={(event) => setField("ethnicity", event.target.value)}
                          placeholder="Optional"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Ethnicity">
                        <SelectInput
                          value={draft.ethnicity || ""}
                          onChange={(e) => setField("ethnicity", e.target.value || null)}
                        >
                          <option value="">Prefer not to say</option>
                          {ETHNICITY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </SelectInput>
                      </Field>
```

- [ ] **Step 7: Replace `<Field label="Religion">` with select + custom text fallback**

Find (lines ~1123–1129):
```tsx
                      <Field label="Religion">
                        <TextInput
                          value={draft.religion || ""}
                          onChange={(event) => setField("religion", event.target.value)}
                          placeholder="Optional"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Religion">
                        <SelectInput
                          value={
                            draft.religion && RELIGION_OPTIONS.includes(draft.religion as never)
                              ? draft.religion
                              : draft.religion
                              ? "Other"
                              : ""
                          }
                          onChange={(e) =>
                            setField("religion", e.target.value === "Other" ? "" : e.target.value || null)
                          }
                        >
                          <option value="">Select</option>
                          {RELIGION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          <option value="Other">Other</option>
                        </SelectInput>
                        {draft.religion !== null &&
                          draft.religion !== undefined &&
                          !RELIGION_OPTIONS.includes(draft.religion as never) && (
                            <TextInput
                              value={draft.religion ?? ""}
                              onChange={(e) => setField("religion", e.target.value || null)}
                              placeholder="Your religion or belief system"
                              className="mt-2"
                            />
                          )}
                      </Field>
```

- [ ] **Step 8: Replace `<Field label="Politics">` with select**

Find (lines ~1130–1136):
```tsx
                      <Field label="Politics">
                        <TextInput
                          value={draft.politics || ""}
                          onChange={(event) => setField("politics", event.target.value)}
                          placeholder="Optional"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Politics">
                        <SelectInput
                          value={draft.politics || ""}
                          onChange={(e) => setField("politics", e.target.value || null)}
                        >
                          <option value="">Select</option>
                          {POLITICS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </SelectInput>
                      </Field>
```

- [ ] **Step 9: Verify basics tab in dev server**

```bash
npm run dev
```

Open `/profile` → click edit → Basics tab. Verify:
- "Date of birth" shows date picker; selecting a date shows age + zodiac sign below
- Gender, Pronouns, Orientation show select dropdowns; choosing "Other (specify)" reveals a text input
- Ethnicity shows a select with all options
- Religion shows select + "Other" reveals text input
- Politics shows a select

- [ ] **Step 10: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: profile basics tab — DOB picker, structured selects for identity fields"
```

---

### Task 6: Profile editor — About tab (interests)

**Files:**
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Replace interests TextArea with grouped MultiSelectChips**

Find (lines ~1155–1166):
```tsx
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <Field label="Interests" hint="Comma or new line separated">
                      <TextArea
                        value={listValue(draft.interests)}
                        onChange={(event) =>
                          updateArrayInput(event, (next) => setField("interests", next))
                        }
                        placeholder="Pilates, live music, Sunday dinner, startups"
                        className="min-h-[110px]"
                      />
                    </Field>
                  </div>
```

Replace with:
```tsx
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <Field
                      label="Interests"
                      hint={draft.interests.length > 0 ? `${draft.interests.length} selected` : undefined}
                    >
                      <MultiSelectChips
                        groups={INTERESTS_GROUPS}
                        value={draft.interests}
                        onChange={(next) => setField("interests", next)}
                        allowCustom
                        placeholder="Add your own interest…"
                      />
                    </Field>
                  </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: profile about tab — interests as grouped MultiSelectChips"
```

---

### Task 7: Profile editor — Dating tab

**Files:**
- Modify: `src/app/profile/page.tsx`

All edits are in the `activeTab === "dating"` section (starting around line 1220).

- [ ] **Step 1: Replace "Relationship style" text input with select + custom**

Find (lines ~1243–1249):
```tsx
                        <Field label="Relationship style">
                          <TextInput
                            value={draft.relationshipStyle || ""}
                            onChange={(event) => setField("relationshipStyle", event.target.value)}
                            placeholder="Monogamy"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Relationship style">
                          <SelectInput
                            value={
                              draft.relationshipStyle &&
                              RELATIONSHIP_STYLE_OPTIONS.includes(draft.relationshipStyle as never)
                                ? draft.relationshipStyle
                                : draft.relationshipStyle
                                ? "Other"
                                : ""
                            }
                            onChange={(e) =>
                              setField(
                                "relationshipStyle",
                                e.target.value === "Other" ? "" : e.target.value || null,
                              )
                            }
                          >
                            <option value="">Select</option>
                            {RELATIONSHIP_STYLE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                            <option value="Other">Other</option>
                          </SelectInput>
                          {draft.relationshipStyle !== null &&
                            draft.relationshipStyle !== undefined &&
                            !RELATIONSHIP_STYLE_OPTIONS.includes(draft.relationshipStyle as never) && (
                              <TextInput
                                value={draft.relationshipStyle ?? ""}
                                onChange={(e) => setField("relationshipStyle", e.target.value || null)}
                                placeholder="Describe your relationship style"
                                className="mt-2"
                              />
                            )}
                        </Field>
```

- [ ] **Step 2: Replace "Looking for" (partnerGender) text input with multi-select chips**

`partnerGender` is `string | null`; store multiple values comma-joined ("Men, Women").

Find (lines ~1250–1256):
```tsx
                        <Field label="Looking for">
                          <TextInput
                            value={draft.partnerGender || ""}
                            onChange={(event) => setField("partnerGender", event.target.value)}
                            placeholder="Men"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Looking for">
                          <MultiSelectChips
                            options={PARTNER_GENDER_OPTIONS}
                            value={
                              draft.partnerGender
                                ? draft.partnerGender.split(", ").filter(Boolean)
                                : []
                            }
                            onChange={(next) =>
                              setField("partnerGender", next.join(", ") || null)
                            }
                            allowCustom={false}
                          />
                        </Field>
```

- [ ] **Step 3: Replace "Love language" text input with multi-select chips (max 2)**

`loveLanguage` is `string | null`; store up to 2 comma-joined.

Find (lines ~1257–1263):
```tsx
                        <Field label="Love language">
                          <TextInput
                            value={draft.loveLanguage || ""}
                            onChange={(event) => setField("loveLanguage", event.target.value)}
                            placeholder="Quality time"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Love language" hint="Pick up to 2">
                          <MultiSelectChips
                            options={LOVE_LANGUAGE_OPTIONS}
                            value={
                              draft.loveLanguage
                                ? draft.loveLanguage.split(", ").filter(Boolean)
                                : []
                            }
                            onChange={(next) =>
                              setField("loveLanguage", next.join(", ") || null)
                            }
                            max={2}
                            allowCustom={false}
                          />
                        </Field>
```

- [ ] **Step 4: Replace partner age min + max number inputs with AgeRangeSlider**

Find and remove both fields (lines ~1264–1288):
```tsx
                        <Field label="Preferred age min">
                          <TextInput
                            inputMode="numeric"
                            value={draft.partnerAgeMin ?? ""}
                            onChange={(event) =>
                              setField(
                                "partnerAgeMin",
                                event.target.value ? Number(event.target.value) : null,
                              )
                            }
                            placeholder="27"
                          />
                        </Field>
                        <Field label="Preferred age max">
                          <TextInput
                            inputMode="numeric"
                            value={draft.partnerAgeMax ?? ""}
                            onChange={(event) =>
                              setField(
                                "partnerAgeMax",
                                event.target.value ? Number(event.target.value) : null,
                              )
                            }
                            placeholder="36"
                          />
                        </Field>
```

Replace with a single field spanning both columns using `sm:col-span-2`:
```tsx
                        <div className="sm:col-span-2">
                          <Field
                            label="Partner age range"
                            hint={`${draft.partnerAgeMin ?? 18} – ${draft.partnerAgeMax ?? 65} years old`}
                          >
                            <AgeRangeSlider
                              min={draft.partnerAgeMin}
                              max={draft.partnerAgeMax}
                              onChange={(min, max) =>
                                setDraft((prev) =>
                                  prev
                                    ? { ...prev, partnerAgeMin: min, partnerAgeMax: max }
                                    : prev,
                                )
                              }
                            />
                          </Field>
                        </div>
```

- [ ] **Step 5: Replace Core values TextArea with MultiSelectChips**

Find (lines ~1328–1337):
```tsx
                      <Field label="Core values" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.coreValues)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("coreValues", next))
                          }
                          placeholder="Commitment, openness, stability"
                          className="min-h-[110px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Core values" hint="Pick up to 5">
                        <MultiSelectChips
                          options={CORE_VALUES_OPTIONS}
                          value={draft.coreValues}
                          onChange={(next) => setField("coreValues", next)}
                          max={5}
                          allowCustom
                          placeholder="Add a value…"
                        />
                      </Field>
```

- [ ] **Step 6: Replace Dealbreakers TextArea with MultiSelectChips**

Find (lines ~1338–1347):
```tsx
                      <Field label="Dealbreakers" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.dealbreakers)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("dealbreakers", next))
                          }
                          placeholder="Dishonesty, emotional unavailability"
                          className="min-h-[110px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Dealbreakers">
                        <MultiSelectChips
                          options={DEALBREAKERS_OPTIONS}
                          value={draft.dealbreakers}
                          onChange={(next) => setField("dealbreakers", next)}
                          allowCustom
                          placeholder="Add a dealbreaker…"
                        />
                      </Field>
```

- [ ] **Step 7: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: profile dating tab — partner chips, love language chips, age range slider, value chips"
```

---

### Task 8: Profile editor — Lifestyle tab

**Files:**
- Modify: `src/app/profile/page.tsx`

All edits are in the `activeTab === "lifestyle"` section (starting around line 1376).

- [ ] **Step 1: Replace "Conflict style" text input with select + custom**

Find (lines ~1430–1436):
```tsx
                        <Field label="Conflict style">
                          <TextInput
                            value={draft.conflictStyle}
                            onChange={(event) => setField("conflictStyle", event.target.value)}
                            placeholder="Direct but calm"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Conflict style">
                          <SelectInput
                            value={
                              draft.conflictStyle &&
                              CONFLICT_STYLE_OPTIONS.includes(draft.conflictStyle as never)
                                ? draft.conflictStyle
                                : draft.conflictStyle
                                ? "Other"
                                : ""
                            }
                            onChange={(e) =>
                              setField(
                                "conflictStyle",
                                e.target.value === "Other" ? "" : e.target.value,
                              )
                            }
                          >
                            <option value="">Select</option>
                            {CONFLICT_STYLE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                            <option value="Other">Other</option>
                          </SelectInput>
                          {draft.conflictStyle !== "" &&
                            !CONFLICT_STYLE_OPTIONS.includes(draft.conflictStyle as never) && (
                              <TextInput
                                value={draft.conflictStyle}
                                onChange={(e) => setField("conflictStyle", e.target.value)}
                                placeholder="How do you handle conflict?"
                                className="mt-2"
                              />
                            )}
                        </Field>
```

- [ ] **Step 2: Replace "Diet" text input with MultiSelectChips**

`diet` is `string | null`; store comma-joined.

Find (lines ~1470–1476):
```tsx
                        <Field label="Diet">
                          <TextInput
                            value={draft.diet || ""}
                            onChange={(event) => setField("diet", event.target.value)}
                            placeholder="Vegetarian-ish, halal, loves sushi"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Diet">
                          <MultiSelectChips
                            options={DIET_OPTIONS}
                            value={draft.diet ? draft.diet.split(", ").filter(Boolean) : []}
                            onChange={(next) => setField("diet", next.join(", ") || null)}
                            allowCustom
                            placeholder="Add dietary preference…"
                          />
                        </Field>
```

- [ ] **Step 3: Replace "Weekend style" text input with MultiSelectChips (max 3)**

`weekendStyle` is `string | null`; store comma-joined.

Find (lines ~1477–1483):
```tsx
                        <Field label="Weekend style">
                          <TextInput
                            value={draft.weekendStyle || ""}
                            onChange={(event) => setField("weekendStyle", event.target.value)}
                            placeholder="Slow mornings, dinner plans, one good walk"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Weekend style" hint="Pick up to 3">
                          <MultiSelectChips
                            options={WEEKEND_STYLE_OPTIONS}
                            value={
                              draft.weekendStyle
                                ? draft.weekendStyle.split(", ").filter(Boolean)
                                : []
                            }
                            onChange={(next) =>
                              setField("weekendStyle", next.join(", ") || null)
                            }
                            max={3}
                            allowCustom
                            placeholder="Add your own…"
                          />
                        </Field>
```

- [ ] **Step 4: Replace "Travel style" text input with select**

Find (lines ~1484–1490):
```tsx
                        <Field label="Travel style">
                          <TextInput
                            value={draft.travelStyle || ""}
                            onChange={(event) => setField("travelStyle", event.target.value)}
                            placeholder="Planner, spontaneous, one big trip person"
                          />
                        </Field>
```

Replace with:
```tsx
                        <Field label="Travel style">
                          <SelectInput
                            value={draft.travelStyle || ""}
                            onChange={(e) => setField("travelStyle", e.target.value || null)}
                          >
                            <option value="">Select</option>
                            {TRAVEL_STYLE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </SelectInput>
                        </Field>
```

- [ ] **Step 5: Replace "Languages" TextArea with MultiSelectChips**

Find (lines ~1493–1502):
```tsx
                      <Field label="Languages" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.languages)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("languages", next))
                          }
                          placeholder="English, Hindi"
                          className="min-h-[96px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Languages">
                        <MultiSelectChips
                          options={LANGUAGE_OPTIONS}
                          value={draft.languages}
                          onChange={(next) => setField("languages", next)}
                          allowCustom
                          placeholder="Add a language…"
                        />
                      </Field>
```

- [ ] **Step 6: Replace "Pets" TextArea with MultiSelectChips**

Find (lines ~1504–1513):
```tsx
                      <Field label="Pets" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.pets)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("pets", next))
                          }
                          placeholder="Dog person, has a cat"
                          className="min-h-[96px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Pets">
                        <MultiSelectChips
                          options={PETS_OPTIONS}
                          value={draft.pets}
                          onChange={(next) => setField("pets", next)}
                          allowCustom={false}
                        />
                      </Field>
```

- [ ] **Step 7: Replace "Strengths" TextArea with MultiSelectChips**

Find (lines ~1518–1527):
```tsx
                      <Field label="Strengths" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.strengths)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("strengths", next))
                          }
                          placeholder="Emotionally steady, funny, loyal"
                          className="min-h-[96px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Strengths">
                        <MultiSelectChips
                          options={STRENGTHS_OPTIONS}
                          value={draft.strengths}
                          onChange={(next) => setField("strengths", next)}
                          allowCustom
                          placeholder="Add a strength…"
                        />
                      </Field>
```

- [ ] **Step 8: Replace "Growing toward" TextArea with MultiSelectChips**

Find (lines ~1528–1537):
```tsx
                      <Field label="Growing toward" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.growthAreas)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("growthAreas", next))
                          }
                          placeholder="Clearer communication, stronger boundaries"
                          className="min-h-[96px]"
                        />
                      </Field>
```

Replace with:
```tsx
                      <Field label="Growing toward">
                        <MultiSelectChips
                          options={GROWTH_AREAS_OPTIONS}
                          value={draft.growthAreas}
                          onChange={(next) => setField("growthAreas", next)}
                          allowCustom
                          placeholder="Add a growth area…"
                        />
                      </Field>
```

- [ ] **Step 9: Verify lifestyle tab in dev server**

Open profile editor → Lifestyle tab. Verify:
- Conflict style shows a select; "Other" reveals a text input
- Diet, Weekend style show chip selectors with predefined options + custom input
- Travel style shows a select dropdown
- Languages, Pets show chip selectors
- Strengths, Growing toward show chip selectors

- [ ] **Step 10: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: profile lifestyle tab — conflict/travel selects, diet/weekend/language/pets/strengths/growth chips"
```

---

### Task 9: Onboarding inline structured inputs

**Files:**
- Modify: `src/components/onboarding/quick-replies.tsx`
- Modify: `src/app/onboarding/page.tsx`

The onboarding currently parses `[CHIPS: A|B|C]` from AI messages. We extend this with:
- `[MULTISELECT: A|B|C]` — multi-select chips with a Confirm button
- `[AGERANGE]` — dual range slider for partner age
- `[DATEPICKER]` — date of birth picker

- [ ] **Step 1: Replace `src/components/onboarding/quick-replies.tsx` entirely**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ACT_COLORS, type Act } from "./ambient-layer";
import { AgeRangeSlider } from "@/components/ui/age-range-slider";
import { DateOfBirth } from "@/components/ui/date-of-birth";

/** Extract single-select chips from "[CHIPS: A | B | C]" suffix */
export function parseChips(text: string): string[] {
  const match = text.match(/\[CHIPS:\s*([^\]]+)\]/);
  if (!match) return [];
  return match[1].split("|").map((s) => s.trim()).filter(Boolean);
}

/** Extract multi-select options from "[MULTISELECT: A | B | C]" suffix */
export function parseMultiSelect(text: string): string[] {
  const match = text.match(/\[MULTISELECT:\s*([^\]]+)\]/);
  if (!match) return [];
  return match[1].split("|").map((s) => s.trim()).filter(Boolean);
}

/** Check if message contains [AGERANGE] marker */
export function hasAgeRange(text: string): boolean {
  return /\[AGERANGE\]/.test(text);
}

/** Check if message contains [DATEPICKER] marker */
export function hasDatePicker(text: string): boolean {
  return /\[DATEPICKER\]/.test(text);
}

/** Strip all inline UI markers from display text */
export function stripChips(text: string): string {
  return text
    .replace(/\[CHIPS:[^\]]*\]/g, "")
    .replace(/\[MULTISELECT:[^\]]*\]/g, "")
    .replace(/\[AGERANGE\]/g, "")
    .replace(/\[DATEPICKER\]/g, "")
    .trim();
}

interface QuickRepliesProps {
  chips: string[];
  multiSelectOptions: string[];
  showAgeRange: boolean;
  showDatePicker: boolean;
  act: Act;
  onSelect: (chip: string) => void;
  onMultiSelect: (selected: string[]) => void;
  onAgeRange: (min: number, max: number) => void;
  onDatePick: (birthday: string | null, age: number | null, zodiac: string | null) => void;
  onSayMore: () => void;
}

export function QuickReplies({
  chips,
  multiSelectOptions,
  showAgeRange,
  showDatePicker,
  act,
  onSelect,
  onMultiSelect,
  onAgeRange,
  onDatePick,
  onSayMore,
}: QuickRepliesProps) {
  const color = ACT_COLORS[act];
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | null>(24);
  const [ageMax, setAgeMax] = useState<number | null>(36);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [birthdayAge, setBirthdayAge] = useState<number | null>(null);
  const [birthdayZodiac, setBirthdayZodiac] = useState<string | null>(null);

  if (chips.length > 0) {
    return (
      <motion.div
        className="mb-4 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {chips.map((chip) => (
          <motion.button
            key={chip}
            onClick={() => onSelect(chip)}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-80"
            style={{
              border: `1px solid ${color}50`,
              color,
              background: `${color}12`,
              backdropFilter: "blur(8px)",
            }}
          >
            {chip}
          </motion.button>
        ))}
        <motion.button
          onClick={onSayMore}
          whileTap={{ scale: 0.95 }}
          className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-70"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--bd-text-faint)",
            background: "transparent",
          }}
        >
          ↩ say more
        </motion.button>
      </motion.div>
    );
  }

  if (multiSelectOptions.length > 0) {
    return (
      <motion.div
        className="mb-4 space-y-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex flex-wrap gap-2">
          {multiSelectOptions.map((opt) => {
            const selected = multiSelected.includes(opt);
            return (
              <motion.button
                key={opt}
                onClick={() =>
                  setMultiSelected((prev) =>
                    selected ? prev.filter((v) => v !== opt) : [...prev, opt],
                  )
                }
                whileTap={{ scale: 0.95 }}
                className="rounded-full px-4 py-1.5 text-sm transition-all"
                style={{
                  border: `1px solid ${selected ? color : color + "40"}`,
                  color: selected ? "#fff" : color,
                  background: selected ? `${color}30` : `${color}10`,
                  backdropFilter: "blur(8px)",
                }}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
        <div className="flex gap-2">
          {multiSelected.length > 0 && (
            <motion.button
              onClick={() => onMultiSelect(multiSelected)}
              whileTap={{ scale: 0.95 }}
              className="rounded-full px-5 py-1.5 text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${color}, #b48cff)`,
                color: "#fff",
                border: "none",
              }}
            >
              Confirm ({multiSelected.length})
            </motion.button>
          )}
          <motion.button
            onClick={onSayMore}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-70"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--bd-text-faint)",
              background: "transparent",
            }}
          >
            ↩ say more
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (showAgeRange) {
    return (
      <motion.div
        className="mb-4 w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <AgeRangeSlider
          min={ageMin}
          max={ageMax}
          onChange={(min, max) => { setAgeMin(min); setAgeMax(max); }}
        />
        <div className="flex gap-2">
          <motion.button
            onClick={() => onAgeRange(ageMin ?? 24, ageMax ?? 36)}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-5 py-1.5 text-sm font-medium"
            style={{ background: `linear-gradient(135deg, ${color}, #b48cff)`, color: "#fff", border: "none" }}
          >
            That works for me
          </motion.button>
          <motion.button
            onClick={onSayMore}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-70"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "var(--bd-text-faint)", background: "transparent" }}
          >
            ↩ say more
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (showDatePicker) {
    return (
      <motion.div
        className="mb-4 w-full max-w-xs space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <DateOfBirth
          value={birthday}
          onChange={(bday, age, zodiac) => {
            setBirthday(bday);
            setBirthdayAge(age);
            setBirthdayZodiac(zodiac);
          }}
        />
        <div className="flex gap-2">
          {birthday && (
            <motion.button
              onClick={() => onDatePick(birthday, birthdayAge, birthdayZodiac)}
              whileTap={{ scale: 0.95 }}
              className="rounded-full px-5 py-1.5 text-sm font-medium"
              style={{ background: `linear-gradient(135deg, ${color}, #b48cff)`, color: "#fff", border: "none" }}
            >
              Confirm
            </motion.button>
          )}
          <motion.button
            onClick={onSayMore}
            whileTap={{ scale: 0.95 }}
            className="rounded-full px-4 py-1.5 text-sm transition-opacity hover:opacity-70"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "var(--bd-text-faint)", background: "transparent" }}
          >
            ↩ say more
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Update imports in `src/app/onboarding/page.tsx`**

Find (line 9):
```tsx
import { QuickReplies, parseChips } from "@/components/onboarding/quick-replies";
```

Replace with:
```tsx
import {
  QuickReplies,
  parseChips,
  parseMultiSelect,
  hasAgeRange,
  hasDatePicker,
  stripChips,
} from "@/components/onboarding/quick-replies";
```

- [ ] **Step 3: Update the `currentChips` derivation and `<QuickReplies>` render in `src/app/onboarding/page.tsx`**

Find the `currentChips` useMemo block (lines ~167–172):
```tsx
  const currentChips = useMemo(() => {
    if (isStreaming || !lastAIMessage) return [];
    const text = getMessageText(lastAIMessage);
    if (text.includes("PROFILE_COMPLETE")) return [];
    return parseChips(text);
  }, [lastAIMessage, isStreaming]);
```

Replace with:
```tsx
  const lastAIText = useMemo(() => {
    if (isStreaming || !lastAIMessage) return "";
    const text = getMessageText(lastAIMessage);
    if (text.includes("PROFILE_COMPLETE")) return "";
    return text;
  }, [lastAIMessage, isStreaming]);

  const currentChips = useMemo(() => parseChips(lastAIText), [lastAIText]);
  const currentMultiSelect = useMemo(() => parseMultiSelect(lastAIText), [lastAIText]);
  const currentShowAgeRange = useMemo(() => hasAgeRange(lastAIText), [lastAIText]);
  const currentShowDatePicker = useMemo(() => hasDatePicker(lastAIText), [lastAIText]);
  const showAnyInlineUI =
    currentChips.length > 0 ||
    currentMultiSelect.length > 0 ||
    currentShowAgeRange ||
    currentShowDatePicker;
```

Find the `<QuickReplies>` render block (lines ~369–376):
```tsx
              {currentChips.length > 0 && (
                <QuickReplies
                  chips={currentChips}
                  act={act}
                  onSelect={handleChipSelect}
                  onSayMore={handleSayMore}
                />
              )}
```

Replace with:
```tsx
              {showAnyInlineUI && (
                <QuickReplies
                  chips={currentChips}
                  multiSelectOptions={currentMultiSelect}
                  showAgeRange={currentShowAgeRange}
                  showDatePicker={currentShowDatePicker}
                  act={act}
                  onSelect={handleChipSelect}
                  onMultiSelect={(selected) => handleSend(selected.join(", "))}
                  onAgeRange={(min, max) => handleSend(`${min} to ${max}`)}
                  onDatePick={(birthday, age, zodiac) =>
                    handleSend(
                      birthday
                        ? `My birthday is ${birthday}. I'm ${age} years old.${zodiac ? ` My zodiac sign is ${zodiac}.` : ""}`
                        : "I'd rather not share my birthday",
                    )
                  }
                  onSayMore={handleSayMore}
                />
              )}
```

- [ ] **Step 4: Also update any `stripChips` call used in message display**

Search the onboarding page and chat-message component for `stripChips(` — the new `stripChips` in quick-replies.tsx now strips all markers (`CHIPS`, `MULTISELECT`, `AGERANGE`, `DATEPICKER`), so no further changes are needed there.

- [ ] **Step 5: Commit**

```bash
git add src/components/onboarding/quick-replies.tsx src/app/onboarding/page.tsx
git commit -m "feat: onboarding inline MULTISELECT, AGERANGE, DATEPICKER input types"
```

---

### Self-review checklist

- [x] **Spec coverage:** All fields from the approved design are handled. DOB ✓, gender/pronouns/orientation select+custom ✓, ethnicity/religion/politics selects ✓, interests grouped chips ✓, partnerGender/loveLanguage chips ✓, relationshipStyle/conflictStyle/travelStyle selects ✓, partnerAge slider ✓, coreValues/dealbreakers chips ✓, diet/weekendStyle chips ✓, languages/pets chips ✓, strengths/growthAreas chips ✓, onboarding MULTISELECT/AGERANGE/DATEPICKER ✓
- [x] **No placeholders:** All steps contain complete code
- [x] **Type consistency:** `MultiSelectChips`, `DateOfBirth`, `AgeRangeSlider` prop names are consistent across all usages
- [x] **comma-joined string fields:** `partnerGender`, `loveLanguage`, `diet`, `weekendStyle` all use `.split(", ").filter(Boolean)` to read and `.join(", ")` to write
- [x] **Birthday → age + zodiac:** Uses `computeAgeFromBirthday` (Task 1) and `getZodiacFromBirthday` (already in zodiac.ts); sets all three fields on draft simultaneously
