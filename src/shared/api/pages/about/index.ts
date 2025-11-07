import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { AboutPageInterface, AboutPageACF } from './types';

interface IParams {}

export const getAboutPage = async (params?: IParams): Promise<AboutPageACF> => {
  try {
    const result = await axiosInstance.get<AboutPageInterface[]>(API.getAboutPage, {
      params,
    });
    return result.data[0].acf;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

