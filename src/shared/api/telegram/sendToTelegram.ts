export type { LeadFormPayload as TelegramFormData } from '@/shared/api/leads/types';

import { submitLead } from '@/shared/api/leads/submitLead';

/**
 * Отправка заявки на сервер (WordPress + SMS; см. /api/leads).
 * Имя сохранено для совместимости со старым кодом.
 */
export const sendToTelegram = submitLead;
