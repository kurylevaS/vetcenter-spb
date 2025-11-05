import { baseApi } from './baseApi';
import { api } from './api';
import { IExampleResponse, IExampleRequest, IResponse } from './dto/exampleDto';

export const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    [api.login.name]: builder.mutation<
      IResponse<IExampleResponse>,
      IExampleRequest
    >({
      query: ({ email, code }) => ({
        url: api.login.endpoint,
        params: { email, code },
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation: useLogin } = exampleApi;
