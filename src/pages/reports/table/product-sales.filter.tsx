/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect } from "@/components/ui";
import { useCatalog } from "@/services/catalog/hooks";
import { ChevronDown } from "lucide-react";
import type { CatalogOutlet } from "@/services/types";

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

  const { get: getCatalog, getResult } = useCatalog();

  const [catalog, setCatalog] = useState<CatalogOutlet | null>(null);

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

  const applyFilters = (updates: any) => {
    const filters = {
      start_date: dateRange ? dateRange[0]?.format("YYYY-MM-DD") : "",
      end_date: dateRange ? dateRange[1]?.format("YYYY-MM-DD") : "",
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
        catalog_id: catalog?.catalog_id ?? "",
        start_date: newRange[0]?.format("YYYY-MM-DD") || "",
        end_date: newRange[1]?.format("YYYY-MM-DD") || "",
      });
    }
  };

  useEffect(() => {
    getCatalog({ page: 1, limit: 100 });
  }, []);

  useEffect(() => {
    if (current.catalog_id && getResult?.data?.data) {
      const catalog = getResult.data.data as any[];
      const foundCatalog = catalog.find(
        (c) => c.catalog_id === current.catalog_id,
      );
      if (foundCatalog) {
        setCatalog(foundCatalog);
      }
    } else if (!current.catalog_id) {
      setCatalog(null);
    }
  }, [current.catalog_id, getResult?.data?.data]);

  return (
    <div className="flex flex-row items-center gap-3 w-full shrink-0">
      <div className="w-60">
        <RemoteSelect
          placeholder="Catalog: All"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
          suffix={<ChevronDown className="text-gray-400 w-4 h-4" />}
          value={catalog}
          onChange={(val) => {
            setCatalog(val);
            applyFilters({ catalog_id: val?.catalog_id ?? "" });
          }}
          onClear={() => {
            setCatalog(null);
            applyFilters({ catalog_id: "" });
          }}
          fetchData={(page, search) =>
            getCatalog({
              page: page || 1,
              limit: 20,
              search,
            })
          }
          hook={getResult as any}
          getLabel={(item: any) =>
            item ? `Catalog: ${item.catalog?.name}` : ""
          }
          renderItem={(item: any) => item?.catalog?.name}
          getValue={(item: any) => item.catalog_id}
        />
      </div>
      <div className="w-70">
        <DatePicker
          mode="range"
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Select Date Range"
          inputClassName="!bg-white !border-gray-200 !h-9 !min-h-0 !py-0 !shadow-sm hover:!bg-gray-50 !text-gray-700 cursor-pointer !rounded-lg text-sm font-medium"
        />
      </div>
    </div>
  );
};

export default TableFilter;
