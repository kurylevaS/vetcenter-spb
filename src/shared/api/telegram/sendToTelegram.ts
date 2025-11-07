export interface TelegramFormData {
  name: string;
  phone: string;
  pet?: string;
  comment?: string;
  doctor?: string;
  service_name?: string;
}

export const sendToTelegram = async (data: TelegramFormData): Promise<void> => {
  try {
    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || 'Ошибка отправки сообщения в Telegram'
      );
    }
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    throw error;
  }
};
