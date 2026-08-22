import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currencyFormat, getStatusVariant } from "@/utils";
import { Trash2 } from "lucide-react";
import type { ContractOutletTopup } from "@/services/types/outlet-topup";

const createTableConfig = ({
  onRemove,
  onRowClick,
}: {
  onRemove?: (row: ContractOutletTopup) => void;
  onRowClick?: (row: ContractOutletTopup) => void;
}) => ({
  ...config,
  url: "/outlet-topup-request",
  columns: {
    code: {
      title: "Kode",
      sortable: true,
      class:
        "font-medium font-mono text-xs cursor-pointer hover:text-primary-100 transition-colors",
      component: (row: ContractOutletTopup) => (
        <span
          role='button'
          tabIndex={0}
          onClick={() => onRowClick?.(row)}
          onKeyDown={(e) => e.key === "Enter" && onRowClick?.(row)}
          className='hover:text-primary-300 transition-colors underline'
        >
          {row.code}
        </span>
      ),
    },
    outlet: {
      title: "Outlet",
      sortable: true,
      component: (row: ContractOutletTopup) => (
        <span>{row.outlet?.name ?? "-"}</span>
      ),
    },
    amount: {
      title: "Jumlah",
      sortable: true,
      class: "font-mono text-right font-medium",
      headerClass: "text-right",
      component: (row: ContractOutletTopup) => (
        <span>{currencyFormat(row.amount)}</span>
      ),
    },
    payment_method: {
      title: "Pembayaran",
      sortable: true,
      component: (row: ContractOutletTopup) => (
        <span>{row.payment_method?.name ?? "-"}</span>
      ),
    },
    document_status: {
      title: "Status",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: ContractOutletTopup) => (
        <Badge
          variant={getStatusVariant(row.document_status)}
          appearance='soft'
        >
          {row.document_status}
        </Badge>
      ),
    },
    created_by: {
      title: "Dibuat Oleh",
      sortable: true,
      class: "text-sm",
      component: (row: ContractOutletTopup) => (
        <span>{row.created_by ?? "-"}</span>
      ),
    },
    created_at: {
      title: "Tanggal",
      sortable: true,
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
          <div className='flex justify-end'>
            <Button
              size='sm'
              variant='error'
              styleType='soft'
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
