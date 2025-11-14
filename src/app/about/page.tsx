import type { Metadata } from 'next';
import { getAboutPage } from '@/shared/api/pages/about';
import AboutMainBlock from '@/widgets/AboutMainBlock/AboutMainBlock';
import FeaturesBlock from '@/widgets/FeaturesBlock/FeaturesBlock';
import MapBlock from '@/widgets/MapBlock/MapBlock';
import { createMetadata, SEO_DEFAULTS, stripHtml } from '@/shared/lib/seo';

const PAGE_TITLE = 'О ветеринарном центре Приморский';
const PAGE_DESCRIPTION =
  'Узнайте подробнее о ветеринарном центре «Приморский»: история клиники, команда специалистов и подход к заботе о вашем питомце.';

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage().catch(() => null);

  const description = aboutPage
    ? stripHtml(aboutPage?.main_block?.content, 180) || PAGE_DESCRIPTION
    : PAGE_DESCRIPTION;

  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description,
    canonicalPath: '/about',
    type: 'website',
  });
}

export default async function AboutPage() {
  const pageData = await getAboutPage();

  if (!pageData) {
    return null;
  }

  return (
    <>
      <main>
        <AboutMainBlock mainBlock={pageData.main_block} />
        <FeaturesBlock featuresBlock={pageData.features_block} />
        <MapBlock />
      </main>
    </>
  );
}
