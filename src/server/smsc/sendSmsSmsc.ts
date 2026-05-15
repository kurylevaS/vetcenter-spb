export interface SmscSendResult {
  smscId: string | number;
  parts: number;
}

/**
 * Отправка SMS через SMSC.ru (https://smsc.ru/api/http/send/sms/).
 * Авторизация: пара SMSC_LOGIN + SMSC_PASSWORD или только SMSC_API_KEY.
 */
export async function sendSmsSmsc(options: {
  phones: string[];
  message: string;
}): Promise<SmscSendResult> {
  const apiKey = process.env.SMSC_API_KEY;
  const login = process.env.SMSC_LOGIN;
  const psw = process.env.SMSC_PASSWORD ?? process.env.SMSC_PSW;

  if (!apiKey && (!login || !psw)) {
    throw new Error(
      'SMSC: задайте SMSC_API_KEY или пару SMSC_LOGIN + SMSC_PASSWORD в окружении'
    );
  }

  const phones = options.phones
    .map((p) => p.replace(/\s+/g, '').replace(/^\+/, ''))
    .filter(Boolean)
    .join(',');

  if (!phones) {
    throw new Error('SMSC: пустой список номеров');
  }

  const params = new URLSearchParams();
  if (apiKey) {
    params.set('apikey', apiKey);
  } else {
    params.set('login', login!);
    params.set('psw', psw!);
  }
  params.set('phones', phones);
  params.set('mes', options.message);
  params.set('charset', 'utf-8');
  params.set('fmt', '3');

  const res = await fetch('https://smsc.ru/sys/send.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: params.toString(),
  });

  const raw = await res.text();

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // не JSON — см. текстовый формат ответа
  }

  if (parsed && typeof parsed.error_code === 'number') {
    throw new Error(
      `SMSC: ${String(parsed.error ?? 'ошибка')} (код ${parsed.error_code})`
    );
  }

  if (parsed && parsed.id !== undefined && parsed.cnt !== undefined) {
    return {
      smscId: parsed.id as string | number,
      parts: Number(parsed.cnt),
    };
  }

  if (raw.includes('ERROR')) {
    throw new Error(`SMSC: ${raw}`);
  }

  throw new Error(`SMSC: неожиданный ответ: ${raw.slice(0, 200)}`);
}
