import type { Metadata } from 'next';
import { getServiceTypes } from '@/shared/api/serviceTypes/getServiceTypes';
import ServicesListBlock from '@/widgets/ServicesListBlock/ServicesListBlock';
import { getServices } from '@/shared/api/services/getServices';
import {
  createMetadata,
  SEO_DEFAULTS,
  buildBreadcrumbJsonLd,
  buildAbsoluteUrl,
} from '@/shared/lib/seo';

const PAGE_TITLE = 'Услуги ветеринарного центра Приморский';
const PAGE_DESCRIPTION =
  'Диагностика, профилактика, хирургия и комплексный уход за питомцами — полный перечень услуг ветеринарного центра «Приморский» в Санкт-Петербурге.';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description: PAGE_DESCRIPTION,
    canonicalPath: '/services',
    type: 'website',
  });
}

interface IServicesPageProps {
  searchParams: {
    search?: string;
    service_type?: string;
  };
}

export default async function ServicesPage({
  searchParams,
}: IServicesPageProps) {
  // Получаем все типы услуг для фильтров
  const serviceTypes = await getServiceTypes();

  // Получаем услуги с параметрами поиска и фильтрации
  const serviceTypeId = searchParams.service_type
    ? parseInt(searchParams.service_type)
    : undefined;

  const services = await getServices({
    search: searchParams.search,
    serviceType: serviceTypeId,
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (services || []).slice(0, 12).map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.acf?.name || service.title?.rendered || 'Услуга',
      url: buildAbsoluteUrl(`/services/${service.slug}`),
    })),
  };

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Услуги', url: '/services' },
  ]);

  return (
    <>
      <main>
        <ServicesListBlock
          services={services || []}
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
