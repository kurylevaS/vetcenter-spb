import { NextRequest, NextResponse } from 'next/server';
import { TelegramFormData } from '@/shared/api/telegram/sendToTelegram';

export async function POST(request: NextRequest) {
  try {
    const data: TelegramFormData = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN не установлен');
      return NextResponse.json(
        { error: 'Конфигурация Telegram бота не найдена' },
        { status: 500 }
      );
    }

    if (!chatId) {
      console.error('TELEGRAM_CHAT_ID не установлен');
      return NextResponse.json(
        { error: 'Chat ID не настроен' },
        { status: 500 }
      );
    }

    // Формируем сообщение
    let message = '📋 <b>Новая заявка с сайта</b>\n\n';
    message += `👤 <b>Имя:</b> ${data.name}\n`;
    message += `📞 <b>Телефон:</b> ${data.phone}\n`;

    if (data.pet) {
      message += `🐾 <b>Питомец:</b> ${data.pet}\n`;
    }

    if (data.comment) {
      message += `💬 <b>Комментарий:</b> ${data.comment}\n`;
    }

    if (data.doctor) {
      message += `👨‍⚕️ <b>Врач:</b> ${data.doctor}\n`;
    }

    if (data.service_name) {
      message += `🔧 <b>Услуга:</b> ${data.service_name}\n`;
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
      const errorData = await response.json();
      throw new Error(
        errorData.description || 'Ошибка отправки сообщения в Telegram'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ошибка отправки в Telegram:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка отправки сообщения' },
      { status: 500 }
    );
  }
}
