import BlogPostMainBlockClient from './BlogPostMainBlockClient';
import { PostBySlug } from '@/shared/api/posts/getPostBySlug/types';

interface IBlogPostMainBlockProps {
  post: PostBySlug;
}

const BlogPostMainBlock = ({ post }: IBlogPostMainBlockProps) => {
  if (!post) {
    return null;
  }

  return (
    <BlogPostMainBlockClient
      title={post.acf.title || post.title.rendered}
      author={post.acf.author}
      image={post.acf.image_full}
    />
  );
};

export default BlogPostMainBlock;
