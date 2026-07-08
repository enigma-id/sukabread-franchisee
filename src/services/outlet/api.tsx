import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { ContractOutletUpdatePayload } from "../types";

export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery,
  tagTypes: ["Outlet"],
  endpoints: (builder) => ({
    /**
     * PUT /outlet
     * Update outlet config (service_charge, name, address)
     */
    updateOutlet: builder.mutation<void, ContractOutletUpdatePayload>({
      query: (payload) => ({
        url: "/outlet",
        method: "PUT",
        body: payload,
      }),
    }),

    getLog: builder.query({
      query: (params) => ({
        url: "/outlet/balance/log",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useUpdateOutletMutation, useLazyGetLogQuery } = outletApi;
