/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { RemoteSelect } from "@/components/ui";
import { ChevronDown } from "lucide-react";
import type { SelectOptionValue } from "@/services/types";

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State: {
      loading: boolean;
      filter: any;
    };
  };
}

const TYPE_OPTIONS = [
  { label: "All Type", value: "" },
  { label: "Receivable", value: "receivable" },
  { label: "Payable", value: "payable" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const currentType = table.State?.filter?.type ?? "";

  const [type, setType] = useState<SelectOptionValue | null>(() => {
    return currentType
      ? (TYPE_OPTIONS.find((opt) => opt.value === currentType) ?? null)
      : null;
  });

  const applyFilters = (updates: any) => {
    const filters = { type, ...updates };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-44">
        <RemoteSelect<SelectOptionValue>
          placeholder="Status: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text--sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          data={TYPE_OPTIONS}
          value={type}
          onChange={(val) => {
            setType(val);
            applyFilters({ type: val?.value });
          }}
          onClear={() => {
            setType(null);
            applyFilters({ type: "" });
          }}
          getLabel={(item) => (item ? `Type: ${item.label}` : "")}
          renderItem={(item) => item?.label}
        />
      </div>
    </div>
  );
};

export default TableFilter;
