import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { BlogCategory } from './types';

interface IParams {}

export const getBlogCategories = async (
  params?: IParams
): Promise<BlogCategory[]> => {
  try {
    const result = await axiosInstance.get<BlogCategory[]>(
      API.getBlogCategories,
      {
        params,
      }
    );
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
