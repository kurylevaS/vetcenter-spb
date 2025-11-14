import type { Metadata } from 'next';
import { getDoctors } from '@/shared/api/doctors/getDoctors';
import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import DoctorsListBlock from '@/widgets/DoctorsListBlock/DoctorsListBlock';
import {
  createMetadata,
  SEO_DEFAULTS,
  buildBreadcrumbJsonLd,
  buildAbsoluteUrl,
} from '@/shared/lib/seo';

const PAGE_TITLE = 'Специалисты ветеринарного центра Приморский';
const PAGE_DESCRIPTION =
  'Команда ветеринарных врачей центра «Приморский»: опытные специалисты по диагностике, хирургии, реабилитации и уходу за питомцами.';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description: PAGE_DESCRIPTION,
    canonicalPath: '/doctors',
    type: 'website',
  });
}

interface IDoctorsPageProps {
  searchParams: {
    search?: string;
    service_type?: string;
  };
}

export default async function DoctorsPage({ searchParams }: IDoctorsPageProps) {
  // Получаем все типы услуг для фильтров
  const serviceTypes = await getServiceTypes();

  // Получаем врачей с параметрами поиска и фильтрации
  const serviceTypeId = searchParams.service_type
    ? parseInt(searchParams.service_type)
    : undefined;

  const doctors = await getDoctors({
    search: searchParams.search,
    serviceType: serviceTypeId,
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (doctors || []).slice(0, 12).map((doctor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: doctor.acf?.full_name || doctor.title?.rendered || 'Врач',
      url: buildAbsoluteUrl(`/doctors/${doctor.id}`),
    })),
  };

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Команда', url: '/doctors' },
  ]);

  return (
    <>
      <main>
        <DoctorsListBlock
          doctors={doctors || []}
          initialSearch={searchParams.search}
          serviceTypes={serviceTypes}
          initialServiceType={serviceTypeId}
        />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}
