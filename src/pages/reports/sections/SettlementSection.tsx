/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import { SettlementSummaryCards } from "@/components/app";
import { useLazyGetSettlementSummaryQuery } from "@/services/report/api";
import createTableConfig from "../table/settlement.config";
import TableFilter from "../table/settlement.filter";
import type { ReportSectionProps } from "./types";

export function SettlementSection({
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
    useLazyGetSettlementSummaryQuery();

  useEffect(() => {
    if (Table.State) triggerSummary(JSON.parse(currentFilterString));
  }, [currentFilterString, triggerSummary, Table.State !== undefined]);

  const summary = useMemo(() => {
    if (!summaryResponse?.data) return [];
    const d = summaryResponse.data;

    // Handle array response [{ payment_methods: [], nominals: [] }]
    if (Array.isArray(d)) {
      if (d.length > 0 && d[0].payment_methods && d[0].nominals) {
        return d[0].payment_methods.map((m: string, i: number) => ({
          method: m,
          total: d[0].nominals[i] || 0,
        }));
      }
      return d.map((item: any) => ({
        method: item.payment_method || item.method || item.name || "Unknown",
        total: item.nominal || item.total || item.amount || 0,
      }));
    }

    // Handle object response { payment_methods: [], nominals: [] }
    if (typeof d === "object" && d !== null) {
      if (d.payment_methods && d.nominals) {
        return d.payment_methods.map((m: string, i: number) => ({
          method: m,
          total: d.nominals[i] || 0,
        }));
      }
      return Object.entries(d).map(([method, total]) => ({
        method,
        total: Number(total) || 0,
      }));
    }

    return [];
  }, [summaryResponse]);

  return (
    <>
      {showSummary && <SettlementSummaryCards summary={summary} />}
      <Table.Tools downloadable searchable={false}>
        {showFilter && <TableFilter table={Table} />}
      </Table.Tools>
      <Table.Render
        emptyTitle='No Settlement Data'
        emptyDescription='Settlement data will appear here once available.'
      />
      <Table.Pagination />
    </>
  );
}
