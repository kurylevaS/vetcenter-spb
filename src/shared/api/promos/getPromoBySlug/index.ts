import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Promo } from '../types';

interface IParams {}

export const getPromoBySlug = async (
  slug: string,
  params?: IParams
): Promise<Promo | null> => {
  try {
    const result = await axiosInstance.get<Promo[]>(API.getPromoBySlug(slug), {
      params,
    });
    return result.data[0] || null;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
