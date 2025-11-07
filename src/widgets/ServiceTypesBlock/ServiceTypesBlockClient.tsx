'use client';

import { ServiceTypeById } from '@/shared/api/serviceTypes/getServiceTypeById/types';
import ServiceCard from '@/shared/ui/ServiceCard/ServiceCard';
import MoreServicesButton from '@/shared/ui/MoreServicesButton/MoreServicesButton';

interface IServiceTypesBlockClientProps {
  title: string;
  description: string;
  serviceTypes: ServiceTypeById[];
}

const ServiceTypesBlockClient = ({
  title,
  description,
  serviceTypes,
}: IServiceTypesBlockClientProps) => {
  // Ограничиваем до 8 карточек, остальное - кнопка
  const displayServices = serviceTypes.slice(0, 8);
  const hasMoreServices = serviceTypes.length > 8;

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24 xl:px-32">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок и описание */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
            <h2 className="text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
              {title}
            </h2>
            <div>
              <p className="text-2xl md:text-xl lg:text-2xl text-cBlack/70 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.acf.icon}
              name={service.acf.name}
              href={`/services/${service.slug}`}
            />
          ))}

          {/* Кнопка "Другие услуги" */}
          {hasMoreServices && <MoreServicesButton />}
        </div>
      </div>
    </section>
  );
};

export default ServiceTypesBlockClient;

