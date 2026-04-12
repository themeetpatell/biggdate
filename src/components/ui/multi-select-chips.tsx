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
