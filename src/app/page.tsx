import type { Metadata } from 'next';
import { getMainPage } from '@/shared/api/pages/main';
import MainBlockMainPage from '@/widgets/MainBlockMainPage/MainBlockMainPage';
import ServiceTypesBlock from '@/widgets/ServiceTypesBlock/ServiceTypesBlock';
import AboutUsBlock from '@/widgets/AboutUsBlock/AboutUsBlock';
import FeaturesBlock from '@/widgets/FeaturesBlock/FeaturesBlock';
import TeamBlock from '@/widgets/TeamBlock/TeamBlock';
import ReviewsBlock from '@/widgets/ReviewsBlock/ReviewsBlock';
import PostsBlock from '@/widgets/PostsBlock/PostsBlock';
import { FeedbackBlock } from '@/widgets/FeedbackBlock/FeedbackBlock';
import PromosBlock from '@/widgets/PromosBlock/PromosBlock';
import { createMetadata, SEO_DEFAULTS } from '@/shared/lib/seo';

// ISR: главная страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.defaultDescription,
    canonicalPath: '/',
    type: 'website',
  });
}

export default async function Home() {
  const pageData = await getMainPage();

  if (!pageData || !pageData.main_block?.banner_slides) {
    return null;
  }

  return (
    <>
      <main>
        <MainBlockMainPage banner_slides={pageData.main_block.banner_slides} />
        <ServiceTypesBlock serviceBlock={pageData.service_block} />
        {pageData.promos_block && (
          <PromosBlock promosBlock={pageData.promos_block} />
        )}
        <AboutUsBlock aboutBlock={pageData.about_block} />
        <FeaturesBlock featuresBlock={pageData.features_block} />
        <TeamBlock teamBlock={pageData.team_block} />
        <ReviewsBlock reviewsBlock={pageData.reviews_block} />
        <PostsBlock blogBlock={pageData.blog_block} />

        <FeedbackBlock feedbackBlock={pageData.feedback_block} />
      </main>
    </>
  );
}
