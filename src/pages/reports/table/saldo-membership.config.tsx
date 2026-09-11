/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import {
  currencyFormat,
  formatDateTime,
  getStatusVariant,
  getTypeVariant,
} from "@/utils";
import type { TableConfig } from "@/services/table/const";
import { Badge } from "@/components";

const createTableConfig = ({
  filter: incomingFilter,
}: {
  filter?: Record<string, unknown>;
}): TableConfig<any> => ({
  ...config,
  url: "/report/saldo-log",
  filter: {
    ...(incomingFilter || {}),
  },
  lockedFilter: {
    status: "completed",
  },
  columns: {
    // Urutan key = urutan kolom: Tanggal, Member, Tipe, Reference Code,
    // Payment Type, Nominal, Status, Info Pembatalan.
    date: {
      title: "Tanggal",
      sortable: true,
      component: (row: any) => (
        <>{row?.date ? formatDateTime(row.date) : "-"}</>
      ),
    },
    cashier_name: { title: "Kasir", sortable: true },
    membership: {
      title: "Member",
      sortable: true,
      component: (row: any) => (
        <div className='flex flex-col'>
          <span className='font-semibold'>{row?.membership || "-"}</span>
          {row?.card_id && (
            <span className='text-xs text-base-content/60'>{row.card_id}</span>
          )}
        </div>
      ),
    },
    reference_type: {
      title: "Tipe",
      sortable: true,
      component: (row: any) => (
        <span className='capitalize'>{row?.reference_type || "-"}</span>
      ),
    },
    reference_code: {
      title: "Reference Code",
      sortable: true,
      component: (row: any) => (
        <span className='font-medium '>{row?.reference_code || "-"}</span>
      ),
    },
    payment_type: {
      title: "Payment Type",
      sortable: false,
      class: "capitalize",
    },
    nominal: {
      title: "Nominal",
      align: "right",
      headerClass: "text-right",
      class: "text-right font-mono font-semibold",
      component: (row: any) => {
        const nominal = row?.nominal ?? 0;
        const isNegative = nominal < 0;
        return (
          <span
            className={
              isNegative
                ? "text-red-500 font-semibold"
                : "text-green-600 font-semibold"
            }
          >
            {currencyFormat(nominal)}
          </span>
        );
      },
    },
    status: {
      title: "Status",
      sortable: true,
      component: (row: any) => (
        <Badge variant={getStatusVariant(row.status)} appearance='soft'>
          {row.status || "-"}
        </Badge>
      ),
    },
    cancelled_info: {
      title: "Dibatalkan",
      sortable: false,
      component: (row: any) => {
        if (row?.status !== "cancelled") return "-";
        return (
          <div className='flex flex-col'>
            <span className=' font-medium text-red-500'>
              {row?.cancelled_reason || "-"}
            </span>
            <span className='text-xs text-base-content/60'>
              {row?.cancelled_by || "-"}
              {row?.cancelled_at
                ? ` • ${formatDateTime(row.cancelled_at)}`
                : ""}
            </span>
          </div>
        );
      },
    },
  },
});

export default createTableConfig;
