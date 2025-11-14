'use client';

import { Promo } from '@/shared/api/promos/types';
import PromoCard from '@/shared/ui/PromoCard/PromoCard';
import Button from '@/shared/ui/Button/Button';

interface IPromosBlockClientProps {
  title: string;
  promos: Promo[];
}

const PromosBlockClient = ({ title, promos }: IPromosBlockClientProps) => {
  if (!promos || promos.length === 0) {
    return null;
  }

  // Ограничиваем до 3 карточек на главной странице
  const displayPromos = promos.slice(0, 3);
  const hasMorePromos = promos.length > 3;

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24 xl:px-32">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
            {title}
          </h2>
        </div>

        {/* Сетка промо */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          {displayPromos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} variant="default" />
          ))}
        </div>

        {/* Кнопка "Все акции" */}
        {hasMorePromos && (
          <div className="flex justify-center">
            <Button href="/promos" theme="green" size="2xl" rounded="full">
              Все акции
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromosBlockClient;
