import { getMainPage } from '@/shared/api/pages/main';
import MainBlockMainPage from '@/widgets/MainBlockMainPage/MainBlockMainPage';
import ServiceTypesBlock from '@/widgets/ServiceTypesBlock/ServiceTypesBlock';
import AboutUsBlock from '@/widgets/AboutUsBlock/AboutUsBlock';
import FeaturesBlock from '@/widgets/FeaturesBlock/FeaturesBlock';
import TeamBlock from '@/widgets/TeamBlock/TeamBlock';

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
        <AboutUsBlock aboutBlock={pageData.about_block} />
        <FeaturesBlock featuresBlock={pageData.features_block} />
        <TeamBlock teamBlock={pageData.team_block} />
      </main>
    </>
  );
}
