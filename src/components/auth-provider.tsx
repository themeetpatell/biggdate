"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";

interface AuthState {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  userId: null,
  profile: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Routes that don't require auth
const PUBLIC_ROUTES = ["/", "/auth"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUserId(data.userId);
        setProfile(data.profile || null);
      } else {
        setUserId(null);
        setProfile(null);
      }
    } catch {
      setUserId(null);
      setProfile(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserId(null);
    setProfile(null);
    router.push("/");
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(r + "/"),
    );
    if (!userId && !isPublic) {
      router.push("/auth");
    }
  }, [userId, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ userId, profile, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
