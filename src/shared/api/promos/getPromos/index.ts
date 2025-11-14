import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Promo } from '../types';

interface IParams {
  search?: string; // Поиск по промо
}

export const getPromos = async (params?: IParams): Promise<Promo[]> => {
  try {
    const queryParams: Record<string, string> = {};

    // Добавляем параметр поиска, если он передан
    if (params?.search) {
      queryParams.search = params.search;
    }

    const result = await axiosInstance.get<Promo[]>(API.getPromos, {
      params: queryParams,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
