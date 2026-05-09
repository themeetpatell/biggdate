// src/lib/push.ts
import webPush from 'web-push';
import { sql } from './db';
import type { PushSubscription } from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@biggdate.app';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn('Web Push VAPID keys not set; push notifications will be disabled');
}

/** Send a push notification to a single subscription */
export async function sendPush(subscription: PushSubscription, payload: Record<string, any>) {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to send push', err);
  }
}

/** Retrieve all stored subscriptions for a user and push a payload */
export async function sendPushToUser(userId: string, payload: Record<string, any>) {
  const rows = await sql`
    SELECT endpoint, keys
    FROM push_subscriptions
    WHERE user_id = ${userId}
  `;
  for (const row of rows as any[]) {
    const subscription: PushSubscription = {
      endpoint: row.endpoint,
      keys: row.keys,
    };
    await sendPush(subscription, payload);
  }
}
