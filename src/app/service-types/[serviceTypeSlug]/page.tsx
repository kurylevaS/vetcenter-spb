import type { Metadata } from 'next';
import { getServiceTypeBySlug } from '@/shared/api/serviceTypes/getServiceTypeBySlug';
import { getServiceByServiceType } from '@/shared/api/serviceTypes/getServiceByTaxonomy';
import ServiceTypeMainBlock from '@/widgets/ServiceTypeMainBlock/ServiceTypeMainBlock';
import ServicesListBlock from '@/widgets/ServicesListBlock/ServicesListBlock';
import {
  createMetadata,
  SEO_DEFAULTS,
  stripHtml,
  buildBreadcrumbJsonLd,
} from '@/shared/lib/seo';

interface IServiceTypePageProps {
  params: {
    serviceTypeSlug: string;
  };
  searchParams: {
    search?: string;
  };
}

export default async function ServiceTypePage({
  params,
  searchParams,
}: IServiceTypePageProps) {
  const { serviceTypeSlug } = params;

  // Получаем информацию о категории услуги
  const serviceType = await getServiceTypeBySlug(serviceTypeSlug);

  if (!serviceType) {
    return null;
  }

  // Получаем услуги этой категории с параметром поиска
  const services = await getServiceByServiceType(
    serviceType['service-type'][0],
    {
      search: searchParams.search,
    }
  );

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Категории услуг', url: '/service-types' },
    {
      name:
        serviceType.acf?.name ||
        serviceType.title?.rendered ||
        'Категория услуг',
      url: `/service-types/${serviceType.slug}`,
    },
  ]);

  return (
    <>
      <main>
        <ServiceTypeMainBlock serviceType={serviceType} />
        <ServicesListBlock
          services={services}
          initialSearch={searchParams.search}
        />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd),
        }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { serviceTypeSlug: string };
}): Promise<Metadata> {
  const serviceType = await getServiceTypeBySlug(params.serviceTypeSlug);

  if (!serviceType) {
    return createMetadata({
      title: `Категория не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница категории услуг не найдена.',
      canonicalPath: `/service-types/${params.serviceTypeSlug}`,
      type: 'website',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  const title =
    serviceType.acf?.name || serviceType.title?.rendered || 'Категория услуг';
  const description =
    stripHtml(serviceType.acf?.description, 180) ||
    SEO_DEFAULTS.defaultDescription;
  const ogImage =
    serviceType.acf?.gallery?.[0] || serviceType.acf?.icon || null;

  return createMetadata({
    title: `${title} | ${SEO_DEFAULTS.siteName}`,
    description,
    canonicalPath: `/service-types/${serviceType.slug}`,
    ogImage,
    type: 'website',
  });
}
