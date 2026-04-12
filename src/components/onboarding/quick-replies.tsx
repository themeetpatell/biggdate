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
