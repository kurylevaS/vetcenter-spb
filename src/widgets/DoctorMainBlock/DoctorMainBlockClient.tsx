'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DoctorFact } from '@/shared/api/doctors/getDoctors/types';
import Button from '@/shared/ui/Button/Button';
import { useOpenFeedbackModal } from '@/shared/hooks/useOpenFeedbackModal';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';

interface IDoctorMainBlockClientProps {
  fullName: string;
  specialization: string;
  facts: DoctorFact[];
  education: string;
  image: string;
}

const DoctorMainBlockClient = ({
  fullName,
  specialization,
  facts,
  education,
  image,
}: IDoctorMainBlockClientProps) => {
  const router = useRouter();
  const openFeedbackModal = useOpenFeedbackModal();
  const isLoading = useAppSelector((state) => state.feedbackModal.isLoading);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Проверяем, нужно ли показывать кнопку "Читать полностью"
  useEffect(() => {
    if (mounted && contentRef.current && education) {
      const element = contentRef.current;
      // Проверяем, превышает ли контент заданную высоту (например, 20rem)
      const maxHeight = 20 * 10; // 20rem в пикселях (1rem = 10px)
      setIsContentTruncated(element.scrollHeight > maxHeight);
    }
  }, [mounted, education]);

  // Блокируем скролл при открытии модалки
  useEffect(() => {
    if (isEducationModalOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем позицию скролла
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup при размонтировании
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isEducationModalOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEducationModalOpen) {
        setIsEducationModalOpen(false);
      }
    };

    if (isEducationModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEducationModalOpen]);

  // Предотвращаем скролл страницы при скролле внутри модального окна
  useEffect(() => {
    if (!isEducationModalOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const scrollableContent = target.closest('[data-scrollable="true"]');

      // Если скролл происходит не внутри скроллируемой области модального окна, предотвращаем его
      if (!scrollableContent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollableContent = target.closest('[data-scrollable="true"]');

      // Если touchmove происходит не внутри скроллируемой области модального окна, предотвращаем его
      if (!scrollableContent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Используем capture phase для перехвата событий раньше
    document.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: true,
    });
    document.addEventListener('touchmove', handleTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('touchmove', handleTouchMove, {
        capture: true,
      });
    };
  }, [isEducationModalOpen]);

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="w-full px-6 bg-[#FAFAFA] py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Кнопка назад */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-4 md:gap-6 text-cBlack hover:text-cGreen transition-colors"
            aria-label="Назад к списку врачей">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[2.4rem] h-[2.4rem]">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[1.6rem] md:text-[2rem] font-semibold">
              Назад
            </span>
          </button>
        </div>

        <h1 className="text-[2.6rem] md:text-[4rem] lg:text-[4.6rem] font-bold text-cBlack mb-6 md:mb-10">
          {fullName}
        </h1>

        {/* Блок с карточкой врача */}
        <div className="relative">
          {/* Зеленый фон под контентом */}
          <div className="absolute inset-x-0 bottom-0 bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[4rem] h-full lg:h-[90%] z-0" />

          {/* Контент поверх фона */}
          <div className="relative z-10">
            {/* Мобильная и планшетная версия */}
            <div className="lg:hidden">
              <div className="">
                {/* Верхняя часть - Имя/Специализация слева, Факты справа */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8 p-6 md:p-8">
                  {/* Левая колонка - Имя и Специализация */}
                  <div className="text-white space-y-3 md:space-y-4">
                    <p className="text-[2.4rem] md:text-[3.2rem] font-bold leading-tight">
                      {fullName}
                    </p>
                    <p className="text-[1.8rem] md:text-[2rem]">
                      {specialization}
                    </p>
                  </div>

                  {/* Правая колонка - Факты */}
                  <div className="text-white grid grid-cols-2 md:grid-cols-3 mt-4 gap-4 md:gap-6">
                    {facts.map((factItem, idx) => (
                      <div className="flex flex-col gap-1 md:gap-2" key={idx}>
                        <p className="text-[1.6rem] md:text-[1.8rem]">
                          {factItem.fact.title}
                        </p>
                        <p className="text-[2.4rem] md:text-[3.2rem] font-bold">
                          {factItem.fact.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Фотография снизу */}
                <div className="relative h-[36rem] flex justify-center w-full">
                  {image && (
                    <img
                      src={image}
                      alt={fullName}
                      className="h-full object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Кнопка за блоком */}
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <Button
                  onClick={() => openFeedbackModal({ doctor: fullName })}
                  theme="white"
                  size="2xl"
                  rounded="full"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}>
                  Записаться
                </Button>
              </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden lg:grid grid-cols-3 gap-8 xl:gap-12 items-center">
              {/* Левая колонка - Имя, Специализация, Образование */}
              <div className="text-white p-8 px-12 space-y-6 xl:space-y-8">
                <p className="text-[3.0rem] xl:text-[3.4rem] font-bold leading-tight">
                  {fullName}
                </p>

                {/* Специализация */}
                <p className="text-[2rem] xl:text-[2.4rem]">{specialization}</p>

                {/* Образование */}
                {education && (
                  <div className="pt-4">
                    <p className="text-[1.6rem] xl:text-[1.8rem] font-bold mb-3">
                      О специалисте:
                    </p>
                    <div className="relative">
                      {/* Контент с ограничением высоты */}
                      <div
                        ref={contentRef}
                        className="text-[1.4rem] xl:text-[1.6rem] leading-relaxed doctor-education-content max-h-[15rem] overflow-hidden relative">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: education,
                          }}
                        />
                        {/* Blur эффект на нижнем краю */}
                        {isContentTruncated && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[2rem] pointer-events-none"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(130, 168, 29, 1) 0%, rgba(130, 168, 29, 0.9) 30%, rgba(130, 168, 29, 0.5) 60%, transparent 100%)',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                            }}
                          />
                        )}
                      </div>
                      {isContentTruncated && (
                        <button
                          onClick={() => setIsEducationModalOpen(true)}
                          className="mt-4 text-white hover:text-white/80 underline font-semibold transition-colors relative z-10">
                          Читать полностью
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Центральная колонка - Фотография */}
              <div className="relative h-full w-full rounded-[2.4rem] xl:rounded-[3.2rem] overflow-hidden">
                {image && (
                  <img
                    src={image}
                    alt={fullName}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Правая колонка - Факты и Кнопка */}
              <div className="text-white space-y-6 xl:space-y-8 flex flex-col justify-center h-full relative">
                {/* Факты (Опыт, Операций) */}
                <div className="flex flex-col items-center gap-12 xl:gap-12">
                  {facts.map((factItem, idx) => (
                    <div className="flex flex-col items-center gap-2" key={idx}>
                      <p className="text-[2.2rem] xl:text-[2.2rem]">
                        {factItem.fact.title}
                      </p>
                      <p className="text-[4.2rem] xl:text-[4.6rem] font-bold">
                        {factItem.fact.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Кнопка */}
                <div className="pt-4 w-full flex justify-center items-center absolute bottom-20 xl:pt-6">
                  <Button
                    onClick={() => openFeedbackModal({ doctor: fullName })}
                    theme="white"
                    size="2xl"
                    rounded="full"
                    className="w-2/3"
                    isLoading={isLoading}
                    disabled={isLoading}>
                    Записаться
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно с полным текстом образования */}
      {isEducationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsEducationModalOpen(false)}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-[2.4rem] md:rounded-[3.2rem] max-w-[90vw] md:max-w-[80vw] lg:max-w-[70rem] max-h-[90vh] flex flex-col z-10"
            onClick={(e) => e.stopPropagation()}>
            {/* Кнопка закрытия */}
            <button
              onClick={() => setIsEducationModalOpen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-[4.8rem] h-[4.8rem] md:w-[5.6rem] md:h-[5.6rem] flex items-center justify-center rounded-full bg-[#FAFAFA] hover:bg-cGreen/10 transition-colors z-20"
              aria-label="Закрыть">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[2.4rem] h-[2.4rem] text-cBlack">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Заголовок - фиксированный */}
            <div className="p-6 md:p-8 lg:p-12 pb-4 md:pb-6 flex-shrink-0">
              <h3 className="text-[2.0rem] md:text-[2.4rem] lg:text-[3rem] font-bold text-cBlack mb-4">
                О специалисте: <br /> {fullName}
              </h3>
            </div>

            {/* Полный текст образования - скроллируемый */}
            <div
              data-scrollable="true"
              className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-12 pb-6 md:pb-8 lg:pb-12"
              onWheel={(e) => {
                // Разрешаем скролл внутри этой области
                e.stopPropagation();
              }}
              onTouchMove={(e) => {
                // Разрешаем touchmove внутри этой области
                e.stopPropagation();
              }}>
              <div
                className="text-[1.4rem] md:text-[1.6rem] lg:text-[1.8rem] text-cBlack/70 leading-relaxed doctor-education-content"
                dangerouslySetInnerHTML={{ __html: education }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorMainBlockClient;
