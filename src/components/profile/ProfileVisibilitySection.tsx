"use client";

import type { HydratedProfile } from "@/components/profile/helpers";

interface ProfileVisibilitySectionProps {
  draft: HydratedProfile;
  onChange: (partial: Partial<HydratedProfile>) => void;
}

const VISIBILITY_OPTIONS = [
  {
    key: "visible" as const,
    label: "Visible in discovery",
    copy: "You are out there, charming strangers on purpose.",
  },
  {
    key: "paused" as const,
    label: "Pause discovery",
    copy: "Take a breath without ghosting the people already here.",
  },
  {
    key: "hidden" as const,
    label: "Private profile",
    copy: "Keep it backstage until the profile stops feeling half-dressed.",
  },
];

const SHOW_TOGGLES: Array<{
  key: "showAge" | "showCity" | "showWork" | "showEducation";
  label: string;
  copy: string;
}> = [
  {
    key: "showAge",
    label: "Show age",
    copy: "Useful context, unless you prefer a little strategic mystery.",
  },
  {
    key: "showCity",
    label: "Show city",
    copy: "Let people know the neighborhood, not your exact coordinates.",
  },
  {
    key: "showWork",
    label: "Show work",
    copy: "Career can be attractive. Corporate oversharing, less so.",
  },
  {
    key: "showEducation",
    label: "Show education",
    copy: "Show the school if it helps. Hide it if it turns into a personality.",
  },
];

export function ProfileVisibilitySection({ draft, onChange }: ProfileVisibilitySectionProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-3 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-white">Discovery visibility</p>
        <div className="grid gap-3">
          {VISIBILITY_OPTIONS.map((option) => (
            <button
              key={option.key}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                draft.profileVisibility === option.key
                  ? "border-[#b48cff]/45 bg-[#b48cff]/10"
                  : "border-white/8 bg-[#0b0d16]"
              }`}
              onClick={() => onChange({ profileVisibility: option.key })}
              type="button"
            >
              <p className="text-sm font-medium text-white">{option.label}</p>
              <p className="mt-1 text-[13px] leading-5 text-white/42">{option.copy}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-white">What is shown publicly</p>
        {SHOW_TOGGLES.map((option) => {
          const isOn = draft[option.key];
          return (
            <button
              key={option.key}
              className={`flex w-full items-start justify-between rounded-2xl border px-4 py-4 text-left transition ${
                isOn
                  ? "border-white/12 bg-[#0b0d16]"
                  : "border-[#d4688a]/22 bg-[#d4688a]/08"
              }`}
              onClick={() => onChange({ [option.key]: !isOn } as Partial<HydratedProfile>)}
              type="button"
            >
              <div>
                <p className="text-sm font-medium text-white">{option.label}</p>
                <p className="mt-1 text-[13px] leading-5 text-white/42">{option.copy}</p>
              </div>
              <div
                className={`mt-1 inline-flex h-7 min-w-14 items-center rounded-full p-1 ${
                  isOn ? "bg-[#4fffb0]/22" : "bg-white/10"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white transition ${
                    isOn ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
