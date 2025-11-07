'use client';

import { Service } from '@/shared/api/services/types';
import ServiceCard from '@/shared/ui/ServiceCard/ServiceCard';

interface IDoctorServicesBlockClientProps {
  services: Service[];
}

const DoctorServicesBlockClient = ({ services }: IDoctorServicesBlockClientProps) => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl text-left text-center lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Список услуг
          </h2>
        </div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.acf.icon}
              name={service.acf.name}
              href={`/services/${service.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorServicesBlockClient;

