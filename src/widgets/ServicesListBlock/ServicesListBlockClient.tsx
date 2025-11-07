'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceByTaxonomy } from '@/shared/api/serviceTypes/getServiceByTaxonomy/types';
import ServiceCard from '@/shared/ui/ServiceCard/ServiceCard';

interface IServicesListBlockClientProps {
  services: ServiceByTaxonomy;
  initialSearch?: string;
}

const ServicesListBlockClient = ({ services, initialSearch }: IServicesListBlockClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Обновляем состояние при изменении URL параметров
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

  // Cleanup для debounce таймера
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Функция для обновления URL с debounce
  const updateSearchParam = (value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300); // Debounce 300ms
  };

  // Фильтрация услуг по поисковому запросу
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return services;
    }

    const query = searchQuery.toLowerCase().trim();
    return services.filter((service) => {
      const name = service.acf.name?.toLowerCase() || '';
      const description = service.acf.description?.toLowerCase() || '';
      return name.includes(query) || description.includes(query);
    });
  }, [services, searchQuery]);

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl text-center lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Список услуг
          </h2>
        </div>

        {/* Строка поиска */}
        <div className="mb-8 md:mb-12">
          <div className="relative max-w-full md:max-w-md lg:max-w-2xl ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                updateSearchParam(value);
              }}
              placeholder="Введите ваш запрос"
              className="w-full px-6 py-4 md:py-5 pr-14 md:pr-16 rounded-full text-[1.6rem] md:text-[1.8rem] bg-[#FAFAFA] placeholder:text-cBlack/40 border-2 border-transparent focus:border-cGreen/30 focus:outline-none transition-colors"
            />
            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[2.4rem] h-[2.4rem] md:w-[2.8rem] md:h-[2.8rem] text-cBlack/40"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m21 21-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Сетка услуг */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.acf.icon}
                name={service.acf.name}
                href={`/services/${service.slug}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[1.8rem] md:text-[2rem] text-cBlack/60">
                По вашему запросу ничего не найдено
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesListBlockClient;

