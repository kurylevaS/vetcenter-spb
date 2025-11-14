import type { Metadata } from 'next';
import { getPosts } from '@/shared/api/posts/getPosts';
import { getBlogCategories } from '@/shared/api/blogCategories/getBlogCategories';
import BlogListBlock from '@/widgets/BlogListBlock/BlogListBlock';
import {
  createMetadata,
  SEO_DEFAULTS,
  buildBreadcrumbJsonLd,
  buildAbsoluteUrl,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

const PAGE_TITLE = 'Блог ветеринарного центра Приморский';
const PAGE_DESCRIPTION =
  'Новости, советы по уходу, профилактика заболеваний и статьи ветеринарных специалистов центра «Приморский».';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: `${PAGE_TITLE} | ${SEO_DEFAULTS.siteName}`,
    description: PAGE_DESCRIPTION,
    canonicalPath: '/blog',
    type: 'website',
  });
}

interface IBlogPageProps {
  searchParams: {
    search?: string;
    blog_category?: string;
  };
}

export default async function BlogPage({ searchParams }: IBlogPageProps) {
  // Получаем все категории блога для фильтров
  const blogCategories = await getBlogCategories();

  // Получаем посты с параметрами поиска и фильтрации
  const blogCategoryId = searchParams.blog_category
    ? parseInt(searchParams.blog_category)
    : undefined;

  const posts = await getPosts({
    search: searchParams.search,
    blogCategory: blogCategoryId,
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (posts || []).slice(0, 12).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.acf?.title || post.title?.rendered || 'Статья',
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
    })),
  };
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Блог', url: '/blog' },
  ]);
  return (
    <>
      <main>
        <BlogListBlock
          posts={posts || []}
          initialSearch={searchParams.search}
          blogCategories={blogCategories}
          initialBlogCategory={blogCategoryId}
        />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}
