/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect, SelectCashier } from "@/components/ui";
import { useCatalog } from "@/services/catalog/hooks";
import { ChevronDown } from "lucide-react";
import type { CatalogOutlet } from "@/services/types";
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

  const { get: getCatalog, getResult } = useCatalog();

  const [catalog, setCatalog] = useState<CatalogOutlet | null>(null);
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
      catalog_id: catalog?.catalog_id ?? "",
      cashier_id: cashierId ?? "",
      start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
      end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
      ...updates,
    });

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
    <TableFilters>
      <div
        className={clsx(
          "grid grid-cols-1 gap-3 items-end",
          // Kasir disembunyikan saat dikunci → jangan sisakan track kosong.
          lockedCashier ? "lg:grid-cols-2" : "lg:grid-cols-3",
        )}
      >
        <RemoteSelect
          placeholder='Catalog: All'
          inputClassName={FILTER_INPUT_CLASS}
          suffix={<ChevronDown className='text-gray-400 w-4 h-4' />}
          value={catalog}
          onChange={(opt) => {
            setCatalog(opt);
            apply({ catalog_id: opt?.catalog_id ?? "" });
          }}
          onClear={() => {
            setCatalog(null);
            apply({ catalog_id: "" });
          }}
          fetchData={(page, search) =>
            getCatalog({
              page: page || 1,
              limit: 20,
              search,
            })
          }
          hook={getResult as any}
          getLabel={(item: any) => item?.catalog?.name ?? ""}
          renderItem={(item: any) => item?.catalog?.name}
          getValue={(item: any) => item.catalog_id}
        />
        {!lockedCashier && (
          <SelectCashier
            value={cashierId}
            onChange={(id) => {
              setCashierId(id);
              apply({ cashier_id: id ?? "" });
            }}
            inputClassName={FILTER_INPUT_CLASS}
          />
        )}
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
          placeholder='Select Date Range'
          inputClassName={FILTER_INPUT_CLASS}
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
