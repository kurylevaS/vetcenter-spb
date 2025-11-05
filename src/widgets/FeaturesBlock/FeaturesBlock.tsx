import { FeaturesBlock as FeaturesBlockType } from '@/shared/api/pages/main/types';
import FeaturesBlockClient from './FeaturesBlockClient';

interface IFeaturesBlockProps {
  featuresBlock: FeaturesBlockType;
}

const FeaturesBlock = async ({ featuresBlock }: IFeaturesBlockProps) => {
  if (!featuresBlock) {
    return null;
  }

  return (
    <FeaturesBlockClient
      title={featuresBlock.title}
      features={featuresBlock.features}
    />
  );
};

export default FeaturesBlock;
