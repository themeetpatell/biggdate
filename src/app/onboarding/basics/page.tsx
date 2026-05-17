"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { LoadingScreen } from "@/components/loading-screen";
import { DateOfBirth } from "@/components/ui/date-of-birth";
import { trackOnboardingStart } from "@/lib/gtm";
import posthog from "posthog-js";

const GENDER_CHOICES = [
  "Woman", "Man", "Non-binary", "Trans woman", "Trans man", "Genderqueer",
] as const;

const PARTNER_GENDER_CHOICES = [
  { label: "Women", value: "Woman" },
  { label: "Men", value: "Man" },
  { label: "Non-binary people", value: "Non-binary" },
  { label: "Everyone", value: "Everyone" },
] as const;

// values mirror Profile.intent in src/lib/types.ts: serious|casual|marriage|exploring
const INTENT_CHOICES = [
  { label: "Just exploring", value: "exploring", hint: "Open to seeing what happens" },
  { label: "Casual but real", value: "casual", hint: "Not looking for marriage tomorrow" },
  { label: "Long-term partner", value: "serious", hint: "Building something serious" },
  { label: "Marriage timeline", value: "marriage", hint: "Aligned on commitment" },
] as const;

// Default country for the city dropdown. Pick a sensible Wave-1 geography
// here — expansion can hand the user a country picker before the city list.
const DEFAULT_COUNTRY_ISO2 = "IN";

export default function BasicsPage() {
  const router = useRouter();
  const { profile, loading: authLoading, refresh } = useAuth();

  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<string>("");
  const [partnerGender, setPartnerGender] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [intent, setIntent] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("@/lib/location-data").then((mod) => {
      if (cancelled) return;
      const cities = mod.getTier1Tier2CitiesForCountry(DEFAULT_COUNTRY_ISO2);
      setCityOptions(cities);
      setCitiesLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Anyone with the psych summary already done should never land here.
  // Anyone with just basics already saved should be sent to the chat.
  useEffect(() => {
    if (authLoading) return;
    if (!profile) return;
    if (profile.summary) {
      router.replace("/soul-snapshot");
      return;
    }
    if (profile.birthday && profile.gender && profile.partnerGender && profile.city && profile.intent) {
      router.replace("/onboarding");
    }
  }, [authLoading, profile, router]);

  useEffect(() => {
    if (authLoading) return;
    trackOnboardingStart();
  }, [authLoading]);

  const canSubmit = useMemo(() => {
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(birthday) &&
      Boolean(gender) &&
      Boolean(partnerGender) &&
      Boolean(city) &&
      Boolean(intent) &&
      !submitting
    );
  }, [birthday, gender, partnerGender, city, intent, submitting]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/basics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthday, gender, partnerGender, city, intent }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Could not save. Try again.");
        setSubmitting(false);
        return;
      }
      // No client-side phase tracker here — the server fires
      // `onboarding_phase1_complete` via trackFirst inside the route.
      posthog.capture("onboarding_basics_submitted", { gender, partner_gender: partnerGender, city, intent });
      await refresh();
      router.replace("/onboarding");
    } catch {
      setError("Network hiccup. Try again.");
      setSubmitting(false);
    }
  };

  if (authLoading) return <LoadingScreen message="Loading…" />;

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--bd-bg)",
        color: "var(--bd-text)",
        padding: "32px 20px 120px",
      }}
    >
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--bd-text-muted)",
            margin: 0,
          }}
        >
          The basics · 1 of 2
        </p>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "8px 0 6px",
            color: "var(--bd-text)",
          }}
        >
          Five quick taps and you&apos;re in.
        </h1>
        <p style={{ fontSize: 14, color: "var(--bd-text-muted)", margin: "0 0 28px", lineHeight: 1.55 }}>
          Maahi needs five facts before she can read your story. The deeper
          questions come next — and only after you&apos;ve seen what we&apos;re building.
        </p>

        <Section label="Your date of birth" hint="18+ only.">
          <DateOfBirth
            value={birthday}
            onChange={(next) => setBirthday(next ?? "")}
          />
        </Section>

        <Section label="I am" hint="Pick the one that fits.">
          <ChipGrid options={GENDER_CHOICES.map((g) => ({ label: g, value: g }))} value={gender} onChange={setGender} />
        </Section>

        <Section label="I'd like to meet" hint="You can change this later.">
          <ChipGrid options={[...PARTNER_GENDER_CHOICES]} value={partnerGender} onChange={setPartnerGender} />
        </Section>

        <Section label="Your city" hint="Used for distance and matchmaking.">
          {citiesLoaded ? (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 16,
                background: "var(--bd-surface)",
                border: "1px solid var(--bd-border)",
                color: "var(--bd-text)",
                padding: "0 16px",
                fontSize: 15,
              }}
            >
              <option value="">Select your city</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <div style={{ height: 52, borderRadius: 16, background: "var(--bd-surface)" }} />
          )}
        </Section>

        <Section label="What you're here for" hint="Pick the one closest to your real answer.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INTENT_CHOICES.map((c) => {
              const selected = intent === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setIntent(c.value)}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: 16,
                    background: selected ? "rgba(168,85,247,0.14)" : "var(--bd-surface)",
                    border: `1px solid ${selected ? "rgba(168,85,247,0.45)" : "var(--bd-border)"}`,
                    color: "var(--bd-text)",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{c.label}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--bd-text-muted)" }}>{c.hint}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {error && (
          <div
            role="alert"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(219,39,119,0.1)",
              border: "1px solid rgba(219,39,119,0.3)",
              color: "var(--bd-pink)",
              fontSize: 13,
              marginTop: 12,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            marginTop: 24,
            width: "100%",
            height: 52,
            borderRadius: 999,
            border: "none",
            cursor: canSubmit ? "pointer" : "default",
            background: canSubmit
              ? "linear-gradient(135deg, #eb987f 0%, #d8698c 42%, #6d58ff 100%)"
              : "rgba(255,255,255,0.06)",
            color: canSubmit ? "#fff" : "var(--bd-text-faint)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {submitting ? "Saving…" : "Continue to the deeper stuff"}
        </button>

        <p style={{ marginTop: 14, fontSize: 12, color: "var(--bd-text-faint)", textAlign: "center" }}>
          About 5 more questions after this — that&apos;s where Maahi gets to know you.
        </p>
      </div>
    </main>
  );
}

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--bd-text)", margin: "0 0 4px" }}>
        {label}
      </p>
      {hint && (
        <p style={{ fontSize: 12, color: "var(--bd-text-muted)", margin: "0 0 10px" }}>{hint}</p>
      )}
      {children}
    </section>
  );
}

function ChipGrid({
  options,
  value,
  onChange,
}: {
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: selected ? "rgba(168,85,247,0.14)" : "var(--bd-surface)",
              border: `1px solid ${selected ? "rgba(168,85,247,0.45)" : "var(--bd-border)"}`,
              color: "var(--bd-text)",
              fontSize: 14,
              fontWeight: selected ? 600 : 500,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
