import { resolveApiBaseUrl } from '@biggdate/shared';
import * as ImageManipulator from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';

import { env } from './env';
import { supabase } from './supabase';

const baseUrl = resolveApiBaseUrl(env.apiUrl);

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'] as const;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB hard cap before upload
const MAX_DIMENSION_PX = 1200; // Longest edge after resize
const COMPRESSED_QUALITY = 0.85;

type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

interface PhotoFormPart {
  uri: string;
  name: string;
  type: AllowedMimeType;
}

interface PreparedPhoto {
  uri: string;
  mime: AllowedMimeType;
  name: string;
}

function safeParse(text: string): Record<string, unknown> {
  try {
    const value = JSON.parse(text);
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function pickMimeType(asset: ImagePickerAsset): AllowedMimeType {
  const candidate = (asset.mimeType ?? 'image/jpeg').toLowerCase();
  if ((ALLOWED_MIME_TYPES as readonly string[]).includes(candidate)) {
    return candidate as AllowedMimeType;
  }
  throw new Error(
    'That image format is not supported. Use JPEG, PNG, WEBP, or HEIC.',
  );
}

function fileNameFor(asset: ImagePickerAsset, mime: AllowedMimeType): string {
  if (asset.fileName) return asset.fileName;
  const ext = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1];
  return `photo-${Date.now()}.${ext}`;
}

/**
 * Resize and re-encode a picked image so the upload payload stays small
 * and the JS thread isn't blocked by encoding a multi-MB original. HEIC
 * is converted to JPEG since servers and CDNs don't universally support
 * it. Returns the new on-device URI plus the effective mime/name.
 */
export async function prepareImageForUpload(
  asset: ImagePickerAsset,
): Promise<PreparedPhoto> {
  if (typeof asset.fileSize === 'number' && asset.fileSize > MAX_PHOTO_BYTES) {
    throw new Error('That photo is too large. Pick one under 10 MB.');
  }

  const sourceMime = pickMimeType(asset);
  const needsResize =
    (asset.width ?? 0) > MAX_DIMENSION_PX || (asset.height ?? 0) > MAX_DIMENSION_PX;
  const heicNeedsConvert = sourceMime === 'image/heic';

  if (!needsResize && !heicNeedsConvert) {
    // Skip the manipulator round-trip when the original is already a
    // safe size and format.
    return { uri: asset.uri, mime: sourceMime, name: fileNameFor(asset, sourceMime) };
  }

  // Calculate resize so the longest edge is at most MAX_DIMENSION_PX.
  const width = asset.width ?? 0;
  const height = asset.height ?? 0;
  const resizeAction =
    width >= height
      ? { resize: { width: Math.min(width || MAX_DIMENSION_PX, MAX_DIMENSION_PX) } }
      : { resize: { height: Math.min(height || MAX_DIMENSION_PX, MAX_DIMENSION_PX) } };

  // HEIC is always emitted as JPEG; PNG keeps PNG; everything else → JPEG.
  const targetMime: AllowedMimeType =
    sourceMime === 'image/png' ? 'image/png' : 'image/jpeg';
  const format =
    targetMime === 'image/png'
      ? ImageManipulator.SaveFormat.PNG
      : ImageManipulator.SaveFormat.JPEG;

  const result = await ImageManipulator.manipulateAsync(
    asset.uri,
    [resizeAction],
    { compress: COMPRESSED_QUALITY, format },
  );

  return {
    uri: result.uri,
    mime: targetMime,
    name: fileNameFor({ ...asset, fileName: undefined }, targetMime),
  };
}

/**
 * Uploads a picked image to `POST /api/profile/upload-photo` as multipart
 * form data and returns the public photo URL. The image is resized and
 * recompressed first so we never push the full-resolution original over
 * the wire. The backend moderates the image before it reaches storage,
 * so a rejected photo throws.
 */
export async function uploadProfilePhoto(asset: ImagePickerAsset): Promise<string> {
  const prepared = await prepareImageForUpload(asset);

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('Your session expired. Sign in again.');
  }

  const part: PhotoFormPart = { uri: prepared.uri, name: prepared.name, type: prepared.mime };
  const formData = new FormData();
  // React Native's FormData accepts `{ uri, name, type }` parts, but the DOM
  // typing requires Blob | string. Cast through the local typed shape rather
  // than `unknown`.
  formData.append('photo', part as unknown as Blob);

  // No explicit Content-Type — the runtime sets the multipart boundary.
  const response = await fetch(`${baseUrl}/api/profile/upload-photo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const payload = safeParse(await response.text());
  if (!response.ok) {
    const message = typeof payload.error === 'string' ? payload.error : 'Photo upload failed.';
    throw new Error(message);
  }
  if (typeof payload.photoUrl !== 'string') {
    throw new Error('Upload did not return a photo URL.');
  }
  return payload.photoUrl;
}
