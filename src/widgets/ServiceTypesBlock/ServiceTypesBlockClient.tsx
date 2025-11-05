'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ServiceTypeById } from '@/shared/api/serviceTypes/getServiceTypeById/types';

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
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] aspect-[2/1] flex flex-col items-center justify-center p-6 md:p-8 lg:p-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Мобильная/планшетная версия - вертикальная компоновка */}
              <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 lg:hidden">
                {/* Иконка */}
                {service.acf.icon && (
                  <div className="w-[6.4rem] h-[6.4rem] md:w-[8rem] md:h-[8rem] relative flex-shrink-0">
                    <Image
                      src={service.acf.icon}
                      alt={service.acf.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                
                {/* Название услуги */}
                <h3 className="text-[2.4rem] md:text-[2.72rem] font-semibold text-cBlack group-hover:text-cGreen transition-colors">
                  {service.acf.name}
                </h3>
              </div>

              {/* Десктопная версия - горизонтальная компоновка */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                {/* Иконка слева */}
                {service.acf.icon && (
                  <div className="w-[10rem] h-[10rem] lg:w-[6.4rem] lg:h-[6.4rem] xl:w-[8rem] xl:h-[8rem] relative flex-shrink-0">
                    <Image
                      src={service.acf.icon}
                      alt={service.acf.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                
                {/* Название услуги справа */}
                <h3 className="text-[2.88rem] lg:text-[2rem] xl:text-[2.4rem] font-semibold text-cBlack group-hover:text-cGreen transition-colors">
                  {service.acf.name}
                </h3>
              </div>
            </Link>
          ))}

          {/* Кнопка "Другие услуги" */}
          <Link
              href="/services"
              className="bg-cGreen aspect-[2/1] rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] p-6 md:p-8 lg:p-10 flex items-center justify-center group hover:bg-cGreen/90 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-[1.6rem] md:gap-[2.4rem] lg:gap-[1.6rem] xl:gap-[1.6rem]">
                <span className="text-white text-[2.4rem] md:text-[2.72rem] lg:text-[2rem] xl:text-[2.4rem] font-semibold">
                  Другие услуги
                </span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[4rem] h-[4rem] md:w-[4.8rem] md:h-[4.8rem] lg:w-[2rem] lg:h-[2rem] xl:w-[2.4rem] xl:h-[2.4rem] text-white group-hover:translate-x-1 transition-transform"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceTypesBlockClient;

