'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/shared/api/posts/getPosts/types';
import { BlogCategory } from '@/shared/api/blogCategories/getBlogCategories/types';

interface IBlogListBlockClientProps {
  posts: Post[];
  initialSearch?: string;
  blogCategories?: BlogCategory[];
  initialBlogCategory?: number;
}

const BlogListBlockClient = ({
  posts,
  initialSearch,
  blogCategories,
  initialBlogCategory,
}: IBlogListBlockClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<number | undefined>(initialBlogCategory);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Отладка входящих данных
  useEffect(() => {
    console.log('BlogListBlockClient - Initial props:', {
      postsCount: posts.length,
      initialSearch,
      blogCategoriesCount: blogCategories?.length,
      initialBlogCategory,
    });
  }, []);

  // Обновляем состояние при изменении URL параметров
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const blogCategory = searchParams.get('blog_category');
    setSearchQuery(search);
    setSelectedBlogCategory(blogCategory ? parseInt(blogCategory) : undefined);
  }, [searchParams]);

  // Cleanup для debounce таймера
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Функция для обновления URL с debounce
  const updateSearchParam = (value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300); // Debounce 300ms
  };

  // Функция для обновления фильтра по категории блога
  const updateBlogCategoryFilter = (categoryId: number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('blog_category', categoryId.toString());
    } else {
      params.delete('blog_category');
    }
    // Сохраняем поисковый запрос
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Фильтрация постов по поисковому запросу и категории
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Отладка
    console.log('BlogListBlockClient - posts count:', posts.length);
    console.log('BlogListBlockClient - selectedBlogCategory:', selectedBlogCategory);
    console.log('BlogListBlockClient - searchQuery:', searchQuery);

    // Фильтр по категории блога (если выбран)
    if (selectedBlogCategory) {
      filtered = filtered.filter((post) => {
        // Проверяем blog_category на верхнем уровне поста (массив ID)
        if (post['blog_category'] && Array.isArray(post['blog_category'])) {
          return post['blog_category'].includes(selectedBlogCategory);
        }
        // Также проверяем acf.blog_category на случай другой структуры
        if (post.acf?.blog_category) {
          if (Array.isArray(post.acf.blog_category)) {
            return post.acf.blog_category.some((cat: any) => {
              if (typeof cat === 'object' && cat.id) {
                return cat.id === selectedBlogCategory;
              }
              return cat === selectedBlogCategory;
            });
          }
          if (typeof post.acf.blog_category === 'object' && post.acf.blog_category.id) {
            return post.acf.blog_category.id === selectedBlogCategory;
          }
          if (typeof post.acf.blog_category === 'number') {
            return post.acf.blog_category === selectedBlogCategory;
          }
        }
        return false;
      });
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((post) => {
        const title = post.title?.rendered?.toLowerCase() || '';
        const acfTitle = post.acf?.title?.toLowerCase() || '';
        const description = post.acf?.description?.toLowerCase() || '';
        return title.includes(query) || acfTitle.includes(query) || description.includes(query);
      });
    }

    console.log('BlogListBlockClient - filteredPosts count:', filtered.length);
    return filtered;
  }, [posts, searchQuery, selectedBlogCategory]);

  return (
    <section className="w-full px-6 bg-white py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="xl:max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-16">
        {/* Заголовок */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl text-left lg:text-6xl xl:text-7xl font-bold text-cBlack">
            Статьи
          </h2>
        </div>

        {/* Строка поиска и фильтров */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row w-full  md:justify-between gap-4 md:gap-6 items-start md:items-center">
            {/* Поиск */}
            <div className="relative flex-1 max-w-full md:max-w-md lg:max-w-3xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  updateSearchParam(value);
                }}
                placeholder="Введите ваш запрос"
                className="w-full px-6 py-4 md:py-5 pr-14 md:pr-16 rounded-full text-[1.4rem] md:text-[1.4rem] bg-[#FAFAFA] placeholder:text-cBlack/40 border-2 border-transparent focus:border-cGreen/30 focus:outline-none transition-colors"
              />
              <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[2.4rem] h-[2.4rem] md:w-[2.8rem] md:h-[2.8rem] text-cBlack/40"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m21 21-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Кнопки фильтров по категориям */}
            {blogCategories && blogCategories.length > 0 && (
              <div className="flex gap-4 md:gap-6">
                <button
                  onClick={() => updateBlogCategoryFilter(undefined)}
                  className={`px-6 py-4 rounded-full text-[1.4rem] md:text-[1.4rem] font-medium transition-colors ${
                    !selectedBlogCategory
                      ? 'bg-cGreen text-white border-2 border-cGreen'
                      : 'bg-white text-cBlack border-2 border-[#E5E5E5] hover:border-cGreen/30'
                  }`}
                >
                  Все
                </button>
                {blogCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => updateBlogCategoryFilter(category.id)}
                    className={`px-6 py-4 rounded-full text-[1.4rem] md:text-[1.4rem] font-medium transition-colors ${
                      selectedBlogCategory === category.id
                        ? 'bg-cGreen text-white border-2 border-cGreen'
                        : 'bg-white text-cBlack border-2 border-[#E5E5E5] hover:border-cGreen/30'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Сетка постов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-[#FAFAFA] rounded-[2.4rem] md:rounded-[3.2rem] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-row gap-6 p-6 md:p-8"
              >
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-[1.8rem] md:text-[2rem] text-cBlack/60">
                По заданным запросам ничего не найдено
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogListBlockClient;

