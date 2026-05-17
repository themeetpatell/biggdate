import "react-native-url-polyfill/auto";

import { createClient, type SupportedStorage } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState, type NativeEventSubscription } from "react-native";

import { env } from "./env";

/**
 * Token storage backed by the device keychain / encrypted store.
 *
 * Note: `expo-secure-store` warns above ~2KB per value. Supabase stores the
 * whole session under one key; if Android testing shows truncation, upgrade
 * this to a chunked or AES-wrapped store. iOS keychain handles current sizes.
 */
const secureStorage: SupportedStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based session detection on native — auth is token-based.
    detectSessionInUrl: false,
  },
});

/**
 * Supabase only refreshes tokens while the app is foregrounded. Pause the
 * refresh loop in the background and resume it on return. Exposing the
 * subscription lets the root layout tear it down on unmount (mostly relevant
 * for tests and Fast Refresh — the listener would otherwise stack up).
 */
let appStateSubscription: NativeEventSubscription | null = AppState.addEventListener(
  "change",
  (state) => {
    if (state === "active") {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  },
);

export function teardownSupabaseAppStateListener(): void {
  appStateSubscription?.remove();
  appStateSubscription = null;
}
