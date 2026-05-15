import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getExpectedLeadsCookieValue } from '@/server/leads/leadsSession';

export const dynamic = 'force-dynamic';

const LEADS_COOKIE = 'leads_gate';

const authSchema = z.object({
  code: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const expected = getExpectedLeadsCookieValue();
    const adminCode = process.env.LEADS_ADMIN_CODE;

    if (!expected || !adminCode) {
      console.error(
        '[leads/auth] LEADS_ADMIN_CODE или LEADS_SESSION_SECRET не заданы'
      );
      return NextResponse.json(
        { error: 'Просмотр заявок не настроен на сервере' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Укажите код' }, { status: 400 });
    }

    const ok =
      parsed.data.code.length === adminCode.length &&
      timingSafeEqualUtf8(parsed.data.code, adminCode);

    if (!ok) {
      return NextResponse.json({ error: 'Неверный код' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(LEADS_COOKIE, expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error('[leads/auth]', e);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

/** Безопасное сравнение строк (фиксированная длина уже проверена). */
function timingSafeEqualUtf8(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
