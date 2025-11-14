'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/shared/ui/Button/Button';
import DiscountBadge from '@/shared/ui/DiscountBadge/DiscountBadge';
import { useOpenFeedbackModal } from '@/shared/hooks/useOpenFeedbackModal';
import { useAppSelector } from '@/shared/store/hooks/useAppSelector';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
interface IPromoMainBlockClientProps {
  title: string;
  description: string;
  image?: string;
  deadline?: string;
  conditions?: string;
  cost?: string;
  duration?: string;
  discountType?: 'procent' | 'fixed';
  discountAmount?: string;
}

const PromoMainBlockClient = ({
  title,
  description,
  image,
  deadline,
  conditions,
  cost,
  duration,
  discountType = 'procent',
  discountAmount,
}: IPromoMainBlockClientProps) => {
  const router = useRouter();
  const openFeedbackModal = useOpenFeedbackModal();
  const isLoading = useAppSelector((state) => state.feedbackModal.isLoading);

  const handleBack = () => {
    router.back();
  };

  // Форматируем скидку для отображения
  const discountText =
    discountType === 'procent' ? `-${discountAmount}%` : `-${discountAmount}₽`;

  return (
    <section className="w-full px-6 bg-white pt-6 pb-12 md:pb-16 lg:pb-20 xl:pb-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Кнопка назад и заголовок */}
        <div className="mb-6 md:mb-12 flex flex-col gap-4 md:gap-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-4 md:gap-6 w-fit text-cBlack hover:text-cGreen transition-colors"
            aria-label="Назад к списку акций">
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
          <h1 className="text-[2.6rem] md:text-[4rem] lg:text-[4.6rem] font-bold text-cBlack leading-tight">
            {title}
          </h1>
        </div>

        {/* Основной контент: изображение и описание */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Изображение акции */}
          {image && (
            <div className="relative w-full aspect-[4/3]">
              <div className="relative w-full h-full rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] overflow-hidden shadow-lg">
                <Image src={image} alt={title} fill className="object-cover" />
                {/* Бейдж со скидкой поверх изображения */}
                {discountAmount && (
                  <div className="absolute top-4 left-4 z-10">
                    <DiscountBadge text={discountText} size="lg" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Описание акции */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <div>
              <h2 className="text-[2rem] md:text-[2.4rem] font-bold text-cBlack mb-4 md:mb-6">
                Описание акции
              </h2>
              <div
                className="space-y-4 md:space-y-6 text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-cBlack/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            {/* Детали акции */}
            <div className="space-y-4 md:space-y-6">
              {cost && (
                <div>
                  <p className="text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] font-semibold text-cBlack">
                    Стоимость: <span className="text-cGreen">{cost}</span>
                  </p>
                </div>
              )}
              {conditions && (
                <div>
                  <p className="text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] font-semibold text-cBlack">
                    Акция подходит:{' '}
                    <span className="text-cGreen">{conditions}</span>
                  </p>
                </div>
              )}
              {deadline && (
                <div>
                  <p className="text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] font-semibold text-cBlack">
                    Срок действия:{' '}
                    <span className="text-cGreen">
                      до{' '}
                      {format(new Date(deadline), 'dd.MM.yyyy', { locale: ru })}
                    </span>
                  </p>
                </div>
              )}
              {duration && (
                <div>
                  <p className="text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] font-semibold text-cBlack">
                    Длительность:{' '}
                    <span className="text-cGreen">{duration}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Кнопка записи */}
            <div className="pt-4">
              <Button
                onClick={() => openFeedbackModal({ service_name: title })}
                theme="green"
                size="3xl"
                rounded="full"
                className="w-full md:w-auto px-8 md:px-12 lg:px-16"
                isLoading={isLoading}
                disabled={isLoading}>
                Записаться на услугу
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoMainBlockClient;
