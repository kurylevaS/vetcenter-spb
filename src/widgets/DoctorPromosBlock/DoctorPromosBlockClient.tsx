'use client';

import { Promo } from '@/shared/api/promos/types';
import PromoCard from '@/shared/ui/PromoCard/PromoCard';

interface IDoctorPromosBlockClientProps {
  promos: Promo[];
}

const DoctorPromosBlockClient = ({ promos }: IDoctorPromosBlockClientProps) => {
  if (!promos || promos.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-[2.2rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4.6rem] font-bold text-cBlack">
            Акции врача
          </h2>
        </div>

        {/* Сетка промо */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorPromosBlockClient;
