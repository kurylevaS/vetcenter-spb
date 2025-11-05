'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination,EffectFade,Autoplay } from 'swiper/modules';
import { Doctor } from '@/shared/api/doctors/getDoctors/types';
import Button from '@/shared/ui/Button/Button';

import 'swiper/css';
import 'swiper/css/pagination';

interface ITeamBlockClientProps {
  title: string;
  doctors: Doctor[];
}

const TeamBlockClient = ({ title, doctors }: ITeamBlockClientProps) => {
  if (!doctors || doctors.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-[#FAFAFA] py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
            {title}
          </h2>
        </div>

        {/* Блок с карточками врачей */}
        <div className="relative">
          {/* Зеленый фон под контентом */}
          <div className="absolute inset-x-0 bottom-0 bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[4rem] h-full lg:h-[90%] z-0" />
          
          {/* Контент поверх фона */}
          <div className="relative z-10 ">
            <Swiper
              modules={[Pagination,EffectFade,Autoplay]}
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
              className="team-swiper"
            >
              {doctors.map((doctor) => (
                <SwiperSlide key={doctor.id}>
                  {/* Мобильная и планшетная версия */}
                  <div className="lg:hidden">
                    <div className="">
                      {/* Верхняя часть - Имя/Специализация слева, Факты справа */}
                      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8 p-6 md:p-8">
                        {/* Левая колонка - Имя и Специализация */}
                        <div className="text-white space-y-3 md:space-y-4">
                          <h3 className="text-[2.4rem] md:text-[3.2rem] font-bold leading-tight">
                            {doctor.acf.full_name}
                          </h3>
                          <p className="text-[1.8rem] md:text-[2rem]">
                            {doctor.acf.specialization}
                          </p>
                        </div>

                        {/* Правая колонка - Факты */}
                        <div className="text-white grid grid-cols-2 md:grid-cols-3 mt-4 gap-4 md:gap-6">
                          {doctor.acf.facts?.map((factItem, idx) => (
                            <div className="flex flex-col  gap-1 md:gap-2" key={idx}>
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
                        {doctor.acf.image && (
                          <img
                            src={doctor.acf.image}
                            alt={doctor.acf.full_name}
                            className="h-full object-contain"
                          />
                        )}
                      </div>
                    </div>

                    {/* Кнопка за блоком */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                      <Button
                        href="#"
                        theme="white"
                        size="2xl"
                        rounded="full"
                        className="w-full"
                      >
                        Записаться
                      </Button>
                    </div>
                  </div>

                  {/* Десктопная версия */}
                  <div className="hidden lg:grid grid-cols-3 gap-8 xl:gap-12 items-center">
                    {/* Левая колонка - Имя, Специализация, Образование */}
                    <div className="text-white p-8 px-12 space-y-6 xl:space-y-8">
                      {/* Имя */}
                      <h3 className="text-[3.2rem] xl:text-[4rem] font-bold leading-tight">
                        {doctor.acf.full_name}
                      </h3>

                      {/* Специализация */}
                      <p className="text-[2rem] xl:text-[2.4rem]">
                        {doctor.acf.specialization}
                      </p>

                      {/* Образование */}
                      {doctor.acf.education && (
                        <div className="pt-4">
                          <p className="text-[1.6rem] xl:text-[1.8rem] font-bold mb-3">
                            Образование:
                          </p>
                          <div
                            dangerouslySetInnerHTML={{ __html: doctor.acf.education }}
                            className="text-[1.4rem] xl:text-[1.6rem] leading-relaxed"
                          />
                        </div>
                      )}
                    </div>

                    {/* Центральная колонка - Фотография */}
                    <div className="relative h-full w-full rounded-[2.4rem] xl:rounded-[3.2rem] overflow-hidden">
                      {doctor.acf.image && (
                        <img
                          src={doctor.acf.image}
                          alt={doctor.acf.full_name}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    {/* Правая колонка - Факты и Кнопка */}
                    <div className="text-white space-y-6 xl:space-y-8 flex flex-col justify-center h-full relative">
                      {/* Факты (Опыт, Операций) */}
                      <div className="flex flex-col items-center gap-12 xl:gap-12">
                        {doctor.acf.facts?.map((factItem, idx) => (
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
                          href="#"
                          theme="white"
                          size="2xl"
                          rounded="full"
                          className="w-2/3"
                        >
                          Записаться
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamBlockClient;

