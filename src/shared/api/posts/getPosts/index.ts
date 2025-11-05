import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Post } from './types';

interface IParams {}

export const getPosts = async (params?: IParams): Promise<Post[]> => {
  try {
    const result = await axiosInstance.get<Post[]>(API.getPosts, {
      params,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

