"use client";

import {
  Children,
  type Dispatch,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Camera,
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  Lock,
  LogOut,
  MapPin,
  MoreHorizontal,
  Pencil,
  Ruler,
  Settings2,
  Shield,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import type { Profile, ProfilePrompt } from "@/lib/types";
import { SettingsDrawer } from "@/components/settings-drawer";
import { UpgradeSheet } from "@/components/upgrade-sheet";
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

const MAX_PHOTOS = 6;
const PROFILE_PHOTO_BUCKET = "profile-photos";

const DEFAULT_PROMPT_QUESTIONS = [
  "A green flag I never ignore",
  "The life I'm building next",
  "By date three, you should know",
];

const DIMENSIONS = [
  { id: "D1", label: "Emotional Intelligence", weight: 20, color: "#d4688a" },
  { id: "D2", label: "Values & Beliefs", weight: 18, color: "#4FFFB0" },
  { id: "D3", label: "Intellectual Depth", weight: 14, color: "#B48CFF" },
  { id: "D4", label: "Relational Patterns", weight: 13, color: "#44c8ff" },
  { id: "D5", label: "Life Architecture", weight: 12, color: "#f5c842" },
  { id: "D6", label: "Family & Future", weight: 11, color: "#ff936d" },
  { id: "D7", label: "Stability", weight: 8, color: "#9bff8c" },
  { id: "D8", label: "Lifestyle", weight: 7, color: "#7fb4ff" },
  { id: "D9", label: "Meaning", weight: 5, color: "#f58bc2" },
  { id: "D10", label: "Astrology", weight: 2, color: "#ffcf5a" },
];

type HydratedProfile = Profile & {
  languages: string[];
  interests: string[];
  pets: string[];
  prompts: ProfilePrompt[];
  offers: string[];
  needs: string[];
  profileVisibility: "visible" | "paused" | "hidden";
  showAge: boolean;
  showCity: boolean;
  showWork: boolean;
  showEducation: boolean;
};

type EditorTab = "basics" | "about" | "dating" | "lifestyle" | "gallery" | "visibility";
type ProfileViewTab = "profile" | "dating" | "lifestyle" | "insights";

const EDITOR_TABS: Array<{
  key: EditorTab;
  label: string;
  title: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    key: "basics",
    label: "Basics",
    title: "Identity, work, and profile vitals",
    description: "Enough signal to feel intentional, not witness protection.",
    icon: UserRound,
  },
  {
    key: "about",
    label: "About",
    title: "Story, interests, and prompt cards",
    description: "Give them something better than 'just ask'.",
    icon: Sparkles,
  },
  {
    key: "dating",
    label: "Dating",
    title: "Intentions, values, and partner preferences",
    description: "Clarity beats vibes-only chaos.",
    icon: Heart,
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    title: "Habits, growth, and day-to-day compatibility",
    description: "Tuesday compatibility matters more than Friday chemistry.",
    icon: Star,
  },
  {
    key: "gallery",
    label: "Gallery",
    title: "Profile photo and gallery",
    description: "Profile photo is your avatar. Gallery photos show on your profile.",
    icon: Camera,
  },
  {
    key: "visibility",
    label: "Visibility",
    title: "Discovery mode and field-level privacy",
    description: "Private where it counts, visible where it helps.",
    icon: Eye,
  },
];

const PROFILE_VIEW_TABS: Array<{
  key: ProfileViewTab;
  label: string;
}> = [
  {
    key: "profile",
    label: "About me",
  },
  {
    key: "dating",
    label: "Looking For",
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
  },
  {
    key: "insights",
    label: "Soulmap",
  },
];

function compactStrings(values: string[] | undefined | null) {
  return (values || []).map((value) => value.trim()).filter(Boolean);
}

function sanitizePrompts(prompts: ProfilePrompt[] | undefined | null) {
  return (prompts || [])
    .map((prompt) => ({
      question: prompt.question.trim(),
      answer: prompt.answer.trim(),
    }))
    .filter((prompt) => prompt.question || prompt.answer);
}

function hydrateProfile(profile: Profile): HydratedProfile {
  return {
    ...profile,
    languages: compactStrings(profile.languages),
    interests: compactStrings(profile.interests),
    pets: compactStrings(profile.pets),
    prompts: sanitizePrompts(profile.prompts),
    offers: compactStrings(profile.offers),
    needs: compactStrings(profile.needs),
    photos: compactStrings(profile.photos),
    dealbreakers: compactStrings(profile.dealbreakers),
    strengths: compactStrings(profile.strengths),
    growthAreas: compactStrings(profile.growthAreas),
    coreValues: compactStrings(profile.coreValues),
    profileVisibility:
      profile.profileVisibility === "paused" || profile.profileVisibility === "hidden"
        ? profile.profileVisibility
        : "visible",
    showAge: profile.showAge ?? true,
    showCity: profile.showCity ?? true,
    showWork: profile.showWork ?? true,
    showEducation: profile.showEducation ?? true,
  };
}

function createEditorDraft(profile: Profile): HydratedProfile {
  const hydrated = hydrateProfile(profile);
  const prompts = Array.from({ length: 3 }, (_, index) => ({
    question:
      hydrated.prompts[index]?.question ||
      DEFAULT_PROMPT_QUESTIONS[index] ||
      `Prompt ${index + 1}`,
    answer: hydrated.prompts[index]?.answer || "",
  }));
  const photos = Array.from({ length: MAX_PHOTOS }, (_, index) => hydrated.photos[index] || "");
  return { ...hydrated, prompts, photos };
}

function buildProfilePayload(profile: HydratedProfile): Partial<Profile> {
  return {
    ...profile,
    name: profile.name.trim(),
    city: profile.city.trim(),
    pronouns: profile.pronouns?.trim() || null,
    hometown: profile.hometown?.trim() || null,
    gender: profile.gender?.trim() || null,
    orientation: profile.orientation?.trim() || null,
    jobTitle: profile.jobTitle?.trim() || null,
    company: profile.company?.trim() || null,
    education: profile.education?.trim() || null,
    height: profile.height?.trim() || null,
    religion: profile.religion?.trim() || null,
    politics: profile.politics?.trim() || null,
    ethnicity: profile.ethnicity?.trim() || null,
    partnerGender: profile.partnerGender?.trim() || null,
    relationshipStyle: profile.relationshipStyle?.trim() || null,
    loveLanguage: profile.loveLanguage?.trim() || null,
    sleepSchedule: profile.sleepSchedule?.trim() || null,
    socialBattery: profile.socialBattery?.trim() || null,
    diet: profile.diet?.trim() || null,
    weekendStyle: profile.weekendStyle?.trim() || null,
    travelStyle: profile.travelStyle?.trim() || null,
    cleanliness: profile.cleanliness?.trim() || null,
    summary: profile.summary.trim(),
    coachingFocus: profile.coachingFocus.trim(),
    conflictStyle: profile.conflictStyle.trim(),
    familyExpectations: profile.familyExpectations.trim(),
    lifeArchitecture: profile.lifeArchitecture.trim(),
    languages: compactStrings(profile.languages),
    interests: compactStrings(profile.interests),
    pets: compactStrings(profile.pets),
    dealbreakers: compactStrings(profile.dealbreakers),
    strengths: compactStrings(profile.strengths),
    growthAreas: compactStrings(profile.growthAreas),
    coreValues: compactStrings(profile.coreValues),
    offers: compactStrings(profile.offers),
    needs: compactStrings(profile.needs),
    photos: compactStrings(profile.photos).slice(0, MAX_PHOTOS),
    prompts: sanitizePrompts(profile.prompts).slice(0, 3),
  };
}

function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatIntent(intent: Profile["intent"]) {
  if (intent === "serious") return "Long-term relationship";
  if (intent === "marriage") return "Marriage-minded";
  if (intent === "casual") return "Something casual";
  if (intent === "exploring") return "Still exploring";
  return "Add relationship intention";
}

function formatWantsKids(value: Profile["wantsKids"]) {
  if (value === "yes") return "Wants kids";
  if (value === "no") return "Doesn't want kids";
  if (value === "open") return "Open to kids";
  return "Not set";
}

function formatHasKids(value: boolean | null) {
  if (value === true) return "Has kids";
  if (value === false) return "No kids";
  return "Not set";
}

function formatVisibility(value: HydratedProfile["profileVisibility"]) {
  if (value === "paused") return "Paused in discovery";
  if (value === "hidden") return "Private profile";
  return "Visible in discovery";
}

function joinLifestyle(values: Array<string | null | undefined>, fallback: string) {
  const items = values.map((value) => (value || "").trim()).filter(Boolean);
  return items.length > 0 ? items.join(" · ") : fallback;
}

function getCompletion(profile: HydratedProfile) {
  const checks = [
    { label: "3+ photos", complete: profile.photos.length >= 3 },
    { label: "About section", complete: Boolean(profile.summary) },
    { label: "Intentions", complete: Boolean(profile.intent || profile.relationshipStyle) },
    { label: "Work or school", complete: Boolean(profile.jobTitle || profile.education) },
    { label: "Lifestyle", complete: Boolean(profile.exercise || profile.drinking || profile.smoking) },
    { label: "Interests", complete: profile.interests.length >= 3 },
    { label: "Prompt cards", complete: profile.prompts.filter((prompt) => prompt.answer).length >= 2 },
    { label: "Visibility set", complete: Boolean(profile.profileVisibility) },
  ];
  const completeCount = checks.filter((check) => check.complete).length;
  return {
    percent: Math.round((completeCount / checks.length) * 100),
    missing: checks.filter((check) => !check.complete).map((check) => check.label),
  };
}

function deriveDimensionScores(profile: HydratedProfile): number[] {
  const d1 =
    profile.attachment === "Secure"
      ? 88
      : profile.attachment === "Anxious"
        ? 65
        : profile.attachment === "Avoidant"
          ? 58
          : 52;
  const d2 = Math.min(94, 52 + profile.coreValues.length * 11);
  const d3 = profile.prompts.filter((prompt) => prompt.answer).length >= 2 ? 84 : profile.summary.length > 110 ? 73 : 60;
  const d4 = profile.loveLanguage ? 80 : 62;
  const d5 = profile.lifeArchitecture ? 82 : 64;
  const d6 = profile.familyExpectations ? 82 : profile.wantsKids ? 72 : 58;
  const d7 = profile.intent === "serious" || profile.intent === "marriage" ? 82 : 68;
  const activity = profile.exercise === "often" ? 90 : profile.exercise === "sometimes" ? 72 : 48;
  const habits = profile.drinking === "never" ? 88 : profile.drinking === "social" ? 74 : 56;
  const d8 = Math.round((activity + habits) / 2);
  const d9 = Math.min(92, Math.round(48 + profile.readinessScore * 0.42));
  const d10 = profile.zodiac ? 76 : 54;
  return [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];
}

function RadarChart({ scores }: { scores: number[] }) {
  const center = 110;
  const radius = 82;
  const count = scores.length;
  const step = (Math.PI * 2) / count;
  const start = -Math.PI / 2;
  const labels = ["Emo", "Val", "Int", "Rel", "Life", "Fam", "Stab", "Live", "Soul", "Ast"];

  const pointFor = (index: number, scale: number) => ({
    x: center + Math.cos(start + index * step) * scale,
    y: center + Math.sin(start + index * step) * scale,
  });

  const shape = scores
    .map((score, index) => pointFor(index, (score / 100) * radius))
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg viewBox="0 0 220 220" className="h-auto w-full max-w-[260px]">
      {[0.25, 0.5, 0.75, 1].map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: count }, (_, index) => {
            const point = pointFor(index, radius * level);
            return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
        />
      ))}
      {Array.from({ length: count }, (_, index) => {
        const edge = pointFor(index, radius);
        return (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={edge.x}
            y2={edge.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.8"
          />
        );
      })}
      <polygon points={shape} fill="rgba(212,104,138,0.18)" stroke="#d4688a" strokeWidth="1.6" />
      {scores.map((score, index) => {
        const point = pointFor(index, (score / 100) * radius);
        return <circle key={DIMENSIONS[index].id} cx={point.x} cy={point.y} r="3.5" fill={DIMENSIONS[index].color} />;
      })}
      {labels.map((label, index) => {
        const point = pointFor(index, radius + 18);
        return (
          <text
            key={label}
            x={point.x}
            y={point.y}
            fontSize="7"
            fill="rgba(255,255,255,0.4)"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,16,27,0.96),rgba(9,10,16,0.9))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-white">{title}</h2>
          {description ? <p className="mt-1 text-[13px] leading-5 text-white/46">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "emerald" | "rose" | "violet" | "amber";
}) {
  const tones = {
    default: "border-white/10 bg-white/[0.04] text-white/72",
    emerald: "border-[#4fffb0]/22 bg-[#4fffb0]/10 text-[#72ffc2]",
    rose: "border-[#d4688a]/24 bg-[#d4688a]/10 text-[#ef8cab]",
    violet: "border-[#b48cff]/24 bg-[#b48cff]/10 text-[#c7a8ff]",
    amber: "border-[#f5c842]/24 bg-[#f5c842]/10 text-[#f4d26a]",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function DetailTile({
  icon,
  label,
  value,
  hidden,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hidden?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-white/36">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className={`text-sm leading-6 ${hidden ? "text-white/38" : "text-white/78"}`}>{value}</p>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/78">{label}</span>
        {hint ? <span className="text-xs text-white/35">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-white/22 focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${
        props.className || ""
      }`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[112px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/22 focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${
        props.className || ""
      }`}
    />
  );
}

function SelectInput({
  children,
  className,
  onChange,
  placeholder,
  value,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { placeholder?: string }) {
  const EMPTY_OPTION_VALUE = "__empty__";
  const options = Children.toArray(children)
    .filter((child): child is ReactElement<{ value?: string; disabled?: boolean; children?: ReactNode }> =>
      isValidElement(child),
    )
    .map((child) => ({
      value: typeof child.props.value === "string" ? child.props.value : "",
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));

  const currentValue = typeof value === "string" ? value : value == null ? "" : String(value);
  const placeholderLabel =
    options.find((option) => option.value === "")?.label || placeholder || "Select";
  const selectValue = currentValue === "" ? EMPTY_OPTION_VALUE : currentValue;

  return (
    <Select
      disabled={props.disabled}
      value={selectValue}
      onValueChange={(nextValue) => {
        if (!onChange) return;
        onChange({
          target: { value: nextValue === EMPTY_OPTION_VALUE ? "" : nextValue },
        } as ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger className={`h-12 w-full rounded-2xl border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:border-[#b48cff]/40 focus:bg-white/[0.06] ${className || ""}`}>
        <SelectValue>
          {options.find((option) => option.value === currentValue)?.label || placeholderLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        className="z-[80] rounded-2xl border border-white/10 bg-[#121521] p-1 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        align="start"
      >
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${String(option.label)}`}
            value={option.value === "" ? EMPTY_OPTION_VALUE : option.value}
            disabled={option.disabled}
            className="rounded-xl px-3 py-2 text-sm text-white data-disabled:text-white/30 focus:bg-white/[0.08] focus:text-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function listValue(values: string[]) {
  return values.join(", ");
}

function updateArrayInput(
  event: ChangeEvent<HTMLTextAreaElement>,
  setValue: (next: string[]) => void,
) {
  setValue(parseListInput(event.target.value));
}

function PhotoHero({
  profile,
  onEditPhoto,
  onLogout,
  onSettings,
  onUpgrade,
}: {
  profile: HydratedProfile;
  onEditPhoto: () => void;
  onLogout: () => void;
  onSettings: () => void;
  onUpgrade: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const openMenu = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setMenuOpen(true);
  };

  // photos[0] = profile photo (avatar), photos[1..] = gallery (cover mosaic)
  const avatarPhoto = profile.photos[0] || null;
  const galleryPhotos = profile.photos.slice(1, MAX_PHOTOS);
  const hasPhotos = galleryPhotos.length > 0;
  const headline = [
    profile.showWork && profile.jobTitle
      ? profile.company
        ? `${profile.jobTitle} at ${profile.company}`
        : profile.jobTitle
      : null,
    profile.intent ? formatIntent(profile.intent) : null,
    profile.relationshipStyle || null,
  ]
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ");
  const summary =
    profile.summary ||
    "This profile still needs sharper edges. Right now it reads more draft than dangerous.";
  const detailMeta = [
    profile.showCity ? profile.city : null,
    profile.showEducation && profile.education ? profile.education : null,
    profile.pronouns || null,
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0b0d16] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,104,138,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(180,140,255,0.16),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/6" />
      <div className="relative overflow-hidden rounded-[inherit]">
        <div className="relative h-[14rem] overflow-hidden sm:h-[16rem]">
          {hasPhotos ? (
            <div className="absolute inset-0 p-3">
              {galleryPhotos.length === 1 ? (
                <div className="relative h-full overflow-hidden rounded-[30px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={galleryPhotos[0]} alt={profile.name} className="h-full w-full object-cover" />
                </div>
              ) : null}

              {galleryPhotos.length === 2 ? (
                <div className="grid h-full grid-cols-[1.35fr_0.65fr] gap-3">
                  <div className="relative overflow-hidden rounded-[30px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={galleryPhotos[0]} alt={`${profile.name} photo 1`} className="h-full w-full object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-[26px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={galleryPhotos[1]} alt={`${profile.name} photo 2`} className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : null}

              {galleryPhotos.length >= 3 ? (
                <div className="grid h-full grid-cols-[1.4fr_0.6fr] gap-3">
                  <div className="relative overflow-hidden rounded-[30px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={galleryPhotos[0]} alt={`${profile.name} photo 1`} className="h-full w-full object-cover" />
                  </div>
                  <div className="grid gap-3">
                    {galleryPhotos.slice(1, 3).map((photo, index) => (
                      <div key={photo + index} className="relative overflow-hidden rounded-[26px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`${profile.name} photo ${index + 2}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="pointer-events-none absolute inset-3 rounded-[30px] bg-[linear-gradient(180deg,rgba(7,9,16,0.04),rgba(7,9,16,0.14)_58%,rgba(7,9,16,0.32))]" />
            </div>
          ) : (
            <div className="absolute inset-0 p-3">
              <div className="grid h-full grid-cols-[1.4fr_0.6fr] gap-3">
                <button
                  className="rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(25,29,43,0.98),rgba(44,19,51,0.92))] p-6 text-left transition hover:border-white/20"
                  onClick={onEditPhoto}
                  type="button"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/68">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[1.55rem] font-semibold tracking-[-0.04em] text-white">
                        Add your first photo
                      </p>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/48">
                        Start with one clear profile shot. Build the rest underneath.
                      </p>
                    </div>
                  </div>
                </button>
                <div className="grid gap-3">
                  <button
                    className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] transition hover:border-white/20"
                    onClick={onEditPhoto}
                    type="button"
                  />
                  <button
                    className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] transition hover:border-white/20"
                    onClick={onEditPhoto}
                    type="button"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(11,13,22,0.82))]" />

          {/* 3-dots menu button */}
          <button
            ref={menuBtnRef}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur"
            onClick={openMenu}
            type="button"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {/* Backdrop to close menu */}
          {menuOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          )}

          {/* Dropdown menu — fixed so it clears overflow-hidden parents */}
          {menuOpen && (
            <div
              className="fixed z-50 min-w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-[#12141f] shadow-[0_20px_48px_rgba(0,0,0,0.5)]"
              style={{ top: menuPos.top, right: menuPos.right }}
            >
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                onClick={() => { onUpgrade(); setMenuOpen(false); }}
                type="button"
              >
                <Sparkles className="h-4 w-4 text-[#f58bc2]" />
                <span className="bg-[linear-gradient(90deg,#f58bc2,#b48cff)] bg-clip-text text-transparent">Upgrade</span>
              </button>
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => { onSettings(); setMenuOpen(false); }}
                type="button"
              >
                <Settings2 className="h-4 w-4 text-white/45" />
                Settings
              </button>
              <div className="mx-3 border-t border-white/8" />
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#ef8cab] transition hover:bg-[#d4688a]/10"
                onClick={() => { onLogout(); setMenuOpen(false); }}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>

        <div className="relative px-5 pb-6 pt-[4.5rem] sm:px-6 sm:pb-7 sm:pt-[5.5rem]">
          <div className="absolute left-5 top-0 -translate-y-1/2 sm:left-6">
            {/* Avatar — overflow-hidden wrapper for image rounding, camera button sits outside */}
            <div className="relative h-24 w-24 shrink-0 rounded-[30px] border-[5px] border-[#0b0d16] shadow-[0_20px_40px_rgba(0,0,0,0.32)] sm:h-32 sm:w-32">
              <div className="h-full w-full overflow-hidden rounded-[inherit] bg-[#10131d]">
                {avatarPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPhoto} alt={`${profile.name} profile photo`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-white/72">
                    {profile.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <button
                className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-[#12141f] text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition hover:bg-[#1e2030]"
                onClick={onEditPhoto}
                type="button"
                aria-label="Change profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-[2rem] font-semibold tracking-[-0.05em] text-white sm:text-[2.45rem]">
                {profile.name}
                {profile.showAge && profile.age ? `, ${profile.age}` : ""}
              </h1>
              {headline ? (
                <p className="mt-2 max-w-[44rem] text-[1.05rem] leading-8 text-white/78">
                  {headline}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/48">
                {detailMeta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
                {profile.zodiac ? (
                  <span>
                    {ZODIAC_EMOJI[profile.zodiac] || "✦"} {profile.zodiac}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 max-w-[46rem] text-sm leading-7 text-white/60 line-clamp-2">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({
  userId,
  draft,
  setDraft,
  activeTab,
  setActiveTab,
  focusedTab,
  open,
  onOpenChange,
  onSave,
  saving,
  error,
}: {
  userId: string;
  draft: HydratedProfile | null;
  setDraft: Dispatch<SetStateAction<HydratedProfile | null>>;
  activeTab: EditorTab;
  setActiveTab: Dispatch<SetStateAction<EditorTab>>;
  focusedTab: EditorTab | null;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      });
    }
  }, [open, activeTab, focusedTab]);

  if (!draft) return null;

  const setField = <K extends keyof HydratedProfile>(key: K, value: HydratedProfile[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };
  const setPhotoAtIndex = (index: number, value: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            photos: current.photos.map((entry, photoIndex) =>
              photoIndex === index ? value : entry,
            ),
          }
        : current,
    );
  };

  const handlePhotoUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadError(null);
    setUploadingPhotoIndex(index);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${userId}/${Date.now()}-${index}.${safeExtension}`;
      const supabase = createSupabaseBrowserClient();
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_PHOTO_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(PROFILE_PHOTO_BUCKET).getPublicUrl(path);
      if (!data.publicUrl) {
        throw new Error("Could not resolve the uploaded photo URL");
      }

      setPhotoAtIndex(index, data.publicUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Photo upload failed");
    } finally {
      setUploadingPhotoIndex(null);
    }
  };

  const currentTab =
    EDITOR_TABS.find((tab) => tab.key === activeTab) || EDITOR_TABS[0];
  const CurrentTabIcon = currentTab.icon;
  const isFocused = focusedTab !== null;
  const contentKey = `${isFocused ? "focused" : "full"}-${activeTab}-${open ? "open" : "closed"}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        key={contentKey}
        side="bottom"
        showCloseButton={false}
        className="inset-0 h-[100dvh] rounded-none border-0 bg-[#090b13] p-0 text-white sm:inset-x-3 sm:bottom-3 sm:top-3 sm:h-auto sm:max-h-[calc(100dvh-1.5rem)] sm:rounded-[32px] sm:border sm:border-white/10 sm:max-w-none"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="sticky top-0 z-20 border-b border-white/8 bg-[#090b13]/92 backdrop-blur-xl">
            <div
              style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
              className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${
                isFocused ? "pb-3 pt-3" : "pb-3 pt-3"
              }`}
            >
              <div className="mx-auto h-1.5 w-16 rounded-full bg-white/12 sm:block" />
              {!isFocused ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
                    {EDITOR_TABS.map((tab) => {
                      const TabIcon = tab.icon;
                      const active = activeTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          className={`inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                            active
                              ? "border-[#b48cff]/40 bg-[#b48cff]/14 text-white shadow-[0_10px_28px_rgba(180,140,255,0.12)]"
                              : "border-white/8 bg-white/[0.03] text-white/54 hover:border-white/14 hover:text-white/78"
                          }`}
                          onClick={() => setActiveTab(tab.key)}
                          type="button"
                        >
                          <TabIcon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/10 px-4 text-sm text-white/68"
                    onClick={() => onOpenChange(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">
                      Edit Profile
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-white">
                      {currentTab.label}
                    </h2>
                  </div>
                  <button
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/10 px-4 text-sm text-white/68"
                    onClick={() => onOpenChange(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>
              )}

              {isFocused ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#b48cff]/25 bg-[#b48cff]/10 px-3 py-1.5 text-sm font-medium text-white">
                  <CurrentTabIcon className="h-4 w-4" />
                  <span>Only this section is open</span>
                </div>
              ) : null}
            </div>
          </div>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${isFocused ? "py-4" : "py-6"}`}>
              {activeTab === "basics" ? (
                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm font-semibold text-white">Identity</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Name">
                        <TextInput
                          value={draft.name}
                          onChange={(event) => setField("name", event.target.value)}
                          placeholder="Your first name"
                        />
                      </Field>
                      <Field label="Date of birth">
                        <DateOfBirth
                          value={draft.birthday ?? null}
                          onChange={(birthday, age, zodiac) => {
                            setDraft((prev) =>
                              prev
                                ? { ...prev, birthday: birthday ?? null, age: age ?? null, zodiac: zodiac ?? null }
                                : prev,
                            );
                          }}
                        />
                      </Field>
                      <Field label="Pronouns">
                        <SelectInput
                          value={
                            draft.pronouns && (PRONOUNS_OPTIONS as readonly string[]).includes(draft.pronouns)
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
                          !(PRONOUNS_OPTIONS as readonly string[]).includes(draft.pronouns) && (
                            <TextInput
                              value={draft.pronouns ?? ""}
                              onChange={(e) => setField("pronouns", e.target.value || null)}
                              placeholder="Your pronouns"
                              className="mt-2"
                            />
                          )}
                      </Field>
                      <Field label="Gender">
                        <SelectInput
                          value={
                            draft.gender && (GENDER_OPTIONS as readonly string[]).includes(draft.gender)
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
                          !(GENDER_OPTIONS as readonly string[]).includes(draft.gender) && (
                            <TextInput
                              value={draft.gender ?? ""}
                              onChange={(e) => setField("gender", e.target.value || null)}
                              placeholder="How would you describe your gender?"
                              className="mt-2"
                            />
                          )}
                      </Field>
                      <Field label="Orientation">
                        <SelectInput
                          value={
                            draft.orientation && (ORIENTATION_OPTIONS as readonly string[]).includes(draft.orientation)
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
                          !(ORIENTATION_OPTIONS as readonly string[]).includes(draft.orientation) && (
                            <TextInput
                              value={draft.orientation ?? ""}
                              onChange={(e) => setField("orientation", e.target.value || null)}
                              placeholder="How would you describe your orientation?"
                              className="mt-2"
                            />
                          )}
                      </Field>
                      <Field label="Height">
                        <TextInput
                          value={draft.height || ""}
                          onChange={(event) => setField("height", event.target.value)}
                          placeholder={`5'7"`}
                        />
                      </Field>
                      <Field label="City">
                        <TextInput
                          value={draft.city}
                          onChange={(event) => setField("city", event.target.value)}
                          placeholder="Dubai"
                        />
                      </Field>
                      <Field label="Hometown">
                        <TextInput
                          value={draft.hometown || ""}
                          onChange={(event) => setField("hometown", event.target.value)}
                          placeholder="Mumbai"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Work and education</p>
                      <Field label="Job title">
                        <TextInput
                          value={draft.jobTitle || ""}
                          onChange={(event) => setField("jobTitle", event.target.value)}
                          placeholder="Product designer"
                        />
                      </Field>
                      <Field label="Company">
                        <TextInput
                          value={draft.company || ""}
                          onChange={(event) => setField("company", event.target.value)}
                          placeholder="Bigg Labs"
                        />
                      </Field>
                      <Field label="Education">
                        <TextInput
                          value={draft.education || ""}
                          onChange={(event) => setField("education", event.target.value)}
                          placeholder="NYU"
                        />
                      </Field>
                    </div>

                    <div className="space-y-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Optional profile facts</p>
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
                      <Field label="Religion">
                        <SelectInput
                          value={
                            draft.religion && (RELIGION_OPTIONS as readonly string[]).includes(draft.religion)
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
                          <option value="Other">Other (specify)</option>
                        </SelectInput>
                        {draft.religion !== null &&
                          draft.religion !== undefined &&
                          !(RELIGION_OPTIONS as readonly string[]).includes(draft.religion) && (
                            <TextInput
                              value={draft.religion ?? ""}
                              onChange={(e) => setField("religion", e.target.value || null)}
                              placeholder="Your religion or belief system"
                              className="mt-2"
                            />
                          )}
                      </Field>
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
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "about" ? (
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <Field label="About me" hint="This shows under your hero">
                      <TextArea
                        value={draft.summary}
                        onChange={(event) => setField("summary", event.target.value)}
                        placeholder="What makes being with you feel different?"
                        className="min-h-[140px]"
                      />
                    </Field>
                  </div>

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

                  <div className="space-y-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <div>
                      <p className="text-sm font-semibold text-white">Prompt cards</p>
                      <p className="mt-1 text-[13px] leading-5 text-white/42">
                        If a prompt cannot start a chat, it is just decorative wallpaper.
                      </p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                      {draft.prompts.map((prompt, index) => (
                        <div
                          key={index}
                          className="space-y-3 rounded-[24px] border border-white/8 bg-[#0b0d16] p-4"
                        >
                          <Field label={`Prompt ${index + 1} question`}>
                            <TextInput
                              value={prompt.question}
                              onChange={(event) =>
                                setField(
                                  "prompts",
                                  draft.prompts.map((entry, promptIndex) =>
                                    promptIndex === index
                                      ? { ...entry, question: event.target.value }
                                      : entry,
                                  ),
                                )
                              }
                            />
                          </Field>
                          <Field label="Answer">
                            <TextArea
                              value={prompt.answer}
                              onChange={(event) =>
                                setField(
                                  "prompts",
                                  draft.prompts.map((entry, promptIndex) =>
                                    promptIndex === index
                                      ? { ...entry, answer: event.target.value }
                                      : entry,
                                  ),
                                )
                              }
                              className="min-h-[132px]"
                              placeholder="Write something specific enough that a match can reply to it."
                            />
                          </Field>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "dating" ? (
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Relationship goals</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Relationship intention">
                          <SelectInput
                            value={draft.intent || ""}
                            onChange={(event) =>
                              setField(
                                "intent",
                                (event.target.value || null) as HydratedProfile["intent"],
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="serious">Long-term relationship</option>
                            <option value="marriage">Marriage-minded</option>
                            <option value="casual">Something casual</option>
                            <option value="exploring">Still exploring</option>
                          </SelectInput>
                        </Field>
                        <Field label="Relationship style">
                          <SelectInput
                            value={
                              draft.relationshipStyle &&
                              (RELATIONSHIP_STYLE_OPTIONS as readonly string[]).includes(draft.relationshipStyle)
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
                            <option value="Other">Other (specify)</option>
                          </SelectInput>
                          {draft.relationshipStyle !== null &&
                            draft.relationshipStyle !== undefined &&
                            !(RELATIONSHIP_STYLE_OPTIONS as readonly string[]).includes(draft.relationshipStyle) && (
                              <TextInput
                                value={draft.relationshipStyle ?? ""}
                                onChange={(e) => setField("relationshipStyle", e.target.value || null)}
                                placeholder="Describe your relationship style"
                                className="mt-2"
                              />
                            )}
                        </Field>
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
                        <div className="col-span-2">
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
                        <Field label="Has kids">
                          <SelectInput
                            value={draft.hasKids === null ? "" : draft.hasKids ? "yes" : "no"}
                            onChange={(event) =>
                              setField(
                                "hasKids",
                                event.target.value === ""
                                  ? null
                                  : event.target.value === "yes",
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </SelectInput>
                        </Field>
                        <Field label="Wants kids">
                          <SelectInput
                            value={draft.wantsKids || ""}
                            onChange={(event) =>
                              setField(
                                "wantsKids",
                                (event.target.value || null) as HydratedProfile["wantsKids"],
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="open">Open</option>
                            <option value="no">No</option>
                          </SelectInput>
                        </Field>
                      </div>
                    </div>

                    <div className="space-y-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Compatibility filters</p>
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
                      <Field label="Dealbreakers">
                        <MultiSelectChips
                          options={DEALBREAKERS_OPTIONS}
                          value={draft.dealbreakers}
                          onChange={(next) => setField("dealbreakers", next)}
                          allowCustom
                          placeholder="Add a dealbreaker…"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <Field label="Family expectations">
                        <TextArea
                          value={draft.familyExpectations}
                          onChange={(event) =>
                            setField("familyExpectations", event.target.value)
                          }
                          placeholder="How much does family approval matter to you?"
                        />
                      </Field>
                    </div>
                    <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <Field label="Life architecture">
                        <TextArea
                          value={draft.lifeArchitecture}
                          onChange={(event) => setField("lifeArchitecture", event.target.value)}
                          placeholder="Where and how do you want to live in the next 3 years?"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "lifestyle" ? (
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Habits and rhythm</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Exercise">
                          <SelectInput
                            value={draft.exercise || ""}
                            onChange={(event) =>
                              setField(
                                "exercise",
                                (event.target.value || null) as HydratedProfile["exercise"],
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="often">Often</option>
                            <option value="sometimes">Sometimes</option>
                            <option value="never">Rarely</option>
                          </SelectInput>
                        </Field>
                        <Field label="Drinking">
                          <SelectInput
                            value={draft.drinking || ""}
                            onChange={(event) =>
                              setField(
                                "drinking",
                                (event.target.value || null) as HydratedProfile["drinking"],
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="never">Never</option>
                            <option value="social">Socially</option>
                            <option value="regularly">Regularly</option>
                          </SelectInput>
                        </Field>
                        <Field label="Smoking">
                          <SelectInput
                            value={draft.smoking || ""}
                            onChange={(event) =>
                              setField(
                                "smoking",
                                (event.target.value || null) as HydratedProfile["smoking"],
                              )
                            }
                          >
                            <option value="">Select</option>
                            <option value="never">Never</option>
                            <option value="social">Socially</option>
                            <option value="regularly">Regularly</option>
                          </SelectInput>
                        </Field>
                        <Field label="Conflict style">
                          <SelectInput
                            value={
                              (CONFLICT_STYLE_OPTIONS as readonly string[]).includes(draft.conflictStyle)
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
                            <option value="Other">Other (specify)</option>
                          </SelectInput>
                          {draft.conflictStyle !== "" &&
                            !(CONFLICT_STYLE_OPTIONS as readonly string[]).includes(draft.conflictStyle) && (
                              <TextInput
                                value={draft.conflictStyle}
                                onChange={(e) => setField("conflictStyle", e.target.value)}
                                placeholder="How do you handle conflict?"
                                className="mt-2"
                              />
                            )}
                        </Field>
                        <Field label="Sleep schedule">
                          <SelectInput
                            value={draft.sleepSchedule || ""}
                            onChange={(event) => setField("sleepSchedule", event.target.value || null)}
                          >
                            <option value="">Select</option>
                            <option value="Early bird">Early bird</option>
                            <option value="Night owl">Night owl</option>
                            <option value="Somewhere in between">Somewhere in between</option>
                          </SelectInput>
                        </Field>
                        <Field label="Social battery">
                          <SelectInput
                            value={draft.socialBattery || ""}
                            onChange={(event) => setField("socialBattery", event.target.value || null)}
                          >
                            <option value="">Select</option>
                            <option value="Needs alone time">Needs alone time</option>
                            <option value="Balanced">Balanced</option>
                            <option value="People-powered">People-powered</option>
                          </SelectInput>
                        </Field>
                        <Field label="Cleanliness">
                          <SelectInput
                            value={draft.cleanliness || ""}
                            onChange={(event) => setField("cleanliness", event.target.value || null)}
                          >
                            <option value="">Select</option>
                            <option value="Neat">Neat</option>
                            <option value="Comfortably lived-in">Comfortably lived-in</option>
                            <option value="Creative chaos">Creative chaos</option>
                          </SelectInput>
                        </Field>
                        <Field label="Diet">
                          <MultiSelectChips
                            options={DIET_OPTIONS}
                            value={draft.diet ? draft.diet.split(", ").filter(Boolean) : []}
                            onChange={(next) => setField("diet", next.join(", ") || null)}
                            allowCustom
                            placeholder="Add dietary preference…"
                          />
                        </Field>
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
                      </div>

                      <Field label="Languages">
                        <MultiSelectChips
                          options={LANGUAGE_OPTIONS}
                          value={draft.languages}
                          onChange={(next) => setField("languages", next)}
                          allowCustom
                          placeholder="Add a language…"
                        />
                      </Field>

                      <Field label="Pets">
                        <MultiSelectChips
                          options={PETS_OPTIONS}
                          value={draft.pets}
                          onChange={(next) => setField("pets", next)}
                          allowCustom={false}
                        />
                      </Field>
                    </div>

                    <div className="space-y-5 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                      <p className="text-sm font-semibold text-white">Inner signal layer</p>
                      <Field label="Strengths">
                        <MultiSelectChips
                          options={STRENGTHS_OPTIONS}
                          value={draft.strengths}
                          onChange={(next) => setField("strengths", next)}
                          allowCustom
                          placeholder="Add a strength…"
                        />
                      </Field>
                      <Field label="Growing toward">
                        <MultiSelectChips
                          options={GROWTH_AREAS_OPTIONS}
                          value={draft.growthAreas}
                          onChange={(next) => setField("growthAreas", next)}
                          allowCustom
                          placeholder="Add a growth area…"
                        />
                      </Field>
                      <Field label="What I bring" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.offers)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("offers", next))
                          }
                          placeholder="Calm under pressure, shows up consistently"
                          className="min-h-[96px]"
                        />
                      </Field>
                      <Field label="What I need" hint="Comma or new line separated">
                        <TextArea
                          value={listValue(draft.needs)}
                          onChange={(event) =>
                            updateArrayInput(event, (next) => setField("needs", next))
                          }
                          placeholder="Direct communication, emotional consistency"
                          className="min-h-[96px]"
                        />
                      </Field>
                      <Field label="Maahi focus">
                        <TextArea
                          value={draft.coachingFocus}
                          onChange={(event) => setField("coachingFocus", event.target.value)}
                          placeholder="What should your private growth lens be right now?"
                          className="min-h-[120px]"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "gallery" ? (
                <div className="space-y-5">
                  {uploadError ? (
                    <p className="rounded-2xl border border-[#ff9fb7]/18 bg-[#ff9fb7]/8 px-4 py-3 text-sm text-[#ffb4c7]">
                      {uploadError}
                    </p>
                  ) : null}

                  {/* ── Profile photo (index 0) ── */}
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="mb-1 text-sm font-semibold text-white">Profile photo</p>
                    <p className="mb-4 text-[13px] leading-5 text-white/42">
                      Shown as your avatar everywhere on the app.
                    </p>
                    <div className="flex items-center gap-4">
                      {/* Avatar preview */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[#10131d]">
                        {draft.photos[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={draft.photos[0]} alt="Profile photo preview" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white/40">
                            {draft.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/78 transition hover:bg-white/[0.05] ${
                            uploadingPhotoIndex === 0 ? "pointer-events-none opacity-60" : ""
                          }`}
                          htmlFor="photo-upload-0"
                        >
                          <Camera className="h-3 w-3" />
                          {uploadingPhotoIndex === 0 ? "Uploading..." : "Upload from gallery"}
                        </label>
                        <input
                          id="photo-upload-0"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            void handlePhotoUpload(0, file);
                            event.target.value = "";
                          }}
                        />
                        {draft.photos[0] ? (
                          <button
                            className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs font-medium text-white/58 transition hover:bg-white/[0.05] hover:text-white/78"
                            onClick={() => setPhotoAtIndex(0, "")}
                            type="button"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* ── Gallery photos (indices 1–5) ── */}
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="mb-1 text-sm font-semibold text-white">Gallery photos</p>
                    <p className="mb-4 text-[13px] leading-5 text-white/42">
                      Shown on your profile. Add up to 5 photos.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {draft.photos.slice(1).map((photo, i) => {
                        const index = i + 1;
                        return (
                          <div key={index} className="relative">
                            <label
                              htmlFor={`photo-upload-${index}`}
                              className={`relative block aspect-square cursor-pointer overflow-hidden rounded-[20px] border bg-[#0b0d16] transition ${
                                photo
                                  ? "border-white/10"
                                  : "border-dashed border-white/12 hover:border-white/25"
                              } ${uploadingPhotoIndex === index ? "pointer-events-none opacity-60" : ""}`}
                            >
                              {photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={photo} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/28">
                                  <Camera className="h-5 w-5" />
                                  <span className="text-[10px]">
                                    {uploadingPhotoIndex === index ? "Uploading…" : "Add photo"}
                                  </span>
                                </div>
                              )}
                            </label>
                            <input
                              id={`photo-upload-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                void handlePhotoUpload(index, file);
                                event.target.value = "";
                              }}
                            />
                            {photo ? (
                              <button
                                className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/70 backdrop-blur transition hover:text-white"
                                onClick={() => setPhotoAtIndex(index, "")}
                                type="button"
                                aria-label="Remove photo"
                              >
                                ×
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "visibility" ? (
                <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="space-y-3 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="text-sm font-semibold text-white">Discovery visibility</p>
                    <div className="grid gap-3">
                      {[
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
                      ].map((option) => (
                        <button
                          key={option.key}
                          className={`rounded-2xl border px-4 py-4 text-left transition ${
                            draft.profileVisibility === option.key
                              ? "border-[#b48cff]/45 bg-[#b48cff]/10"
                              : "border-white/8 bg-[#0b0d16]"
                          }`}
                          onClick={() => setField("profileVisibility", option.key)}
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
                    {[
                      {
                        key: "showAge" as const,
                        label: "Show age",
                        copy: "Useful context, unless you prefer a little strategic mystery.",
                      },
                      {
                        key: "showCity" as const,
                        label: "Show city",
                        copy: "Let people know the neighborhood, not your exact coordinates.",
                      },
                      {
                        key: "showWork" as const,
                        label: "Show work",
                        copy: "Career can be attractive. Corporate oversharing, less so.",
                      },
                      {
                        key: "showEducation" as const,
                        label: "Show education",
                        copy: "Show the school if it helps. Hide it if it turns into a personality.",
                      },
                    ].map((option) => (
                      <button
                        key={option.key}
                        className={`flex w-full items-start justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          draft[option.key]
                            ? "border-white/12 bg-[#0b0d16]"
                            : "border-[#d4688a]/22 bg-[#d4688a]/08"
                        }`}
                        onClick={() => setField(option.key, !draft[option.key])}
                        type="button"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{option.label}</p>
                          <p className="mt-1 text-[13px] leading-5 text-white/42">{option.copy}</p>
                        </div>
                        <div
                          className={`mt-1 inline-flex h-7 min-w-14 items-center rounded-full p-1 ${
                            draft[option.key] ? "bg-[#4fffb0]/22" : "bg-white/10"
                          }`}
                        >
                          <span
                            className={`h-5 w-5 rounded-full bg-white transition ${
                              draft[option.key] ? "translate-x-7" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/8 bg-[#090b13]/95 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
              {error ? <p className="mb-3 text-sm text-[#ff9fb7]">{error}</p> : null}
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white/72"
                  onClick={() => onOpenChange(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-full bg-[linear-gradient(135deg,#ff6a95,#b48cff)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(180,140,255,0.24)] disabled:opacity-50"
                  disabled={saving}
                  onClick={onSave}
                  type="button"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { userId, profile, loading, logout, refresh } = useAuth();
  const [profileViewTab, setProfileViewTab] = useState<ProfileViewTab>("profile");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>("basics");
  const [focusedEditorTab, setFocusedEditorTab] = useState<EditorTab | null>(null);
  const [draft, setDraft] = useState<HydratedProfile | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      router.push("/onboarding");
    }
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile) {
      setDraft(createEditorDraft(profile));
    }
  }, [profile]);

  const hydrated = useMemo(() => (profile ? hydrateProfile(profile) : null), [profile]);
  const completion = useMemo(() => (hydrated ? getCompletion(hydrated) : null), [hydrated]);
  const scores = useMemo(() => (hydrated ? deriveDimensionScores(hydrated) : []), [hydrated]);

  if (loading || !profile || !hydrated || !completion) {
    return null;
  }

  const topDimensions = DIMENSIONS.map((dimension, index) => ({
    ...dimension,
    score: scores[index],
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const hiddenCount = [
    hydrated.showAge,
    hydrated.showCity,
    hydrated.showWork,
    hydrated.showEducation,
  ].filter((value) => !value).length;

  const openEditor = (tab: EditorTab, mode: "full" | "focused" = "focused") => {
    setSaveError(null);
    setDraft(createEditorDraft(profile));
    setEditorTab(tab);
    setFocusedEditorTab(mode === "focused" ? tab : null);
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaveError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildProfilePayload(draft)),
      });

      if (!response.ok) {
        throw new Error("Could not save profile changes");
      }

      await refresh();
      setFocusedEditorTab(null);
      setEditorOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-[100dvh] bg-[#06070d] pb-[calc(120px+env(safe-area-inset-bottom,0px))] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-[-6rem] top-[-5rem] h-72 w-72 rounded-full bg-[#d4688a]/18 blur-[110px]" />
          <div className="absolute bottom-[-7rem] right-[-3rem] h-80 w-80 rounded-full bg-[#7e63ff]/14 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-10 pt-4 sm:px-5">
          <PhotoHero
            profile={hydrated}
            onEditPhoto={() => openEditor("gallery", "focused")}
            onSettings={() => setSettingsOpen(true)}
            onUpgrade={() => setUpgradeOpen(true)}
            onLogout={() => void logout()}
          />

          {hydrated.profileVisibility !== "visible" ? (
            <div className="rounded-[26px] border border-[#f5c842]/18 bg-[#f5c842]/8 px-5 py-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 text-[#f5c842]" />
                <div>
                  <p className="text-sm font-semibold text-white">{formatVisibility(hydrated.profileVisibility)}</p>
                  <p className="mt-1 text-[13px] leading-5 text-white/48">
                    Your profile is not fully discoverable right now. Existing connections stay intact,
                    but new people will not see the profile until you switch visibility back on.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <SectionCard
            eyebrow="Profile Health"
            title={`Profile completeness: ${completion.percent}%`}
            description="The bones are here. Now we are making sure it reads like a person, not a beta feature."
            action={
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                onClick={() => openEditor("basics", "full")}
                type="button"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            }
          >
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#ff6a95,#b48cff,#4fffb0)]"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {completion.missing.length > 0 ? (
                    completion.missing.map((item) => <Tag key={item}>{item}</Tag>)
                  ) : (
                    <Tag tone="emerald">No obvious gaps left</Tag>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag
                    tone={
                      hydrated.profileVisibility === "visible"
                        ? "emerald"
                        : hydrated.profileVisibility === "paused"
                          ? "amber"
                          : "rose"
                    }
                  >
                    {formatVisibility(hydrated.profileVisibility)}
                  </Tag>
                  <Tag>
                    {hydrated.photos.length}/{MAX_PHOTOS} photos
                  </Tag>
                </div>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/34">
                  Profile state
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/48">Ready to date</span>
                    <span className="text-white/78">{hydrated.readinessScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/48">Discovery</span>
                    <span className="text-white/78">{formatVisibility(hydrated.profileVisibility)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/48">Hidden fields</span>
                    <span className="text-white/78">{hiddenCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/48">Prompts answered</span>
                    <span className="text-white/78">
                      {hydrated.prompts.filter((prompt) => prompt.answer).length}/3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,16,27,0.96),rgba(9,10,16,0.9))] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            <div className="flex gap-2 overflow-x-auto">
              {PROFILE_VIEW_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`min-w-[132px] flex-1 rounded-[20px] px-4 py-3 text-left transition ${
                    profileViewTab === tab.key
                      ? "bg-white text-[#090b13]"
                      : "bg-transparent text-white/48 hover:bg-white/[0.04] hover:text-white/78"
                  }`}
                  onClick={() => setProfileViewTab(tab.key)}
                  type="button"
                >
                  <p className="text-sm font-semibold">{tab.label}</p>
                </button>
              ))}
            </div>
          </div>

          {profileViewTab === "profile" ? (
            <>
              <SectionCard
                eyebrow="Essentials"
                title="What people see first"
                description="The first thirty seconds: enough signal to intrigue, not enough mystery to feel suspicious."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("basics")}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailTile
                    icon={<UserRound className="h-4 w-4" />}
                    label="Identity"
                    value={[hydrated.pronouns, hydrated.gender, hydrated.orientation].filter(Boolean).join(" · ") || "Add pronouns, gender, and orientation"}
                  />
                  <DetailTile
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={
                      hydrated.showCity
                        ? [hydrated.city, hydrated.hometown].filter(Boolean).join(" · ") || "Add city"
                        : "Hidden on your public profile"
                    }
                    hidden={!hydrated.showCity}
                  />
                  <DetailTile
                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                    label="Work"
                    value={
                      hydrated.showWork
                        ? [hydrated.jobTitle, hydrated.company].filter(Boolean).join(" at ") || "Add role and company"
                        : "Hidden on your public profile"
                    }
                    hidden={!hydrated.showWork}
                  />
                  <DetailTile
                    icon={<GraduationCap className="h-4 w-4" />}
                    label="Education"
                    value={
                      hydrated.showEducation
                        ? hydrated.education || "Add school or education"
                        : "Hidden on your public profile"
                    }
                    hidden={!hydrated.showEducation}
                  />
                  <DetailTile
                    icon={<Ruler className="h-4 w-4" />}
                    label="Vitals"
                    value={[hydrated.height, hydrated.religion, hydrated.politics].filter(Boolean).join(" · ") || "Add height, religion, or politics"}
                  />
                  <DetailTile
                    icon={<Star className="h-4 w-4" />}
                    label="Interests"
                    value={
                      hydrated.interests.length > 0
                        ? hydrated.interests.slice(0, 4).join(" · ")
                        : "Add interests people can actually message you about"
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Gallery"
                title="Photo gallery"
                description="Photos do half the talking. Make sure they are saying something useful."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("gallery")}
                    type="button"
                  >
                    <Camera className="h-4 w-4" />
                    Edit
                  </button>
                }
              >
                {hydrated.photos.slice(1).filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {hydrated.photos.slice(1).filter(Boolean).map((photo, index) => (
                      <div
                        key={photo + index}
                        className="relative overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`${hydrated.name} photo ${index + 1}`}
                          className="aspect-[0.9] h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.02] px-5 py-8 text-center">
                    <Camera className="mx-auto h-8 w-8 text-white/32" />
                    <p className="mt-3 text-sm font-medium text-white">No gallery photos yet</p>
                    <p className="mt-2 text-[13px] leading-5 text-white/42">
                      Add photos in the editor to build your gallery.
                    </p>
                  </div>
                )}
              </SectionCard>
            </>
          ) : null}

          {profileViewTab === "dating" ? (
            <>
              <SectionCard
                eyebrow="Dating Intentions"
                title="What you're looking for"
                description="Clarity is attractive. Mixed signals are for bad Wi-Fi and people who text 'haha sure'."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("dating")}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                }
              >
                <div className="flex flex-wrap gap-2">
                  <Tag tone="violet">{formatIntent(hydrated.intent)}</Tag>
                  {hydrated.relationshipStyle ? <Tag tone="violet">{hydrated.relationshipStyle}</Tag> : null}
                  {hydrated.partnerGender ? <Tag tone="violet">Looking for {hydrated.partnerGender}</Tag> : null}
                  {hydrated.partnerAgeMin || hydrated.partnerAgeMax ? (
                    <Tag tone="violet">
                      Prefers {hydrated.partnerAgeMin || 18} - {hydrated.partnerAgeMax || 99}
                    </Tag>
                  ) : null}
                  <Tag tone="violet">{formatHasKids(hydrated.hasKids)}</Tag>
                  <Tag tone="violet">{formatWantsKids(hydrated.wantsKids)}</Tag>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DetailTile
                    icon={<Heart className="h-4 w-4" />}
                    label="Love language"
                    value={hydrated.loveLanguage || "Add how care is best received"}
                  />
                  <DetailTile
                    icon={<Shield className="h-4 w-4" />}
                    label="Dealbreakers"
                    value={
                      hydrated.dealbreakers.length > 0
                        ? hydrated.dealbreakers.join(" · ")
                        : "Add what quietly ends attraction for you"
                    }
                  />
                </div>

                {hydrated.familyExpectations || hydrated.lifeArchitecture ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <DetailTile
                      icon={<Sparkles className="h-4 w-4" />}
                      label="Family expectations"
                      value={hydrated.familyExpectations || "Add how family fits into partner choice"}
                    />
                    <DetailTile
                      icon={<MapPin className="h-4 w-4" />}
                      label="Life architecture"
                      value={hydrated.lifeArchitecture || "Add the life you're trying to build"}
                    />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                eyebrow="Conversation"
                title="Prompt answers"
                description="These are your reply magnets. A good prompt should invite a message, not polite silence."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("about")}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                }
              >
                {hydrated.prompts.filter((prompt) => prompt.answer).length > 0 ? (
                  <div className="grid gap-3">
                    {hydrated.prompts
                      .filter((prompt) => prompt.answer)
                      .map((prompt) => (
                        <div
                          key={prompt.question}
                          className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(180,140,255,0.08),rgba(180,140,255,0.03))] p-5"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c9b5ff]">
                            {prompt.question}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/78">{prompt.answer}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.02] px-5 py-8 text-center">
                    <p className="text-sm font-medium text-white">No prompt cards yet</p>
                    <p className="mt-2 text-[13px] leading-5 text-white/42">
                      Add two or three prompts so people can message the real you, not your résumé.
                    </p>
                  </div>
                )}
              </SectionCard>
            </>
          ) : null}

          {profileViewTab === "lifestyle" ? (
            <>
              <SectionCard
                eyebrow="Lifestyle"
                title="Vibes, habits, and compatibility clues"
                description="Chemistry is cute. Daily habits decide whether the Tuesday version of you works."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("lifestyle")}
                    type="button"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailTile
                    icon={<Sparkles className="h-4 w-4" />}
                    label="Lifestyle"
                    value={[hydrated.exercise, hydrated.drinking, hydrated.smoking].filter(Boolean).join(" · ") || "Add exercise, drinking, and smoking"}
                  />
                  <DetailTile
                    icon={<Star className="h-4 w-4" />}
                    label="Languages & pets"
                    value={[...hydrated.languages, ...hydrated.pets].join(" · ") || "Add languages or pets"}
                  />
                  <DetailTile
                    icon={<Heart className="h-4 w-4" />}
                    label="Daily flow"
                    value={joinLifestyle(
                      [hydrated.sleepSchedule, hydrated.socialBattery, hydrated.cleanliness],
                      "Add sleep schedule, social battery, and cleanliness style",
                    )}
                  />
                  <DetailTile
                    icon={<MapPin className="h-4 w-4" />}
                    label="Weekends & travel"
                    value={joinLifestyle(
                      [hydrated.weekendStyle, hydrated.travelStyle, hydrated.diet],
                      "Add weekend style, travel style, and diet",
                    )}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {hydrated.coreValues.length > 0 ? hydrated.coreValues.map((value) => <Tag key={value} tone="emerald">{value}</Tag>) : <Tag>Core values missing</Tag>}
                  {hydrated.strengths.length > 0 ? hydrated.strengths.map((value) => <Tag key={value} tone="rose">{value}</Tag>) : null}
                </div>
              </SectionCard>

              <SectionCard
                eyebrow="Visibility"
                title="What stays public vs private"
                description="Privacy is healthy. Accidental invisibility is less sexy."
                action={
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72"
                    onClick={() => openEditor("visibility")}
                    type="button"
                  >
                    {hiddenCount > 0 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    Edit
                  </button>
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailTile
                    icon={<Eye className="h-4 w-4" />}
                    label="Discovery"
                    value={formatVisibility(hydrated.profileVisibility)}
                  />
                  <DetailTile
                    icon={<Lock className="h-4 w-4" />}
                    label="Field privacy"
                    value={
                      hiddenCount > 0
                        ? `${hiddenCount} field${hiddenCount === 1 ? "" : "s"} hidden from the public profile`
                        : "All core fields visible"
                    }
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Tag tone={hydrated.showAge ? "emerald" : "rose"}>
                    Age: {hydrated.showAge ? "Visible" : "Hidden"}
                  </Tag>
                  <Tag tone={hydrated.showCity ? "emerald" : "rose"}>
                    City: {hydrated.showCity ? "Visible" : "Hidden"}
                  </Tag>
                  <Tag tone={hydrated.showWork ? "emerald" : "rose"}>
                    Work: {hydrated.showWork ? "Visible" : "Hidden"}
                  </Tag>
                  <Tag tone={hydrated.showEducation ? "emerald" : "rose"}>
                    Education: {hydrated.showEducation ? "Visible" : "Hidden"}
                  </Tag>
                </div>
              </SectionCard>
            </>
          ) : null}

          {profileViewTab === "insights" ? (
            <SectionCard
              eyebrow="Maahi Read"
              title="Your deeper signal layer"
                description="The deeper pattern read. Not destiny, just the stuff that keeps repeating until you notice."
            >
              <div className="grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="flex items-center justify-center rounded-[28px] border border-white/8 bg-white/[0.03] p-4">
                  <RadarChart scores={scores} />
                </div>
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-[#d4688a]/16 bg-[#d4688a]/6 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f09cb6]">
                      Attachment profile
                    </p>
                    <p className="mt-3 text-xl font-semibold text-white">{hydrated.attachment}</p>
                  <p className="mt-2 text-[13px] leading-5 text-white/48">
                    {hydrated.attachment === "Secure" &&
                      "Emotionally available, grounded, and able to stay open without losing yourself."}
                      {hydrated.attachment === "Anxious" &&
                        "You care deeply. The work is trusting consistency without chasing it."}
                      {hydrated.attachment === "Avoidant" &&
                        "You protect yourself fast. The growth edge is making closeness feel safe."}
                      {hydrated.attachment === "Fearful-Avoidant" &&
                        "You want connection and safety at the same time. Both need attention."}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                        Strongest dimensions
                      </p>
                      <p className="text-sm font-medium text-white/65">{hydrated.readinessScore}% ready</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {topDimensions.map((dimension) => (
                        <div key={dimension.id}>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm text-white/72">{dimension.label}</span>
                            <span className="text-sm font-semibold" style={{ color: dimension.color }}>
                              {dimension.score}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${dimension.score}%`, background: dimension.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {(hydrated.offers.length > 0 || hydrated.needs.length > 0 || hydrated.growthAreas.length > 0) ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <DetailTile
                    icon={<Heart className="h-4 w-4" />}
                    label="What I bring"
                    value={hydrated.offers.join(" · ") || "Add what makes being with you valuable"}
                  />
                  <DetailTile
                    icon={<Shield className="h-4 w-4" />}
                    label="What I need"
                    value={hydrated.needs.join(" · ") || "Add what your partner needs to understand"}
                  />
                  <DetailTile
                    icon={<Sparkles className="h-4 w-4" />}
                    label="Growing toward"
                    value={hydrated.growthAreas.join(" · ") || "Add current growth edges"}
                  />
                </div>
              ) : null}

              {hydrated.coachingFocus ? (
                <div className="mt-5 rounded-[24px] border border-[#b48cff]/20 bg-[#b48cff]/8 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d8c8ff]">
                    Maahi&apos;s focus for you
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/74">&ldquo;{hydrated.coachingFocus}&rdquo;</p>
                </div>
              ) : null}
            </SectionCard>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="rounded-full border border-white/10 px-5 py-4 text-sm font-medium text-white/72"
              onClick={() => router.push("/onboarding")}
              type="button"
            >
              Redo soul discovery
            </button>
            <Button
              variant="ghost"
              className="h-auto rounded-full border border-[#d4688a]/20 bg-[#d4688a]/8 px-5 py-4 text-sm font-medium text-[#ef8cab] hover:bg-[#d4688a]/14 hover:text-[#f6a3bc]"
              onClick={() => void logout()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {editorOpen ? (
        <ProfileEditor
          userId={userId!}
          draft={draft}
          setDraft={setDraft}
          activeTab={editorTab}
          setActiveTab={setEditorTab}
          focusedTab={focusedEditorTab}
          open={editorOpen}
          onOpenChange={(next) => {
            setEditorOpen(next);
            if (!next) {
              setFocusedEditorTab(null);
            }
          }}
          onSave={handleSave}
          saving={isSaving}
          error={saveError}
        />
      ) : null}
      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} onUpgrade={() => { setSettingsOpen(false); setUpgradeOpen(true); }} />
      <UpgradeSheet open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
}
