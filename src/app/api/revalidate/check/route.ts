import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

/**
 * API Route для автоматической проверки изменений в WordPress и revalidation страниц
 * 
 * Этот endpoint проверяет WordPress API на наличие измененных постов
 * и автоматически ревалидирует соответствующие страницы Next.js
 * 
 * Использование:
 * 1. Настройте cron job на VPS для периодического вызова этого endpoint
 * 2. Вызывайте: GET /api/revalidate/check?secret=your-secret-key
 *    или через Authorization header: GET /api/revalidate/check с заголовком Authorization: Bearer your-secret-key
 * 
 * Пример настройки cron на VPS (каждые 5 минут):
 * 0,5,10,15,20,25,30,35,40,45,50,55 * * * * curl -s -H "Authorization: Bearer your-secret-key" https://your-domain.com/api/revalidate/check > /dev/null 2>&1
 * 
 * Или через query параметр:
 * 0,5,10,15,20,25,30,35,40,45,50,55 * * * * curl -s "https://your-domain.com/api/revalidate/check?secret=your-secret-key" > /dev/null 2>&1
 */

interface WordPressPost {
  id: number;
  slug: string;
  type: string;
  modified: string;
  modified_gmt: string;
  date: string;
  date_gmt: string;
  status: string;
}

// Маппинг типов постов WordPress на типы Next.js
const POST_TYPE_MAP: Record<string, { type: string; pathPrefix: string; useId?: boolean }> = {
  promo: { type: 'promo', pathPrefix: '/promos' },
  service: { type: 'service', pathPrefix: '/services' },
  doctor: { type: 'doctor', pathPrefix: '/doctors', useId: true },
  blog_post: { type: 'post', pathPrefix: '/blog' },
  page: { type: 'page', pathPrefix: '' },
  service_types: { type: 'service_type', pathPrefix: '/service-types' },
};

// Время последней проверки (в памяти, сбрасывается при перезапуске)
// В production лучше использовать Redis или базу данных
let lastCheckTime: number = Date.now() - 5 * 60 * 1000; // По умолчанию проверяем последние 5 минут

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');

    // Проверяем секретный ключ (из query параметра или заголовка Authorization)
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      console.error('REVALIDATE_SECRET не установлен в переменных окружения');
      return NextResponse.json(
        { error: 'Сервер не настроен для автоматической revalidation' },
        { status: 500 }
      );
    }

    // Поддерживаем проверку через query параметр или Authorization header
    const providedSecret = secret || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
    
    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Неверный секретный ключ' },
        { status: 401 }
      );
    }

    const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL;
    if (!API_URL) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_FRONT_API_URL не установлен' },
        { status: 500 }
      );
    }

    // Получаем время последней проверки из параметра или используем сохраненное
    const sinceParam = searchParams.get('since');
    const checkSince = sinceParam 
      ? new Date(sinceParam).getTime() 
      : lastCheckTime;

    const checkSinceISO = new Date(checkSince).toISOString();
    const now = Date.now();

    console.log(`Проверка изменений с ${checkSinceISO}`);

    const revalidatedPaths: string[] = [];
    const errors: string[] = [];

    // Проверяем каждый тип поста
    for (const [wpPostType, config] of Object.entries(POST_TYPE_MAP)) {
      try {
        // Формируем URL для проверки измененных постов
        // WordPress REST API: получаем последние измененные посты и фильтруем по дате на стороне сервера
        // Также фильтруем только опубликованные посты (status=publish)
        const apiUrl = `${API_URL}/${wpPostType}?per_page=50&orderby=modified&order=desc&status=publish`;
        
        const response = await axios.get<WordPressPost[]>(apiUrl, {
          timeout: 10000,
        });

        const allPosts = Array.isArray(response.data) ? response.data : [];
        
        // Фильтруем посты, измененные после checkSince
        const posts = allPosts.filter(post => {
          const postModified = new Date(post.modified_gmt || post.modified).getTime();
          return postModified > checkSince && post.status === 'publish';
        });

        if (posts.length > 0) {
          console.log(`Найдено ${posts.length} измененных постов типа ${wpPostType}`);

          for (const post of posts) {
            try {
              // Формируем путь для ревалидации
              let path: string;
              if (config.useId) {
                path = `${config.pathPrefix}/${post.id}`;
              } else if (config.type === 'page' && post.slug === 'main') {
                path = '/';
              } else if (config.pathPrefix) {
                path = `${config.pathPrefix}/${post.slug}`;
              } else {
                path = `/${post.slug}`;
              }

              // Ревалидируем страницу
              revalidatePath(path);
              if (!revalidatedPaths.includes(path)) {
                revalidatedPaths.push(path);
              }

              // Также ревалидируем список и главную страницу для большинства типов
              if (config.type !== 'page' && config.pathPrefix) {
                revalidatePath(config.pathPrefix);
                if (!revalidatedPaths.includes(config.pathPrefix)) {
                  revalidatedPaths.push(config.pathPrefix);
                }
                
                revalidatePath('/');
                if (!revalidatedPaths.includes('/')) {
                  revalidatedPaths.push('/');
                }
              }

              console.log(`Ревалидирован путь: ${path} (пост ID: ${post.id}, slug: ${post.slug})`);
            } catch (error) {
              const errorMsg = `Ошибка при ревалидации поста ${post.id}: ${error}`;
              console.error(errorMsg);
              errors.push(errorMsg);
            }
          }
        }
      } catch (error: any) {
        // Игнорируем ошибки 404 для типов постов, которых может не быть
        // Но логируем другие ошибки
        if (error.response?.status === 404) {
          // Тип поста не существует или не поддерживается - это нормально
          continue;
        } else {
          const errorMsg = `Ошибка при проверке типа ${wpPostType}: ${error.message || String(error)}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    // Обновляем время последней проверки
    lastCheckTime = now;

    return NextResponse.json({
      success: true,
      checkedSince: checkSinceISO,
      checkedUntil: new Date(now).toISOString(),
      revalidatedCount: revalidatedPaths.length,
      revalidatedPaths,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now,
    });
  } catch (error) {
    console.error('Ошибка при автоматической проверке изменений:', error);
    return NextResponse.json(
      { 
        error: 'Ошибка при обработке запроса', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

