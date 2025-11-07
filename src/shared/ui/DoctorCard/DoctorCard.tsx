import Image from 'next/image';
import Button from '@/shared/ui/Button/Button';
import { Doctor } from '@/shared/api/doctors/getDoctors/types';

interface IDoctorCardProps {
  doctor: Doctor;
  className?: string;
}

const DoctorCard = ({ doctor, className = '' }: IDoctorCardProps) => {
  return (
    <div
      className={`rounded-[2.4rem] overflow-hidden h-96 md:rounded-[3.2rem] relative flex flex-row items-start gap-6 md:gap-8 ${className}`}>
      {/* Фото врача */}
      <div className="absolute bottom-0 rounded-[2.4rem] left-0 w-full h-[90%] bg-[#FAFAFA] "></div>
      {doctor.acf.image && (
        <div className="relative h-full absolute bottom-0 -left-8 flex-shrink-0">
          <img
            src={doctor.acf.image}
            alt={doctor.acf.full_name || doctor.title.rendered}
            className="h-full object-contain"
          />
        </div>
      )}

      {/* Информация о враче */}
      <div className="flex flex-col justify-end py-6 pr-6 h-full z-10 flex-grow w-full md:w-auto">
        <div className="mb-4 md:mb-6">
          <h3 className="text-[1.6rem] md:text-[1.8rem] lg:text-[2.2rem] font-bold text-cBlack mb-2">
            {doctor.acf.full_name.split(' ').slice(0, 2).join(' ') ||
              doctor.title.rendered}
          </h3>
          {doctor.acf.specialization && (
            <p className="text-[1.2rem] md:text-[1.2rem] lg:text-[1.4rem] text-cBlack/70 mb-2">
              {doctor.acf.specialization}
            </p>
          )}
          {/* Выводим все факты о враче, если они есть */}
          {doctor.acf.facts && doctor.acf.facts.length > 0 && (
            <ul className="mb-0">
              {doctor.acf.facts.map((factObj, idx) => (
                // factObj.fact.content — по типу структуры в doctor.acf.facts
                <li
                  key={idx}
                  className="text-[1.2rem] md:text-[1.2rem] text-cBlack/70">
                  <span className="font-bold">{factObj.fact?.title}:</span>{' '}
                  {factObj.fact?.content}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Кнопка "Подробнее" */}
        <div className="">
          <Button
            href={`/doctors/${doctor.id}`}
            theme="green"
            size="2xl"
            rounded="full"
            className="w-full !text-[1.2rem] lg:!text-2xl md:w-auto !py-2 !px-2 lg:!py-4 md:!px-6 lg:px-12">
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
