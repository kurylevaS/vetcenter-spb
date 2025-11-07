'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceType } from '@/shared/api/serviceTypes/getServiceTypes/types';
import ServiceCard from '@/shared/ui/ServiceCard/ServiceCard';

interface IServiceTypesListBlockClientProps {
  serviceTypes: ServiceType[];
  initialSearch?: string;
}

const ServiceTypesListBlockClient = ({ serviceTypes, initialSearch }: IServiceTypesListBlockClientProps) => {
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
  const filteredServiceTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return serviceTypes;
    }

    const query = searchQuery.toLowerCase().trim();
    return serviceTypes.filter((serviceType) => {
      const name = serviceType.acf.name?.toLowerCase() || '';
      const description = serviceType.acf.description?.toLowerCase() || '';
      return name.includes(query) || description.includes(query);
    });
  }, [serviceTypes, searchQuery]);

  if (!serviceTypes || serviceTypes.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Услуги
          </h1>
        </div>

        {/* Строка поиска */}
        <div className="mb-8 md:mb-12">
          <div className="relative max-w-full md:max-w-md lg:max-w-lg">
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

        {/* Сетка категорий услуг */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredServiceTypes.length > 0 ? (
            filteredServiceTypes.reverse().map((serviceType) => (
              <ServiceCard
                key={serviceType.id}
                icon={typeof serviceType.acf.icon === 'string' ? serviceType.acf.icon : undefined}
                name={serviceType.acf.name}
                href={`/service-types/${serviceType.slug}`}
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

export default ServiceTypesListBlockClient;

