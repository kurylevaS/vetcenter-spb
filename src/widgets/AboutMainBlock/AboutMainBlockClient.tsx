'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface IAboutMainBlockClientProps {
  title: string;
  content: string;
  gallery: string[];
}

const AboutMainBlockClient = ({ title, content, gallery }: IAboutMainBlockClientProps) => {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col w-full gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Левая часть - Галерея */}
          <div className="relative w-full aspect-[20/9]">
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
                className="about-main-swiper !h-full"
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

          {/* Правая часть - Заголовок и контент */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10 order-1 lg:order-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
              {title}
            </h1>
            
            <div 
              className="space-y-4 md:space-y-6 text-2xl md:text-xl lg:text-2xl text-cBlack/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMainBlockClient;

