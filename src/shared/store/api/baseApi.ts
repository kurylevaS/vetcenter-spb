import { prepareHeaders } from '@/shared/api/prepareHeaders';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_FRONT_PROXY_API_URL;
const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;

const URL = VERCEL_URL ? `https://${VERCEL_URL}/proxy/api` : BASE_URL;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
    prepareHeaders: (headers) => prepareHeaders(headers),
  }),
  tagTypes: ['example'],
  endpoints: () => ({}),
});
