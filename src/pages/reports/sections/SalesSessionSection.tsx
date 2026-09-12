import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useTable from "@/services/table/hooks";
import type { TableConfig } from "@/services/table/const";
import type { SalesSession } from "@/services/types/sales";
import createTableConfig from "@/pages/sales/table/session.config";
import TableFilter from "@/pages/sales/table/session.filter";
import type { ReportSectionProps } from "./types";

/**
 * Tab "Penjualan" — daftar sesi penjualan (sama dengan menu Transaksi >
 * Penjualan) yang dikunci ke satu operator. Klik baris → detail sesi.
 */
export function SalesSessionSection({
  tableName,
  filter,
  lockedFilter,
  showFilter = true,
  onRowClick,
}: ReportSectionProps) {
  const navigate = useNavigate();

  const tableConfig = useMemo(
    () =>
      createTableConfig({
        filter,
        lockedFilter,
        onClick:
          onRowClick ?? ((row: SalesSession) => navigate(`/sales/session/${row.id}`)),
      }),
    [filter, lockedFilter, onRowClick, navigate],
  );

  const Table = useTable(tableName, tableConfig as TableConfig<unknown>);

  return (
    <>
      <Table.Tools>{showFilter && <TableFilter table={Table} />}</Table.Tools>
      <Table.Render
        emptyTitle='Belum ada sesi'
        emptyDescription='Sesi penjualan operator ini akan muncul di sini.'
      />
      <Table.Pagination />
    </>
  );
}
