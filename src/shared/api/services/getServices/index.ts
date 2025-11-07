import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Service } from '../types';

interface IParams {
  search?: string; // Поиск по услугам
  serviceType?: number; // Фильтр по типу услуги
}

export const getServices = async (params?: IParams): Promise<Service[]> => {
  try {
    const queryParams: Record<string, string> = {};

    // Добавляем параметр поиска, если он передан
    if (params?.search) {
      queryParams.search = params.search;
    }

    // Добавляем фильтр по типу услуги, если он передан
    if (params?.serviceType) {
      queryParams['service-type'] = params.serviceType.toString();
    }

    const result = await axiosInstance.get<Service[]>(API.getServices, {
      params: queryParams,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
