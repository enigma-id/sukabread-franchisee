import { Badge } from "@/components";
import config from "@/services/table/const";
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
  onClick: (e: any) => void;
}) => ({
  ...config,
  url: "/sales/session",
  filter,
  onRowClick: (row: any) => onClick?.(row),
  columns: {
    transaction_date: {
      title: "Tanggal",
      component: (row: any) => formatDate(row.transaction_date),
    },
    cashier_id: {
      alias: "cashier.id",
      title: "Kasir",
      class: "font-medium uppercase",
      component: (row: any) => <div>{row.cashier?.name ?? "-"}</div>,
    },
    id: {
      title: "No. Session",
      class: "text-base-content/60",
    },
    started_at: {
      title: "Awal Session",
      component: (row: any) => formatTime(row.started_at),
    },
    finished_at: {
      title: "Akhir Session",
      component: (row: any) =>
        isOngoing(row.finished_at) ? (
          <Badge variant="primary" appearance="soft">Ongoing</Badge>
        ) : (
          formatTime(row.finished_at)
        ),
    },
    total_charges: {
      title: "Total Transaksi",
      align: "right",
      class: "text-right font-mono font-medium",
      component: (row: any) => currencyFormat(row.summary_order.total_charges),
    },
    status: {
      title: "Status",
      component: (row: any) => (
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
