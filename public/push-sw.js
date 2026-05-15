/* eslint-disable no-restricted-globals */
/**
 * Service Worker для Web Push (уведомления администратору о новых заявках).
 */
self.addEventListener('push', (event) => {
  let data = {
    title: 'Новая заявка',
    body: 'Откройте сайт, чтобы посмотреть.',
    url: '/internal/leads',
  };
  try {
    if (event.data) {
      const parsed = event.data.json();
      if (parsed && typeof parsed === 'object') {
        data = {
          title:
            typeof parsed.title === 'string' ? parsed.title : data.title,
          body: typeof parsed.body === 'string' ? parsed.body : data.body,
          url: typeof parsed.url === 'string' ? parsed.url : data.url,
        };
      }
    }
  } catch {
    // текст без JSON
    const text = event.data?.text();
    if (text) {
      data = { ...data, body: text };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: { url: data.url },
      vibrate: [120, 80, 120],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url =
    event.notification.data &&
    typeof event.notification.data.url === 'string'
      ? event.notification.data.url
      : '/internal/leads';

  event.waitUntil(
    self.clients.openWindow(url)
  );
});
