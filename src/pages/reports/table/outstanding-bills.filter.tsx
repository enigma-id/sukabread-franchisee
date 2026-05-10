import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
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

  // Fetch customers for filter
  const { get: getUser, getResult } = useUser();

  useEffect(() => {
    getUser({ page: 1, limit: 100, status: "active" });
  }, []);

  const [cashier, setCashier] = useState<User | null>(null);

  // Sync customer state when current.cashier_id changes
  useEffect(() => {
    if (current.cashier_id && getResult?.data?.data) {
      const cashiers = getResult.data.data as any[];
      const foundCashier = cashiers.find((c) => c.id === current.cashier_id);
      if (foundCashier) {
        setCashier(foundCashier);
      }
    } else if (!current.cashier_id) {
      setCashier(null);
    }
  }, [current.cashier_id, getResult?.data?.data]);

  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | undefined
  >(() => {
    const start = current.start_at as string | undefined;
    const end = current.end_at as string | undefined;
    if (start && end) {
      return [dayjs(start), dayjs(end)];
    }
    return undefined;
  });

  const applyFilters = (updates: any) => {
    const filters = {
      start_at: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_at: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
      cashier_id: cashier?.id ?? "",
      ...updates,
    };
    table.filter(filters);
  };

  const handleDateChange = (
    date: Dayjs | [Dayjs | null, Dayjs | null] | null,
  ) => {
    let newRange: [Dayjs | null, Dayjs | null] = [null, null];
    if (date && typeof date !== "string" && !("format" in date)) {
      newRange = date as [Dayjs | null, Dayjs | null];
    }

    setDateRange(newRange);

    if ((newRange[0] && newRange[1]) || (!newRange[0] && !newRange[1])) {
      applyFilters({
        start_at: newRange[0]?.format("YYYY-MM-DD") || "",
        end_at: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
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
          getLabel={(item: any) => (item ? `Customer: ${item.name}` : "")}
          renderItem={(item: any) => item?.name}
          getValue={(item: any) => item.id}
        />
      </div>
      <div className="w-70">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Date: All Time"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default TableFilter;
