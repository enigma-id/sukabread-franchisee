/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, SelectCashier } from "@/components/ui";
import clsx from "clsx";
import TableFilters from "@/components/ui/table/filter";
import { FILTER_INPUT_CLASS } from "@/components/ui/table/filter.styles";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
      lockedFilter?: Record<string, any>;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  // Kasir dikunci di konteks drill-down (mis. tab detail kasir).
  const lockedCashier = !!table.State?.lockedFilter?.cashier_id;

  const [cashierId, setCashierId] = useState<string | null>(
    () => (current.cashier_id as string) || null,
  );

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_date as string | undefined;
    const end = current.end_date as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return undefined;
  });

  // Filter langsung diterapkan tiap kontrol berubah (tanpa tombol Apply).
  const apply = (updates: Record<string, unknown> = {}) =>
    table.filter({
      cashier_id: cashierId ?? "",
      start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
      end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
      ...updates,
    });

  return (
    <TableFilters>
      <div
        className={clsx(
          "grid grid-cols-1 gap-3 items-end",
          // Kasir disembunyikan saat dikunci → jangan sisakan track kosong.
          lockedCashier ? "lg:grid-cols-1" : "lg:grid-cols-2",
        )}
      >
        <SelectCashier
          value={cashierId}
          onChange={(id) => {
            setCashierId(id);
            apply({ cashier_id: id ?? "" });
          }}
          hidden={lockedCashier}
          inputClassName={FILTER_INPUT_CLASS}
        />
        <DatePicker
          mode='range'
          value={dateRange}
          onChange={(date) => {
            if (!Array.isArray(date)) return;
            const range = date as [Dayjs | null, Dayjs | null];
            setDateRange(range);
            // Apply hanya saat rentang lengkap atau dikosongkan.
            if ((range[0] && range[1]) || (!range[0] && !range[1])) {
              apply({
                start_date: range[0]?.format("YYYY-MM-DD") ?? "",
                end_date: range[1]?.format("YYYY-MM-DD") ?? "",
              });
            }
          }}
          placeholder='Filter Tanggal'
          inputClassName={FILTER_INPUT_CLASS}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
