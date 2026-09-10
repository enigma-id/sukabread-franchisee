import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetProductSalesSummaryQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetSettlementSummaryQuery,
  useLazyGetCashControlSummaryQuery,
  useLazyGetProductItemSummaryQuery,
  useLazyGetCancelledProductSalesSummaryQuery,
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
    cancelledProductSalesSummary: useLazyGetCancelledProductSalesSummaryQuery,
    saldoLog: useLazyGetSaldoLogQuery,
    saldoLogSummary: useLazyGetSaldoLogSummaryQuery,
  },
});
