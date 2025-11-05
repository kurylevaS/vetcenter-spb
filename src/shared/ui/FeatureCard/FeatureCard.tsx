import Image from 'next/image';

interface IFeatureCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className = '' }: IFeatureCardProps) => {
  return (
    <div className={`bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] p-6 md:p-8 lg:p-10 overflow-hidden lg:!pb-0 flex flex-col lg:flex-col lg:items-center gap-6 md:gap-8 transition-all duration-300 hover:shadow-cGreen/50 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      {/* Текстовая часть */}
      <div className="flex-1">
        <h3 className="text-[2.4rem] md:text-[2.72rem] lg:text-[2.4rem] xl:text-[2.72rem] font-bold text-cBlack mb-3 md:mb-4">
          {title}
        </h3>
        <p className="text-[1.8rem] md:text-[2rem] lg:text-[1.8rem] xl:text-[1.4rem] text-cBlack/70 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Иконка */}
      {icon && (
        <div className="absolute right-0 lg:-right-28 -bottom-2 w-[8rem] h-[8rem] md:w-[10rem]  lg:w-[14rem] xl:w-[16rem] xl:h-auto relative lg:ml-auto">
          <img
            src={icon}
            alt={title}
            className="object-contain w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default FeatureCard;

