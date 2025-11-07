import { BlogBlock } from '@/shared/api/pages/main/types';
import { getPostById } from '@/shared/api/posts/getPostById';
import { PostById } from '@/shared/api/posts/getPostById/types';
import PostsBlockClient from './PostsBlockClient';

interface IPostsBlockProps {
  blogBlock: BlogBlock;
}

const PostsBlock = async ({ blogBlock }: IPostsBlockProps) => {
  if (!blogBlock?.posts) {
    return null;
  }

  // Извлекаем ID из post объектов (пропускаем false)
  const postIds = blogBlock.posts
    .map((blogPost) => blogPost.post)
    .filter((id): id is number => typeof id === 'number');

  if (postIds.length === 0) {
    return null;
  }

  // Получаем данные для каждого поста через Promise.allSettled
  const postsResults = await Promise.allSettled(
    postIds.map((id) => getPostById(id))
  );

  // Фильтруем успешные результаты
  const postsData = postsResults
    .filter(
      (result): result is PromiseFulfilledResult<PostById> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value);

  if (postsData.length === 0) {
    return null;
  }

  return <PostsBlockClient title={blogBlock.title} posts={postsData} />;
};

export default PostsBlock;
