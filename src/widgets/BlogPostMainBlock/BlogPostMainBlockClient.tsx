'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface IBlogPostMainBlockClientProps {
  title: string;
  author: string;
  image: string;
}

const BlogPostMainBlockClient = ({
  title,
  author,
  image,
}: IBlogPostMainBlockClientProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="relative w-full h-screen">
      {/* Фоновое изображение */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Затемнение для лучшей читаемости текста */}
          <div className="absolute inset-0 from-black/30 to-black/70 bg-gradient-to-b" />
        </div>
      )}

      {/* Контент поверх изображения */}
      <div className="relative flex flex-col z-10 h-full ">
        <div className="xl:max-w-[1440px] w-full mx-auto flex flex-col h-full px-4 md:px-8 lg:px-16 pt-12 md:pt-16 lg:pt-20">
          {/* Кнопка назад */}
          <div className="mb-6 md:mb-12">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-8 text-white hover:text-white/80 transition-colors"
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
            </button>
          </div>

          {/* Заголовок и автор */}
          <div className="pb-12 flex flex-col flex-grow gap-96 justify-center items-center flex-1 md:pb-16 lg:pb-20">
            <h1 className="text-[3.2rem] md:text-[4.8rem] lg:text-[5.6rem] xl:text-[5.6rem] font-bold text-white mb-4 md:mb-6">
              {title}
            </h1>
            {author && (
              <p className="text-[1.8rem] text-center md:text-[2rem] font-light lg:text-[2.2rem] text-white/90"><span className='font-bold'>Автор:</span><br/>{author}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPostMainBlockClient;

