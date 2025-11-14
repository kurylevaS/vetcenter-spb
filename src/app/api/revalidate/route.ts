import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * API Route для on-demand revalidation страниц
 * Используется для мгновенного обновления контента при изменении в WordPress админке
 *
 * Настройка webhook в WordPress:
 * 1. Установите плагин "WP Webhooks" или используйте встроенные хуки WordPress REST API
 * 2. Создайте webhook, который будет отправлять POST запрос на этот endpoint при изменении контента
 * 3. URL webhook: https://your-domain.com/api/revalidate
 * 4. Метод: POST
 * 5. В теле запроса отправляйте JSON с полями:
 *    - secret: секретный ключ (должен совпадать с REVALIDATE_SECRET в .env)
 *    - path: путь к странице для перегенерации (например, "/promos", "/promos/my-promo-slug")
 *    - type: тип контента ("promo", "service", "doctor", "post", "page")
 *
 * Пример запроса:
 * POST /api/revalidate
 * {
 *   "secret": "your-secret-key",
 *   "path": "/promos",
 *   "type": "promo"
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path, type } = body;

    // Проверяем секретный ключ
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      console.error('REVALIDATE_SECRET не установлен в переменных окружения');
      return NextResponse.json(
        { error: 'Сервер не настроен для revalidation' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Неверный секретный ключ' },
        { status: 401 }
      );
    }

    // Проверяем наличие пути
    if (!path) {
      return NextResponse.json({ error: 'Путь не указан' }, { status: 400 });
    }

    // Определяем пути для перегенерации в зависимости от типа контента
    const pathsToRevalidate: string[] = [];

    if (type) {
      switch (type) {
        case 'promo':
          // Перегенерация страницы конкретной акции и списка акций
          pathsToRevalidate.push(path);
          pathsToRevalidate.push('/promos');
          pathsToRevalidate.push('/'); // Главная страница (там может быть блок акций)
          break;
        case 'service':
          // Перегенерация страницы услуги и списка услуг
          pathsToRevalidate.push(path);
          pathsToRevalidate.push('/services');
          pathsToRevalidate.push('/'); // Главная страница
          break;
        case 'doctor':
          // Перегенерация страницы врача и списка врачей
          pathsToRevalidate.push(path);
          pathsToRevalidate.push('/doctors');
          pathsToRevalidate.push('/'); // Главная страница
          break;
        case 'post':
          // Перегенерация статьи и списка статей
          pathsToRevalidate.push(path);
          pathsToRevalidate.push('/blog');
          pathsToRevalidate.push('/'); // Главная страница
          break;
        case 'page':
          // Перегенерация страницы (например, главной)
          pathsToRevalidate.push(path);
          break;
        default:
          // Если тип не указан, перегенерация только указанного пути
          pathsToRevalidate.push(path);
      }
    } else {
      // Если тип не указан, перегенерация только указанного пути
      pathsToRevalidate.push(path);
    }

    // Выполняем revalidation для каждого пути
    const results = pathsToRevalidate.map((p) => {
      try {
        revalidatePath(p);
        return { path: p, revalidated: true };
      } catch (error) {
        console.error(`Ошибка при revalidation пути ${p}:`, error);
        return { path: p, revalidated: false, error: String(error) };
      }
    });

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      results,
    });
  } catch (error) {
    console.error('Ошибка при обработке revalidation запроса:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке запроса', details: String(error) },
      { status: 500 }
    );
  }
}

// GET метод для проверки работоспособности endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation API активен',
    usage: 'Используйте POST метод с секретным ключом для revalidation',
  });
}
