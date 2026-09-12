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
     * GET /report/cancel-order
     * List cancelled sales (so.status = 'cancelled')
     */
    getCancelledSales: builder.query({
      query: (params) => ({
        url: "/report/cancel-order",
        params,
      }),
    }),

    /**
     * GET /report/cancelled-order/summary
     * Get cancelled sales summary
     */
    getCancelledSalesSummary: builder.query({
      query: (params) => ({
        url: "/report/cancel-order/summary",
        params,
      }),
    }),

    /**
     * GET /report/saldo-log
     * List member saldo mutation log with pagination
     */
    getSaldoLog: builder.query({
      query: (params) => ({ url: "/report/saldo-log", params }),
    }),

    /**
     * GET /report/saldo-log/summary
     * Get member saldo mutation log summary
     */
    getSaldoLogSummary: builder.query({
      query: (params) => ({ url: "/report/saldo-log/summary", params }),
    }),

    /**
     * GET /report/cashier-maps
     * Satu baris per SESI operator (opened/closed) + jejak GPS sesi (mitra)
     */
    getCashierMaps: builder.query({
      query: (params) => ({ url: "/report/cashier-maps", params }),
    }),

    /**
     * GET /report/cashier-device
     * Semua operator outlet + posisi device terakhirnya (mitra)
     */
    getCashierDevice: builder.query({
      query: (params) => ({ url: "/report/cashier-device", params }),
    }),

    /**
     * GET /report/cashier
     * List laporan per-operator (cashier + manager) dengan angka ringkasan
     */
    getCashierReport: builder.query({
      query: (params) => ({ url: "/report/cashier", params }),
    }),

    /**
     * GET /report/cashier/summary
     * Agregat laporan per-operator (tanpa cashier_id = seluruh operator)
     */
    getCashierReportSummary: builder.query({
      query: (params) => ({ url: "/report/cashier/summary", params }),
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
  useLazyGetCancelledSalesQuery,
  useLazyGetCancelledSalesSummaryQuery,
  useLazyGetSaldoLogQuery,
  useLazyGetSaldoLogSummaryQuery,
  useLazyGetCashierMapsQuery,
  useLazyGetCashierDeviceQuery,
  useLazyGetCashierReportQuery,
  useLazyGetCashierReportSummaryQuery,
} = reportApi;
