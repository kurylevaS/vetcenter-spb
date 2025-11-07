import { getAboutPage } from '@/shared/api/pages/about';
import AboutMainBlock from '@/widgets/AboutMainBlock/AboutMainBlock';
import FeaturesBlock from '@/widgets/FeaturesBlock/FeaturesBlock';
import MapBlock from '@/widgets/MapBlock/MapBlock';

export default async function AboutPage() {
  const pageData = await getAboutPage();

  console.log(pageData);

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
