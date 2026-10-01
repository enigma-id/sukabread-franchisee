/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { Page } from "@/components/app/layout";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import createTableConfig from "./table/saldo-membership.config";
import TableFilter from "./table/saldo-membership.filter";
import { useLazyGetSaldoLogSummaryQuery } from "@/services/report/api";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { Banknote, ListOrdered } from "lucide-react";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data?.data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <SummaryCard
        label="Total Nominal"
        value={currencyFormat(data.data.total_nominal ?? 0)}
        icon={Banknote}
        theme={THEMES.blue}
      />
      <SummaryCard
        label="Total Transaksi"
        value={data.data.total_count ?? 0}
        icon={ListOrdered}
        theme={THEMES.green}
      />
    </div>
  );
};

export function SaldoMembership() {
  const tableConfig = useMemo(() => {
    return createTableConfig({});
  }, []);

  const Table = useTable(
    "report_saldo_log",
    tableConfig as TableConfig<unknown>,
  );

  const currentFilter = useMemo(() => {
    return {
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    };
  }, [Table.State?.lockedFilter, Table.State?.filter]);

  const currentFilterString = JSON.stringify(currentFilter);
  const [triggerSummary, { data: summaryResponse }] =
    useLazyGetSaldoLogSummaryQuery();

  useEffect(() => {
    if (Table.State) {
      triggerSummary(JSON.parse(currentFilterString));
    }
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Report"
        title="Saldo Membership"
        subtitle="Laporan mutasi saldo member (top-up, bonus, dan pemakaian)."
      />
      <Page.Body className="flex-1 flex flex-col min-h-0">
        <OverviewCards data={summaryResponse as any} />

        <Table.Tools downloadable searchable={false}>
          <TableFilter table={Table} />
        </Table.Tools>
        <Table.Render
          emptyTitle="Belum Ada Data"
          emptyDescription="Data mutasi saldo akan muncul di sini."
        />
        <Table.Pagination />
      </Page.Body>
    </Page>
  );
}
