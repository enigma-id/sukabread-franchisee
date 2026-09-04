import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const salesRequestApi = createApi({
  reducerPath: "salesRequestApi",
  baseQuery,
  endpoints: (builder) => ({
    getList: builder.query({
      query: (params) => ({
        url: "/sales/request",
        method: "GET",
        params,
      }),
    }),
    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/sales/request/${id}`,
        method: "GET",
        params,
      }),
    }),
    create: builder.mutation({
      query: (payload) => ({
        url: "/sales/request",
        method: "POST",
        body: payload,
      }),
    }),
    update: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/request/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    publish: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/request/${id}/publish`,
        method: "PUT",
        body: payload,
      }),
    }),
    cancel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/sales/request/${id}/cancel`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  usePublishMutation,
  useCancelMutation,
} = salesRequestApi;
