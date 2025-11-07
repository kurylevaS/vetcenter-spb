import { AboutMainBlock as AboutMainBlockType } from '@/shared/api/pages/about/types';
import AboutMainBlockClient from './AboutMainBlockClient';

interface IAboutMainBlockProps {
  mainBlock: AboutMainBlockType;
}

const AboutMainBlock = ({ mainBlock }: IAboutMainBlockProps) => {
  if (!mainBlock) {
    return null;
  }

  return (
    <AboutMainBlockClient
      title={mainBlock.title}
      content={mainBlock.content}
      gallery={mainBlock.gallery}
    />
  );
};

export default AboutMainBlock;
