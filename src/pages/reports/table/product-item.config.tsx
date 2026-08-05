import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import type { ProductItemRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/product-item",
  filter,
  columns: {
    date: {
      title: "Tanggal",
      component: (row: ProductItemRow) => formatDate(row.date),
    },
    outlet: { title: "Outlet" },
    menu: { title: "Menu" },
    quantity: { title: "Qty", class: "text-center", headerClass: "text-center" },
    unit_nett: {
      title: "Unit Nett",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductItemRow) => currencyFormat(row.unit_nett),
    },
    total_nett: {
      title: "Total Nett",
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductItemRow) => currencyFormat(row.total_nett),
    },
  },
});

export default createTableConfig;
