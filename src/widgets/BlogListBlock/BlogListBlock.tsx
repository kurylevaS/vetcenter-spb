import { Post } from '@/shared/api/posts/getPosts/types';
import { BlogCategory } from '@/shared/api/blogCategories/getBlogCategories/types';
import BlogListBlockClient from './BlogListBlockClient';

interface IBlogListBlockProps {
  posts: Post[];
  initialSearch?: string;
  blogCategories?: BlogCategory[];
  initialBlogCategory?: number;
}

const BlogListBlock = ({
  posts,
  initialSearch,
  blogCategories,
  initialBlogCategory,
}: IBlogListBlockProps) => {
  return (
    <BlogListBlockClient
      posts={posts || []}
      initialSearch={initialSearch}
      blogCategories={blogCategories}
      initialBlogCategory={initialBlogCategory}
    />
  );
};

export default BlogListBlock;
