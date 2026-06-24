/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { OutstandingBill } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/outstanding",
  filter,
  columns: {
    code: {
      title: "Code",
      component: (row: OutstandingBill) => (
        <span className="font-medium uppercase">{row.code}</span>
      ),
    },
    date: {
      title: "Tanggal",
      component: (row: OutstandingBill) => formatDateTime(row.date),
    },
    outlet: {
      title: "Outlet",
    },
    cashier: {
      title: "Kasir",
      component: (row: OutstandingBill) => (
        <span className="uppercase">{row.cashier}</span>
      ),
    },
    bill_name: {
      title: "Bill Name",
      component: (row: OutstandingBill) => (
        <span className="uppercase">{row.bill_name}</span>
      ),
    },
    total_charges: {
      title: "Total Charges",
      headerClass: "!text-end",
      class: "text-end font-mono font-medium",
      component: (row: OutstandingBill) => currencyFormat(row.total_charges),
    },
  },
});

export default createTableConfig;
