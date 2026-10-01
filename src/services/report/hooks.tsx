import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetProductSalesSummaryQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetSettlementSummaryQuery,
  useLazyGetCashControlSummaryQuery,
  useLazyGetProductItemSummaryQuery,
  useLazyGetCancelledSalesSummaryQuery,
  useLazyGetSaldoLogQuery,
  useLazyGetSaldoLogSummaryQuery,
} from "./api";

export const useReport = createCrudHook({
  entityName: "report",
  additionalQueries: {
    productSalesSummary: useLazyGetProductSalesSummaryQuery,
    outstandingSummary: useLazyGetOutstandingSummaryQuery,
    settlementSummary: useLazyGetSettlementSummaryQuery,
    cashControlSummary: useLazyGetCashControlSummaryQuery,
    productItemSummary: useLazyGetProductItemSummaryQuery,
    cancelledSalesSummary: useLazyGetCancelledSalesSummaryQuery,
    saldoLog: useLazyGetSaldoLogQuery,
    saldoLogSummary: useLazyGetSaldoLogSummaryQuery,
  },
});
