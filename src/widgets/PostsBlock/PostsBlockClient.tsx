'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PostById } from '@/shared/api/posts/getPostById/types';
import Button from '@/shared/ui/Button/Button';

interface IPostsBlockClientProps {
  title: string;
  posts: PostById[];
}

const PostsBlockClient = ({ title, posts }: IPostsBlockClientProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 bg-[#FAFAFA] py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-cBlack">
            {title}
          </h2>
        </div>

        {/* Сетка постов */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12 lg:mb-16">
          {[...posts, ...posts, ...posts].map((post, index) => (
            <Link
              key={index}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-[2.4rem] md:rounded-[3.2rem] lg:rounded-[3.2rem] xl:rounded-[3.2rem] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Мобильная версия - горизонтальная компоновка */}
              <div className="md:hidden flex gap-4 p-8">
                {/* Текстовая часть */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Заголовок */}
                    <h3 className="text-[1.8rem] md:text-[2rem] font-bold text-cBlack mb-2 line-clamp-2">
                      {post.acf.title}
                    </h3>
                    
                    {/* Описание */}
                    {post.acf.description && (
                      <p className="text-[1.4rem] md:text-[1.6rem] text-cBlack/70 leading-relaxed line-clamp-3 mb-3">
                        {post.acf.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Ссылка "Читать далее" */}
                  <span className="text-cGreen underline text-[1.4rem] md:text-[1.6rem]">
                    Читать далее
                  </span>
                </div>

                {/* Изображение */}
                {post.acf.image_min && (
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[1.2rem] md:rounded-[1.6rem] overflow-hidden flex-shrink-0">
                    <Image
                      src={post.acf.image_min}
                      alt={post.acf.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Планшетная и десктопная версия - вертикальная компоновка */}
              <div className="hidden md:flex flex-row gap-8 h-full p-8">
                {/* Изображение */}
                {post.acf.image_min && (
                  <div className="relative p-4 overflow-hidden rounded-xl aspect-square">
                    <Image
                      src={post.acf.image_min}
                      alt={post.acf.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Контент */}
                <div className="flex flex-col px-4 flex-1">
                  {/* Заголовок */}
                  <h3 className="text-[1.4rem] md:text-[2.4rem] lg:text-[2.4rem] xl:text-[2.0rem] font-bold text-cBlack mb-3 md:mb-4 line-clamp-2">
                    {post.acf.title}
                  </h3>

                  {/* Описание */}
                  {post.acf.description && (
                    <p className="text-[1.2rem] md:text-[1.8rem] lg:text-[2rem] xl:text-[1.5rem] text-cBlack/70 leading-relaxed line-clamp-3 mb-4 md:mb-6 flex-1">
                      {post.acf.description}
                    </p>
                  )}

                  {/* Ссылка "Читать далее" */}
                  <span className="text-cGreen underline text-[1.2rem] md:text-[1.8rem] lg:text-[2rem] xl:text-[1.5rem]">
                    Читать далее
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Кнопка "Больше статьей" */}
        <div className="flex justify-center">
          <Button
            href="/blog"
            theme="green"
            size="2xl"
            rounded="full"
          >
            Больше статьей
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PostsBlockClient;

