import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Значение httpOnly-cookie после успешного ввода LEADS_ADMIN_CODE.
 * Не хранит сам код в браузере.
 */
export function getExpectedLeadsCookieValue(): string | null {
  const code = process.env.LEADS_ADMIN_CODE;
  const secret = process.env.LEADS_SESSION_SECRET;
  if (!code || !secret) {
    return null;
  }
  return createHmac('sha256', secret).update(code).digest('hex');
}

export function isValidLeadsSession(cookieValue: string | undefined): boolean {
  const expected = getExpectedLeadsCookieValue();
  if (!expected || !cookieValue) {
    return false;
  }
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(cookieValue, 'utf8');
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
