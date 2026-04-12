"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";

interface AuthState {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  hydrateProfile: (profile: Profile) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  userId: null,
  profile: null,
  loading: true,
  refresh: async () => {},
  hydrateProfile: () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Routes that don't require auth
const PUBLIC_ROUTES = ["/", "/auth", "/about", "/contact"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAuthState = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return {
          userId: data.userId,
          profile: data.profile || null,
        };
      }
      return { userId: null, profile: null };
    } catch {
      return { userId: null, profile: null };
    }
  }, []);

  const refresh = useCallback(async () => {
    const nextState = await loadAuthState();
    setUserId(nextState.userId);
    setProfile(nextState.profile);
    setLoading(false);
  }, [loadAuthState]);

  const hydrateProfile = useCallback((nextProfile: Profile) => {
    setProfile(nextProfile);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserId(null);
    setProfile(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      const nextState = await loadAuthState();
      if (cancelled) return;
      setUserId(nextState.userId);
      setProfile(nextState.profile);
      setLoading(false);
    }

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [loadAuthState]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (loading) return;
    if (userId && pathname === "/auth") {
      router.replace(profile ? "/dashboard" : "/onboarding");
      return;
    }

    const isPublic = PUBLIC_ROUTES.some(
      (r) => r === "/" ? pathname === "/" : pathname === r || pathname.startsWith(r + "/"),
    );
    if (!userId && !isPublic && !pathname.startsWith("/api/")) {
      router.replace("/auth");
    }
  }, [userId, profile, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ userId, profile, loading, refresh, hydrateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
