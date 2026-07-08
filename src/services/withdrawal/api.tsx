import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { ContractCreateWithdrawalRequest } from "../types";

export const withdrawalApi = createApi({
  reducerPath: "withdrawalApi",
  baseQuery,
  tagTypes: ["Withdrawal"],
  endpoints: (builder) => ({
    getList: builder.query({
      query: (params) => ({
        url: "/withdrawal-request",
        method: "GET",
        params,
      }),
    }),
    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/withdrawal-request/${id}`,
        method: "GET",
        params,
      }),
    }),
    create: builder.mutation<void, ContractCreateWithdrawalRequest>({
      query: (payload) => ({
        url: "/withdrawal-request",
        method: "POST",
        body: payload,
      }),
    }),
    cancel: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/withdrawal-request/${id}/cancel`,
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetListQuery,
  useLazyShowQuery,
  useShowQuery,
  useCreateMutation,
  useCancelMutation,
} = withdrawalApi;
