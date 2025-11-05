"use client"
import React, { useState, useEffect } from 'react'
import { MainPageInterface } from '@/shared/api/pages/main/types';
import Image from 'next/image';
import Button from '@/shared/ui/Button/Button';



const MainBlockMainPage = ({banner_slides}: MainPageInterface['acf']['main_block']) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (banner_slides && banner_slides.length > 0) {
      setActiveSlide(0);
    }
  }, [banner_slides]);

  if (!banner_slides || banner_slides.length === 0) {
    return null;
  }

  const currentSlide = banner_slides[activeSlide];
  const slideData = currentSlide.banner_slide;

  return (
    <section className="relative w-full px-6 overflow-hidden bg-white">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-8 lg:py-12 xl:py-16">
        {/* Мобильная и планшетная версия - вертикальная компоновка */}
        <div className="lg:hidden relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#FAFAFA] to-[#F6FFE6] p-8 !pr-0 !pb-0">
          {/* Текст сверху */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {/* Заголовок "Ветеринарный центр" */}
            <h1 className="text-[2.6rem] md:text-[3.2rem] font-bold text-cBlack leading-tight">
              {slideData.title_main}
            </h1>
            
            {/* Подзаголовок "ПРИМОРСКИЙ" */}
            <h2 className="text-5xl md:text-[6.4rem] font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cGreen to-[#C3FF00] leading-[90%] tracking-tight">
              {slideData.title_sub}
            </h2>
            
            {/* Описание */}
            <p className="text-[1.7rem] md:text-[2.4rem] text-cBlack leading-tight">
              {slideData.description}
            </p>
          </div>

          {/* Изображение животных в центре */}
          <div className="relative mt-6 md:mt-16 w-full h-[280px] md:h-[350px] overflow-hidden">
            {/* SVG Overlay */}
            <div className="absolute -right-12 md:left-1/2 md:-translate-x-1/2 bottom-0 w-[250px] md:w-[350px] h-[250px] md:h-[350px] z-0">
              <Image
                src="/images/main_block_overlay.svg"
                alt=""
                fill
                className="opacity-77 object-contain"
                aria-hidden="true"
              />
            </div>
            
            {/* Изображение баннера */}
            <div className="absolute right-0 md:left-1/2 md:-translate-x-1/2 bottom-0 h-full" style={{ aspectRatio: '460/617' }}>
              <Image
                src="/images/main_banner.png"
                alt="Ветеринарный центр Приморский"
                fill
                className="object-contain object-right-bottom md:object-center-bottom"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Кнопка внизу */}
          
        </div>
        {slideData.button && (
            <div className="w-full mt-8 lg:hidden">
              <Button
                href={slideData.button.link}
                theme="green"
                size="3xl"
                rounded="full"
                className="w-full"
              >
                {slideData.button.title}
              </Button>
            </div>
          )}

        {/* Десктопная версия - горизонтальная компоновка */}
        <div className="hidden lg:block relative h-[500px] xl:h-[630px]">
          <div className="absolute bottom-0 right-0 w-full h-[500px] xl:h-[600px] overflow-hidden flex flex-row items-center gap-8 xl:gap-12 rounded-3xl bg-gradient-to-r from-[#FAFAFA] to-[#F6FFE6] p-8 xl:p-16">
            {/* Левая часть - Текст и кнопка */}
            <div className="flex-[0.6] z-10">
              <div className="space-y-5 xl:space-y-6">
                {/* Заголовок "Ветеринарный центр" */}
                <h1 className="text-5xl xl:text-8xl font-bold text-cBlack leading-tight">
                  {slideData.title_main}
                </h1>
                
                {/* Подзаголовок "ПРИМОРСКИЙ" */}
                <h2 className="text-6xl xl:text-9xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cGreen to-[#C3FF00] leading-[90%] tracking-tight">
                  {slideData.title_sub}
                </h2>
                
                {/* Описание */}
                <p className="text-2xl xl:text-4xl text-cBlackLight max-w-5xl leading-relaxed mt-2">
                  {slideData.description}
                </p>
                
                {/* Кнопка */}
                {slideData.button && (
                  <div className="pt-2 !mt-32">
                    <Button
                      href={slideData.button.link}
                      theme="green"
                      size="2xl"
                      rounded="full"
                      className="w-1/3"
                    >
                      {slideData.button.title}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Правая часть - Изображения */}
            <div className="flex-[0.4] absolute right-0 w-full h-full">
              {/* SVG Overlay */}
              <div className="absolute inset-0 z-0 flex items-center justify-end overflow-hidden">
                <Image
                  src="/images/main_block_overlay.svg"
                  alt=""
                  width={605}
                  height={612}
                  className="w-full h-full max-w-[605px] max-h-[612px] opacity-77"
                  style={{ 
                    transform: 'translateX(15%) scale(1.1)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          
          {/* Изображение баннера на десктопе */}
          <div className="absolute right-0 w-auto aspect-[460/617] rounded-3xl overflow-hidden h-full bottom-0">
            <Image
              src="/images/main_banner.png"
              alt="Ветеринарный центр Приморский"
              fill
              className="h-full"
              priority
              quality={90}
            />
          </div>
        </div>

        {/* Индикаторы слайдов (если их больше одного) */}
        {banner_slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {banner_slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-bannerGreen w-8' 
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                }`}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MainBlockMainPage;