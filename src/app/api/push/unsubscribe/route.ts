import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isValidLeadsSession } from '@/server/leads/leadsSession';
import { removeSubscriptionByEndpoint } from '@/server/push/subscriptionsFile';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const bodySchema = z.object({
  endpoint: z.string().url(),
});

export async function POST(request: NextRequest) {
  if (!isValidLeadsSession(request.cookies.get('leads_gate')?.value)) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Укажите endpoint подписки' }, { status: 400 });
    }

    await removeSubscriptionByEndpoint(parsed.data.endpoint);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[push/unsubscribe]', e);
    return NextResponse.json({ error: 'Не удалось обновить файл' }, { status: 500 });
  }
}
