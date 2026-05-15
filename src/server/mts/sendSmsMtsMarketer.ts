import { randomUUID } from 'crypto';

export interface MtsSendResult {
  /** Внутренние id сообщений платформы МТС */
  internalIds: string[];
}

/** Нормализация номера под формат МТС: 79XXXXXXXXX без «+». */
function normalizeMtsMsisdn(raw: string): string {
  let d = raw.replace(/\s+/g, '').replace(/^\+/, '');
  if (d.startsWith('8') && d.length === 11) {
    d = `7${d.slice(1)}`;
  }
  if (d.startsWith('9') && d.length === 10) {
    d = `7${d}`;
  }
  return d;
}

/**
 * МТС Маркетолог — «Рассылки по своей базе PRO», REST с Basic auth.
 * POST https://omnichannel.mts.ru/http-api/v1/messages
 * @see https://support.mts.ru/mts_marketolog/rassilki-po-svoei-baze-pro-i-api-k-nim/dokumentatsiya-rest-api
 */
export async function sendSmsMtsMarketer(options: {
  phones: string[];
  message: string;
}): Promise<MtsSendResult> {
  const login = process.env.MTS_OMNI_LOGIN?.trim();
  const password = process.env.MTS_OMNI_PASSWORD?.trim();
  const sender = process.env.MTS_SMS_SENDER?.trim();

  if (!login || !password || !sender) {
    throw new Error(
      'МТС SMS: задайте MTS_OMNI_LOGIN, MTS_OMNI_PASSWORD и MTS_SMS_SENDER (имя отправителя из ЛК)'
    );
  }

  const phones = [...new Set(options.phones.map(normalizeMtsMsisdn).filter(Boolean))];
  if (phones.length === 0) {
    throw new Error('МТС SMS: пустой список номеров');
  }

  const messages = phones.map((msisdn) => ({
    content: {
      short_text: options.message,
    },
    to: [
      {
        msisdn,
        message_id: randomUUID(),
      },
    ],
  }));

  const optionsBody: {
    from: { sms_address: string };
    class?: number;
  } = {
    from: { sms_address: sender },
  };

  const classRaw = process.env.MTS_OMNI_CLASS?.trim();
  if (classRaw) {
    const c = Number.parseInt(classRaw, 10);
    if (!Number.isNaN(c)) {
      optionsBody.class = c;
    }
  }

  const body = {
    messages,
    options: optionsBody,
  };

  const auth = Buffer.from(`${login}:${password}`, 'utf8').toString('base64');

  const res = await fetch('https://omnichannel.mts.ru/http-api/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(
      `МТС SMS: не JSON в ответе (HTTP ${res.status}): ${text.slice(0, 400)}`
    );
  }

  if (!res.ok) {
    throw new Error(`МТС SMS HTTP ${res.status}: ${text.slice(0, 500)}`);
  }

  const msgArr = parsed.messages as Array<{ internal_id?: string }> | undefined;

  if (!Array.isArray(msgArr) || msgArr.length === 0) {
    if (typeof parsed.code === 'number') {
      throw new Error(
        `МТС SMS: ${String(parsed.message ?? parsed.description ?? 'ошибка')} (code ${parsed.code})`
      );
    }
    throw new Error(`МТС SMS: нет messages в ответе: ${text.slice(0, 400)}`);
  }

  const internalIds = msgArr
    .map((m) => m.internal_id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  if (internalIds.length === 0) {
    throw new Error(`МТС SMS: нет internal_id в ответе: ${text.slice(0, 400)}`);
  }

  return { internalIds };
}
