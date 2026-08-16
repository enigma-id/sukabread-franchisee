/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/topup-cancelled.config";
import TableFilter from "./table/topup-cancelled.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useReport } from "@/services/report/hooks";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { XCircle, TimerReset } from "lucide-react";

const THEMES: Record<string, any> = {
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <SummaryCard
        label="Total Dibatalkan"
        value={data.total_count}
        icon={XCircle}
        theme={THEMES.red}
      />
      <SummaryCard
        label="Total Nominal"
        value={currencyFormat(data.total_nominal)}
        icon={TimerReset}
        theme={THEMES.orange}
      />
    </div>
  );
};

export function TopupCancelled() {
  useDocumentMeta(
    "Report Topup Dibatalkan | Sukabread Franchisee",
    "Laporan topup saldo yang dibatalkan.",
  );

  const tableConfig = useMemo(() => {
    return createTableConfig({}) as TableConfig<unknown>;
  }, []);

  const Table = useTable("report_topup_cancelled", tableConfig);

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const { topupCancelledSummary, topupCancelledSummaryResult } = useReport();

  useEffect(() => {
    if (Table.State) {
      topupCancelledSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = topupCancelledSummaryResult.data?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Topup Dibatalkan"
        subtitle="Laporan topup saldo yang dibatalkan."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table as any} />
        </Table.Tools>

        <Table.Render
          emptyTitle="Tidak Ada Topup Dibatalkan"
          emptyDescription="Topup yang dibatalkan akan muncul di sini jika tersedia."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}

export default TopupCancelled;