/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/product-sales",
  filter,
  columns: {
    dates: {
      title: "Tanggal",
      component: (row: any) => formatDate(row.dates),
    },
    total_order: {
      title: "Total Order",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: any) => currencyFormat(row.total_order),
    },
  },
});

export default createTableConfig;
