import { sendSmsSmsc } from '@/server/smsc/sendSmsSmsc';
import { sendSmsMtsMarketer } from '@/server/mts/sendSmsMtsMarketer';

function resolveLeadSmsProvider(): 'mts' | 'smsc' {
  const explicit = process.env.SMS_PROVIDER?.toLowerCase().trim();
  if (explicit === 'mts' || explicit === 'mts_marketer') {
    return 'mts';
  }
  if (explicit === 'smsc') {
    return 'smsc';
  }

  const hasMts =
    Boolean(process.env.MTS_OMNI_LOGIN?.trim()) &&
    Boolean(process.env.MTS_OMNI_PASSWORD?.trim()) &&
    Boolean(process.env.MTS_SMS_SENDER?.trim());

  if (hasMts) {
    return 'mts';
  }

  return 'smsc';
}

/**
 * SMS администраторам после сохранения лида.
 * Провайдер: env `SMS_PROVIDER=mts` | `smsc`.
 * Если `SMS_PROVIDER` не задан, но указаны MTS_OMNI_* и MTS_SMS_SENDER — используется МТС.
 */
export async function sendLeadAdminSms(options: {
  phones: string[];
  message: string;
}): Promise<void> {
  const provider = resolveLeadSmsProvider();

  if (provider === 'mts') {
    await sendSmsMtsMarketer(options);
    return;
  }

  await sendSmsSmsc(options);
}
