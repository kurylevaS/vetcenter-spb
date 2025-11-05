import { AboutBlock } from '@/shared/api/pages/main/types';
import AboutUsBlockClient from './AboutUsBlockClient';

interface IAboutUsBlockProps {
  aboutBlock: AboutBlock;
}

const AboutUsBlock = async ({ aboutBlock }: IAboutUsBlockProps) => {
  if (!aboutBlock) {
    return null;
  }

  return (
    <AboutUsBlockClient
      title={aboutBlock.title}
      description={aboutBlock.description}
      button={aboutBlock.button}
      gallery={aboutBlock.gallery}
    />
  );
};

export default AboutUsBlock;
