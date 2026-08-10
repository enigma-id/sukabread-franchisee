import config from "@/services/table/const";
import { formatDate, formatDateTime } from "@/utils";
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
      sortable: true,
      component: (row: CashControlRow) => formatDate(row.transaction_date),
    },
    cashier: {
      title: "Kasir",
      sortable: true,
    },
    started_at: {
      title: "Mulai",
      sortable: true,
      component: (row: CashControlRow) => formatDateTime(row.started_at),
    },
    finished_at: {
      title: "Selesai",
      sortable: true,
      component: (row: CashControlRow) => formatDateTime(row.finished_at),
    },
    transaction_cash: {
      title: "Transaksi Cash",
      sortable: true,
      align: "right",
      format_number: true,
    },
    cash_deposit: {
      title: "Cash Deposit",
      sortable: true,
      align: "right",
      format_number: true,
    },
    finished_cash: {
      title: "Ending Cash",
      sortable: true,
      align: "right",
      format_number: true,
    },
    variance: {
      title: "Variance",
      sortable: true,
      align: "right",
      format_number: true,
    },
  },
});

export default createTableConfig;
