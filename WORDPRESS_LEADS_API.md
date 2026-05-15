# WordPress: REST API для заявок с сайта (`vet_site_lead`)

Next.js отправляет лиды на `POST /wp-json/vetcenter/v1/leads` и читает их через `GET /wp-json/vetcenter/v1/leads/{id}` с заголовком **`X-Leads-Api-Key`** (значение совпадает с `VETCENTER_LEADS_API_KEY` в `.env` фронта).

В админке ACF имена полей должны совпадать с ключами JSON:

| Поле в JSON      | Имя поля ACF на CPT `vet_site_lead` |
|-----------------|-------------------------------------|
| `name`          | `name`                              |
| `phone`         | `phone`                             |
| `pet`           | `pet`                               |
| `comment`       | `comment`                           |
| `doctor`        | `doctor`                            |
| `service_name`  | `service_name`                      |

Если у вас другие machine name в ACF — поправьте массив `$map` в колбэке ниже.

## Ключ API

Задайте константу в `wp-config.php` (рекомендуется):

```php
define('VETCENTER_LEADS_API_KEY', 'вставьте-длинную-случайную-строку');
```

Тот же текст положите в переменную **`VETCENTER_LEADS_API_KEY`** на сервере Next.js.

## Пример плагина / `mu-plugins/vetcenter-leads.php`

Сохраните файл и при необходимости очистите кеш.

Файл в **`wp-content/plugins/vetcenter-leads.php`** обязан содержать заголовок **`Plugin Name`**, иначе WordPress не подключит файл. После загрузки включите плагин в админке. Либо положите этот же код в **`wp-content/mu-plugins/vetcenter-leads.php`** (папку создайте при необходимости) — тогда активация не нужна.

```php
<?php
/**
 * Plugin Name: VetCenter Leads
 * Description: REST API для заявок с сайта (vetcenter/v1/leads).
 * Version: 1.0.0
 */

/**
 * REST для лидов VetCenter + CPT vet_site_lead.
 */
defined('ABSPATH') || exit;

add_action('init', function () {
    register_post_type('vet_site_lead', [
        'labels' => [
            'name' => 'Заявки с сайта',
            'singular_name' => 'Заявка с сайта',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => false,
        'capability_type' => 'post',
        'supports' => ['title'],
        'menu_icon' => 'dashicons-email-alt',
    ]);
});

function vetcenter_leads_expected_key(): string {
    if (defined('VETCENTER_LEADS_API_KEY') && VETCENTER_LEADS_API_KEY) {
        return (string) VETCENTER_LEADS_API_KEY;
    }
    return (string) get_option('vetcenter_leads_api_key', '');
}

function vetcenter_leads_check_key(WP_REST_Request $request): bool {
    $expected = vetcenter_leads_expected_key();
    if ($expected === '') {
        return false;
    }
    $key = $request->get_header('X-Leads-Api-Key');
    if (!$key || !is_string($key)) {
        return false;
    }
    return hash_equals($expected, $key);
}

add_action('rest_api_init', function () {
    register_rest_route('vetcenter/v1', '/leads', [
        'methods' => 'POST',
        'callback' => 'vetcenter_rest_create_lead',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('vetcenter/v1', '/leads/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'vetcenter_rest_get_lead',
        'permission_callback' => '__return_true',
    ]);
});

function vetcenter_rest_create_lead(WP_REST_Request $request) {
    if (!vetcenter_leads_check_key($request)) {
        return new WP_Error('forbidden', 'Invalid API key', ['status' => 403]);
    }

    $params = $request->get_json_params();
    if (!is_array($params)) {
        return new WP_Error('bad_request', 'Invalid JSON', ['status' => 400]);
    }

    $name = isset($params['name']) ? sanitize_text_field((string) $params['name']) : '';
    $phone = isset($params['phone']) ? sanitize_text_field((string) $params['phone']) : '';
    if ($name === '' || $phone === '') {
        return new WP_Error('bad_request', 'name and phone required', ['status' => 400]);
    }

    $post_id = wp_insert_post([
        'post_type' => 'vet_site_lead',
        'post_status' => 'private',
        'post_title' => $name . ' — ' . $phone,
    ], true);

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    $optional = [
        'pet' => isset($params['pet']) ? sanitize_text_field((string) $params['pet']) : '',
        'comment' => isset($params['comment']) ? sanitize_textarea_field((string) $params['comment']) : '',
        'doctor' => isset($params['doctor']) ? sanitize_text_field((string) $params['doctor']) : '',
        'service_name' => isset($params['service_name']) ? sanitize_text_field((string) $params['service_name']) : '',
    ];

    $map = array_merge([
        'name' => $name,
        'phone' => $phone,
    ], $optional);

    foreach ($map as $field_name => $value) {
        if ($value === '') {
            continue;
        }
        if (function_exists('update_field')) {
            update_field($field_name, $value, $post_id);
        } else {
            update_post_meta($post_id, $field_name, $value);
        }
    }

    return rest_ensure_response(['id' => (int) $post_id]);
}

function vetcenter_rest_get_lead(WP_REST_Request $request) {
    if (!vetcenter_leads_check_key($request)) {
        return new WP_Error('forbidden', 'Invalid API key', ['status' => 403]);
    }

    $id = (int) $request['id'];
    $post = get_post($id);
    if (!$post || $post->post_type !== 'vet_site_lead') {
        return new WP_Error('not_found', 'Lead not found', ['status' => 404]);
    }

    $out = [
        'id' => $id,
        'created' => get_post_time('c', true, $post),
        'modified' => get_post_modified_time('c', true, $post),
    ];

    if (function_exists('get_fields')) {
        $fields = get_fields($id, false);
        if (is_array($fields)) {
            foreach ($fields as $k => $v) {
                $out[$k] = $v;
            }
        }
    }

    return rest_ensure_response($out);
}
```

### Ответы

- Успешное создание: `{ "id": 123 }`
- Успешное чтение: JSON с полями `id`, `created`, `modified` и всеми полями ACF.

Если база для REST отличается от `NEXT_PUBLIC_FRONT_API_URL`, задайте на Next **`WORDPRESS_LEADS_REST_URL`**: только origin хоста WordPress с плагином лидов, **без** `/wp-json` на конце (см. `.env.example`).
