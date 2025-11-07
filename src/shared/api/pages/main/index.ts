import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { MainPageInterface, MainPageACF } from './types';

interface IParams {}

export const getMainPage = async (params?: IParams): Promise<MainPageACF> => {
  try {
    const result = await axiosInstance.get<MainPageInterface[]>(
      API.getMainPage,
      {
        params,
      }
    );
    return result.data[0].acf;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
