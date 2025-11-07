import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Service } from '../types';

interface IParams {}

export const getServiceBySlug = async (slug: string, params?: IParams): Promise<Service | null> => {
  try {
    const result = await axiosInstance.get<Service[]>(API.getServiceBySlug(slug), {
      params,
    });
    return result.data[0] || null;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

