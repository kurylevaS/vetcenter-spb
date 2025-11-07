'use client';

import { useRouter } from 'next/navigation';
import { DoctorFact } from '@/shared/api/doctors/getDoctors/types';
import Button from '@/shared/ui/Button/Button';

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

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="w-full px-6 bg-[#FAFAFA] py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Кнопка назад */}
        <div className="mb-6 md:mb-12">
          <button
            onClick={handleBack}
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
            <span className="text-[2rem] md:text-[4.2rem] font-bold">Врач</span>
          </button>
        </div>

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
                    <h3 className="text-[2.4rem] md:text-[3.2rem] font-bold leading-tight">
                      {fullName}
                    </h3>
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
                  href="#feedback"
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
                  {fullName}
                </h3>

                {/* Специализация */}
                <p className="text-[2rem] xl:text-[2.4rem]">
                  {specialization}
                </p>

                {/* Образование */}
                {education && (
                  <div className="pt-4">
                    <p className="text-[1.6rem] xl:text-[1.8rem] font-bold mb-3">
                      Образование:
                    </p>
                    <div
                      dangerouslySetInnerHTML={{ __html: education }}
                      className="text-[1.4rem] xl:text-[1.6rem] leading-relaxed"
                    />
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
                    href="#feedback"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorMainBlockClient;

