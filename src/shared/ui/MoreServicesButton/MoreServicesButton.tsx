import Link from 'next/link';

interface IMoreServicesButtonProps {
  href?: string;
  text?: string;
  className?: string;
}

const MoreServicesButton = ({
  href = '/services',
  text = 'Другие услуги',
  className = '',
}: IMoreServicesButtonProps) => {
  return (
    <Link
      href={href}
      className={`bg-cGreen aspect-[2/1] rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] p-6 md:p-8 lg:p-10 flex items-center justify-center group hover:bg-cGreen/90 transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="flex items-center gap-[1.6rem] md:gap-[2.4rem] lg:gap-[1.6rem] xl:gap-[1.6rem]">
        <span className="text-white text-[2.4rem] md:text-[2.72rem] lg:text-[2rem] xl:text-[2.4rem] font-semibold">
          {text}
        </span>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[4rem] h-[4rem] md:w-[4.8rem] md:h-[4.8rem] lg:w-[2rem] lg:h-[2rem] xl:w-[2.4rem] xl:h-[2.4rem] text-white group-hover:translate-x-1 transition-transform">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};

export default MoreServicesButton;
