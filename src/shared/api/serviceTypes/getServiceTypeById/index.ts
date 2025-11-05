import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { ServiceTypeById } from './types';

interface IParams {}

export const getServiceTypeById = async (id: number, params?: IParams): Promise<ServiceTypeById> => {
  try {
    const result = await axiosInstance.get<ServiceTypeById>(API.getServiceTypeById(id), {
      params,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

