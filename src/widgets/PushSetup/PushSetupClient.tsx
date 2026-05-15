'use client';

import { useCallback, useState } from 'react';
import Button from '@/shared/ui/Button/Button';

const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushSetupClient() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subscribe = useCallback(async () => {
    if (!vapidPublic) {
      setStatus(
        'На сервере не задан NEXT_PUBLIC_VAPID_PUBLIC_KEY. Сгенерируйте ключи (web-push generate-vapid-keys).'
      );
      return;
    }
    if (
      typeof self.Notification === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window)
    ) {
      setStatus('Этот браузер не поддерживает Web Push.');
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setStatus('Уведомления запрещены. Разрешите их в настройках браузера.');
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.register('/push-sw.js', {
        scope: '/',
      });
      await reg.update();

      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        await existing.unsubscribe();
      }

      const applicationServerKey = urlBase64ToUint8Array(vapidPublic);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sub.toJSON()),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setStatus(data.error ?? 'Не удалось сохранить подписку на сервере.');
        setLoading(false);
        return;
      }

      setStatus(
        'Готово. На этом устройстве будут приходить push при новой заявке. Держите сайт добавленным или периодически открывайте вкладку, если браузер «засыпает».'
      );
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Не удалось включить push.');
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      setStatus('Service Worker недоступен.');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus('Подписка на этом устройстве отключена.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Ошибка отключения.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto rounded-3xl bg-white p-8 shadow border border-neutral-200">
      <h1 className="text-[2.4rem] font-bold text-cBlack mb-2">
        Push для администратора
      </h1>
      <p className="text-cBlack/70 text-[1.4rem] md:text-[1.6rem] mb-6 leading-relaxed">
        Один раз нажмите кнопку ниже и разрешите уведомления. Подписка сохраняется в файле на
        вашем сервере — когда клиент отправит заявку с сайта, придёт уведомление на этот
        телефон/браузер (работает лучше в Chrome на Android; на iPhone часто нужно добавить сайт
        на экран «Домой»).
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          theme="green"
          size="2xl"
          rounded="full"
          disabled={loading}
          isLoading={loading}
          className="flex-1"
          onClick={subscribe}>
          Включить уведомления
        </Button>
        <Button
          type="button"
          theme="white"
          size="2xl"
          rounded="full"
          disabled={loading}
          className="flex-1 border-2 border-cGreen/30"
          onClick={unsubscribe}>
          Отключить на этом устройстве
        </Button>
      </div>
      {status ? (
        <p className="mt-6 text-[1.4rem] text-cBlack/80 whitespace-pre-wrap">{status}</p>
      ) : null}
    </div>
  );
}
