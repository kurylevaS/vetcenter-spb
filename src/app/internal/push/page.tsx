import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { isValidLeadsSession } from '@/server/leads/leadsSession';
import LeadsLoginGate from '@/widgets/LeadsViewer/LeadsLoginGate';
import PushSetupClient from '@/widgets/PushSetup/PushSetupClient';

export const metadata: Metadata = {
  title: 'Уведомления администратора',
};

export const dynamic = 'force-dynamic';

export default function PushSetupPage() {
  const cookieStore = cookies();
  const auth = cookieStore.get('leads_gate')?.value;

  if (!isValidLeadsSession(auth)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-neutral-50">
        <LeadsLoginGate />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-10 md:py-16 px-4 bg-neutral-50">
      <PushSetupClient />
    </div>
  );
}
