'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface IServiceTypeMainBlockClientProps {
  title: string;
  description: string;
  gallery: string[];
}

const ServiceTypeMainBlockClient = ({ title, description, gallery }: IServiceTypeMainBlockClientProps) => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Кнопка назад */}
        <div className="mb-6 md:mb-12">
          <Link
            href="/service-types"
            className="inline-flex items-center gap-8 text-cBlack hover:text-cGreen transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[2.4rem] h-[2.4rem]"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[2rem] md:text-[4.2rem] font-bold">{title}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 px-16 w-full gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Галерея */}
          {gallery && gallery.length > 0 && (
            <div className="relative w-full aspect-[4/3]">
              <div className="relative w-full h-full rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] overflow-hidden shadow-lg">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-white !w-[1.2rem] !h-[1.2rem] !rounded-full',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-cGreen !w-[2.4rem]',
                  }}
                  className="service-type-main-swiper !h-full"
                >
                  {gallery.map((image, index) => (
                    <SwiperSlide key={index} className="!h-full">
                      <div className="relative w-full h-full">
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
          )}

          {/* Заголовок и описание */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <div 
              className="space-y-4 md:space-y-6 text-2xl md:text-xl lg:text-2xl text-cBlack/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTypeMainBlockClient;

