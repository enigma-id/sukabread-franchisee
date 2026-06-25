import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

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
    create: builder.mutation({
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

export const { useLazyGetListQuery, useCreateMutation, useCancelMutation } =
  withdrawalApi;
