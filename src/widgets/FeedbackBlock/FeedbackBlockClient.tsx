'use client';

import FeedbackForm from '@/shared/ui/FeedbackForm/FeedbackForm';

interface IFeedbackBlockClientProps {
  title: string;
  description: string;
  button_text: string;
}

const FeedbackBlockClient = ({
  title,
  description,
  button_text,
}: IFeedbackBlockClientProps) => {
  return (
    <section id="feedback" className="w-full px-6 py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-cGreen rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[4rem] p-8 md:p-12 lg:p-16 xl:p-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
            <div className="absolute hidden xl:block -left-0 top-0 lg:top-8 w-[64rem] h-[64rem] md:w-[40rem] md:h-[40rem] lg:w-[50rem] lg:h-[50rem] xl:w-[64.4rem] xl:h-[67.1rem]">
              <img src="/images/dog_asset.png" alt="" className="object-contain" aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 w-full grid grid-cols-3 ">
            <div className='hidden lg:block'></div>
            <div className='col-span-3 xl:col-span-2 flex flex-col gap-4'>
              <h2 className="text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] xl:text-[5.6rem] font-bold text-white mb-4 md:mb-6">
                {title}
              </h2>

              {/* Описание */}
              <p className="text-[1.6rem] md:text-[1.8rem] lg:text-[2rem] text-white/90 mb-8 md:mb-10 lg:mb-12 ">
                {description}
              </p>
            </div>
          </div>
          <div className="relative z-10 w-full">
            <FeedbackForm buttonText={button_text} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackBlockClient;

