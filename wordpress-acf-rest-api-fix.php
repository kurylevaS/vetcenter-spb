<?php
/**
 * Добавляет ACF поля к связанным объектам в WordPress REST API
 * 
 * Этот код нужно добавить в functions.php вашей темы WordPress
 * или создать отдельный плагин.
 * 
 * Проблема: Когда ACF возвращает связанные объекты (relationships),
 * они не включают свои ACF поля автоматически.
 * 
 * Решение: Используем фильтры WordPress REST API для добавления
 * ACF полей к каждому типу связанного поста.
 */

// Добавляем ACF поля для custom post types
// Замените 'service_types' и 'doctor' на ваши реальные типы постов

add_filter('rest_prepare_service_types', 'add_acf_to_rest_response', 10, 3);
add_filter('rest_prepare_doctor', 'add_acf_to_rest_response', 10, 3);

// Универсальная функция для добавления ACF полей к любому типу поста
function add_acf_to_rest_response($response, $post, $request) {
    // Проверяем, что ACF активен
    if (!function_exists('get_fields')) {
        return $response;
    }
    
    // Получаем все ACF поля для поста
    $acf_fields = get_fields($post->ID);
    
    // Добавляем ACF поля в ответ REST API
    if ($acf_fields) {
        $response->data['acf'] = $acf_fields;
    }
    
    return $response;
}

// Альтернативный вариант: добавить ACF поля для всех типов постов автоматически
// Раскомментируйте, если хотите добавить ACF ко всем типам постов
/*
add_filter('rest_prepare_post', 'add_acf_to_rest_response', 10, 3);
add_filter('rest_prepare_page', 'add_acf_to_rest_response', 10, 3);

// Для всех custom post types
add_action('rest_api_init', function() {
    $post_types = get_post_types(['public' => true], 'names');
    foreach ($post_types as $post_type) {
        add_filter("rest_prepare_{$post_type}", 'add_acf_to_rest_response', 10, 3);
    }
});
*/

