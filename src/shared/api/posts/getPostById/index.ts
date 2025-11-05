import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { PostById } from './types';

interface IParams {}

export const getPostById = async (id: number, params?: IParams): Promise<PostById> => {
  try {
    const result = await axiosInstance.get<PostById>(API.getPostById(id), {
      params,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

