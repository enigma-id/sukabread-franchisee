import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import type { ProductItemRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
  lockedFilter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  onRowClick?: (row: ProductItemRow) => void;
}) => ({
  ...config,
  url: "/report/product-item",
  filter,
  lockedFilter,
  onRowClick,
  columns: {
    date: {
      title: "Tanggal",
      component: (row: ProductItemRow) => formatDate(row.date),
    },
    menu: { title: "Menu" },
    quantity: {
      title: "Qty",
      class: "text-center",
      headerClass: "text-center",
    },
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
