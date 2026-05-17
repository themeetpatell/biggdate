"use client";

import { Camera } from "lucide-react";
import type { HydratedProfile } from "@/components/profile/helpers";

interface ProfileGallerySectionProps {
  draft: HydratedProfile;
  uploadError: string | null;
  uploadingPhotoIndex: number | null;
  // Replace photo at slot index. Pass "" to clear the slot.
  setPhotoAtIndex: (index: number, value: string) => void;
  // Upload a file into the slot. Caller handles compression + storage + the
  // moderation roundtrip; this section just hands off the File.
  handlePhotoUpload: (index: number, file: File | null) => void;
}

export function ProfileGallerySection({
  draft,
  uploadError,
  uploadingPhotoIndex,
  setPhotoAtIndex,
  handlePhotoUpload,
}: ProfileGallerySectionProps) {
  return (
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
                handlePhotoUpload(0, file);
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
                    handlePhotoUpload(index, file);
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
  );
}
