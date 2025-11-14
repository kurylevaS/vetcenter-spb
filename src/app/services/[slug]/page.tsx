import type { Metadata } from 'next';
import { getServiceBySlug } from '@/shared/api/services/getServiceBySlug';
import { getMainPage } from '@/shared/api/pages/main';
import ServiceMainBlock from '@/widgets/ServiceMainBlock/ServiceMainBlock';
import ServicePromosBlock from '@/widgets/ServicePromosBlock/ServicePromosBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import { notFound } from 'next/navigation';
import {
  createMetadata,
  SEO_DEFAULTS,
  stripHtml,
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

interface IServicePageProps {
  params: {
    slug: string;
  };
}

export default async function ServicePage({ params }: IServicePageProps) {
  const { slug } = params;

  // Получаем информацию об услуге
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceTitle = service.acf?.name || service.title?.rendered || 'Услуга';
  const serviceDescriptionHtml =
    service.acf?.description || service.content?.rendered || '';
  const serviceDescriptionText = stripHtml(serviceDescriptionHtml, 180);
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Услуги', url: '/services' },
    { name: serviceTitle, url: `/services/${service.slug}` },
  ]);
  const serviceJsonLd = buildServiceJsonLd({
    name: serviceTitle,
    description: serviceDescriptionText,
    slug: service.slug,
    image: service.acf?.image || null,
  });

  // Получаем промо из acf.promos
  const promoIds =
    service.acf.promos && Array.isArray(service.acf.promos)
      ? service.acf.promos
          .map((item: any) => item.promo)
          .filter((id): id is number => typeof id === 'number' && id > 0)
      : [];

  // Получаем данные главной страницы для формы обратной связи
  const pageData = await getMainPage();

  return (
    <>
      <main>
        <ServiceMainBlock service={service} />
        {promoIds.length > 0 && <ServicePromosBlock promoIds={promoIds} />}
        {pageData?.feedback_block && (
          <FeedbackBlock feedbackBlock={pageData.feedback_block} />
        )}
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return createMetadata({
      title: `Услуга не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница услуги не найдена.',
      canonicalPath: `/services/${params.slug}`,
      type: 'article',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  const serviceTitle = service.acf?.name || service.title?.rendered || 'Услуга';
  const rawDescription =
    service.acf?.description || service.content?.rendered || '';
  const description =
    stripHtml(rawDescription, 180) || SEO_DEFAULTS.defaultDescription;
  const ogImage = service.acf?.image || null;

  return createMetadata({
    title: `${serviceTitle} | ${SEO_DEFAULTS.siteName}`,
    description,
    canonicalPath: `/services/${service.slug}`,
    ogImage,
    type: 'article',
  });
}
