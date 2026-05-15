import { log } from "./log";

/**
 * Photo moderation via Sightengine.
 *
 * Activates when SIGHTENGINE_USER and SIGHTENGINE_SECRET are set. Without
 * keys, returns `safe` with `provider: null` and emits a warning — useful
 * for local dev where moderation isn't critical.
 *
 * Sightengine docs: https://sightengine.com/docs/nudity-detection-api
 */

export type ModerationVerdict = "safe" | "flagged";

export interface ModerationResult {
  verdict: ModerationVerdict;
  reason: string | null;
  scores: Record<string, number> | null;
  provider: "sightengine" | null;
}

const NUDITY_THRESHOLD = 0.6;
const VIOLENCE_THRESHOLD = 0.6;
const WEAPON_THRESHOLD = 0.6;
const MINOR_THRESHOLD = 0.5;

// Fail-closed verdict for Sightengine outages. Returned as `flagged` so the
// existing upload handler short-circuits on `verdict !== "safe"`. The reason
// string ("moderation_unavailable") is distinguishable in the photo_moderation
// audit log, letting ops re-review these uploads when the provider recovers.
const MODERATION_UNAVAILABLE: ModerationResult = {
  verdict: "flagged",
  reason: "moderation_unavailable",
  scores: null,
  provider: null,
};

interface SightengineResponse {
  status?: string;
  error?: { message?: string };
  nudity?: {
    sexual_activity?: number;
    sexual_display?: number;
    erotica?: number;
    raw?: number;
    partial?: number;
  };
  weapon?: { classes?: { firearm?: number; knife?: number } };
  violence?: { prob?: number };
  minor?: { prob?: number };
  faces?: Array<{ minor?: { prob?: number } }>;
}

export async function moderatePhoto(photoUrl: string): Promise<ModerationResult> {
  const user = process.env.SIGHTENGINE_USER;
  const secret = process.env.SIGHTENGINE_SECRET;

  if (!user || !secret) {
    log.warn("photo moderation skipped — SIGHTENGINE_USER/SECRET not configured", {
      photoUrl,
    });
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }

  try {
    const params = new URLSearchParams({
      url: photoUrl,
      models: "nudity-2.1,weapon,violence,offensive,minor",
      api_user: user,
      api_secret: secret,
    });
    const res = await fetch(`https://api.sightengine.com/1.0/check.json?${params}`);
    const data = (await res.json()) as SightengineResponse;

    if (!res.ok || data.status !== "success") {
      const message = data.error?.message || `HTTP ${res.status}`;
      log.warn("sightengine call failed — failing closed", { error: message, photoUrl });
      return MODERATION_UNAVAILABLE;
    }

    const scores = {
      sexual_activity: data.nudity?.sexual_activity ?? 0,
      sexual_display: data.nudity?.sexual_display ?? 0,
      erotica: data.nudity?.erotica ?? 0,
      nudity_raw: data.nudity?.raw ?? 0,
      nudity_partial: data.nudity?.partial ?? 0,
      firearm: data.weapon?.classes?.firearm ?? 0,
      knife: data.weapon?.classes?.knife ?? 0,
      violence: data.violence?.prob ?? 0,
      minor:
        data.minor?.prob ??
        Math.max(0, ...(data.faces?.map((f) => f.minor?.prob ?? 0) ?? [])),
    };

    const reasons: string[] = [];
    if (scores.sexual_activity >= NUDITY_THRESHOLD) reasons.push("sexual content");
    if (scores.sexual_display >= NUDITY_THRESHOLD) reasons.push("explicit nudity");
    if (scores.nudity_raw >= NUDITY_THRESHOLD) reasons.push("raw nudity");
    if (scores.firearm >= WEAPON_THRESHOLD) reasons.push("firearm");
    if (scores.knife >= WEAPON_THRESHOLD) reasons.push("knife");
    if (scores.violence >= VIOLENCE_THRESHOLD) reasons.push("violence");
    if (scores.minor >= MINOR_THRESHOLD) reasons.push("possible minor");

    if (reasons.length > 0) {
      return {
        verdict: "flagged",
        reason: reasons.join(", "),
        scores,
        provider: "sightengine",
      };
    }

    return { verdict: "safe", reason: null, scores, provider: "sightengine" };
  } catch (err) {
    // Fail closed — when we cannot moderate, we cannot let unverified content
    // into storage. Users see a transient "try again" error; ops can clear the
    // queue once the provider recovers.
    log.warn("sightengine threw — failing closed", {
      error: err instanceof Error ? err.message : String(err),
      photoUrl,
    });
    return MODERATION_UNAVAILABLE;
  }
}

export async function moderatePhotoBuffer(
  buffer: Uint8Array,
  mimeType: string,
): Promise<ModerationResult> {
  const user = process.env.SIGHTENGINE_USER;
  const secret = process.env.SIGHTENGINE_SECRET;

  if (!user || !secret) {
    log.warn("photo moderation skipped — SIGHTENGINE_USER/SECRET not configured");
    return { verdict: "safe", reason: null, scores: null, provider: null };
  }

  try {
    const form = new FormData();
    form.append("media", new Blob([buffer.buffer as ArrayBuffer], { type: mimeType }), "photo");
    form.append("models", "nudity-2.1,weapon,violence,offensive,minor");
    form.append("api_user", user);
    form.append("api_secret", secret);

    const res = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: form,
    });
    const data = (await res.json()) as SightengineResponse;

    if (!res.ok || data.status !== "success") {
      const message = data.error?.message || `HTTP ${res.status}`;
      log.warn("sightengine binary call failed — failing closed", { error: message });
      return MODERATION_UNAVAILABLE;
    }

    const scores = {
      sexual_activity: data.nudity?.sexual_activity ?? 0,
      sexual_display: data.nudity?.sexual_display ?? 0,
      erotica: data.nudity?.erotica ?? 0,
      nudity_raw: data.nudity?.raw ?? 0,
      nudity_partial: data.nudity?.partial ?? 0,
      firearm: data.weapon?.classes?.firearm ?? 0,
      knife: data.weapon?.classes?.knife ?? 0,
      violence: data.violence?.prob ?? 0,
      minor:
        data.minor?.prob ??
        Math.max(0, ...(data.faces?.map((f) => f.minor?.prob ?? 0) ?? [])),
    };

    const reasons: string[] = [];
    if (scores.sexual_activity >= NUDITY_THRESHOLD) reasons.push("sexual content");
    if (scores.sexual_display >= NUDITY_THRESHOLD) reasons.push("explicit nudity");
    if (scores.nudity_raw >= NUDITY_THRESHOLD) reasons.push("raw nudity");
    if (scores.firearm >= WEAPON_THRESHOLD) reasons.push("firearm");
    if (scores.knife >= WEAPON_THRESHOLD) reasons.push("knife");
    if (scores.violence >= VIOLENCE_THRESHOLD) reasons.push("violence");
    if (scores.minor >= MINOR_THRESHOLD) reasons.push("possible minor");

    if (reasons.length > 0) {
      return { verdict: "flagged", reason: reasons.join(", "), scores, provider: "sightengine" };
    }

    return { verdict: "safe", reason: null, scores, provider: "sightengine" };
  } catch (err) {
    log.warn("sightengine binary threw — failing closed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return MODERATION_UNAVAILABLE;
  }
}
