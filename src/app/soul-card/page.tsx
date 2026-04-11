"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import { Button } from "@/components/ui/button";

export default function SoulCardPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !profile) router.push("/onboarding");
  }, [profile, authLoading, router]);

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      // Use html2canvas-like approach via canvas API
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, "#0A0A0F");
      gradient.addColorStop(0.5, "#111118");
      gradient.addColorStop(1, "#0A0A0F");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Accent orb
      const orbGrad = ctx.createRadialGradient(200, 300, 0, 200, 300, 400);
      orbGrad.addColorStop(0, "rgba(180,140,255,0.15)");
      orbGrad.addColorStop(1, "transparent");
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Text
      ctx.textAlign = "center";
      ctx.fillStyle = "#B48CFF";
      ctx.font = "bold 36px -apple-system, system-ui, sans-serif";
      ctx.fillText("BiggDate", 540, 200);

      ctx.fillStyle = "#F0EEF8";
      ctx.font = "bold 72px -apple-system, system-ui, sans-serif";
      ctx.fillText(profile!.name || "", 540, 500);

      const zodiacEmoji = profile!.zodiac ? ZODIAC_EMOJI[profile!.zodiac] || "" : "";
      ctx.font = "48px -apple-system, system-ui, sans-serif";
      ctx.fillText(`${zodiacEmoji} ${profile!.zodiac || ""}`, 540, 600);

      ctx.fillStyle = "#8A87A0";
      ctx.font = "32px -apple-system, system-ui, sans-serif";
      ctx.fillText(`${profile!.attachment} Attachment`, 540, 720);
      ctx.fillText(`${profile!.city || ""}`, 540, 780);

      // Readiness ring (simplified)
      ctx.fillStyle = "#B48CFF";
      ctx.font = "bold 120px -apple-system, system-ui, sans-serif";
      ctx.fillText(`${profile!.readinessScore}`, 540, 1050);
      ctx.fillStyle = "#8A87A0";
      ctx.font = "24px -apple-system, system-ui, sans-serif";
      ctx.fillText("READINESS SCORE", 540, 1100);

      // Values
      ctx.fillStyle = "#B48CFF";
      ctx.font = "28px -apple-system, system-ui, sans-serif";
      ctx.fillText((profile!.coreValues || []).join("  ·  "), 540, 1300);

      // Strengths
      ctx.fillStyle = "#4FFFB0";
      ctx.fillText((profile!.strengths || []).join("  ·  "), 540, 1380);

      // CTA
      ctx.fillStyle = "#4A4760";
      ctx.font = "24px -apple-system, system-ui, sans-serif";
      ctx.fillText("Discover your soul at biggdate.com", 540, 1700);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (blob && navigator.share) {
        const file = new File([blob], "soul-card.png", { type: "image/png" });
        await navigator.share({ files: [file], title: `${profile!.name}'s Soul Card` });
      } else if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "soul-card.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // silent
    }
  };

  if (authLoading || !profile) return null;

  const zodiacEmoji = profile.zodiac ? ZODIAC_EMOJI[profile.zodiac] || "" : "";
  const readiness = profile.readinessScore || 0;
  const readinessColor =
    readiness >= 70 ? "var(--bd-green)" : readiness >= 40 ? "var(--bd-gold)" : "var(--bd-rose)";

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 max-w-md mx-auto px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="text-[var(--bd-text-muted)] mb-6"
        >
          ← Dashboard
        </Button>

        {/* Soul Card Preview */}
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden border page-enter"
          style={{
            background: "linear-gradient(135deg, var(--bd-bg), var(--bd-surface), var(--bd-bg))",
            borderColor: "var(--bd-border-glow)",
            aspectRatio: "9/16",
          }}
        >
          <div className="relative h-full flex flex-col items-center justify-between py-10 px-6">
            {/* Orb */}
            <div
              className="absolute top-10 left-10 w-40 h-40 rounded-full blur-[80px] opacity-20"
              style={{ background: "var(--bd-accent)" }}
            />

            {/* Logo */}
            <span className="text-sm font-bold tracking-wider" style={{ color: "var(--bd-accent)" }}>
              BiggDate
            </span>

            {/* Profile */}
            <div className="text-center flex-1 flex flex-col items-center justify-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "var(--bd-surface)", border: "2px solid var(--bd-accent)" }}
              >
                {zodiacEmoji || profile.name?.[0]?.toUpperCase() || "?"}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-xs mt-1" style={{ color: "var(--bd-text-muted)" }}>
                  {profile.zodiac && `${zodiacEmoji} ${profile.zodiac} · `}
                  {profile.attachment}
                </p>
              </div>

              {/* Readiness */}
              <div className="text-center">
                <div className="text-4xl font-bold" style={{ color: readinessColor }}>
                  {readiness}
                </div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--bd-text-faint)" }}>
                  Readiness Score
                </div>
              </div>

              {/* Values */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
                {(profile.coreValues || []).map((v) => (
                  <span
                    key={v}
                    className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: "var(--bd-accent-soft)", color: "var(--bd-accent)" }}
                  >
                    {v}
                  </span>
                ))}
              </div>

              {/* Strengths */}
              <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
                {(profile.strengths || []).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(79,255,176,0.1)", color: "var(--bd-green)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <p className="text-[10px]" style={{ color: "var(--bd-text-faint)" }}>
              Discover your soul at biggdate.com
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={handleShare}
            className="flex-1 bg-[var(--bd-accent)] text-black font-bold rounded-xl"
          >
            Share Soul Card
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="flex-1 rounded-xl border-[var(--bd-border)] text-[var(--bd-text-muted)]"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
