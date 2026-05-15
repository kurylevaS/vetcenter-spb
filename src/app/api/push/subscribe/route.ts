import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type webpush from 'web-push';
import { isValidLeadsSession } from '@/server/leads/leadsSession';
import { upsertSubscription } from '@/server/push/subscriptionsFile';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const subSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export async function POST(request: NextRequest) {
  if (!isValidLeadsSession(request.cookies.get('leads_gate')?.value)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  if (!process.env.PUSH_SUBSCRIPTIONS_FILE?.trim()) {
    return NextResponse.json(
      { error: 'Путь к файлу подписок не настроен (PUSH_SUBSCRIPTIONS_FILE)' },
      { status: 503 }
    );
  }

  try {
    const json = await request.json();
    const parsed = subSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Неверный формат подписки' }, { status: 400 });
    }

    await upsertSubscription(parsed.data as webpush.PushSubscription);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[push/subscribe]', e);
    return NextResponse.json(
      { error: 'Не удалось сохранить подписку' },
      { status: 500 }
    );
  }
}
