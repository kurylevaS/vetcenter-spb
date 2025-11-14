import Image from 'next/image';
import Link from 'next/link';
import { Promo } from '@/shared/api/promos/types';
import DiscountBadge from '@/shared/ui/DiscountBadge/DiscountBadge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
interface IPromoCardProps {
  promo: Promo;
  className?: string;
  variant?: 'default' | 'compact'; // default - полная карточка, compact - компактная для списков
}

const PromoCard = ({
  promo,
  className = '',
  variant = 'default',
}: IPromoCardProps) => {
  const title = promo.acf?.title || promo.title?.rendered || 'Акция';
  const description = promo.acf?.description || '';
  const image = promo.acf?.banner_image || promo.acf?.image || '';
  const deadline = promo.acf?.deadline || '';
  const conditions = promo.acf?.conditions || '';
  const cost = promo.acf?.cost || '';
  const duration = promo.acf?.duration || '';
  const discountType = promo.acf?.type || 'procent';
  const discountAmount = promo.acf?.amount || '';

  // Форматируем скидку для отображения
  const discountText =
    discountType === 'procent' ? `-${discountAmount}%` : `-${discountAmount}₽`;

  if (variant === 'compact') {
    // Компактная версия для списков (как на главной странице)
    return (
      <Link
        href={`/promos/${promo.slug}`}
        className={`group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 md:gap-6 ${className}`}>
        {/* Иконка/изображение */}
        {promo.acf?.image && (
          <div className="w-[6.4rem] h-[6.4rem] md:w-[8rem] md:h-[8rem] relative flex-shrink-0">
            <Image
              src={promo.acf.image}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Название */}
        <div className="flex-1">
          <h3 className="text-[1.8rem] md:text-[2.4rem] font-semibold text-cBlack group-hover:text-cGreen transition-colors">
            {title}
          </h3>
        </div>

        {/* Бейдж со скидкой */}
        {discountAmount && (
          <div className="relative flex-shrink-0">
            <DiscountBadge text={discountText} size="sm" />
          </div>
        )}
      </Link>
    );
  }

  // Полная версия карточки
  return (
    <Link
      href={`/promos/${promo.slug}`}
      className={`group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem]  hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row ${className}`}>
      {/* Изображение */}
      {image && (
        <div className="relative w-full md:w-1/2 h-[20rem] md:h-auto aspect-square md:aspect-auto">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 rounded-[2.4rem] md:rounded-[3.2rem] transition-transform duration-300"
          />
          {/* Бейдж со скидкой поверх изображения */}
          {discountAmount && (
            <div className="absolute -top-12 -left-12 z-10">
              <DiscountBadge text={discountText} size="md" />
            </div>
          )}
        </div>
      )}

      {/* Контент */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          {/* Заголовок */}
          <h3 className="text-[2.4rem] md:text-[3.2rem] lg:text-[2.8rem] font-bold text-cBlack mb-4 md:mb-6">
            {title}
          </h3>

          {/* Описание */}
          {description && (
            <div
              className="text-[1.6rem] md:text-[1.8rem] text-cBlack/70 mb-6 md:mb-8 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* Детали акции */}
          <div className="space-y-2 md:space-y-3">
            {cost && (
              <div className="text-[1.4rem] md:text-[1.6rem] text-cBlack">
                <span className="font-semibold">Стоимость:</span> {cost}
              </div>
            )}
            {conditions && (
              <div className="text-[1.4rem] md:text-[1.6rem] text-cBlack">
                <span className="font-semibold">Акция подходит:</span>{' '}
                {conditions}
              </div>
            )}
            {deadline && (
              <div className="text-[1.4rem] md:text-[1.6rem] text-cBlack">
                <span className="font-semibold">Срок действия:</span> до{' '}
                {format(new Date(deadline), 'dd.MM.yyyy', { locale: ru })}
              </div>
            )}
            {duration && (
              <div className="text-[1.4rem] md:text-[1.6rem] text-cBlack">
                <span className="font-semibold">Длительность:</span> {duration}
              </div>
            )}
          </div>
        </div>

        {/* Кнопка */}
        <div className="mt-6 md:mt-8">
          <span className="text-cGreen underline text-[1.6rem] md:text-[1.8rem] font-semibold group-hover:text-cBlack transition-colors">
            Подробнее
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PromoCard;
