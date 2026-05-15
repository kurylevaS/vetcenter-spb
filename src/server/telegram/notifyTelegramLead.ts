import type { LeadFormPayload } from '@/shared/api/leads/types';

export async function notifyTelegramLead(data: LeadFormPayload): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error(
      'Telegram не настроен (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)'
    );
  }

  let message = '📋 <b>Новая заявка с сайта</b>\n\n';
  message += `👤 <b>Имя:</b> ${escapeHtml(data.name)}\n`;
  message += `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}\n`;

  if (data.pet) {
    message += `🐾 <b>Питомец:</b> ${escapeHtml(data.pet)}\n`;
  }
  if (data.comment) {
    message += `💬 <b>Комментарий:</b> ${escapeHtml(data.comment)}\n`;
  }
  if (data.doctor) {
    message += `👨‍⚕️ <b>Врач:</b> ${escapeHtml(data.doctor)}\n`;
  }
  if (data.service_name) {
    message += `🔧 <b>Услуга:</b> ${escapeHtml(data.service_name)}\n`;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    }
  );

  if (!response.ok) {
    const errorData = (await response.json()) as { description?: string };
    throw new Error(errorData.description || 'Ошибка отправки в Telegram');
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
