import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { ServiceType } from './types';

interface IParams {
  search?: string; // Поиск по title.rendered и другим полям (WordPress REST API использует параметр search)
}

export const getServiceTypes = async (params?: IParams): Promise<ServiceType[]> => {
  try {
    const queryParams: Record<string, string> = {};
    
    // Добавляем параметр поиска, если он передан
    // WordPress REST API автоматически ищет по title.rendered и content.rendered
    if (params?.search) {
      queryParams.search = params.search;
    }
    
    const result = await axiosInstance.get<ServiceType[]>(API.getServiceTypes, {
      params: queryParams,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};