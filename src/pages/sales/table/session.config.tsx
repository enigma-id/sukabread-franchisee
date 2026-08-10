import { Badge } from "@/components";
import config from "@/services/table/const";
import type { SalesSession } from "@/services/types/sales";
import {
  currencyFormat,
  formatDate,
  formatTime,
  getStatusVariant,
  isOngoing,
} from "@/utils";
import { ChevronRight, CreditCard } from "lucide-react";
import { useState, type ReactNode } from "react";

const PayTooltip = ({
  children,
  methods,
}: {
  children: ReactNode;
  methods: { name: string; total_paid: number }[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <>
          <span className="absolute left-1/2 bottom-full z-50 mb-2.5 -translate-x-1/2">
            <span className="block whitespace-nowrap rounded-2xl border border-white/60 bg-slate-900/95 px-4 py-3 text-left shadow-2xl shadow-indigo-500/20 backdrop-blur-md">
              <span className="mb-1.5 flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                <CreditCard className="h-3 w-3 text-indigo-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                  Pembayaran
                </span>
              </span>
              {methods.map((m) => (
                <span
                  key={m.name}
                  className="flex items-center justify-between gap-4 py-0.5"
                >
                  <span className="text-xs font-medium text-slate-200">
                    {m.name}
                  </span>
                  <span className="ml-3 text-xs font-semibold text-white">
                    {currencyFormat(m.total_paid)}
                  </span>
                </span>
              ))}
            </span>
            <span className="absolute left-1/2 top-full -mt-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/60 bg-slate-900/95" />
          </span>
        </>
      )}
    </span>
  );
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
      alias: "outlet:id",
      title: "Outlet",
      sortable: true,
      component: (row: SalesSession) => <div>{row.outlet?.name ?? "-"}</div>,
    },
    transaction_date: {
      title: "Tanggal",
      sortable: true,
      component: (row: SalesSession) => formatDate(row.transaction_date),
    },
    cashier_id: {
      alias: "cashier:id",
      title: "Kasir",
      sortable: true,
      class: "font-medium uppercase",
      component: (row: SalesSession) => <div>{row.cashier?.name ?? "-"}</div>,
    },
started_at: {
      title: "Awal Session",
      sortable: true,
      component: (row: SalesSession) => (
        <span className="whitespace-nowrap">
          {formatDate(row.started_at)}
          <span className="text-slate-400"> · </span>
          {formatTime(row.started_at)}
        </span>
      ),
    },
    finished_at: {
      title: "Akhir Session",
      sortable: true,
      component: (row: SalesSession) =>
        isOngoing(row.finished_at) ? (
          <Badge variant="primary" appearance="soft">
            Ongoing
          </Badge>
        ) : (
          <span className="whitespace-nowrap">
            {formatDate(row.finished_at)}
            <span className="text-slate-400"> · </span>
            {formatTime(row.finished_at)}
          </span>
        ),
    },
    cash_started: {
      title: "Modal Awal",
      sortable: true,
      class: "text-right font-mono",
      headerClass: "text-right",
      component: (row: SalesSession) => currencyFormat(row.cash_started),
    },
    grand_total: {
      alias: "summary:sales.grand_total",
      title: "Total Transaksi",
      sortable: true,
      class: "text-right font-mono font-medium",
      headerClass: "text-right",
      component: (row: SalesSession) => {
        const methods = row.summary?.payment_methods ?? [];
        return (
          <PayTooltip methods={methods}>
            <span className="border-b border-dashed border-slate-400/60 pb-px transition-colors hover:border-indigo-400 hover:text-indigo-600">
              {currencyFormat(row.summary?.sales?.grand_total ?? 0)}
            </span>
          </PayTooltip>
        );
      },
    },
    status: {
      title: "Status",
      sortable: true,
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
