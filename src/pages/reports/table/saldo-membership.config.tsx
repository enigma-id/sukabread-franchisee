/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/services/table/const";
import { currencyFormat, formatDateTime } from "@/utils";
import type { TableConfig } from "@/services/table/const";

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
        <span className="text-sm">
          {row?.date ? formatDateTime(row.date) : "-"}
        </span>
      ),
    },
    membership: {
      title: "Member",
      sortable: true,
      component: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{row?.membership || "-"}</span>
          {row?.card_id && (
            <span className="text-xs text-base-content/60">{row.card_id}</span>
          )}
        </div>
      ),
    },
    reference_type: {
      title: "Tipe",
      sortable: true,
      component: (row: any) => (
        <span className="text-sm capitalize">{row?.reference_type || "-"}</span>
      ),
    },
    reference_code: {
      title: "Reference Code",
      sortable: true,
      component: (row: any) => (
        <span className="font-medium text-sm">{row?.reference_code || "-"}</span>
      ),
    },
    payment_type: {
      title: "Payment Type",
      sortable: false,
      component: (row: any) => (
        <span className="text-sm">{row?.payment_type || "-"}</span>
      ),
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
        <span
          className={
            row?.status === "cancelled"
              ? "text-red-500 text-sm font-medium capitalize"
              : "text-green-600 text-sm font-medium capitalize"
          }
        >
          {row?.status || "-"}
        </span>
      ),
    },
    cancelled_info: {
      title: "Dibatalkan",
      sortable: false,
      component: (row: any) => {
        if (row?.status !== "cancelled") return <span className="text-sm">-</span>;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-red-500">
              {row?.cancelled_reason || "-"}
            </span>
            <span className="text-xs text-base-content/60">
              {row?.cancelled_by || "-"}
              {row?.cancelled_at ? ` • ${formatDateTime(row.cancelled_at)}` : ""}
            </span>
          </div>
        );
      },
    },
  },
});

export default createTableConfig;
