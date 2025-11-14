# Настройка автоматического обновления страниц через Webhook

## Как это работает

Проект использует **ISR (Incremental Static Regeneration)** с двумя механизмами обновления:

1. **Автоматическое обновление** — страницы автоматически обновляются каждые 60 секунд
2. **Мгновенное обновление через webhook** — при изменении контента в WordPress админке страницы обновляются сразу

## Настройка переменных окружения

Добавьте в ваш `.env.local` или `.env` файл:

```env
REVALIDATE_SECRET=your-super-secret-key-here-change-this
```

**Важно:** Используйте сложный случайный ключ для безопасности. Например, можно сгенерировать его командой:
```bash
openssl rand -base64 32
```

## Настройка Webhook в WordPress

### Вариант 1: Использование плагина "WP Webhooks"

1. Установите плагин [WP Webhooks](https://wordpress.org/plugins/wp-webhooks/)
2. Перейдите в **WP Webhooks → Send Data**
3. Создайте новый webhook:
   - **Webhook Name**: "Next.js Revalidation"
   - **Webhook URL**: `https://your-domain.com/api/revalidate`
   - **Request Method**: `POST`
   - **Request Content Type**: `application/json`

4. В разделе **Data Mapping** добавьте следующие поля:
   ```json
   {
     "secret": "your-super-secret-key-here-change-this",
     "path": "/promos/{{post_name}}",
     "type": "promo"
   }
   ```

5. Настройте триггеры:
   - **When to send**: "After a post has been created"
   - **When to send**: "After a post has been updated"
   - **Post Types**: Выберите нужные типы постов (promo, service, doctor, blog_post, page)

### Вариант 2: Использование WordPress REST API хуков (через functions.php)

Добавьте следующий код в `functions.php` вашей темы WordPress:

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

Если вы используете сервисы автоматизации, настройте webhook:

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

## Формат запроса к API

```json
{
  "secret": "your-secret-key",
  "path": "/promos/my-promo-slug",
  "type": "promo"
}
```

### Параметры:

- **secret** (обязательный): Секретный ключ из переменной окружения `REVALIDATE_SECRET`
- **path** (обязательный): Путь к странице для перегенерации
- **type** (опциональный): Тип контента (`promo`, `service`, `doctor`, `post`, `page`)

### Примеры запросов:

**Акция:**
```json
{
  "secret": "your-secret-key",
  "path": "/promos/summer-discount",
  "type": "promo"
}
```

**Услуга:**
```json
{
  "secret": "your-secret-key",
  "path": "/services/vaccination",
  "type": "service"
}
```

**Врач:**
```json
{
  "secret": "your-secret-key",
  "path": "/doctors/123",
  "type": "doctor"
}
```

**Статья блога:**
```json
{
  "secret": "your-secret-key",
  "path": "/blog/my-article",
  "type": "post"
}
```

**Главная страница:**
```json
{
  "secret": "your-secret-key",
  "path": "/",
  "type": "page"
}
```

## Проверка работоспособности

1. Проверьте, что API доступен:
   ```bash
   curl https://your-domain.com/api/revalidate
   ```
   Должен вернуться JSON с сообщением о том, что API активен.

2. Протестируйте revalidation:
   ```bash
   curl -X POST https://your-domain.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-secret-key",
       "path": "/promos",
       "type": "promo"
     }'
   ```

3. Проверьте логи Next.js приложения — должны появиться сообщения о успешной revalidation.

## Что происходит при revalidation

Когда приходит запрос на revalidation:

1. Проверяется секретный ключ
2. Перегенерация указанной страницы
3. Если указан `type`, также перегенерация связанных страниц:
   - Для `promo`: страница акции + `/promos` + главная страница
   - Для `service`: страница услуги + `/services` + главная страница
   - Для `doctor`: страница врача + `/doctors` + главная страница
   - Для `post`: страница статьи + `/blog` + главная страница
   - Для `page`: только указанная страница

## Частота обновления

- **Автоматическое обновление**: каждые 60 секунд (настраивается через `export const revalidate = 60`)
- **Мгновенное обновление**: сразу после изменения в WordPress через webhook

## Безопасность

⚠️ **Важно:**
- Никогда не коммитьте `REVALIDATE_SECRET` в git
- Используйте сложный случайный ключ
- Ограничьте доступ к endpoint через firewall/Vercel Edge Config если возможно
- Регулярно меняйте секретный ключ

## Troubleshooting

### Страницы не обновляются

1. Проверьте, что `REVALIDATE_SECRET` установлен в переменных окружения
2. Проверьте логи Next.js приложения
3. Убедитесь, что webhook отправляет правильный формат данных
4. Проверьте, что URL webhook правильный

### Ошибка 401 (Unauthorized)

- Проверьте, что секретный ключ в webhook совпадает с `REVALIDATE_SECRET`

### Ошибка 500 (Internal Server Error)

- Проверьте логи сервера
- Убедитесь, что путь указан правильно
- Проверьте, что Next.js приложение запущено

