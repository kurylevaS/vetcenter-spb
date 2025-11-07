import Image from 'next/image';
import Link from 'next/link';

interface IServiceCardProps {
  icon?: string;
  name: string;
  href: string;
  className?: string;
}

const ServiceCard = ({
  icon,
  name,
  href,
  className = '',
}: IServiceCardProps) => {
  return (
    <Link
      href={href}
      className={`group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] aspect-[2/1] flex flex-col items-center justify-center p-6 md:p-8 lg:p-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Мобильная/планшетная версия - вертикальная компоновка */}
      <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 lg:hidden">
        {/* Иконка */}
        {icon && (
          <div className="w-[6.4rem] h-[6.4rem] md:w-[8rem] md:h-[8rem] relative flex-shrink-0">
            <Image src={icon} alt={name} fill className="object-contain" />
          </div>
        )}

        {/* Название услуги */}
        <h3 className="text-[1.8rem] md:text-[2.4rem] font-semibold text-cBlack group-hover:text-cGreen transition-colors">
          {name}
        </h3>
      </div>

      {/* Десктопная версия - горизонтальная компоновка */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-12">
        {/* Иконка слева */}
        {icon && (
          <div className="w-[10rem] h-[10rem] lg:w-[6.4rem] lg:h-[6.4rem] xl:w-[8rem] xl:h-[8rem] relative flex-shrink-0">
            <Image src={icon} alt={name} fill className="object-contain" />
          </div>
        )}

        {/* Название услуги справа */}
        <h3 className="text-[2.88rem] lg:text-[2rem] xl:text-[2.4rem] font-semibold text-cBlack group-hover:text-cGreen transition-colors">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default ServiceCard;
