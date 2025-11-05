'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Review } from '@/shared/api/pages/main/types';

import 'swiper/css';
import 'swiper/css/pagination';

interface IReviewsBlockClientProps {
  title: string;
  gallery: string[];
  reviews: Review[];
}

const ReviewsBlockClient = ({ title, gallery, reviews }: IReviewsBlockClientProps) => {
  if (!gallery || gallery.length === 0 || !reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-12 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center md:text-left text-cBlack">
            {title}
          </h2>
        </div>

        {/* Контент: Галерея слева, Отзывы справа */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Левая часть - Галерея */}
          <div className="relative md:col-span-1 lg:col-span-1">
            <div className="relative rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] overflow-hidden shadow-lg">
              <Swiper
                modules={[Pagination, EffectFade, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                effect="fade"
                fadeEffect={{
                  crossFade: true,
                }}
                speed={800}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-white/90 !w-[0.8rem] !h-[0.8rem] lg:!w-[1rem] lg:!h-[1rem] !rounded-full',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-[2rem] lg:!w-[2.4rem]',
                }}
                className="reviews-gallery-swiper"
              >
                {gallery.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]">
                      <Image
                        src={image}
                        alt={`${title} - изображение ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Правая часть - Блок с отзывами */}
          <div className="relative md:col-span-1 lg:col-span-2">
            <div className="bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[4rem] p-6 md:p-8 lg:p-8 xl:p-12 relative overflow-hidden">
              <Swiper
                modules={[Pagination, EffectFade, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                effect="fade"
                fadeEffect={{
                  crossFade: true,
                }}
                speed={800}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-white/90 !w-[0.8rem] !h-[0.8rem] lg:!w-[1rem] lg:!h-[1rem] !rounded-full',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-[2rem] lg:!w-[2.4rem]',
                }}
                className="reviews-swiper"
              >
                {reviews.map((reviewItem, index) => (
                  <SwiperSlide key={index}>
                    {/* Мобильная версия */}
                    <div className="lg:hidden text-white pb-28">
                      {/* Автор и изображение */}
                      <div className="flex items-center xl:flex-row flex-col gap-4 md:gap-6 mb-6 md:mb-8">
                        {/* Изображение автора */}
                        {reviewItem.review.author_image && (
                          <div className="relative w-96 h-96 md:w-96 md:h-96 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20">
                            <Image
                              src={reviewItem.review.author_image}
                              alt={reviewItem.review.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Имя автора */}
                        <h3 className="text-[2rem] md:text-[2.4rem] font-bold leading-tight">
                          {reviewItem.review.author}
                        </h3>
                      </div>

                      {/* Текст отзыва */}
                      <div
                        dangerouslySetInnerHTML={{ __html: reviewItem.review.review_text }}
                        className="text-[1.6rem] md:text-[1.8rem] leading-relaxed opacity-90"
                      />
                    </div>

                    {/* Десктопная версия */}
                    <div className="hidden lg:block text-white">
                      <div className="flex items-start gap-6 xl:gap-10">
                        {/* Изображение автора */}
                        {reviewItem.review.author_image && (
                          <div className="relative w-96 h-96 xl:w-96 xl:h-96 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20">
                            <Image
                              src={reviewItem.review.author_image}
                              alt={reviewItem.review.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Имя автора и текст отзыва */}
                        <div className="flex flex-col gap-4">
                          <div className="flex-1 pt-2">
                            <h3 className="text-[2.4rem] xl:text-[3.2rem] font-bold leading-tight">
                              {reviewItem.review.author}
                            </h3>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{ __html: reviewItem.review.review_text }}
                            className="text-[1.6rem] xl:text-[1.6rem] leading-relaxed opacity-90"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsBlockClient;

