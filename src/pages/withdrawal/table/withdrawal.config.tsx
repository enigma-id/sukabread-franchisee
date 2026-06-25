import config from "@/services/table/const";
import { Edit, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WithdrawalRequest } from "@/services/types/withdrawal";
import { currencyFormat } from "@/utils";
import { Dropdown } from "@/components";

const createTableConfig = ({
  onCancel,
}: {
  onCancel?: (row: WithdrawalRequest) => void;
}) => ({
  ...config,
  url: "/withdrawal-request",
  columns: {
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
    status: {
      title: "Status",
      class: "text-center",
      headerClass: "text-center",
      component: (row: WithdrawalRequest) => {
        let variant: "default" | "success" | "error" | "warning" = "default";
        if (row.status === "approved") variant = "success";
        if (row.status === "rejected") variant = "error";
        if (row.status === "pending") variant = "warning";
        return <Badge variant={variant}>{row.status}</Badge>;
      },
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
      align: "right",
      component: (row: WithdrawalRequest) => (
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
          }
          position="end"
          contentClassName="dropdown-content z-[100] menu p-2 shadow-2xl bg-white rounded-2xl !w-56 border border-slate-100 mt-2"
        >
          <Dropdown.Item
            onSelect={() => onCancel?.(row)}
            className="hover:bg-indigo-50 hover:text-indigo-600"
          >
            <button className="flex items-center py-1 gap-3 rounded-xl text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Edit className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold text-[13px]">Cancel</span>
                <span className="text-[11px] text-slate-400">
                  Cancel withdrawal request
                </span>
              </div>
            </button>
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  },
});

export default createTableConfig;
