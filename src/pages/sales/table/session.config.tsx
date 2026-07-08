import { Badge } from "@/components";
import config from "@/services/table/const";
import type { SalesSession } from "@/services/types/sales";
import { currencyFormat, formatDate, formatTime, isOngoing } from "@/utils";
import { ChevronRight } from "lucide-react";

const getStatusVariant = (status: string) => {
  if (!status) return "default";
  const s = String(status).toUpperCase();
  if (s === "COMPLETED" || s === "FINISHED" || s === "CLOSED") return "success";
  if (s === "ONGOING" || s === "OPEN" || s === "ACTIVE") return "primary";
  if (s === "PENDING" || s === "WAITING") return "warning";
  if (s === "CANCELLED" || s === "FAILED" || s === "VOID") return "error";
  return "default";
};

const createTableConfig = ({
  onClick,
  filter,
}: {
  filter?: Record<string, unknown>;
  onClick: (row: SalesSession) => void;
}) => ({
  ...config,
  url: "/sales/session",
  filter,
  onRowClick: (row: SalesSession) => onClick?.(row),
  columns: {
    outlet_id: {
      title: "Outlet",
      component: (row: SalesSession) => <div>{row.outlet?.name ?? "-"}</div>,
    },
    transaction_date: {
      title: "Tanggal",
      component: (row: SalesSession) => formatDate(row.transaction_date),
    },
    cashier_id: {
      alias: "cashier.id",
      title: "Kasir",
      class: "font-medium uppercase",
      component: (row: SalesSession) => <div>{row.cashier?.name ?? "-"}</div>,
    },
started_at: {
      title: "Awal Session",
      component: (row: SalesSession) => formatTime(row.started_at),
    },
    finished_at: {
      title: "Akhir Session",
      component: (row: SalesSession) =>
        isOngoing(row.finished_at) ? (
          <Badge variant="primary" appearance="soft">
            Ongoing
          </Badge>
        ) : (
          formatTime(row.finished_at)
        ),
    },
    cash_started: {
      title: "Modal Awal",
      class: "text-right font-mono",
      headerClass: "text-right",
      component: (row: SalesSession) => currencyFormat(row.cash_started),
    },
    grand_total: {
      title: "Total Transaksi",
      class: "text-right font-mono font-medium",
      headerClass: "text-right",
      component: (row: SalesSession) =>
        currencyFormat(row.summary?.sales?.grand_total ?? 0),
    },
    status: {
      title: "Status",
      component: (row: SalesSession) => (
        <Badge variant={getStatusVariant(row.status)} appearance="soft">
          {row.status}
        </Badge>
      ),
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
