'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Doctor } from '@/shared/api/doctors/getDoctors/types';
import { ServiceType } from '@/shared/api/serviceTypes/getServiceTypes/types';
import DoctorCard from '@/shared/ui/DoctorCard/DoctorCard';

interface IDoctorsListBlockClientProps {
  doctors: Doctor[];
  initialSearch?: string;
  serviceTypes?: ServiceType[];
  initialServiceType?: number;
}

const DoctorsListBlockClient = ({
  doctors,
  initialSearch,
  serviceTypes,
  initialServiceType,
}: IDoctorsListBlockClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedServiceType, setSelectedServiceType] = useState<number | undefined>(initialServiceType);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Обновляем состояние при изменении URL параметров
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const serviceType = searchParams.get('service_type');
    setSearchQuery(search);
    setSelectedServiceType(serviceType ? parseInt(serviceType) : undefined);
  }, [searchParams]);

  // Cleanup для debounce таймера
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Закрытие меню фильтров при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

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

  // Функция для обновления фильтра по типу услуги
  const updateServiceTypeFilter = (serviceTypeId: number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (serviceTypeId) {
      params.set('service_type', serviceTypeId.toString());
    } else {
      params.delete('service_type');
    }
    // Сохраняем поисковый запрос
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    router.push(`?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  // Получаем ID из service-type массива для фильтров
  const getServiceTypeIdForFilter = (serviceType: ServiceType): number | undefined => {
    return serviceType['service-type'] && serviceType['service-type'].length > 0
      ? serviceType['service-type'][0]
      : undefined;
  };

  // Фильтрация врачей по поисковому запросу и типу услуги
  const filteredDoctors = useMemo(() => {
    let filtered = doctors;

    // Фильтр по типу услуги (если выбран)
    if (selectedServiceType) {
      filtered = filtered.filter((doctor) =>
        doctor['service-type']?.includes(selectedServiceType)
      );
    }

    // Фильтр по поисковому запросу (по title.rendered)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((doctor) => {
        const title = doctor.title.rendered?.toLowerCase() || '';
        const fullName = doctor.acf.full_name?.toLowerCase() || '';
        const specialization = doctor.acf.specialization?.toLowerCase() || '';
        return title.includes(query) || fullName.includes(query) || specialization.includes(query);
      });
    }

    return filtered;
  }, [doctors, searchQuery, selectedServiceType]);

  return (
    <section className="w-full px-6 bg-white pt-6 pb-12 md:pb-16 lg:pb-20 xl:pb-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl text-left lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Врачи
          </h2>
        </div>

        {/* Строка поиска и фильтров */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
            {/* Поиск */}
            <div className="relative flex-1 max-w-full md:max-w-md lg:max-w-2xl">
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

            {/* Кнопка фильтров */}
            {serviceTypes && serviceTypes.length > 0 && (
              <div className="relative" ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-4 px-6 py-4 md:py-5 rounded-full bg-cGreen text-white text-[1.6rem] md:text-[1.8rem] font-medium hover:bg-cGreen/90 transition-colors"
                >
                  <span>Фильтры</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-[2.4rem] h-[2.4rem]"
                  >
                    <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Выпадающее меню фильтров */}
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-[1.6rem] shadow-lg p-4 min-w-[200px] z-10 border-2 border-cGreen/20">
                    <button
                      onClick={() => updateServiceTypeFilter(undefined)}
                      className={`w-full text-left px-4 py-3 rounded-[1.2rem] mb-2 text-[1.6rem] transition-colors ${
                        !selectedServiceType
                          ? 'bg-cGreen text-white'
                          : 'bg-[#FAFAFA] text-cBlack hover:bg-cGreen/10'
                      }`}
                    >
                      Все врачи
                    </button>
                    {serviceTypes.map((serviceType) => {
                      const serviceTypeIdForFilter = getServiceTypeIdForFilter(serviceType);
                      if (!serviceTypeIdForFilter) return null;
                      
                      return (
                        <button
                          key={serviceType.id}
                          onClick={() => updateServiceTypeFilter(serviceTypeIdForFilter)}
                          className={`w-full text-left px-4 py-3 rounded-[1.2rem] mb-2 text-[1.6rem] transition-colors ${
                            selectedServiceType === serviceTypeIdForFilter
                              ? 'bg-cGreen text-white'
                              : 'bg-[#FAFAFA] text-cBlack hover:bg-cGreen/10'
                          }`}
                        >
                          {serviceType.title.rendered}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Сетка врачей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[1.8rem] md:text-[2rem] text-cBlack/60">
                По заданным запросам ничего не найдено
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorsListBlockClient;

