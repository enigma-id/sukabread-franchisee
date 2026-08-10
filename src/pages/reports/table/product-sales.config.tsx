import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import { ChevronRight } from "lucide-react";
import type { ProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: ProductSalesRow) => void;
}) => ({
  ...config,
  url: "/report/product-sales",
  filter,
  onRowClick,
  columns: {
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: ProductSalesRow) => formatDate(row.date),
    },
    channel: { title: "Channel", sortable: true },
    payment: { title: "Payment", sortable: true },
    code: { title: "Code", sortable: true },
    menu: { title: "Menu", sortable: true },
    quantity: {
      title: "Qty",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
    },
    unit_nett: {
      title: "Unit Nett",
      sortable: true,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.unit_nett),
    },
    discount: {
      title: "Discount",
      sortable: true,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.discount),
    },
    total_nett: {
      title: "Total Nett",
      sortable: true,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: ProductSalesRow) => currencyFormat(row.total_nett),
    },
    action: {
      title: "",
      width: 40,
      component: () => (
        <ChevronRight size={16} className="text-base-content/30" />
      ),
    },
  },
});

export default createTableConfig;
