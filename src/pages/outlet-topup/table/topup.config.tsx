import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/utils";
import { Trash2 } from "lucide-react";
import type { ContractOutletTopup } from "@/services/types/outlet-topup";

const getStatusVariant = (status: string) => {
  if (status === "approved" || status === "completed") return "success";
  if (status === "rejected") return "error";
  if (status === "pending") return "warning";
  return "default";
};

const createTableConfig = ({
  onRemove,
}: {
  onRemove?: (row: ContractOutletTopup) => void;
}) => ({
  ...config,
  url: "/outlet-topup-request",
  columns: {
    code: {
      title: "Kode",
      class: "font-medium font-mono text-xs",
    },
    outlet: {
      title: "Outlet",
      component: (row: ContractOutletTopup) => (
        <span>{row.outlet?.name ?? "-"}</span>
      ),
    },
    amount: {
      title: "Jumlah",
      class: "font-mono text-right font-medium",
      headerClass: "text-right",
      component: (row: ContractOutletTopup) => (
        <span>{currencyFormat(row.amount)}</span>
      ),
    },
    payment_method: {
      title: "Pembayaran",
      component: (row: ContractOutletTopup) => (
        <span>{row.payment_method?.name ?? "-"}</span>
      ),
    },
    document_status: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: ContractOutletTopup) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          appearance="soft"
        >
          {row.document_status}
        </Badge>
      ),
    },
    created_by: {
      title: "Dibuat Oleh",
      class: "text-sm",
      component: (row: ContractOutletTopup) => (
        <span>{row.created_by ?? "-"}</span>
      ),
    },
    created_at: {
      title: "Tanggal",
      class: "text-sm",
      component: (row: ContractOutletTopup) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    action: {
      title: "",
      width: 64,
      component: (row: ContractOutletTopup) =>
        row.document_status === "pending" ? (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="error"
              styleType="soft"
              onClick={() => onRemove?.(row)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ) : null,
    },
  },
});

export default createTableConfig;
