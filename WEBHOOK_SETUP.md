# Настройка автоматического обновления страниц через WP Webhooks

## Как это работает

Проект использует **ISR (Incremental Static Regeneration)** с двумя механизмами обновления:

1. **Автоматическое обновление** — страницы автоматически обновляются каждые 60 секунд
2. **Мгновенное обновление через webhook** — при изменении контента в WordPress админке страницы обновляются сразу

## Шаг 1: Настройка переменных окружения в Next.js

### 1.1. Генерация секретного ключа

Сгенерируйте безопасный секретный ключ командой:

```bash
openssl rand -base64 32
```

Скопируйте полученный ключ (например: `aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==`)

### 1.2. Добавление ключа в переменные окружения

Добавьте в ваш `.env.local` или `.env` файл (в корне проекта Next.js):

```env
REVALIDATE_SECRET=aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==
```

**⚠️ Важно:** 
- Используйте сложный случайный ключ для безопасности
- Никогда не коммитьте этот файл в git (убедитесь, что `.env.local` в `.gitignore`)
- Используйте тот же ключ в WordPress настройках

### 1.3. Перезапуск Next.js приложения

После добавления переменной окружения перезапустите ваше Next.js приложение:

```bash
npm run dev
# или
npm run build && npm start
```

## Шаг 2: Установка плагина WP Webhooks в WordPress

### 2.1. Установка плагина

1. Войдите в админ-панель WordPress
2. Перейдите в **Плагины → Добавить новый**
3. Найдите плагин **"WP Webhooks"** (автор: Ironikus)
4. Нажмите **"Установить"**, затем **"Активировать"**

Альтернативно: скачайте с [wordpress.org/plugins/wp-webhooks](https://wordpress.org/plugins/wp-webhooks/)

### 2.2. Проверка установки

После активации в левом меню WordPress должен появиться пункт **"WP Webhooks"**

## Шаг 3: Настройка Webhook для акций (Promo)

### 3.1. Создание нового Webhook

1. Перейдите в **WP Webhooks → Send Data**
2. Нажмите кнопку **"Add Webhook"** или **"Создать Webhook"**

### 3.2. Основные настройки

Заполните следующие поля:

- **Webhook Name**: `Next.js Revalidation - Promo`
- **Webhook URL**: `https://your-domain.com/api/revalidate`
  - ⚠️ Замените `your-domain.com` на реальный домен вашего Next.js приложения
  - Пример: `https://vetcenter-spb.ru/api/revalidate`
- **Request Method**: `POST`
- **Request Content Type**: `application/json`

### 3.3. Настройка Data Mapping (JSON Body)

В разделе **"Data Mapping"** или **"Request Body"** нажмите **"Add Data Mapping"** и добавьте следующие поля:

**Поле 1:**
- **Key**: `secret`
- **Value**: `aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==`
  - ⚠️ Используйте тот же ключ, что в `.env.local`

**Поле 2:**
- **Key**: `path`
- **Value**: `/promos/{{post_name}}`
  - ⚠️ `{{post_name}}` — это переменная плагина, которая автоматически подставит slug поста

**Поле 3:**
- **Key**: `type`
- **Value**: `promo`

**Итоговый JSON должен выглядеть так:**

```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/promos/{{post_name}}",
  "type": "promo"
}
```

### 3.4. Настройка триггеров

В разделе **"Triggers"** или **"When to send"**:

1. Выберите **"After a post has been created"** (После создания поста)
2. Выберите **"After a post has been updated"** (После обновления поста)
3. В поле **"Post Types"** выберите: `promo`

### 3.5. Сохранение

Нажмите **"Save Webhook"** или **"Сохранить"**

## Шаг 4: Настройка Webhook для услуг (Service)

Повторите шаги 3.1-3.5 с следующими изменениями:

- **Webhook Name**: `Next.js Revalidation - Service`
- **path**: `/services/{{post_name}}`
- **type**: `service`
- **Post Types**: `service`

**JSON Body:**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/services/{{post_name}}",
  "type": "service"
}
```

## Шаг 5: Настройка Webhook для врачей (Doctor)

Повторите шаги 3.1-3.5 с следующими изменениями:

- **Webhook Name**: `Next.js Revalidation - Doctor`
- **path**: `/doctors/{{post_id}}`
  - ⚠️ Для врачей используется `{{post_id}}`, а не `{{post_name}}`
- **type**: `doctor`
- **Post Types**: `doctor`

**JSON Body:**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/doctors/{{post_id}}",
  "type": "doctor"
}
```

## Шаг 6: Настройка Webhook для статей блога (Blog Post)

Повторите шаги 3.1-3.5 с следующими изменениями:

- **Webhook Name**: `Next.js Revalidation - Blog Post`
- **path**: `/blog/{{post_name}}`
- **type**: `post`
- **Post Types**: `blog_post`

**JSON Body:**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/blog/{{post_name}}",
  "type": "post"
}
```

## Шаг 7: Настройка Webhook для страниц (Page)

Повторите шаги 3.1-3.5 с следующими изменениями:

- **Webhook Name**: `Next.js Revalidation - Page`
- **path**: `{{#if post_name == "main"}}/{{else}}/{{post_name}}{{/if}}`
  - ⚠️ Для главной страницы (slug = "main") путь должен быть `/`, для остальных `/slug`
  - В некоторых версиях WP Webhooks может потребоваться условная логика или отдельный webhook для главной страницы
- **type**: `page`
- **Post Types**: `page`

**JSON Body (для обычных страниц):**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/{{post_name}}",
  "type": "page"
}
```

**Для главной страницы (если slug = "main"):**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/",
  "type": "page"
}
```

## Шаг 8: Настройка Webhook для типов услуг (Service Type) - опционально

Если у вас есть кастомный тип поста `service_type`, создайте отдельный webhook:

- **Webhook Name**: `Next.js Revalidation - Service Type`
- **path**: `/service-types/{{post_name}}`
- **type**: не указывайте (или оставьте пустым)
- **Post Types**: `service_type`

**JSON Body:**
```json
{
  "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
  "path": "/service-types/{{post_name}}"
}
```

## Шаг 9: Тестирование Webhook

### 9.1. Проверка доступности API

Сначала убедитесь, что API endpoint доступен:

```bash
curl https://your-domain.com/api/revalidate
```

Должен вернуться ответ:
```json
{
  "message": "Revalidation API активен",
  "usage": "Используйте POST метод с секретным ключом для revalidation"
}
```

### 9.2. Ручное тестирование

Протестируйте revalidation вручную:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "aB3dEf9gHiJkLmNoPqRsTuVwXyZ1234567890==",
    "path": "/promos",
    "type": "promo"
  }'
```

Должен вернуться ответ:
```json
{
  "revalidated": true,
  "now": 1234567890123,
  "results": [
    { "path": "/promos", "revalidated": true },
    { "path": "/", "revalidated": true }
  ]
}
```

### 9.3. Тестирование через WordPress

1. Откройте любой пост типа `promo` в WordPress
2. Внесите небольшое изменение (например, добавьте пробел в описание)
3. Нажмите **"Обновить"**
4. Проверьте логи Next.js приложения — должны появиться сообщения о revalidation
5. Проверьте, что изменения отобразились на сайте (может потребоваться очистка кеша браузера)

## Шаг 10: Проверка логов WP Webhooks

В плагине WP Webhooks есть раздел для просмотра логов отправленных запросов:

1. Перейдите в **WP Webhooks → Logs** или **WP Webhooks → Send Data → [Ваш Webhook] → Logs**
2. Проверьте, что запросы отправляются успешно
3. Если есть ошибки, проверьте:
   - Правильность URL
   - Правильность секретного ключа
   - Формат JSON

## Альтернативный вариант: Один универсальный Webhook

Вместо создания отдельных webhook для каждого типа контента, можно создать один универсальный webhook с условной логикой:

### Настройка универсального Webhook

1. Создайте один webhook с именем `Next.js Revalidation - Universal`
2. В поле **path** используйте условную логику:

```
{{#switch post_type}}
  {{#case "promo"}}/promos/{{post_name}}{{/case}}
  {{#case "service"}}/services/{{post_name}}{{/case}}
  {{#case "doctor"}}/doctors/{{post_id}}{{/case}}
  {{#case "blog_post"}}/blog/{{post_name}}{{/case}}
  {{#case "page"}}{{#if post_name == "main"}}/{{else}}/{{post_name}}{{/if}}{{/case}}
{{/switch}}
```

3. В поле **type** используйте:

```
{{#switch post_type}}
  {{#case "promo"}}promo{{/case}}
  {{#case "service"}}service{{/case}}
  {{#case "doctor"}}doctor{{/case}}
  {{#case "blog_post"}}post{{/case}}
  {{#case "page"}}page{{/case}}
{{/switch}}
```

4. В триггерах выберите все нужные типы постов

**⚠️ Примечание:** Синтаксис условной логики может отличаться в зависимости от версии WP Webhooks. Если условная логика не работает, используйте отдельные webhook для каждого типа контента (рекомендуется).

---

## Альтернативные способы настройки

### Вариант 2: Использование WordPress REST API хуков (через functions.php)

Если вы не хотите использовать плагин WP Webhooks, можно добавить код напрямую в `functions.php` вашей темы WordPress:

```php
/**
 * Автоматическая перегенерация страниц Next.js при изменении контента
 */
function trigger_nextjs_revalidation($post_id, $post) {
    // Проверяем, что это не автосохранение или ревизия
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Определяем тип контента и путь
    $post_type = get_post_type($post_id);
    $post_slug = $post->post_name;

    $type_map = [
        'promo' => 'promo',
        'service' => 'service',
        'doctor' => 'doctor',
        'blog_post' => 'post',
        'page' => 'page',
    ];

    $type = $type_map[$post_type] ?? null;
    if (!$type) {
        return;
    }

    // Формируем путь в зависимости от типа
    $path_map = [
        'promo' => "/promos/{$post_slug}",
        'service' => "/services/{$post_slug}",
        'doctor' => "/doctors/{$post_id}",
        'post' => "/blog/{$post_slug}",
        'page' => $post_slug === 'main' ? '/' : "/{$post_slug}",
    ];

    $path = $path_map[$type] ?? null;
    if (!$path) {
        return;
    }

    // URL вашего Next.js приложения
    $nextjs_url = 'https://your-domain.com/api/revalidate';
    $secret = 'your-super-secret-key-here-change-this';

    // Отправляем запрос на revalidation
    wp_remote_post($nextjs_url, [
        'method' => 'POST',
        'headers' => [
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'secret' => $secret,
            'path' => $path,
            'type' => $type,
        ]),
        'timeout' => 5,
    ]);
}

// Хуки для разных типов постов
add_action('save_post_promo', 'trigger_nextjs_revalidation', 10, 2);
add_action('save_post_service', 'trigger_nextjs_revalidation', 10, 2);
add_action('save_post_doctor', 'trigger_nextjs_revalidation', 10, 2);
add_action('save_post_blog_post', 'trigger_nextjs_revalidation', 10, 2);
add_action('save_post_page', 'trigger_nextjs_revalidation', 10, 2);

// Также перегенерация при удалении
add_action('before_delete_post', function($post_id) {
    $post = get_post($post_id);
    if ($post) {
        trigger_nextjs_revalidation($post_id, $post);
    }
});
```

**Не забудьте заменить:**

- `https://your-domain.com` на URL вашего Next.js приложения
- `your-super-secret-key-here-change-this` на тот же секретный ключ, что в `.env.local`

### Вариант 3: Использование Zapier/Make.com или других интеграций

Если вы используете сервисы автоматизации (Zapier, Make.com, n8n и т.д.), настройте webhook:

1. **Trigger**: WordPress → Post Created/Updated
2. **Action**: HTTP Request
   - **Method**: POST
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Headers**: `Content-Type: application/json`
   - **Body**:
     ```json
     {
       "secret": "your-super-secret-key-here-change-this",
       "path": "/promos/{{post_slug}}",
       "type": "promo"
     }
     ```

---

## Справочная информация

### Формат запроса к API

```json
{
  "secret": "your-secret-key",
  "path": "/promos/my-promo-slug",
  "type": "promo"
}
```

### Параметры запроса:

- **secret** (обязательный): Секретный ключ из переменной окружения `REVALIDATE_SECRET`
- **path** (обязательный): Путь к странице для перегенерации
- **type** (опциональный): Тип контента (`promo`, `service`, `doctor`, `post`, `page`)

### Примеры запросов для разных типов контента:

**Акция (Promo):**
```json
{
  "secret": "your-secret-key",
  "path": "/promos/summer-discount",
  "type": "promo"
}
```

**Услуга (Service):**
```json
{
  "secret": "your-secret-key",
  "path": "/services/vaccination",
  "type": "service"
}
```

**Врач (Doctor):**
```json
{
  "secret": "your-secret-key",
  "path": "/doctors/123",
  "type": "doctor"
}
```

**Статья блога (Blog Post):**
```json
{
  "secret": "your-secret-key",
  "path": "/blog/my-article",
  "type": "post"
}
```

**Главная страница (Page):**
```json
{
  "secret": "your-secret-key",
  "path": "/",
  "type": "page"
}
```

### Что происходит при revalidation

Когда приходит запрос на revalidation:

1. ✅ Проверяется секретный ключ
2. ✅ Перегенерация указанной страницы
3. ✅ Если указан `type`, также перегенерация связанных страниц:
   - Для `promo`: страница акции + `/promos` + главная страница (`/`)
   - Для `service`: страница услуги + `/services` + главная страница (`/`)
   - Для `doctor`: страница врача + `/doctors` + главная страница (`/`)
   - Для `post`: страница статьи + `/blog` + главная страница (`/`)
   - Для `page`: только указанная страница

### Частота обновления

- **Автоматическое обновление**: каждые 60 секунд (настраивается через `export const revalidate = 60` в файлах страниц)
- **Мгновенное обновление**: сразу после изменения в WordPress через webhook

---

## Безопасность

⚠️ **Важные рекомендации по безопасности:**

- ✅ Никогда не коммитьте `REVALIDATE_SECRET` в git (убедитесь, что `.env.local` в `.gitignore`)
- ✅ Используйте сложный случайный ключ (минимум 32 символа)
- ✅ Ограничьте доступ к endpoint через firewall/Vercel Edge Config если возможно
- ✅ Регулярно меняйте секретный ключ (рекомендуется раз в 3-6 месяцев)
- ✅ Используйте HTTPS для всех запросов к API
- ✅ Не передавайте секретный ключ в URL параметрах, только в теле запроса

---

## Troubleshooting (Решение проблем)

### Страницы не обновляются после изменения в WordPress

**Проверьте по порядку:**

1. ✅ Убедитесь, что `REVALIDATE_SECRET` установлен в переменных окружения Next.js
2. ✅ Проверьте логи Next.js приложения (консоль сервера или логи в production)
3. ✅ Убедитесь, что webhook отправляет правильный формат данных (проверьте логи WP Webhooks)
4. ✅ Проверьте, что URL webhook правильный и доступен из WordPress сервера
5. ✅ Убедитесь, что переменные `{{post_name}}` или `{{post_id}}` правильно подставляются в WP Webhooks

**Как проверить логи WP Webhooks:**
- Перейдите в **WP Webhooks → Logs**
- Найдите последние запросы от вашего webhook
- Проверьте статус ответа (должен быть 200 OK)
- Проверьте отправленные данные (JSON должен быть правильным)

### Ошибка 401 (Unauthorized)

**Причина:** Неверный секретный ключ

**Решение:**
- ✅ Проверьте, что секретный ключ в webhook **точно совпадает** с `REVALIDATE_SECRET` в `.env.local`
- ✅ Убедитесь, что нет лишних пробелов или символов
- ✅ Перезапустите Next.js приложение после изменения переменных окружения

### Ошибка 400 (Bad Request)

**Причина:** Не указан обязательный параметр `path`

**Решение:**
- ✅ Проверьте, что в Data Mapping webhook есть поле `path`
- ✅ Убедитесь, что переменные типа `{{post_name}}` правильно подставляются
- ✅ Проверьте формат JSON в логах WP Webhooks

### Ошибка 500 (Internal Server Error)

**Причина:** Ошибка на стороне сервера Next.js

**Решение:**
- ✅ Проверьте логи Next.js приложения для деталей ошибки
- ✅ Убедитесь, что путь указан правильно (начинается с `/`)
- ✅ Проверьте, что Next.js приложение запущено и доступно
- ✅ Убедитесь, что переменная окружения `REVALIDATE_SECRET` установлена

### Webhook не срабатывает при сохранении поста

**Проверьте:**

1. ✅ Убедитесь, что webhook активен (не отключен) в WP Webhooks
2. ✅ Проверьте, что выбран правильный тип поста в триггерах
3. ✅ Убедитесь, что выбраны триггеры "After a post has been created" и "After a post has been updated"
4. ✅ Проверьте логи WP Webhooks — возможно, запрос отправляется, но с ошибкой

### Переменные не подставляются в WP Webhooks

**Проблема:** В логах видно `{{post_name}}` вместо реального slug

**Решение:**
- ✅ Убедитесь, что используете правильный синтаксис переменных для вашей версии WP Webhooks
- ✅ Попробуйте альтернативные варианты: `{{post.post_name}}`, `{{data.post_name}}`, `{{wp_post.post_name}}`
- ✅ Проверьте документацию вашей версии плагина WP Webhooks
- ✅ Если ничего не помогает, используйте вариант с `functions.php` (Вариант 2)

### Страница обновляется, но изменения не видны

**Причина:** Кеш браузера или CDN

**Решение:**
- ✅ Очистите кеш браузера (Ctrl+Shift+R или Cmd+Shift+R)
- ✅ Проверьте в режиме инкогнито
- ✅ Если используете CDN (Cloudflare, Vercel и т.д.), очистите кеш CDN
- ✅ Убедитесь, что revalidation действительно произошла (проверьте ответ API)

---

## Дополнительные ресурсы

- [Документация WP Webhooks](https://wp-webhooks.com/)
- [Next.js ISR документация](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js revalidatePath API](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)

---

## Чек-лист настройки

Используйте этот чек-лист для проверки правильности настройки:

- [ ] Сгенерирован и установлен `REVALIDATE_SECRET` в `.env.local`
- [ ] Next.js приложение перезапущено после добавления переменной окружения
- [ ] Плагин WP Webhooks установлен и активирован в WordPress
- [ ] Создан webhook для типа `promo`
- [ ] Создан webhook для типа `service`
- [ ] Создан webhook для типа `doctor`
- [ ] Создан webhook для типа `blog_post`
- [ ] Создан webhook для типа `page`
- [ ] Все webhook используют правильный URL (`https://your-domain.com/api/revalidate`)
- [ ] Все webhook используют правильный секретный ключ
- [ ] Все webhook настроены на триггеры создания и обновления постов
- [ ] API endpoint доступен (проверено через `curl`)
- [ ] Ручное тестирование revalidation прошло успешно
- [ ] Тестирование через WordPress прошло успешно
- [ ] Логи WP Webhooks показывают успешные запросы
