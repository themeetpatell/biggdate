"use client";

import { useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

function isSupported(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function persistSubscription(subscription: PushSubscription): Promise<void> {
  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, keys }),
  });
}

async function subscribeAndPersist(): Promise<PushSubscriptionState> {
  if (!VAPID_PUBLIC_KEY || !isSupported()) return "unsupported";
  const reg = await navigator.serviceWorker.register("/sw.js");
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    await persistSubscription(existing);
    return "subscribed";
  }
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
  await persistSubscription(subscription);
  return "subscribed";
}

export type PushSubscriptionState =
  | "unsupported"
  | "denied"
  | "default"
  | "subscribed";

/**
 * Call from an explicit user action (button click). Triggers the browser
 * permission prompt + subscribes. Must NOT be called on page mount — that
 * was the GDPR / DPDPA consent failure that produced a permission prompt
 * with no surrounding context.
 */
export async function enablePushNotifications(): Promise<PushSubscriptionState> {
  if (!isSupported()) return "unsupported";
  if (!VAPID_PUBLIC_KEY) return "unsupported";
  const permission = await Notification.requestPermission();
  if (permission === "denied") return "denied";
  if (permission !== "granted") return "default";
  return subscribeAndPersist();
}

/**
 * Mounted globally in layout.tsx. Silent on first visit — never prompts. If
 * the user has already granted permission in a prior session, we resume their
 * subscription quietly so an existing opt-in keeps working without a
 * re-prompt. The actual "Turn on push notifications" CTA lives in settings.
 */
export function PushSubscriber() {
  useEffect(() => {
    if (!VAPID_PUBLIC_KEY || !isSupported()) return;
    if (Notification.permission !== "granted") return;
    subscribeAndPersist().catch(() => {
      // Best-effort. The settings CTA is the canonical way to retry.
    });
  }, []);

  return null;
}
