import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery,
  tagTypes: ["Report", "Cash"],
  endpoints: (builder) => ({
    /**
     * GET /report/sales/daily
     * List daily sales with pagination
     */
    getDailySales: builder.query({
      query: (params) => ({ url: "/report/sales/daily", params }),
    }),

    /**
     * GET /report/sales/item
     * List item sales with pagination
     */
    getItemSales: builder.query({
      query: (params) => ({ url: "/report/sales/item", params }),
    }),

    /**
     * GET /report/sales/outstanding
     * List outstanding bills with pagination
     */
    getOutstandingBills: builder.query({
      query: (params) => ({
        url: "/report/sales/outstanding",
        params,
      }),
    }),

    /**
     * GET /report/sales/outstanding/summary
     * Get outstanding bills summary
     */
    getOutstandingSummary: builder.query({
      query: (params) => ({
        url: "/report/sales/outstanding/summary",
        params,
      }),
    }),

    /**
     * GET /report/settlement
     * List settlement data with pagination
     */
    getSettlement: builder.query({
      query: (params) => ({ url: "/report/settlement", params }),
    }),

    /**
     * GET /report/settlement/summary
     * Get settlement summary
     */
    getSettlementSummary: builder.query({
      query: (params) => ({ url: "/report/settlement/summary", params }),
    }),

    /**
     * GET /report/cash/control
     * Get cash control data
     */
    getCashControl: builder.query({
      query: (params) => ({ url: "/report/cash/control", params }),
    }),
  }),
});

export const {
  useLazyGetDailySalesQuery,
  useLazyGetItemSalesQuery,
  useLazyGetOutstandingBillsQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetSettlementQuery,
  useLazyGetSettlementSummaryQuery,
  useGetSettlementSummaryQuery,
  useLazyGetCashControlQuery,
} = reportApi;