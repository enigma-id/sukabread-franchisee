/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/outstanding.config";
import TableFilter from "./table/outstanding.filter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SummaryCard } from "@/components/app";
import { useReport } from "@/services/report/hooks";
import { currencyFormat } from "@/utils";
import { Banknote, ArrowUpCircle } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <SummaryCard
        label="Total Outstanding"
        value={data.total_outstanding}
        icon={Banknote}
        theme={THEMES.orange}
      />
      <SummaryCard
        label="Total Charges"
        value={currencyFormat(data.total_charges)}
        icon={ArrowUpCircle}
        theme={THEMES.blue}
      />
    </div>
  );
};

export function Outstanding() {
  useDocumentMeta(
    "Outstanding | Sukabread Franchisee",
    "Laporan outstanding pelanggan.",
  );
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable(
    "report_outstanding",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const { outstandingSummary, outstandingSummaryResult } = useReport();

  useEffect(() => {
    if (Table.State) {
      outstandingSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, Table.State !== undefined]);

  const summary = outstandingSummaryResult.data?.data;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Report" title="Outstanding Bills" subtitle="" />
      <Page.Body className="flex-1 flex flex-col min-h-0 ">
        <OverviewCards data={summary} />

        <Table.Tools downloadable>
          <TableFilter table={Table} />
        </Table.Tools>

        <Table.Render
          emptyTitle="No Outstanding Bills"
          emptyDescription="Outstanding bills will appear here once available."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
