import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { HeaderAndFooterInterface, HeaderAndFooterACF } from './types';


interface IParams {}

export const getHeaderAndFooter = async (params?: IParams): Promise<HeaderAndFooterACF> => {
  try {
    const result = await axiosInstance.get<HeaderAndFooterInterface[]>(API.getHeaderAndFooter, {
      params,
    });
    return result.data[0].acf;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};