import fs from 'fs/promises';
import path from 'path';
import type webpush from 'web-push';

export type StoredPushSubscription = webpush.PushSubscription;

export function getPushSubscriptionsFilePath(): string | null {
  const p = process.env.PUSH_SUBSCRIPTIONS_FILE?.trim();
  return p || null;
}

function isPushSubscription(x: unknown): x is webpush.PushSubscription {
  if (!x || typeof x !== 'object') {
    return false;
  }
  const o = x as Record<string, unknown>;
  if (typeof o.endpoint !== 'string' || !o.endpoint.startsWith('http')) {
    return false;
  }
  const keys = o.keys;
  if (!keys || typeof keys !== 'object') {
    return false;
  }
  const k = keys as Record<string, unknown>;
  return typeof k.p256dh === 'string' && typeof k.auth === 'string';
}

export async function readSubscriptions(): Promise<webpush.PushSubscription[]> {
  const filePath = getPushSubscriptionsFilePath();
  if (!filePath) {
    return [];
  }
  const resolved = path.resolve(filePath);
  try {
    const raw = await fs.readFile(resolved, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isPushSubscription);
  } catch {
    return [];
  }
}

export async function writeSubscriptions(
  subs: webpush.PushSubscription[]
): Promise<void> {
  const filePath = getPushSubscriptionsFilePath();
  if (!filePath) {
    throw new Error('PUSH_SUBSCRIPTIONS_FILE не задан');
  }
  const resolved = path.resolve(filePath);
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, JSON.stringify(subs, null, 2), 'utf8');
}

export async function upsertSubscription(
  sub: webpush.PushSubscription
): Promise<void> {
  const subs = await readSubscriptions();
  const next = subs.filter((s) => s.endpoint !== sub.endpoint);
  next.push(sub);
  await writeSubscriptions(next);
}

export async function removeSubscriptionByEndpoint(
  endpoint: string
): Promise<void> {
  const subs = await readSubscriptions();
  await writeSubscriptions(subs.filter((s) => s.endpoint !== endpoint));
}
