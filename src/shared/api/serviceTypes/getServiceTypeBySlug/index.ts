import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { ServiceTypeBySlug } from './types';

interface IParams {}

export const getServiceTypeBySlug = async (slug: string, params?: IParams): Promise<ServiceTypeBySlug> => {
  try {
    const result = await axiosInstance.get<ServiceTypeBySlug[]>(API.getServiceTypeBySlug(slug), {
      params,
    });
    return result.data[0];
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

