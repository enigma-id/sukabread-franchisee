import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery,
  tagTypes: ["Session", "Order"],
  endpoints: (builder) => ({
    /**
     * GET /sales/session
     * List sessions with pagination
     */
    getSession: builder.query({
      query: (params) => ({ url: "/sales/session", params }),
    }),

    /**
     * GET /sales/session/:id
     * Get session detail
     */
    showSession: builder.query({
      query: ({ id, ...params }) => ({ url: `/sales/session/${id}`, params }),
    }),

    /**
     * GET /sales/order/:id
     * Get order detail
     */
    showOrder: builder.query({
      query: ({ id, ...params }) => ({ url: `/sales/order/${id}`, params }),
    }),
  }),
});

export const {
  useLazyGetSessionQuery,
  useLazyShowSessionQuery,
  useLazyShowOrderQuery,
} = salesApi;
