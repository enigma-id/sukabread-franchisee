/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import type { ProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/product-sales",
  filter,
  columns: {
    date: {
      title: "Tanggal",
      component: (row: ProductSalesRow) => formatDate(row.date),
    },
    channel: { title: "Channel" },
    payment: { title: "Payment" },
    outlet: { title: "Outlet" },
    code: { title: "Code" },
    menu: { title: "Menu" },
    quantity: { title: "Qty", class: "text-center", headerClass: "text-center" },
    unit_nett: {
      title: "Unit Nett",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.unit_nett),
    },
    discount: {
      title: "Discount",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.discount),
    },
    total_nett: {
      title: "Total Nett",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.total_nett),
    },
  },
});

export default createTableConfig;
