import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { WithdrawalRequest } from "@/services/types/withdrawal";
import { currencyFormat } from "@/utils";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const getStatusVariant = (status: string) => {
  if (status === "approved" || status === "completed") return "success";
  if (status === "rejected") return "error";
  if (status === "pending") return "warning";
  return "default";
};

const createTableConfig = ({
  onCancel,
}: {
  onCancel?: (row: WithdrawalRequest) => void;
}) => ({
  ...config,
  url: "/withdrawal-request",
  columns: {
    code: {
      title: "Kode",
      class: "font-medium font-mono text-xs",
    },
    outlet: {
      title: "Outlet",
      class: "font-medium",
      component: (row: WithdrawalRequest) => (
        <span>{row.outlet?.name || "-"}</span>
      ),
    },
    amount: {
      title: "Jumlah",
      class: "font-mono text-right",
      headerClass: "text-right",
      component: (row: WithdrawalRequest) => (
        <span className="font-semibold">{currencyFormat(row.amount)}</span>
      ),
    },
    bank_name: {
      title: "Bank",
      component: (row: WithdrawalRequest) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.bank_name}</span>
          <span className="text-xs text-slate-500">
            {row.bank_account_name} - {row.bank_account_number}
          </span>
        </div>
      ),
    },
    document_status: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: WithdrawalRequest) => (
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
      component: (row: WithdrawalRequest) => (
        <span>{row.created_by || "-"}</span>
      ),
    },
    created_at: {
      title: "Tanggal",
      class: "text-sm",
      component: (row: WithdrawalRequest) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
    action: {
      title: "",
      class: "text-right",
      component: (row: WithdrawalRequest) =>
        row.document_status === "pending" ? (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="error"
              styleType="soft"
              onClick={() => onCancel?.(row)}
            >
              <XCircle size={14} />
            </Button>
          </div>
        ) : null,
    },
  },
});

export default createTableConfig;
