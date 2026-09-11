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
      title: "Kasir / Operator",
      sortable: false,
      component: (row: CashierReportRow) => (
        <span className='font-medium'>{row.cashier_name || "-"}</span>
      ),
    },
    role: {
      title: "Role",
      sortable: false,
      component: (row: CashierReportRow) => (
        <Badge variant={row.role === "manager" ? "primary" : "info"}>
          {row.role || "-"}
        </Badge>
      ),
    },
    username: {
      title: "Username",
      sortable: false,
      component: (row: CashierReportRow) => row.username || "-",
    },
    outlet_name: { title: "Outlet", sortable: false },
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
      title: "Nilai Outstanding",
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
    active_session: {
      title: "Sesi Aktif",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: CashierReportRow) =>
        row.active_session > 0 ? (
          <Badge variant='success'>{row.active_session}</Badge>
        ) : (
          <span className='text-base-content/40'>0</span>
        ),
    },
    aov: {
      title: "AOV",
      sortable: false,
      headerClass: "!text-end",
      class: "text-end font-mono",
      component: (row: CashierReportRow) => currencyFormat(row.aov),
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
