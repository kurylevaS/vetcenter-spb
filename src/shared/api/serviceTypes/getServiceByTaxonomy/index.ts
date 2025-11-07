import { axiosInstance } from '@/shared/api/axios';
import { ServiceByTaxonomy } from './types';
import { API } from '@/shared/api/api';

interface IParams {
  search?: string; // Поиск по услугам
}

export const getServiceByServiceType = async (
  serviceTypeId: number,
  params?: IParams
): Promise<ServiceByTaxonomy> => {
  try {
    const baseUrl = API.getServiceByServiceType(serviceTypeId);
    const queryParams: Record<string, string> = {};
    
    // Добавляем параметр поиска, если он передан
    if (params?.search) {
      queryParams.search = params.search;
    }
    
    const result = await axiosInstance.get<ServiceByTaxonomy>(baseUrl, {
      params: queryParams,
    });
    
    return result.data;
    
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

