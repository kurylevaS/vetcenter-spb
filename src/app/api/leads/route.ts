import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { wpCreateLead } from '@/server/wp/leadsWp';
import { sendLeadAdminSms } from '@/server/sms/sendLeadAdminSms';
import { notifyTelegramLead } from '@/server/telegram/notifyTelegramLead';
import { notifyAdminsNewLead } from '@/server/push/sendLeadPush';
import {
  getLeadsPublicOrigin,
  parseAdminPhones,
} from '@/server/leads/leadsPublicUrl';

export const dynamic = 'force-dynamic';

const leadBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(5).max(80),
  pet: z.string().trim().max(500).optional(),
  comment: z.string().trim().max(4000).optional(),
  doctor: z.string().trim().max(500).optional(),
  service_name: z.string().trim().max(500).optional(),
});

function buildSmsText(options: {
  name: string;
  phone: string;
  detailUrl: string;
}): string {
  const line = `Заявка: ${options.name}, ${options.phone}. Ссылка: ${options.detailUrl}`;
  if (line.length <= 1000) {
    return line;
  }
  return `${options.name}, ${options.phone}: ${options.detailUrl}`;
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = leadBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Некорректные данные формы' },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    let leadId: number;
    try {
      leadId = await wpCreateLead(payload);
    } catch (e) {
      console.error('[leads] WordPress:', e);
      return NextResponse.json(
        { error: 'Не удалось сохранить заявку. Попробуйте позже.' },
        { status: 502 }
      );
    }

    const origin = getLeadsPublicOrigin();
    const detailUrl = `${origin}/internal/leads/${leadId}`;

    const phones = parseAdminPhones(
      process.env.SMS_ADMIN_PHONES ?? process.env.SMSC_ADMIN_PHONES
    );
    if (phones.length > 0) {
      try {
        await sendLeadAdminSms({
          phones,
          message: buildSmsText({
            name: payload.name,
            phone: payload.phone,
            detailUrl,
          }),
        });
      } catch (e) {
        console.error('[leads] SMS:', e);
      }
    } else {
      console.warn(
        '[leads] SMS_ADMIN_PHONES или SMSC_ADMIN_PHONES не задан — SMS не отправлены'
      );
    }

    if (process.env.LEADS_SEND_TELEGRAM === 'true') {
      try {
        await notifyTelegramLead(payload);
      } catch (e) {
        console.error('[leads] Telegram:', e);
      }
    }

    try {
      await notifyAdminsNewLead({
        title: 'Новая заявка с сайта',
        body: `${payload.name}, ${payload.phone}`,
        url: detailUrl,
      });
    } catch (e) {
      console.error('[leads] push:', e);
    }

    return NextResponse.json({ success: true, id: leadId });
  } catch (error: unknown) {
    console.error('[leads] POST:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
