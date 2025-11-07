import { getPosts } from '@/shared/api/posts/getPosts';
import { getBlogCategories } from '@/shared/api/blogCategories/getBlogCategories';
import BlogListBlock from '@/widgets/BlogListBlock/BlogListBlock';

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
  //   console.log('Blog categories:', blogCategories);

  //   console.log('Posts:', posts);
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
    </>
  );
}
