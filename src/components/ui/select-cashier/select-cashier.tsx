/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { RemoteSelect } from "../select-remote";
import { useUser } from "@/services/user/hooks";
import type { CashierOption, SelectCashierProps } from "./types";

const toOption = (row: any): CashierOption => ({
  id: String(row.id),
  name: row.name ?? "",
  username: row.username,
  role: row.role,
});

/**
 * Dropdown operator (kasir + manager) — sumber `GET /user` yang sudah
 * difilter backend ke role `cashier`/`manager` dan outlet pada sesi.
 *
 * Bekerja dengan ID saja: nilai awal di-resolve ke opsi begitu daftar termuat,
 * sehingga filter bisa direstor dari query/state.
 */
export const SelectCashier = ({
  value,
  onChange,
  label,
  placeholder = "Semua Kasir",
  inputClassName,
  disabled,
  hidden,
}: SelectCashierProps) => {
  const { get, getResult } = useUser();
  const [option, setOption] = useState<CashierOption | null>(null);

  const rows = useMemo(
    () => ((getResult?.data?.data ?? []) as any[]) || [],
    [getResult?.data],
  );

  // Muat sekali supaya nilai awal (kalau ada) bisa di-resolve ke nama.
  useEffect(() => {
    get({ page: 1, limit: 100 });
  }, [get]);

  useEffect(() => {
    if (!value) {
      setOption(null);
      return;
    }
    if (String(option?.id) === String(value)) return;

    const found = rows.find((r) => String(r.id) === String(value));
    if (found) setOption(toOption(found));
  }, [value, rows, option?.id]);

  return (
    <RemoteSelect<any>
      label={label}
      placeholder={placeholder}
      value={option}
      onChange={(item) => {
        const next = toOption(item);
        setOption(next);
        onChange?.(next.id);
      }}
      onClear={() => {
        setOption(null);
        onChange?.(null);
      }}
      fetchData={(page, search) =>
        get({ page: page || 1, limit: 20, search })
      }
      hook={getResult as any}
      getLabel={(item: any) => item?.name ?? ""}
      renderItem={(item: any) => (
        <div className='flex items-center justify-between gap-2'>
          <span className='text-sm font-medium'>{item?.name}</span>
          <span className='text-[10px] uppercase font-bold text-gray-400'>
            {item?.role}
          </span>
        </div>
      )}
      getValue={(item: any) => item?.id}
      inputClassName={inputClassName}
      disabled={disabled}
      hidden={hidden}
    />
  );
};
