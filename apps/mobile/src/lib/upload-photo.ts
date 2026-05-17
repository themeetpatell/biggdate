import { resolveApiBaseUrl } from '@biggdate/shared';
import type { ImagePickerAsset } from 'expo-image-picker';

import { env } from './env';
import { supabase } from './supabase';

const baseUrl = resolveApiBaseUrl(env.apiUrl);

function safeParse(text: string): Record<string, unknown> {
  try {
    const value = JSON.parse(text);
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Uploads a picked image to `POST /api/profile/upload-photo` as multipart
 * form data and returns the public photo URL. The backend moderates the
 * image before it reaches storage, so a rejected photo throws.
 */
export async function uploadProfilePhoto(asset: ImagePickerAsset): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('Your session expired. Sign in again.');
  }

  const formData = new FormData();
  formData.append('photo', {
    uri: asset.uri,
    name: asset.fileName ?? `photo-${Date.now()}.jpg`,
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);

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
