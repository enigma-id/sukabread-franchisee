import { useCallback, useEffect } from "react";
import { useLazyGetCashControlQuery } from "./api";
import { logger } from "@/utils/logger";

export interface OverviewCash {
  total_session: number;
  total_topup: number;
  total_transaction: number;
  deficient: number;
}

export interface CashControlData {
  overview_cash: OverviewCash | null;
  session_data: any[] | null;
}

export interface CashControlResult {
  data: CashControlData | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: any;
  refetch: (params?: any) => void;
}

export const useCashControl = (): CashControlResult => {
  const [trigger, result] = useLazyGetCashControlQuery();

  const fetchData = useCallback(
    async (params?: any) => {
      try {
        await trigger(params || {}).unwrap();
      } catch (err) {
        logger.error("Failed to fetch cash control data", err);
      }
    },
    [trigger],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: result.data?.data ?? null,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: fetchData,
  };
};
