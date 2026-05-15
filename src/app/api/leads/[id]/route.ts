import { NextRequest, NextResponse } from 'next/server';
import { isValidLeadsSession } from '@/server/leads/leadsSession';
import { wpGetLead } from '@/server/wp/leadsWp';

export const dynamic = 'force-dynamic';

const LEADS_COOKIE = 'leads_gate';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params.id;
    const id = Number(idParam);
    if (!Number.isFinite(id) || id < 1) {
      return NextResponse.json({ error: 'Некорректный id' }, { status: 400 });
    }

    const cookie = request.cookies.get(LEADS_COOKIE)?.value;
    if (!isValidLeadsSession(cookie)) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const data = await wpGetLead(id);
    return NextResponse.json(data);
  } catch (e) {
    console.error('[leads/[id]] GET:', e);
    const status = (
      e as Error & {
        status?: number;
      }
    ).status;
    if (status === 404) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Не удалось загрузить заявку' }, { status: 502 });
  }
}
