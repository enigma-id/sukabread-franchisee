import config from "@/services/table/const";
import { formatDate, formatTime } from "@/utils";
import type { CashControlRow } from "@/services/types/reports";

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
      component: (row: CashControlRow) => formatDate(row.transaction_date),
    },
    started_at: {
      title: "Mulai",
      component: (row: CashControlRow) => formatTime(row.started_at),
    },
    finished_at: {
      title: "Selesai",
      component: (row: CashControlRow) => formatTime(row.finished_at),
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
