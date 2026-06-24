import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery,
  tagTypes: ["Outlet"],
  endpoints: (builder) => ({
    /**
     * PUT /outlet
     * Update outlet service charges config
     */
    updateOutlet: builder.mutation({
      query: ({ ...payload }) => (
        console.log("updateOutlet", payload),
        {
          url: "/outlet",
          method: "PUT",
          body: payload,
        }
      ),
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
