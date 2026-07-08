/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Banknote, ArrowUpCircle, Landmark, AlertTriangle } from "lucide-react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/cash-control.config";
import TableFilter from "./table/cash-control.filter";
import { currencyFormat } from "@/utils";
import { SummaryCard } from "@/components/app";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import type { CashOverview } from "@/services/types";
import { useReport } from "@/services/report/hooks";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

const OverviewCards = ({ data }: { data: CashOverview | null }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        label="Total Transaksi Cash"
        value={currencyFormat(data.transaction_cash)}
        icon={Banknote}
        theme={THEMES.orange}
      />
      <SummaryCard
        label="Total Variance"
        value={currencyFormat(data.variance)}
        icon={ArrowUpCircle}
        theme={THEMES.blue}
      />
      <SummaryCard
        label="Total Setoran Cash"
        value={currencyFormat(data.finished_cash)}
        icon={Landmark}
        theme={THEMES.green}
      />
      <SummaryCard
        label="Kekurangan"
        value={currencyFormat(data.cash_deposit)}
        icon={AlertTriangle}
        theme={THEMES.red}
      />
    </div>
  );
};

export function CashControl() {
  useDocumentMeta(
    "Cash Control | Sukabread Franchisee",
    "Laporan cash control outlet.",
  );
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable("cash_control", tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const { cashControlSummary, cashControlSummaryResult } = useReport();

  useEffect(() => {
    if (Table.State) {
      cashControlSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = cashControlSummaryResult.data?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Report" title="Cash Control" subtitle="" />
      <Page.Body>
        {/* Overview Cards */}
        <OverviewCards data={summary} />

        {/* Table */}
        <div className="flex-1 flex flex-col min-h-0">
          <Table.Tools downloadable>
            <TableFilter table={Table} />
          </Table.Tools>

          <Table.Render
            emptyTitle="No Cash Control Data"
            emptyDescription="Cash control data will appear here once available."
          />
        </div>
      </Page.Body>
    </Page>
  );
}
