import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { Doctor } from '../getDoctors/types';

interface IParams {}

export const getDoctorById = async (
  id: number,
  params?: IParams
): Promise<Doctor> => {
  try {
    const result = await axiosInstance.get<Doctor>(API.getDoctorById(id), {
      params,
    });
    return result.data;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
