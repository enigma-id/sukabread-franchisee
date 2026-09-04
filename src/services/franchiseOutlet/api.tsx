import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

/**
 * CRUD Outlet milik franchise — endpoint `/franchise/outlets`
 * (backend handler `outlet/manage`).
 */
export const franchiseOutletApi = createApi({
  reducerPath: "franchiseOutletApi",
  baseQuery,
  tagTypes: ["FranchiseOutlet"],
  endpoints: (builder) => ({
    getList: builder.query({
      query: (params) => ({
        url: "/franchise/outlets",
        method: "GET",
        params,
      }),
      providesTags: ["FranchiseOutlet"],
    }),
    show: builder.query({
      query: ({ id, ...params }) => ({
        url: `/franchise/outlets/${id}`,
        method: "GET",
        params,
      }),
      providesTags: ["FranchiseOutlet"],
    }),
    create: builder.mutation({
      query: (payload) => ({
        url: "/franchise/outlets",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["FranchiseOutlet"],
    }),
    update: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchise/outlets/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["FranchiseOutlet"],
    }),
    remove: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchise/outlets/${id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["FranchiseOutlet"],
    }),
    activate: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchise/outlets/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["FranchiseOutlet"],
    }),
    deactivate: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/franchise/outlets/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["FranchiseOutlet"],
    }),
  }),
});

export const {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useActivateMutation,
  useDeactivateMutation,
} = franchiseOutletApi;
