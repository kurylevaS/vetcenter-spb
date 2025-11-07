import BlogPostContentBlockClient from './BlogPostContentBlockClient';
import { PostBySlug } from '@/shared/api/posts/getPostBySlug/types';

interface IBlogPostContentBlockProps {
  content: string;
}

const BlogPostContentBlock = ({ content }: IBlogPostContentBlockProps) => {
  if (!content) {
    return null;
  }

  return <BlogPostContentBlockClient content={content} />;
};

export default BlogPostContentBlock;

