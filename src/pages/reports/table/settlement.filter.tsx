/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SelectCashier, YearPicker } from "@/components/ui";

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

  const lockedCashier = !!table.State?.lockedFilter?.cashier_id;
  const [cashierId, setCashierId] = useState<string | null>(
    () => (current.cashier_id as string) || null,
  );

  const applyFilters = (updates: any) => {
    const filters = {
      periode: current.periode ?? undefined,
      cashier_id: cashierId ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className='flex flex-row items-end gap-3 w-full shrink-0'>
      <YearPicker
        value={current.periode ?? ""}
        onChange={(val) => applyFilters({ periode: val })}
        inputClassName='!h-9 !min-h-0 !py-0'
      />
      <div className='w-60'>
        <SelectCashier
          value={cashierId}
          onChange={(id) => {
            setCashierId(id);
            applyFilters({ cashier_id: id ?? "" });
          }}
          hidden={lockedCashier}
          inputClassName='!h-9 !min-h-0 !py-0'
        />
      </div>
    </div>
  );
};

export default TableFilter;
