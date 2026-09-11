import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import { ChevronRight } from "lucide-react";
import type { CancelledProductSalesRow } from "@/services/types/reports";

const createTableConfig = ({
  filter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  onRowClick?: (row: CancelledProductSalesRow) => void;
}) => ({
  ...config,
  url: "/report/cancel-order",
  filter,
  onRowClick,
  columns: {
    cancelled_at: {
      title: "Cancelled At",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <>{row?.cancelled_at ? formatDateTime(row.cancelled_at) : "-"}</>
      ),
    },
    cashier_name: { title: "Kasir", sortable: true },
    code: {
      title: "Order Code",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className='font-medium uppercase '>{row?.code ?? "-"}</span>
      ),
    },
    discount: {
      title: "Discount",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: CancelledProductSalesRow) =>
        currencyFormat(row?.discount),
    },
    total_nett: {
      title: "Total Charges",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: CancelledProductSalesRow) =>
        currencyFormat(row?.total_nett),
    },
    cancelled_reason: {
      title: "Cancelled Reason",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className='capitalize'>{row?.cancelled_reason ?? "-"}</span>
      ),
    },
    cancelled_by: {
      title: "Cancelled By",
      sortable: true,
      component: (row: CancelledProductSalesRow) => (
        <span className='uppercase'>{row?.cancelled_by ?? "-"}</span>
      ),
    },
    action: {
      title: "",
      width: 40,
      component: () => (
        <ChevronRight size={16} className='text-base-content/30' />
      ),
    },
  },
});

export default createTableConfig;
