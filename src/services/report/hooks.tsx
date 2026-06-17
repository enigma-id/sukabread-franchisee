import { createCrudHook } from "../hooks/createCrudHook";
import {
  useLazyGetProductSalesSummaryQuery,
  useLazyGetOutstandingSummaryQuery,
  useLazyGetSettlementSummaryQuery,
  useLazyGetCashControlSummaryQuery,
} from "./api";

export const useReport = createCrudHook({
  entityName: "report",
  additionalQueries: {
    productSalesSummary: useLazyGetProductSalesSummaryQuery,
    outstandingSummary: useLazyGetOutstandingSummaryQuery,
    settlementSummary: useLazyGetSettlementSummaryQuery,
    cashControlSummary: useLazyGetCashControlSummaryQuery,
  },
});
