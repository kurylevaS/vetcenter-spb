import type { Metadata } from 'next';
import { getPromoBySlug } from '@/shared/api/promos/getPromoBySlug';
import { getMainPage } from '@/shared/api/pages/main';
import PromoMainBlock from '@/widgets/PromoMainBlock/PromoMainBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import { notFound } from 'next/navigation';
import {
  createMetadata,
  SEO_DEFAULTS,
  stripHtml,
  buildBreadcrumbJsonLd,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

interface IPromoPageProps {
  params: {
    slug: string;
  };
}

export default async function PromoPage({ params }: IPromoPageProps) {
  const { slug } = params;

  // Получаем информацию об акции
  const promo = await getPromoBySlug(slug);

  if (!promo) {
    notFound();
  }

  const promoTitle = promo.acf?.title || promo.title?.rendered || 'Акция';
  const promoDescriptionHtml = promo.acf?.description || '';
  const promoDescriptionText = stripHtml(promoDescriptionHtml, 180);
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Акции', url: '/promos' },
    { name: promoTitle, url: `/promos/${promo.slug}` },
  ]);

  // Получаем данные главной страницы для формы обратной связи
  const pageData = await getMainPage();

  return (
    <>
      <main>
        <PromoMainBlock promo={promo} />
        {pageData?.feedback_block && (
          <FeedbackBlock feedbackBlock={pageData.feedback_block} />
        )}
      </main>
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
  const promo = await getPromoBySlug(params.slug);

  if (!promo) {
    return createMetadata({
      title: `Акция не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница акции не найдена.',
      canonicalPath: `/promos/${params.slug}`,
      type: 'article',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  const promoTitle = promo.acf?.title || promo.title?.rendered || 'Акция';
  const rawDescription = promo.acf?.description || '';
  const description =
    stripHtml(rawDescription, 180) || SEO_DEFAULTS.defaultDescription;
  const ogImage = promo.acf?.banner_image || promo.acf?.image || null;

  return createMetadata({
    title: `${promoTitle} | ${SEO_DEFAULTS.siteName}`,
    description,
    canonicalPath: `/promos/${promo.slug}`,
    ogImage,
    type: 'article',
  });
}
