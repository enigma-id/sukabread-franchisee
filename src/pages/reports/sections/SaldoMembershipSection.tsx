/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { Banknote, ListOrdered } from "lucide-react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { SummaryCard } from "@/components/app";
import { currencyFormat } from "@/utils";
import { useLazyGetSaldoLogSummaryQuery } from "@/services/report/api";
import createTableConfig from "../table/saldo-membership.config";
import TableFilter from "../table/saldo-membership.filter";
import type { ReportSectionProps } from "./types";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
};

const OverviewCards = ({ data }: { data: any | null }) => {
  if (!data?.data) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <SummaryCard
        label='Total Nominal'
        value={currencyFormat(data.data.total_nominal ?? 0)}
        icon={Banknote}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Total Transaksi'
        value={data.data.total_count ?? 0}
        icon={ListOrdered}
        theme={THEMES.green}
      />
    </div>
  );
};

export function SaldoMembershipSection({
  tableName,
  filter,
  lockedFilter,
  showFilter = true,
  showSummary = true,
  onRowClick,
}: ReportSectionProps) {
  const tableConfig = useMemo(
    () => createTableConfig({ filter, lockedFilter, onRowClick }),
    [filter, lockedFilter, onRowClick],
  );

  const Table = useTable(tableName, tableConfig as TableConfig<unknown>);

  const currentFilter = useMemo(
    () => ({
      ...(Table.State?.lockedFilter || {}),
      ...(Table.State?.filter || {}),
    }),
    [Table.State?.lockedFilter, Table.State?.filter],
  );

  const currentFilterString = JSON.stringify(currentFilter);
  const [triggerSummary, { data: summaryResponse }] =
    useLazyGetSaldoLogSummaryQuery();

  useEffect(() => {
    if (Table.State) triggerSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  return (
    <>
      {showSummary && <OverviewCards data={summaryResponse as any} />}
      <Table.Tools downloadable searchable={false}>
        {showFilter && <TableFilter table={Table} />}
      </Table.Tools>
      <Table.Render
        emptyTitle='Belum Ada Data'
        emptyDescription='Data mutasi saldo akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}
