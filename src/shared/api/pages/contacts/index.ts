import { API } from '@/shared/api/api';
import { axiosInstance } from '@/shared/api/axios';
import { ContactsPageInterface, ContactsPageACF } from './types';

interface IParams {}

export const getContactsPage = async (params?: IParams): Promise<ContactsPageACF> => {
  try {
    const result = await axiosInstance.get<ContactsPageInterface[]>(API.getContactsPage, {
      params,
    });
    return result.data[0].acf;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};

