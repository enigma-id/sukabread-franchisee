/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import { DatePicker, RemoteSelect, SelectCashier } from "@/components/ui";
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

/** Pilihan tipe referensi saldo_log (mirror nilai yang di-insert backend). */
type FilterOption = { label: string; value: string };

const referenceTypeOptions: FilterOption[] = [
  { label: "Top-Up", value: "top-up" },
  { label: "Bonus", value: "bonus" },
  { label: "Sales", value: "sales" },
];

const statusOptions: FilterOption[] = [
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const TableFilter: React.FC<TableFilterProps> = ({ table }) => {
  const current = useMemo(() => table.State?.filter ?? {}, [table.State?.filter]);

  // Kasir dikunci di konteks drill-down (mis. tab detail kasir).
  const lockedCashier = !!table.State?.lockedFilter?.cashier_id;

  const [cashierId, setCashierId] = useState<string | null>(
    () => (current.cashier_id as string) || null,
  );

  const [referenceType, setReferenceType] = useState<FilterOption | null>(() => {
    const cur = current.reference_type as string | undefined;
    const found = referenceTypeOptions.find((o) => o.value === cur);
    return found ? { label: found.label, value: found.value } : null;
  });

  const [status, setStatus] = useState<FilterOption | null>(() => {
    const cur = (current.status as string | undefined) ?? "completed";
    const found = statusOptions.find((o) => o.value === cur);
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
    reference_type: referenceType?.value ?? "",
    status: status?.value ?? "",
    cashier_id: cashierId ?? "",
    start_date: dateRange?.[0]?.format("YYYY-MM-DD") ?? "",
    end_date: dateRange?.[1]?.format("YYYY-MM-DD") ?? "",
  });

  const isDirty = useMemo(() => {
    return (
      ((referenceType?.value ?? "") !== (current.reference_type || "")) ||
      ((status?.value ?? "") !== (current.status || "")) ||
      ((cashierId ?? "") !== (current.cashier_id || "")) ||
      ((dateRange?.[0]?.format("YYYY-MM-DD") ?? "") !==
        (current.start_date || "")) ||
      ((dateRange?.[1]?.format("YYYY-MM-DD") ?? "") !==
        (current.end_date || ""))
    );
  }, [referenceType, status, cashierId, dateRange, current]);

  const anyActive = useMemo(
    () =>
      !!current.reference_type ||
      !!current.cashier_id ||
      (current.status && current.status !== "completed") ||
      !!current.start_date ||
      !!current.end_date,
    [current],
  );

  const handleClear = () => {
    setReferenceType(null);
    setStatus({ label: "Completed", value: "completed" });
    setCashierId(null);
    setDateRange(undefined);
    table.filter({
      reference_type: "",
      status: "completed",
      cashier_id: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleFilter = () => table.filter(buildFilters());

  return (
    <TableFilters
      isActive={anyActive}
      isDirty={isDirty}
      handleClear={handleClear}
      handleFilter={handleFilter}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-end">
        <RemoteSelect
          label="Tipe"
          placeholder="Filter Tipe"
          data={referenceTypeOptions}
          value={referenceType}
          onChange={(opt) => setReferenceType(opt)}
          onClear={() => setReferenceType(null)}
          getLabel={(item: { label: string }) => item?.label ?? ""}
          renderItem={(item: { label: string }) => item?.label}
        />
        <RemoteSelect
          label="Status"
          placeholder="Filter Status"
          data={statusOptions}
          value={status}
          onChange={(opt) => setStatus(opt)}
          onClear={() => setStatus({ label: "Completed", value: "completed" })}
          getLabel={(item: { label: string }) => item?.label ?? ""}
          renderItem={(item: { label: string }) => item?.label}
        />
        <SelectCashier value={cashierId} onChange={setCashierId} hidden={lockedCashier} />
        <DatePicker
          label="Rentang Tanggal"
          mode="range"
          value={dateRange}
          onChange={(date) => {
            if (Array.isArray(date)) {
              setDateRange(date as [Dayjs | null, Dayjs | null]);
            }
          }}
          placeholder="Filter Tanggal"
        />
      </div>
    </TableFilters>
  );
};

export default TableFilter;
