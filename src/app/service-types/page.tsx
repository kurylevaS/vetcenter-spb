import type { Metadata } from 'next';
import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import ServiceTypesListBlock from '@/widgets/ServiceTypesListBlock/ServiceTypesListBlock';
import {
  createMetadata,
  SEO_DEFAULTS,
  buildBreadcrumbJsonLd,
  buildAbsoluteUrl,
} from '@/shared/lib/seo';

const PAGE_TITLE = 'Категории ветеринарных услуг';
const PAGE_DESCRIPTION =
  'Выберите подходящий раздел: профилактика, диагностика, хирургия, уход и другие направления ветеринарной помощи в центре «Приморский».';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description: PAGE_DESCRIPTION,
    canonicalPath: '/service-types',
    type: 'website',
  });
}

interface IServiceTypesPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function ServiceTypesPage({
  searchParams,
}: IServiceTypesPageProps) {
  const serviceTypes = await getServiceTypes({
    search: searchParams.search,
  });

  if (!serviceTypes || serviceTypes.length === 0) {
    return null;
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: serviceTypes.slice(0, 12).map((serviceType, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name:
        serviceType.acf?.name ||
        serviceType.title?.rendered ||
        'Категория услуг',
      url: buildAbsoluteUrl(`/service-types/${serviceType.slug}`),
    })),
  };

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Категории услуг', url: '/service-types' },
  ]);

  return (
    <>
      <main>
        <ServiceTypesListBlock
          serviceTypes={serviceTypes}
          initialSearch={searchParams.search}
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
