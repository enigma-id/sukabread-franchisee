import config from "@/services/table/const";
import { currencyFormat, formatDate, formatTime } from "@/utils";
import type { CashSessionData } from "@/services/types/cash";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/cash-control",
  filter,
  columns: {
    transaction_date: {
      title: "Tanggal",
      component: (row: CashSessionData) => formatDate(row.transaction_date),
    },
    started_at: {
      title: "Mulai",
      component: (row: CashSessionData) => formatTime(row.started_at),
    },
    transaction_cash: {
      title: "Transaksi Cash",
      align: "right",
      format_number: true,
    },
    cash_deposit: {
      title: "Cash Deposit",
      align: "right",
      format_number: true,
    },
    finished_cash: {
      title: "Ending Cash",
      align: "right",
      format_number: true,
    },
    variance: {
      title: "Variance",
      align: "right",
      format_number: true,
    },
  },
});

export default createTableConfig;
