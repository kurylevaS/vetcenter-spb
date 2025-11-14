import type { Metadata } from 'next';
import { getPromos } from '@/shared/api/promos/getPromos';
import PromosListBlock from '@/widgets/PromosListBlock/PromosListBlock';
import {
  createMetadata,
  SEO_DEFAULTS,
  buildBreadcrumbJsonLd,
  buildAbsoluteUrl,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

const PAGE_TITLE = 'Акции и специальные предложения';
const PAGE_DESCRIPTION =
  'Специальные предложения и акции ветеринарного центра «Приморский» в Санкт-Петербурге. Выгодные условия для ваших питомцев.';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description: PAGE_DESCRIPTION,
    canonicalPath: '/promos',
    type: 'website',
  });
}

interface IPromosPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function PromosPage({ searchParams }: IPromosPageProps) {
  // Получаем промо с параметрами поиска
  const promos = await getPromos({
    search: searchParams.search,
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (promos || []).slice(0, 12).map((promo, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: promo.acf?.title || promo.title?.rendered || 'Акция',
      url: buildAbsoluteUrl(`/promos/${promo.slug}`),
    })),
  };

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Акции', url: '/promos' },
  ]);

  return (
    <>
      <main>
        <PromosListBlock
          promos={promos || []}
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
