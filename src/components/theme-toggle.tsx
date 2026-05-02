"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  variant?: "icon" | "segment";
  className?: string;
}

const THEMES = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

type ThemeValue = (typeof THEMES)[number]["value"];

const noopSubscribe = () => () => {};

// Hydration-safe mounted flag — false during SSR, true after hydration.
// Avoids setState-in-effect while preserving the no-flash render.
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ThemeToggle({
  variant = "icon",
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  if (variant === "segment") {
    return (
      <div
        role="radiogroup"
        aria-label="Color theme"
        className={`inline-flex items-center gap-1 rounded-full p-1 ${className}`}
        style={{
          background: "var(--bd-surface)",
          border: "1px solid var(--bd-border)",
        }}
      >
        {THEMES.map(({ value, label, Icon }) => {
          const active = mounted && theme === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setTheme(value)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: active ? "var(--bd-accent-soft)" : "transparent",
                color: active ? "var(--bd-accent)" : "var(--bd-text-muted)",
              }}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // Icon button — cycles light → dark → system
  const next: ThemeValue =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const ActiveIcon =
    !mounted || theme === "system"
      ? Monitor
      : (resolvedTheme ?? theme) === "dark"
        ? Moon
        : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={
        mounted
          ? `Theme: ${theme === "system" ? `system (${resolvedTheme})` : theme}`
          : "Theme"
      }
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${className}`}
      style={{
        background: "var(--bd-surface)",
        border: "1px solid var(--bd-border)",
        color: "var(--bd-text-muted)",
      }}
      suppressHydrationWarning
    >
      <ActiveIcon className="size-4" aria-hidden />
    </button>
  );
}
