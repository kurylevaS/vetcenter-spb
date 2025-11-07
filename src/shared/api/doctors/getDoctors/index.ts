import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Doctor } from './types';

interface IParams {
  search?: string; // Поиск по title.rendered
  serviceType?: number; // Фильтр по типу услуги (service-type)
}

export const getDoctors = async (params?: IParams): Promise<Doctor[]> => {
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

    const result = await axiosInstance.get<Doctor[]>(API.getDoctors, {
      params: queryParams,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
