import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery,
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    /**
     * GET /report/product-sales
     * List daily sales with pagination
     */
    getProductSales: builder.query({
      query: (params) => ({ url: "/report/product-sales", params }),
    }),

    /**
     * GET /report/product-sales/summary
     * List item sales with pagination
     */
    getProductSalesSummary: builder.query({
      query: (params) => ({ url: "/report/product-sales/summary", params }),
    }),

    /**
     * GET /report/outstanding
     * List outstanding bills with pagination
     */
    getOutstanding: builder.query({
      query: (params) => ({
        url: "/report/outstanding",
        params,
      }),
    }),

    /**
     * GET /report/outstanding/summary
     * Get outstanding bills summary
     */
    getOutstandingSummary: builder.query({
      query: (params) => ({
        url: "/report/outstanding/summary",
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
     * GET /report/cash-control
     * Get cash control data
     */
    getCashControl: builder.query({
      query: (params) => ({ url: "/report/cash-control", params }),
    }),
    /**
     * GET /report/cash-control/summary
     * Get settlement summary
     */
    getCashControlSummary: builder.query({
      query: (params) => ({ url: "/report/cash-control/summary", params }),
    }),
  }),
});

export const {
  useLazyGetProductSalesQuery,
  useLazyGetProductSalesSummaryQuery,
  useLazyGetOutstandingQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetSettlementQuery,
  useLazyGetSettlementSummaryQuery,
  useLazyGetCashControlQuery,
  useLazyGetCashControlSummaryQuery,
} = reportApi;
