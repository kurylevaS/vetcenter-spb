import type { LeadFormPayload } from '@/shared/api/leads/types';

export async function submitLead(data: LeadFormPayload): Promise<void> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = 'Ошибка отправки заявки';
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}
