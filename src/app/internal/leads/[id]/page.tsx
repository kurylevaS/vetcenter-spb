import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { isValidLeadsSession } from '@/server/leads/leadsSession';
import { wpGetLead } from '@/server/wp/leadsWp';
import LeadDetailCard from '@/widgets/LeadsViewer/LeadDetailCard';
import LeadsLoginGate from '@/widgets/LeadsViewer/LeadsLoginGate';

export const dynamic = 'force-dynamic';

export default async function InternalLeadPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) {
    notFound();
  }

  const cookieStore = cookies();
  const auth = cookieStore.get('leads_gate')?.value;

  if (!isValidLeadsSession(auth)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-neutral-50">
        <LeadsLoginGate />
      </div>
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await wpGetLead(id);
  } catch {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <p className="text-red-600 text-[1.6rem] text-center max-w-md">
          Не удалось загрузить заявку. Возможно, запись удалена или неверный
          идентификатор.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-10 md:py-16 px-4 bg-neutral-50">
      <LeadDetailCard leadId={id} data={data} />
    </div>
  );
}
