import webpush from 'web-push';
import {
  readSubscriptions,
  writeSubscriptions,
} from '@/server/push/subscriptionsFile';

let vapidReady = false;

function configureVapid(): boolean {
  if (vapidReady) {
    return true;
  }
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) {
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidReady = true;
  return true;
}

/**
 * Уведомляет все сохранённые в файле подписки о новой заявке.
 * Отключённые (410/404) подписки удаляются из файла.
 */
export async function notifyAdminsNewLead(options: {
  title: string;
  body: string;
  url: string;
}): Promise<void> {
  if (!process.env.PUSH_SUBSCRIPTIONS_FILE?.trim()) {
    return;
  }
  if (!configureVapid()) {
    console.warn(
      '[push] Задайте NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY и VAPID_SUBJECT'
    );
    return;
  }

  const subs = await readSubscriptions();
  if (subs.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    title: options.title,
    body: options.body,
    url: options.url,
  });

  const kept: webpush.PushSubscription[] = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload, { TTL: 86_400 });
      kept.push(sub);
    } catch (err: unknown) {
      const statusCode =
        err &&
        typeof err === 'object' &&
        'statusCode' in err &&
        typeof (err as { statusCode?: number }).statusCode === 'number'
          ? (err as { statusCode: number }).statusCode
          : undefined;

      if (statusCode === 410 || statusCode === 404) {
        continue;
      }

      kept.push(sub);
      console.error('[push] отправка push:', statusCode, err);
    }
  }

  if (kept.length !== subs.length) {
    try {
      await writeSubscriptions(kept);
    } catch (e) {
      console.error('[push] не удалось записать файл подписок:', e);
    }
  }
}
