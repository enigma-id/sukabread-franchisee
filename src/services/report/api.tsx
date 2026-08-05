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

    /**
     * GET /report/product-item
     * List product item sales grouped per (date, outlet, menu)
     */
    getProductItem: builder.query({
      query: (params) => ({ url: "/report/product-item", params }),
    }),

    /**
     * GET /report/product-item/summary
     * Get product item sales summary
     */
    getProductItemSummary: builder.query({
      query: (params) => ({ url: "/report/product-item/summary", params }),
    }),

    /**
     * GET /report/cancelled-product-sales
     * List cancelled product sales (so.status = 'cancelled')
     */
    getCancelledProductSales: builder.query({
      query: (params) => ({
        url: "/report/cancelled-product-sales",
        params,
      }),
    }),

    /**
     * GET /report/cancelled-product-sales/summary
     * Get cancelled product sales summary
     */
    getCancelledProductSalesSummary: builder.query({
      query: (params) => ({
        url: "/report/cancelled-product-sales/summary",
        params,
      }),
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
  useLazyGetProductItemQuery,
  useLazyGetProductItemSummaryQuery,
  useLazyGetCancelledProductSalesQuery,
  useLazyGetCancelledProductSalesSummaryQuery,
} = reportApi;
