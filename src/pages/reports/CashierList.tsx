/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, TrendingUp, UserCheck, UsersRound } from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/cashier.config";
import TableFilter from "./table/cashier.filter";
import { useLazyGetCashierReportSummaryQuery } from "@/services/report/api";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useAppSelector } from "@/hooks";
import { currencyFormat } from "@/utils";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
      <SummaryCard
        label='Total Operator'
        value={data.total_cashier ?? 0}
        icon={UsersRound}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Transaksi'
        value={data.total_sales ?? 0}
        icon={ShoppingCart}
        theme={THEMES.green}
      />
      <SummaryCard
        label='Total Omzet'
        value={currencyFormat(data.total_omzet ?? 0)}
        icon={TrendingUp}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Operator Aktif'
        value={data.active_cashier ?? 0}
        icon={UserCheck}
        theme={THEMES.purple}
      />
    </div>
  );
};

export function CashierList() {
  const brandType = useAppSelector((s) => s.auth.session?.brand?.type);
  const isMitra = brandType?.toLowerCase() === "mitra";
  const title = isMitra ? "Laporan Mitra" : "Laporan Kasir";

  useDocumentMeta(
    `${title} | Sukabread Franchisee`,
    "Laporan per-operator kasir dan manager.",
  );

  const navigate = useNavigate();

  // Filter tabel dibaca dari redux supaya baris yang diklik membawa periode
  // yang sedang aktif ke halaman detail.
  const tableState = useAppSelector((s) => s.table?.data?.["report_cashier"]);
  const periodQuery = useMemo(() => {
    const f = (tableState?.filter ?? {}) as Record<string, unknown>;
    const qs = new URLSearchParams();
    if (f.start_date) qs.set("start_date", String(f.start_date));
    if (f.end_date) qs.set("end_date", String(f.end_date));
    return qs.toString();
  }, [tableState]);

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        onRowClick: (row) => {
          navigate(
            `/report/cashier/${row.cashier_id}${periodQuery ? `?${periodQuery}` : ""}`,
          );
        },
      }),
    [navigate, periodQuery],
  );

  const Table = useTable("report_cashier", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(
    () => ({
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
      search: Table.State?.textSearch || "",
    }),
    [Table.State?.lockedFilter, Table.State?.filter, Table.State?.textSearch],
  );

  const currentFilterString = JSON.stringify(currentFilter);
  const [triggerSummary, { data: summaryResponse }] =
    useLazyGetCashierReportSummaryQuery();

  useEffect(() => {
    if (Table.State) triggerSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  const summary = summaryResponse?.data;

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={title}
        subtitle='Ringkasan aktivitas per kasir / operator.'
      />
      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle='Belum Ada Data'
          emptyDescription='Data laporan per-operator akan muncul di sini.'
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
