/**
 * Client-side photo compression using Canvas. Resizes to maxDimension on the
 * longer edge and re-encodes as JPEG at the given quality. Photos out of
 * modern phone cameras are typically 4–12MB; we target ~300–800KB which is
 * still high-quality at the displayed sizes (≤512px in our UI).
 *
 * Why this matters: smaller uploads = faster perceived perf, less Supabase
 * storage cost, faster Sightengine moderation roundtrip, less mobile data.
 */

interface CompressOptions {
  maxDimension?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxDimension: 1600,
  quality: 0.82,
  mimeType: "image/jpeg",
};

export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<File> {
  // Skip compression for non-image inputs and tiny files (already small).
  if (!file.type.startsWith("image/")) return file;
  if (file.size < 200 * 1024) return file;

  const opts = { ...DEFAULT_OPTIONS, ...options };

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Some images (HEIC on older browsers) can't be decoded — pass through
    // and let the server handle it.
    return file;
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, opts.maxDimension / Math.max(width, height));
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(targetWidth, targetHeight)
      : Object.assign(document.createElement("canvas"), {
          width: targetWidth,
          height: targetHeight,
        });

  const ctx = (canvas as HTMLCanvasElement | OffscreenCanvas).getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  (ctx as CanvasRenderingContext2D).drawImage(
    bitmap,
    0,
    0,
    targetWidth,
    targetHeight,
  );
  bitmap.close();

  const blob: Blob | null = await (canvas instanceof OffscreenCanvas
    ? canvas.convertToBlob({ type: opts.mimeType, quality: opts.quality })
    : new Promise<Blob | null>((resolve) =>
        (canvas as HTMLCanvasElement).toBlob(
          (b) => resolve(b),
          opts.mimeType,
          opts.quality,
        ),
      ));

  if (!blob) return file;

  // If compression made the file larger (rare, e.g. PNG → JPEG of a flat
  // graphic), keep the original.
  if (blob.size >= file.size) return file;

  const newName = file.name.replace(/\.\w+$/, ".jpg");
  return new File([blob], newName, { type: opts.mimeType, lastModified: Date.now() });
}
