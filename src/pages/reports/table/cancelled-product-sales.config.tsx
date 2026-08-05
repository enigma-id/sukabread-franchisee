import config from "@/services/table/const";
import { currencyFormat, formatDate } from "@/utils";
import type { CancelledProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
}: {
  filter?: Record<string, unknown>;
}) => ({
  ...config,
  url: "/report/cancelled-product-sales",
  filter,
  columns: {
    date: {
      title: "Date",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="text-sm">
          {row?.date ? formatDate(row.date) : "-"}
        </span>
      ),
    },
    code: {
      title: "Order Code",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="font-medium uppercase text-sm">{row?.code ?? "-"}</span>
      ),
    },
    menu: {
      title: "Menu",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="font-semibold text-sm">{row?.menu ?? "-"}</span>
      ),
    },
    quantity: {
      title: "QTY",
      align: "center",
      class: "text-center font-semibold",
      component: (row: CancelledProductSalesRow) => row?.quantity ?? 0,
    },
    unit_nett: {
      title: "Unit Price",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: CancelledProductSalesRow) =>
        currencyFormat(row?.unit_nett),
    },
    discount: {
      title: "Discount",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: CancelledProductSalesRow) =>
        currencyFormat(row?.discount),
    },
    total_nett: {
      title: "Total Price",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: CancelledProductSalesRow) =>
        currencyFormat(row?.total_nett),
    },
    cancelled_reason: {
      title: "Cancelled Reason",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="text-sm capitalize">{row?.cancelled_reason ?? "-"}</span>
      ),
    },
    cancelled_by: {
      title: "Cancelled By",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="text-sm uppercase">{row?.cancelled_by ?? "-"}</span>
      ),
    },
    cancelled_at: {
      title: "Cancelled At",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className="text-sm">
          {row?.cancelled_at ? formatDate(row.cancelled_at) : "-"}
        </span>
      ),
    },
  },
});

export default createTableConfig;
