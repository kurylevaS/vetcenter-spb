import { getPostBySlug } from '@/shared/api/posts/getPostBySlug';
import { getPosts } from '@/shared/api/posts/getPosts';
import BlogPostMainBlock from '@/widgets/BlogPostMainBlock/BlogPostMainBlock';
import BlogPostContentBlock from '@/widgets/BlogPostContentBlock/BlogPostContentBlock';
import BlogPostRelatedBlock from '@/widgets/BlogPostRelatedBlock/BlogPostRelatedBlock';
import { notFound } from 'next/navigation';

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

  return (
    <>
      <main>
        <BlogPostMainBlock post={post} />
        <BlogPostContentBlock content={post.acf.content} />
        <BlogPostRelatedBlock posts={allPosts || []} currentPostSlug={post.slug} />
      </main>
    </>
  );
}

