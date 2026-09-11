/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, SelectCashier } from "@/components/ui";
import TableFilters from "@/components/ui/table/filter";

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

  const buildFilters = () => ({
    cashier_id: cashierId ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      String(f.cashier_id || "") !== String(current.cashier_id || "") ||
      String(f.start_date || "") !== String(current.start_date || "") ||
      String(f.end_date || "") !== String(current.end_date || "")
    );
  }, [cashierId, dateRange, current]);

  const anyActive = useMemo(
    () => !!current.cashier_id || !!current.start_date || !!current.end_date,
    [current],
  );

  const handleClear = () => {
    setCashierId(null);
    setDateRange(undefined);
    table.filter({ cashier_id: "", start_date: "", end_date: "" });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 items-end'>
        <SelectCashier
          value={cashierId}
          onChange={setCashierId}
          hidden={lockedCashier}
        />
        <DatePicker
          label='Rentang Tanggal'
          mode='range'
          value={dateRange}
          onChange={(date) => {
            if (Array.isArray(date)) {
              setDateRange(date as [Dayjs | null, Dayjs | null]);
            }
          }}
          placeholder='Filter Tanggal'
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
