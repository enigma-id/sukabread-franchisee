import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { StockItem, StockLog } from "../types";

export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery,
  tagTypes: ["Stock", "StockLog"],
  endpoints: (builder) => ({
    /**
     * GET /stock
     * List current stock inventory levels
     */
    getStock: builder.query<{ data: StockItem[] }, any>({
      query: (params) => ({
        url: "/stock",
        method: "GET",
        params,
      }),
      providesTags: ["Stock"],
    }),

    /**
     * GET /stock/log
     * List stock movement transaction logs
     */
    getStockLogs: builder.query<{ data: StockLog[] }, any>({
      query: (params) => ({
        url: "/stock/log",
        method: "GET",
        params,
      }),
      providesTags: ["StockLog"],
    }),
  }),
});

export const {
  useGetStockQuery,
  useLazyGetStockQuery,
  useGetStockLogsQuery,
  useLazyGetStockLogsQuery,
} = stockApi;
