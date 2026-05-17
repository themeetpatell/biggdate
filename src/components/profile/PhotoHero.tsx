"use client";

import { useRef, useState } from "react";
import {
  BadgeCheck,
  Camera,
  LogOut,
  MoreHorizontal,
  Settings2,
  Sparkles,
} from "lucide-react";
import { ZODIAC_EMOJI } from "@/lib/zodiac";
import { MAX_PHOTOS, formatIntent, type HydratedProfile } from "./helpers";

export function PhotoHero({
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
            <div className="relative h-20 w-20 shrink-0 rounded-[30px] border-[5px] border-[#0b0d16] shadow-[0_20px_40px_rgba(0,0,0,0.32)] sm:h-32 sm:w-32">
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
              <h1 className="inline-flex flex-wrap items-center gap-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-white sm:text-[2.45rem]">
                <span>
                  {profile.name}
                  {profile.showAge && profile.age ? `, ${profile.age}` : ""}
                </span>
                {profile.isVerified && (
                  <BadgeCheck className="h-7 w-7 shrink-0 text-[#1d9bf0] sm:h-9 sm:w-9" aria-label="Verified" />
                )}
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
