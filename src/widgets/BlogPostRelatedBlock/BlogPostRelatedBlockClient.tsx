'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/shared/api/posts/getPosts/types';

interface IBlogPostRelatedBlockClientProps {
  posts: Post[];
}

const BlogPostRelatedBlockClient = ({
  posts,
}: IBlogPostRelatedBlockClientProps) => {
  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Другие статьи
          </h2>
        </div>

        {/* Сетка постов */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-row gap-6 p-6 md:p-8">
              {/* Изображение */}
              {post.acf.image_min && (
                <div className="relative w-24 h-24 md:w-64 md:h-64 rounded-[1.2rem] md:rounded-[1.6rem] overflow-hidden flex-shrink-0">
                  <Image
                    src={post.acf.image_min}
                    alt={post.acf.title || post.title.rendered}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Контент */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Заголовок */}
                <h3 className="text-[1.4rem] md:text-[1.6rem] lg:text-[1.8rem] font-bold text-cBlack mb-2 md:mb-3 line-clamp-2">
                  {post.acf.title || post.title.rendered}
                </h3>

                {/* Описание */}
                {post.acf.description && (
                  <p className="text-[1.4rem] md:text-[1.4rem] text-cBlack/70 leading-relaxed line-clamp-3 mb-3 md:mb-4 flex-1">
                    {post.acf.description}
                  </p>
                )}

                {/* Ссылка "Читать далее" */}
                <span className="text-cGreen underline text-[1.4rem] md:text-[1.4rem]">
                  Читать далее
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPostRelatedBlockClient;
