import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { OutletUpdatePayload, Outlet } from "../types";

export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery,
  tagTypes: ["Outlet"],
  endpoints: (builder) => ({
    /**
     * PUT /outlet
     * Update outlet service charges config
     */
    updateOutlet: builder.mutation<Outlet, OutletUpdatePayload>({
      query: (payload) => ({
        url: "/outlet",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Outlet"],
    }),

    getLog: builder.query({
      query: (params) => ({
        url: "/outlet/balance/log",
        method: "GET",
        params,
      }),
      providesTags: ["Outlet"],
    }),
  }),
});

export const { useUpdateOutletMutation, useLazyGetLogQuery } = outletApi;
