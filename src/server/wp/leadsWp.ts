import type { LeadFormPayload } from '@/shared/api/leads/types';

/** База WordPress для лидов: только origin, без /wp-json (иначе будет двойной путь). */
function normalizeWpRestOrigin(raw: string): string {
  let u = raw.trim().replace(/\/+$/, '');
  if (u.toLowerCase().endsWith('/wp-json')) {
    u = u.slice(0, -'/wp-json'.length).replace(/\/+$/, '');
  }
  return u;
}

function wpLeadsBaseUrl(): string {
  const explicit = process.env.WORDPRESS_LEADS_REST_URL?.trim();
  const fallback = process.env.NEXT_PUBLIC_FRONT_API_URL?.trim();
  const base = explicit || fallback;
  if (!base) {
    throw new Error(
      'Задайте WORDPRESS_LEADS_REST_URL (рекомендуется, если NEXT_PUBLIC_FRONT_API_URL указывает не на тот WordPress) или NEXT_PUBLIC_FRONT_API_URL'
    );
  }
  return normalizeWpRestOrigin(base);
}

function leadsApiKey(): string {
  const key = process.env.VETCENTER_LEADS_API_KEY;
  if (!key) {
    throw new Error('Не задан VETCENTER_LEADS_API_KEY');
  }
  return key;
}

/** Пояснение к типичным ответам WordPress REST */
function wpLeadsFailureHint(status: number, bodyText: string): string {
  if (status !== 404) {
    return '';
  }
  try {
    const data = JSON.parse(bodyText) as { code?: string };
    if (data.code === 'rest_no_route') {
      return (
        ' — На WordPress не подключён маршрут /wp-json/vetcenter/v1/leads. ' +
        'Скопируйте PHP из WORDPRESS_LEADS_API.md в wp-content/mu-plugins/ ' +
        '(или активируйте сниппет), затем в админке: Настройки → Постоянные ссылки → Сохранить.'
      );
    }
  } catch {
    // не JSON
  }
  return '';
}

export async function wpCreateLead(payload: LeadFormPayload): Promise<number> {
  const url = `${wpLeadsBaseUrl()}/wp-json/vetcenter/v1/leads`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Leads-Api-Key': leadsApiKey(),
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `WordPress leads POST ${res.status}: ${text}${wpLeadsFailureHint(res.status, text)}`
    );
  }

  let data: { id?: number };
  try {
    data = JSON.parse(text) as { id?: number };
  } catch {
    throw new Error(`WordPress leads: неверный JSON: ${text.slice(0, 200)}`);
  }

  const id = data.id;
  if (typeof id !== 'number' || !Number.isFinite(id)) {
    throw new Error('WordPress leads: в ответе нет числового id');
  }

  return id;
}

export async function wpGetLead(id: number): Promise<Record<string, unknown>> {
  const url = `${wpLeadsBaseUrl()}/wp-json/vetcenter/v1/leads/${id}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Leads-Api-Key': leadsApiKey(),
    },
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) {
    const err = new Error(
      `WordPress leads GET ${res.status}: ${text}${wpLeadsFailureHint(res.status, text)}`
    ) as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`WordPress leads: неверный JSON: ${text.slice(0, 200)}`);
  }
}
