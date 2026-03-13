import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json;charset=UTF-8');
      headers.set('Authorization', 'anonymous');

      return headers;
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
