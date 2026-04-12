"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight, Mail, Lock, Eye, Shield, Trash2,
  ExternalLink, X, Heart, MessageCircle, CalendarDays, Sparkles,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth-provider";

type NotificationSettings = {
  newMatch: boolean;
  message: boolean;
  dailyMatch: boolean;
  maahiCheckIn: boolean;
};

const NOTIF_KEY = "biggdate_notifications";

/* ─── Primitives ─── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 mt-5 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-3 rounded-xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.06]">
      {children}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  sublabel,
  right,
  onClick,
  danger,
}: {
  icon?: React.ElementType;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const cls = [
    "flex w-full items-center gap-3 px-4 py-3 text-left",
    onClick ? "cursor-pointer transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]" : "cursor-default",
    danger ? "text-[#ef8cab]" : "text-white/80",
  ].join(" ");

  const content = (
    <>
      {Icon && (
        <span className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          danger ? "bg-[#d4688a]/12" : "bg-white/[0.08]",
        ].join(" ")}>
          <Icon className={["h-3.5 w-3.5", danger ? "text-[#ef8cab]" : "text-white/50"].join(" ")} />
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-medium leading-5">{label}</span>
        {sublabel && (
          <span className="block text-[11px] text-white/35 mt-0.5 leading-[1.4]">{sublabel}</span>
        )}
      </span>
      {right !== undefined
        ? right
        : onClick && !danger
          ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />
          : null}
    </>
  );

  if (onClick) {
    return <button type="button" onClick={onClick} className={cls}>{content}</button>;
  }
  return <div className={cls}>{content}</div>;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  // Use a div to avoid nesting issues when Row renders as <button>.
  // Knob uses margin-based movement — no absolute positioning that can be clipped.
  return (
    <div
      role="switch"
      aria-checked={value}
      onClick={(e) => { e.stopPropagation(); onChange(!value); }}
      className={[
        "flex shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200",
        value ? "bg-[#d4688a]" : "bg-white/[0.18]",
      ].join(" ")}
      style={{ width: 38, height: 22 }}
    >
      <div
        className="h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: value ? "translateX(16px)" : "translateX(0)" }}
      />
    </div>
  );
}

function VisibilitySelector({
  value,
  onChange,
}: {
  value: "visible" | "paused" | "hidden";
  onChange: (v: "visible" | "paused" | "hidden") => void;
}) {
  const opts: { key: "visible" | "paused" | "hidden"; label: string }[] = [
    { key: "visible", label: "Visible" },
    { key: "paused", label: "Paused" },
    { key: "hidden", label: "Hidden" },
  ];
  return (
    <div className="flex gap-1 rounded-xl bg-white/[0.06] p-1 mt-2.5">
      {opts.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={[
            "flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors",
            value === opt.key ? "bg-white/15 text-white" : "text-white/35 hover:text-white/55",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Main ─── */

export function SettingsDrawer({
  open,
  onOpenChange,
  onUpgrade,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
}) {
  const router = useRouter();
  const { profile, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newMatch: true,
    message: true,
    dailyMatch: true,
    maahiCheckIn: false,
  });
  const [visibility, setVisibility] = useState<"visible" | "paused" | "hidden">(
    profile?.profileVisibility ?? "visible"
  );
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d: { email?: string }) => setEmail(d.email ?? ""))
      .catch(() => {});
    try {
      const stored = localStorage.getItem(NOTIF_KEY);
      if (stored) setNotifications(JSON.parse(stored) as NotificationSettings);
    } catch { /* ignore */ }
  }, [open]);

  useEffect(() => {
    setVisibility(profile?.profileVisibility ?? "visible");
  }, [profile?.profileVisibility]);

  const setNotif = useCallback((key: keyof NotificationSettings, v: boolean) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: v };
      try { localStorage.setItem(NOTIF_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const saveVisibility = useCallback(async (next: "visible" | "paused" | "hidden") => {
    setVisibility(next);
    setSavingVisibility(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileVisibility: next }),
      });
      await refresh();
    } finally {
      setSavingVisibility(false);
    }
  }, [refresh]);

  const handlePasswordReset = useCallback(async () => {
    if (!email || sendingReset || resetSent) return;
    setSendingReset(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResetSent(true);
    } finally {
      setSendingReset(false);
    }
  }, [email, sendingReset, resetSent]);

  const handleDeleteAccount = useCallback(async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/auth/delete", { method: "DELETE" });
      if (res.ok) router.push("/");
    } finally {
      setDeleting(false);
    }
  }, [router]);

  const handleManageBilling = useCallback(() => {
    onOpenChange(false);
    onUpgrade?.();
  }, [onOpenChange, onUpgrade]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/*
        SheetContent base CSS has: flex flex-col gap-4 overflow-hidden
        We override gap with gap-0 and let the inner scroll div handle overflow.
        This prevents cards from being clipped.
      */}
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-[320px] gap-0 border-l border-white/8 bg-[#0d0f1c] p-0"
      >
        {/* Header — shrinks to its natural height, stays at top */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/8 px-4 py-4">
          <h2 className="text-[15px] font-semibold text-white tracking-tight">Settings</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-white/50 transition hover:bg-white/12"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable body — takes all remaining height */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-10">

          {/* Account */}
          <Label>Account</Label>
          <Card>
            <Row icon={Mail} label={email || "—"} sublabel="Email address" />
            <Row
              icon={Lock}
              label={resetSent ? "Reset link sent ✓" : sendingReset ? "Sending…" : "Change password"}
              sublabel="We'll send a reset link to your email"
              onClick={resetSent ? undefined : handlePasswordReset}
            />
          </Card>

          {/* Notifications */}
          <Label>Notifications</Label>
          <Card>
            <Row
              icon={Heart}
              label="New match"
              sublabel="When someone new is ready for you"
              right={<Toggle value={notifications.newMatch} onChange={(v) => setNotif("newMatch", v)} />}
            />
            <Row
              icon={MessageCircle}
              label="Message received"
              sublabel="When a connection messages you"
              right={<Toggle value={notifications.message} onChange={(v) => setNotif("message", v)} />}
            />
            <Row
              icon={CalendarDays}
              label="Daily matches ready"
              sublabel="Your daily stack is in"
              right={<Toggle value={notifications.dailyMatch} onChange={(v) => setNotif("dailyMatch", v)} />}
            />
            <Row
              icon={Sparkles}
              label="Maahi check-in"
              sublabel="Gentle nudges from your companion"
              right={<Toggle value={notifications.maahiCheckIn} onChange={(v) => setNotif("maahiCheckIn", v)} />}
            />
          </Card>

          {/* Discovery */}
          <Label>Discovery</Label>
          <Card>
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08]">
                  <Eye className="h-3.5 w-3.5 text-white/50" />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-white/80 leading-5">Profile visibility</p>
                  <p className="text-[11px] text-white/35 mt-0.5">
                    {savingVisibility ? "Saving…" : "Control who can discover you"}
                  </p>
                  <VisibilitySelector value={visibility} onChange={saveVisibility} />
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Safety */}
          <Label>Privacy & Safety</Label>
          <Card>
            <Row
              icon={Shield}
              label="Blocked users"
              sublabel="Manage your block list"
              right={<span className="text-[10px] text-white/25 font-medium">Soon</span>}
            />
            <Row
              icon={ExternalLink}
              label="Privacy policy"
              onClick={() => window.open("https://biggdate.com/privacy", "_blank")}
            />
            <Row
              icon={ExternalLink}
              label="Terms of service"
              onClick={() => window.open("https://biggdate.com/terms", "_blank")}
            />
          </Card>

          {/* Billing */}
          <Label>Billing</Label>
          <Card>
            <Row
              icon={ExternalLink}
              label="Manage subscription"
              sublabel="Invoices, payment method"
              onClick={handleManageBilling}
            />
          </Card>

          {/* Danger Zone */}
          <Label>Danger Zone</Label>
          <Card>
            {!showDeleteConfirm ? (
              <Row
                icon={Trash2}
                label="Delete account"
                sublabel="Permanently removes all your data"
                onClick={() => setShowDeleteConfirm(true)}
                danger
              />
            ) : (
              <div className="px-4 py-4">
                <p className="text-[13px] font-semibold text-white/85 mb-1">Are you sure?</p>
                <p className="text-[11px] text-white/40 mb-4 leading-[1.5]">
                  Permanent — your profile, matches, and Maahi memory cannot be recovered.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-lg border border-white/10 py-2 text-xs text-white/55 transition hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-[#d4688a]/15 py-2 text-xs font-semibold text-[#ef8cab] transition hover:bg-[#d4688a]/22 disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                </div>
              </div>
            )}
          </Card>

        </div>
      </SheetContent>
    </Sheet>
  );
}
