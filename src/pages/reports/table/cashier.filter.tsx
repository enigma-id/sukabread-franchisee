/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker } from "@/components/ui";
import TableFilters from "@/components/ui/table/filter";
import { FILTER_INPUT_CLASS } from "@/components/ui/table/filter.styles";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
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

  return (
    <TableFilters>
      <div className='grid grid-cols-1 gap-3 items-end'>
        <DatePicker
          mode='range'
          value={dateRange}
          onChange={(date) => {
            if (!Array.isArray(date)) return;
            const range = date as [Dayjs | null, Dayjs | null];
            setDateRange(range);
            // Apply hanya saat rentang lengkap atau dikosongkan.
            if ((range[0] && range[1]) || (!range[0] && !range[1])) {
              table.filter({
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
