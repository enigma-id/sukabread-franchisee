/* eslint-disable @typescript-eslint/no-explicit-any */
import { YearPicker } from "@/components/ui";

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
  const current = table.State?.filter ?? {};

  const applyFilters = (updates: any) => {
    const filters = { periode: current.periode ?? undefined, ...updates };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <YearPicker
        value={current.periode ?? ""}
        onChange={(val) => applyFilters({ periode: val })}
        inputClassName="!h-9 !min-h-0 !py-0"
      />
    </div>
  );
};

export default TableFilter;
