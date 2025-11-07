import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { PostBySlug } from './types';

interface IParams {}

export const getPostBySlug = async (
  slug: string,
  params?: IParams
): Promise<PostBySlug | null> => {
  try {
    const result = await axiosInstance.get<PostBySlug[]>(
      API.getPostBySlug(slug),
      {
        params,
      }
    );
    return result.data[0] || null;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
