import FeaturesBlockClient from './FeaturesBlockClient';

interface Feature {
  feature: {
    title: string;
    description: string;
    icon: string;
  };
}

interface FeaturesBlockType {
  title: string;
  features: Feature[];
}

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
