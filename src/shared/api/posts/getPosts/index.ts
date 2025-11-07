import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Post } from './types';

interface IParams {
  search?: string; // Поиск по title.rendered и другим полям
  blogCategory?: number; // Фильтр по категории блога (blog_category)
}

export const getPosts = async (params?: IParams): Promise<Post[]> => {
  try {
    const queryParams: Record<string, string> = {};
    
    // Добавляем параметр поиска, если он передан
    if (params?.search) {
      queryParams.search = params.search;
    }

    
    // Добавляем фильтр по категории блога, если он передан
    if (params?.blogCategory) {
      queryParams['blog_category'] = params.blogCategory.toString();
    }

    console.log('Query params:', queryParams);
    
    const result = await axiosInstance.get<Post[]>(API.getPosts, {
      params: queryParams,
    });

    console.log('Result:', result.data);
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

