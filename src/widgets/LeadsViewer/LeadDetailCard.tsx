const LABELS: Record<string, string> = {
  id: 'ID',
  created: 'Создано',
  modified: 'Изменено',
  name: 'Имя',
  phone: 'Телефон',
  pet: 'Питомец',
  comment: 'Комментарий',
  doctor: 'Врач',
  service_name: 'Услуга',
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'да' : 'нет';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

interface LeadDetailCardProps {
  leadId: number;
  data: Record<string, unknown>;
}

export default function LeadDetailCard({ leadId, data }: LeadDetailCardProps) {
  const entries = Object.entries(data).filter(([key]) => !key.startsWith('_'));

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white p-8 md:p-10 shadow border border-neutral-200">
      <h1 className="text-[2.4rem] md:text-[3rem] font-bold text-cBlack mb-2">
        Заявка #{leadId}
      </h1>
      <p className="text-cBlack/60 mb-8 text-[1.4rem]">
        Данные из системы учёта заявок.
      </p>
      <dl className="space-y-5">
        {entries.map(([key, value]) => (
          <div key={key} className="border-b border-neutral-100 pb-4 last:border-0">
            <dt className="text-[1.3rem] font-semibold text-cGreen uppercase tracking-wide mb-1">
              {LABELS[key] ?? key}
            </dt>
            <dd className="text-[1.6rem] md:text-[1.8rem] text-cBlack whitespace-pre-wrap break-words">
              {formatValue(value)}
            </dd>
          </div>
        ))}
      </dl>
      {entries.length === 0 ? (
        <p className="text-cBlack/60 mt-4">Нет полей для отображения.</p>
      ) : null}
    </div>
  );
}
