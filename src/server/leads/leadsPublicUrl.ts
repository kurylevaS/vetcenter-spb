/** Базовый URL сайта для ссылок в SMS (без завершающего /). */
export function getLeadsPublicOrigin(): string {
  const explicit =
    process.env.LEADS_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_FRONT_BASE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export function parseAdminPhones(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(/[,;]+/)
    .map((s) => s.trim().replace(/^\+/, ''))
    .filter(Boolean);
}
