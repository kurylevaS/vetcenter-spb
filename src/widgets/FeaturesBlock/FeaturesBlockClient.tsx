'use client';

import FeatureCard from '@/shared/ui/FeatureCard/FeatureCard';

interface Feature {
  feature: {
    title: string;
    description: string;
    icon: string;
  };
}

interface IFeaturesBlockClientProps {
  title: string;
  features: Feature[];
}

const FeaturesBlockClient = ({ title, features }: IFeaturesBlockClientProps) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
            {title}
          </h2>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.feature.title}
              description={feature.feature.description}
              icon={feature.feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBlockClient;

