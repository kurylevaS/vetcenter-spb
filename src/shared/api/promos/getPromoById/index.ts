import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Promo } from '../types';

interface IParams {}

export const getPromoById = async (
  id: number,
  params?: IParams
): Promise<Promo | null> => {
  try {
    const result = await axiosInstance.get<Promo>(API.getPromoById(id), {
      params,
    });
    return result.data || null;
  } catch (e: any) {
    console.log(e);
    return null; // Возвращаем null при ошибке, чтобы не ломать Promise.allSettled
  }
};
