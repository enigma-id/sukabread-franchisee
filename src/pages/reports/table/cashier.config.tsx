import config from "@/services/table/const";
import { currencyFormat } from "@/utils";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components";
import type { CashierReportRow } from "@/services/types/reports";

// Backend mengabaikan order_by (selalu ORDER BY u.name), jadi tidak ada kolom
// yang sortable.
const createTableConfig = ({
  filter,
  lockedFilter,
  onRowClick,
}: {
  filter?: Record<string, unknown>;
  lockedFilter?: Record<string, unknown>;
  onRowClick?: (row: CashierReportRow) => void;
}) => ({
  ...config,
  url: "/report/cashier",
  filter,
  lockedFilter,
  onRowClick,
  columns: {
    cashier_name: {
      title: "Kasir",
      sortable: false,
      component: (row: CashierReportRow) => (
        <span className='font-medium'>{row.cashier_name || "-"}</span>
      ),
    },
    status: {
      title: "Status",
      sortable: false,
      component: (row: CashierReportRow) => (
        <Badge
          variant={
            String(row.status).toLowerCase() === "online" ? "success" : "default"
          }
        >
          {row.status || "-"}
        </Badge>
      ),
    },
    total_sales: {
      title: "Transaksi",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
    },
    omzet: {
      title: "Omzet",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono font-medium",
      component: (row: CashierReportRow) => currencyFormat(row.omzet),
    },
    total_outstanding: {
      title: "Outstanding",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
    },
    outstanding_amount: {
      title: "Total Outstanding",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: CashierReportRow) =>
        currencyFormat(row.outstanding_amount),
    },
    total_session: {
      title: "Total Sesi",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
    },
    cancelled_count: {
      title: "Dibatalkan",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
    },
    action: {
      title: "",
      width: 40,
      sortable: false,
      component: () => (
        <ChevronRight size={16} className='text-base-content/30' />
      ),
    },
  },
});

export default createTableConfig;
