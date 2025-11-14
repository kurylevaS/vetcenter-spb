'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Promo } from '@/shared/api/promos/types';
import PromoCard from '@/shared/ui/PromoCard/PromoCard';

interface IPromosListBlockClientProps {
  promos: Promo[];
  initialSearch?: string;
}

const PromosListBlockClient = ({
  promos,
  initialSearch,
}: IPromosListBlockClientProps) => {
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

  // Фильтрация промо по поисковому запросу
  const filteredPromos = useMemo(() => {
    if (!searchQuery.trim()) {
      return promos;
    }

    const query = searchQuery.toLowerCase().trim();
    return promos.filter((promo) => {
      const title = promo.acf?.title?.toLowerCase() || '';
      const description = promo.acf?.description?.toLowerCase() || '';
      return title.includes(query) || description.includes(query);
    });
  }, [promos, searchQuery]);

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl text-left text-center lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Акции
          </h1>
        </div>

        {/* Строка поиска */}
        <div className="mb-8 md:mb-12">
          <div className="relative w-full md:w-auto flex-1 max-w-full md:max-w-full lg:max-w-2xl">
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
                className="w-[2.4rem] h-[2.4rem] md:w-[2.8rem] md:h-[2.8rem] text-cBlack/40">
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

        {/* Сетка промо */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:gap-10">
          {filteredPromos.length > 0 ? (
            filteredPromos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} variant="default" />
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

export default PromosListBlockClient;
