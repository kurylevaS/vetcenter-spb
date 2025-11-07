'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AboutBlock } from '@/shared/api/pages/main/types';
import Button from '@/shared/ui/Button/Button';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface IAboutUsBlockClientProps {
  title: string;
  description: string;
  button: AboutBlock['button'];
  gallery: string[];
}

const AboutUsBlockClient = ({
  title,
  description,
  button,
  gallery,
}: IAboutUsBlockClientProps) => {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-[#fafafa] py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
      {/* Фоновый SVG ассет */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <div className="absolute -left-48 top-0 lg:top-8 w-[64rem] h-[64rem] md:w-[40rem] md:h-[40rem] lg:w-[50rem] lg:h-[50rem] xl:w-[64.4rem] xl:h-[67.1rem]">
          <Image
            src="/images/about_us_asset.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Левая часть - Галерея */}
          <div className="relative">
            <div className="relative rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                navigation={false}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass:
                    'swiper-pagination-bullet !bg-white !w-[1.2rem] !h-[1.2rem] !rounded-full',
                  bulletActiveClass:
                    'swiper-pagination-bullet-active !w-[2.4rem]',
                }}
                className="about-us-swiper">
                {gallery.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3]">
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

          {/* Правая часть - Текст и кнопка */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
              {title}
            </h2>

            <div className="space-y-4 md:space-y-6">
              {description.split('\n\n').map((paragraph, index) => (
                <p
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                  key={index}
                  className="text-2xl md:text-xl lg:text-2xl whitespace-pre-line text-cBlack/70 leading-relaxed"
                />
              ))}
            </div>

            {button && (
              <div className="pt-2">
                <Button
                  href={button.link}
                  theme="green"
                  size="2xl"
                  rounded="full"
                  className="w-full md:w-auto">
                  {button.titile || button.link}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsBlockClient;
