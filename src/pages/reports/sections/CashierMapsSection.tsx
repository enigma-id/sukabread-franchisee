/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useLazyGetCashierMapsQuery } from "@/services/report/api";
import { CashierLiveMap } from "@/components/app/CashierLiveMap";
import type { CashierMapRow } from "@/services/types";
import { currencyFormat, deviceStatusColor, deviceStatusLabel } from "@/utils";
import type { ReportSectionProps } from "./types";

/**
 * Tab peta untuk halaman detail kasir — menampilkan posisi & history GPS
 * operator yang sedang dibuka (dibatasi `cashier_id`).
 *
 * Memuat `mapbox-gl`, jadi komponen ini WAJIB di-lazy-load oleh pemanggilnya.
 */
export function CashierMapsSection({
  lockedFilter,
  showSummary = true,
}: ReportSectionProps) {
  const cashierId = (lockedFilter?.cashier_id as string) ?? "";
  const [trigger, { data: rawResponse, isLoading }] =
    useLazyGetCashierMapsQuery();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Refresh tiap menit — status recency device (online ≤5 mnt) ikut berubah.
  useEffect(() => {
    if (!cashierId) return;

    const params = { cashier_id: cashierId };
    trigger(params);
    const timer = setInterval(() => trigger(params), 60 * 1000);
    return () => clearInterval(timer);
  }, [cashierId, trigger]);

  const rows = useMemo<CashierMapRow[]>(() => {
    const raw = (rawResponse as any)?.data ?? rawResponse;
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    if (raw && Array.isArray(raw.datas)) return raw.datas;
    return [];
  }, [rawResponse]);

  // Semua titik operator ini; `selectedId` hanya untuk menandai operator aktif.
  const activeId = rows[0]?.cashier_id ?? null;
  const operator = rows[0];

  return (
    <div className='flex-1 min-h-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
      <div className='px-5 py-4 border-b border-slate-100 flex items-center gap-2.5 shrink-0'>
        <MapPin className='w-4 h-4 text-emerald-600' />
        <h3 className='text-sm font-bold text-slate-800'>
          {operator?.cashier_name ?? "Peta Operator"}
        </h3>
        {operator && (
          <span className='flex items-center gap-1.5'>
            <span
              className='h-1.5 w-1.5 rounded-full'
              style={{ background: deviceStatusColor(operator.status) }}
            />
            <span
              className='text-[10px] font-bold uppercase tracking-wide'
              style={{ color: deviceStatusColor(operator.status) }}
            >
              {deviceStatusLabel(operator.status)}
            </span>
          </span>
        )}
        <span className='ml-auto text-[11px] font-semibold text-slate-400'>
          {rows.length > 0 ? `${rows.length} operator` : ""}
        </span>
      </div>

      {showSummary && operator && (
        <div className='px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1 shrink-0'>
          <span className='text-[11px] text-slate-500'>
            Omset sesi:{" "}
            <span className='font-bold text-emerald-600'>
              {currencyFormat(operator.total_charges)}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Battery:{" "}
            <span className='font-bold text-slate-700'>
              {operator.battery_health || "-"}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Last seen:{" "}
            <span className='font-bold text-slate-700'>
              {operator.last_seen || "-"}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Sesi mulai:{" "}
            <span className='font-bold text-slate-700'>
              {operator.started_at || "-"}
            </span>
          </span>
        </div>
      )}

      <div className='flex-1 min-h-0 relative'>
        {isLoading && rows.length === 0 ? (
          <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
            <Loader2 className='w-5 h-5 animate-spin' />
          </div>
        ) : rows.length === 0 ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-400'>
            <MapPin className='w-8 h-8 text-slate-300 mb-2' />
            <p className='text-sm font-medium'>Belum ada data posisi</p>
            <p className='mt-1 max-w-sm text-center text-[11px]'>
              Peta hanya menampilkan operator dengan sesi kasir yang masih
              terbuka.
            </p>
          </div>
        ) : (
          <CashierLiveMap
            items={rows}
            selectedId={selectedSession ?? activeId}
            onSelect={setSelectedSession}
            className='h-full min-h-[420px] rounded-none'
          />
        )}
      </div>
    </div>
  );
}
