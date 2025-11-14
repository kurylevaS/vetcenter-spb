import type { Metadata } from 'next';
import { getPostBySlug } from '@/shared/api/posts/getPostBySlug';
import { getPosts } from '@/shared/api/posts/getPosts';
import BlogPostMainBlock from '@/widgets/BlogPostMainBlock/BlogPostMainBlock';
import BlogPostContentBlock from '@/widgets/BlogPostContentBlock/BlogPostContentBlock';
import BlogPostRelatedBlock from '@/widgets/BlogPostRelatedBlock/BlogPostRelatedBlock';
import { notFound } from 'next/navigation';
import {
  createMetadata,
  SEO_DEFAULTS,
  stripHtml,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from '@/shared/lib/seo';

// ISR: страница будет автоматически обновляться каждые 60 секунд
// + мгновенное обновление через webhook при изменении в админке
export const revalidate = 60;

interface IBlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: IBlogPostPageProps) {
  const { slug } = params;

  // Получаем информацию о посте
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Получаем другие посты для блока "Другие статьи"
  const allPosts = await getPosts();

  const title = post.acf?.title || post.title?.rendered || 'Статья блога';
  const description =
    stripHtml(post.acf?.description || post.content?.rendered, 180) ||
    SEO_DEFAULTS.defaultDescription;
  const image = post.acf?.image_full || post.acf?.image_min || null;
  const articleJsonLd = buildArticleJsonLd({
    title,
    description,
    slug: post.slug,
    image,
    author: post.acf?.author,
    datePublished: post.date,
    dateModified: post.modified,
  });
  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', url: '/' },
    { name: 'Блог', url: '/blog' },
    { name: title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <main>
        <BlogPostMainBlock post={post} />
        <BlogPostContentBlock content={post.acf.content} />
        <BlogPostRelatedBlock
          posts={allPosts || []}
          currentPostSlug={post.slug}
        />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return createMetadata({
      title: `Статья не найдена | ${SEO_DEFAULTS.siteName}`,
      description: 'Страница статьи не найдена.',
      canonicalPath: `/blog/${params.slug}`,
      type: 'article',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  const title = post.acf?.title || post.title?.rendered || 'Статья блога';
  const description =
    stripHtml(post.acf?.description || post.content?.rendered, 180) ||
    SEO_DEFAULTS.defaultDescription;
  const ogImage = post.acf?.image_full || post.acf?.image_min || null;

  return createMetadata({
    title: `${title} | ${SEO_DEFAULTS.siteName}`,
    description,
    canonicalPath: `/blog/${post.slug}`,
    ogImage,
    type: 'article',
  });
}
