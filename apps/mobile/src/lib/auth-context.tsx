import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "./api";
import { queryClient } from "./query-client";
import { supabase } from "./supabase";

export interface SignUpInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export type SignUpResult =
  | { status: "authenticated" }
  | { status: "pending_confirmation"; message: string };

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
      })
      .catch(() => {
        // Keychain / SecureStore read can fail (locked device, corrupted
        // entry on Android). Treat as no session rather than spinning forever.
        if (!active) return;
        setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw new Error(error.message);
      },
      signUp: async (input) => {
        // Signup runs through the backend route — it creates the account
        // handle row and emits analytics that direct Supabase signUp skips.
        const result = await api.post<{
          status: SignUpResult["status"];
          message?: string;
        }>("/api/auth/signup", {
          email: input.email.trim().toLowerCase(),
          password: input.password,
          fullName: input.fullName.trim(),
          username: input.username.trim().toLowerCase(),
          phone: input.phone?.trim() || undefined,
        });
        if (result.status === "pending_confirmation") {
          return {
            status: "pending_confirmation",
            message:
              result.message ?? "Check your inbox to confirm your email, then sign in.",
          };
        }
        if (result.status !== "authenticated") {
          throw new Error(
            `Unexpected signup status from server: ${String(result.status)}`,
          );
        }
        // Account is live — obtain a native (token) session.
        const { error } = await supabase.auth.signInWithPassword({
          email: input.email.trim().toLowerCase(),
          password: input.password,
        });
        if (error) throw new Error(error.message);
        return { status: "authenticated" };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        // Drop cached profile, matches, messages, intros so the next user
        // on a shared device starts from a clean state.
        queryClient.clear();
      },
      requestPasswordReset: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
        );
        if (error) throw new Error(error.message);
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
