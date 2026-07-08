import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const outletTopupApi = createApi({
  reducerPath: "outletTopupApi",
  baseQuery,
  tagTypes: ["OutletTopup"],
  endpoints: (builder) => ({
    getList: builder.query({
      query: (params) => ({
        url: "/outlet-topup-request",
        method: "GET",
        params,
      }),
    }),
    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/outlet-topup-request/${id}`,
        method: "GET",
        params,
      }),
    }),
    create: builder.mutation({
      query: (payload) => ({
        url: "/outlet-topup-request",
        method: "POST",
        body: payload,
      }),
    }),
    remove: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/outlet-topup-request/${id}`,
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useRemoveMutation,
} = outletTopupApi;
