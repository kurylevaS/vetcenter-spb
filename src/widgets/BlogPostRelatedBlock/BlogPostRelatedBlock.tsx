import BlogPostRelatedBlockClient from './BlogPostRelatedBlockClient';
import { Post } from '@/shared/api/posts/getPosts/types';

interface IBlogPostRelatedBlockProps {
  posts: Post[];
  currentPostSlug?: string;
}

const BlogPostRelatedBlock = ({
  posts,
  currentPostSlug,
}: IBlogPostRelatedBlockProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Исключаем текущий пост из списка
  const relatedPosts = currentPostSlug
    ? posts.filter((post) => post.slug !== currentPostSlug).slice(0, 4)
    : posts.slice(0, 4);

  if (relatedPosts.length === 0) {
    return null;
  }

  return <BlogPostRelatedBlockClient posts={relatedPosts} />;
};

export default BlogPostRelatedBlock;
