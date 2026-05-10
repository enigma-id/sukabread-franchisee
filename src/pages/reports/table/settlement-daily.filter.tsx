import { useEffect, useMemo, useState } from "react";

import { RemoteSelect } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import type { User } from "@/services/types";
import { ChevronDown } from "lucide-react";

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

  // Fetch users for filter
  const { get: getUser, getResult } = useUser();

  useEffect(() => {
    getUser({ page: 1, limit: 100, status: "active" });
  }, []);

  const [cashier, setCashier] = useState<User | null>(null);

  // Sync state when current.cashier_id changes
  useEffect(() => {
    if (current.cashier_id && getResult?.data?.data) {
      const cashiers = getResult.data.data as any[];
      const found = cashiers.find((c) => c.id === current.cashier_id);
      if (found) {
        setCashier(found);
      }
    } else if (!current.cashier_id) {
      setCashier(null);
    }
  }, [current.cashier_id, getResult?.data?.data]);

  const applyFilters = (updates: any) => {
    const filters = {
      cashier_id: cashier?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-40 md:w-56">
        <RemoteSelect
          placeholder="Cashier: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={cashier}
          onChange={(val) => {
            setCashier(val);
            applyFilters({ cashier_id: val?.id || "" });
          }}
          onClear={() => {
            setCashier(null);
            applyFilters({ cashier_id: "" });
          }}
          fetchData={(page, search) =>
            getUser({
              page: page || 1,
              limit: 20,
              search,
              status: "active",
            })
          }
          hook={getResult as any}
          getLabel={(item: any) => (item ? item.name : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
    </div>
  );
};

export default TableFilter;
