/**
 * Public runtime environment for the native app.
 *
 * Expo statically inlines `process.env.EXPO_PUBLIC_*` at build time, so each
 * value must be accessed as a direct member expression (do not destructure
 * `process.env`). Set these in `apps/mobile/.env` — see `.env.example`.
 */

declare const __DEV__: boolean;

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required env var: ${name}. Copy apps/mobile/.env.example to apps/mobile/.env and fill it in.`,
    );
  }
  return value;
}

function apiUrlValue(): string | null {
  const raw = process.env.EXPO_PUBLIC_API_URL;
  if (raw && raw.length > 0) return raw;
  if (!__DEV__) {
    throw new Error(
      'Missing required env var: EXPO_PUBLIC_API_URL. Production builds must point at a real backend.',
    );
  }
  return null;
}

export const env = {
  supabaseUrl: required('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: required(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
  /** Backend base URL. Defaults to localhost in dev when unset; required in production. */
  apiUrl: apiUrlValue(),
} as const;
