/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";

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
      component: (row: any) => (
        <span className="font-medium uppercase">{row.code}</span>
      ),
    },
    ordered_at: {
      title: "Tanggal",
      component: (row: any) => formatDateTime(row.ordered_at),
    },
    cashier: {
      title: "Kasir",
      component: (row: any) => (
        <span className="uppercase">{row.session?.cashier?.name}</span>
      ),
    },
    ticket: {
      title: "Bill",
      component: (row: any) => <span className="uppercase">{row.ticket}</span>,
    },
    membership: {
      title: "Customer",
      component: (row: any) => row.membership?.name ?? "-",
    },
    total_charges: {
      title: "Total Charges",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row.total_charges),
    },
  },
});

export default createTableConfig;
