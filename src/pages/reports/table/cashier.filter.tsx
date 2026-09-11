/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import TableFilters from "@/components/ui/table/filter";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

type FilterOption = { label: string; value: string };

const roleOptions: FilterOption[] = [
  { label: "Kasir", value: "cashier" },
  { label: "Manager", value: "manager" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(
    () => table.State?.filter ?? {},
    [table.State?.filter],
  );

  const [role, setRole] = useState<FilterOption | null>(() => {
    const cur = current.role as string | undefined;
    const found = roleOptions.find((o) => o.value === cur);
    return found ? { label: found.label, value: found.value } : null;
  });

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
    role: role?.value ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    const f = buildFilters();
    return (
      String(f.role || "") !== String(current.role || "") ||
      String(f.start_date || "") !== String(current.start_date || "") ||
      String(f.end_date || "") !== String(current.end_date || "")
    );
  }, [role, dateRange, current]);

  const anyActive = useMemo(
    () => !!current.role || !!current.start_date || !!current.end_date,
    [current],
  );

  const handleClear = () => {
    setRole(null);
    setDateRange(undefined);
    table.filter({ role: "", start_date: "", end_date: "" });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <RemoteSelect
          label='Role'
          placeholder='Semua Role'
          data={roleOptions}
          value={role}
          onChange={(opt) => setRole(opt)}
          onClear={() => setRole(null)}
          getLabel={(item: FilterOption) => item?.label ?? ""}
          renderItem={(item: FilterOption) => item?.label}
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
