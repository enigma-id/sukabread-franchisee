/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, MapPinned } from "lucide-react";
import { Page } from "@/components/app/layout";
import { CashierLiveMap } from "@/components/app/CashierLiveMap";
import { useLazyGetCashierMapsQuery } from "@/services/report/api";
import type { CashierMapRow } from "@/services/types";
import { currencyFormat, deviceStatusColor, deviceStatusLabel } from "@/utils";
import clsx from "clsx";

const pointCount = (row: CashierMapRow) =>
  (row.historys ?? []).filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  ).length;

export function CashierMaps() {
  const [trigger, { data: rawResponse, isLoading }] =
    useLazyGetCashierMapsQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo<CashierMapRow[]>(() => {
    const raw = (rawResponse as any)?.data ?? rawResponse;
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    if (raw && Array.isArray(raw.datas)) return raw.datas;
    return [];
  }, [rawResponse]);

  // Refresh tiap menit — status recency device (online ≤5 mnt) ikut berubah.
  useEffect(() => {
    trigger(undefined);
    const timer = setInterval(() => trigger(undefined), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Default ke operator pertama; klik marker/list menimpa pilihan.
  const activeId =
    selectedId && rows.some((r) => r.cashier_id === selectedId)
      ? selectedId
      : (rows[0]?.cashier_id ?? null);

  const selected = rows.find((r) => r.cashier_id === activeId);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Outlet Maps'
        subtitle='Posisi live kasir/operator yang sedang bertugas berdasarkan history GPS device.'
      />
      <Page.Body className='flex-1 flex flex-col md:flex-row gap-4 min-h-0'>
        {/* Left — daftar operator yang sedang bertugas */}
        <div className='w-full md:w-[380px] shrink-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
          <div className='px-5 py-4 border-b border-slate-100 flex items-center gap-2.5'>
            <MapPinned className='w-4 h-4 text-emerald-600' />
            <h3 className='text-sm font-bold text-slate-800'>
              Operator Bertugas
            </h3>
            <span className='ml-auto text-[11px] font-semibold text-slate-400'>
              {rows.length} Operator
            </span>
          </div>

          <div className='flex-1 overflow-y-auto min-h-0'>
            {isLoading ? (
              <div className='flex items-center justify-center py-12 text-slate-400'>
                <Loader2 className='w-5 h-5 animate-spin' />
              </div>
            ) : rows.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-slate-400'>
                <MapPin className='w-8 h-8 text-slate-300 mb-2' />
                <p className='text-sm font-medium'>Tidak ada operator bertugas</p>
                <p className='mt-1 px-6 text-center text-[11px]'>
                  Peta hanya menampilkan operator dengan sesi kasir yang masih
                  terbuka.
                </p>
              </div>
            ) : (
              rows.map((row) => {
                const count = pointCount(row);
                const active = row.cashier_id === activeId;
                const color = deviceStatusColor(row.status);
                return (
                  <button
                    key={row.cashier_id}
                    onClick={() => setSelectedId(row.cashier_id)}
                    className={clsx(
                      "w-full text-left px-5 py-3.5 border-b border-slate-50 transition-colors cursor-pointer",
                      active
                        ? "bg-emerald-50/70 border-l-[3px] border-l-emerald-500"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-sm font-bold text-slate-800 truncate'>
                        {row.cashier_name}
                      </p>
                      <span className='shrink-0 text-[11px] font-semibold text-slate-400'>
                        {count} titik
                      </span>
                    </div>

                    <div className='mt-1 flex items-center gap-2'>
                      <span className='text-[10px] font-bold uppercase tracking-wide text-slate-400'>
                        {row.role || "-"}
                      </span>
                      <span className='flex items-center gap-1'>
                        <span
                          className='h-1.5 w-1.5 rounded-full'
                          style={{ background: color }}
                        />
                        <span
                          className='text-[10px] font-bold'
                          style={{ color }}
                        >
                          {deviceStatusLabel(row.status)}
                        </span>
                      </span>
                    </div>

                    <p className='text-xs text-slate-500 font-medium mt-1'>
                      Omset sesi:{" "}
                      <span className='font-bold text-emerald-600'>
                        {currencyFormat(row.total_charges)}
                      </span>
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>
                      {row.battery_health
                        ? `Battery ${row.battery_health}`
                        : "Battery -"}
                      {row.last_seen ? ` • ${row.last_seen}` : ""}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right — peta */}
        <div className='flex-1 min-w-0 bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col'>
          <div className='px-5 py-4 border-b border-slate-100 flex items-center gap-2.5'>
            <MapPin className='w-4 h-4 text-emerald-600' />
            <h3 className='text-sm font-bold text-slate-800'>
              {selected?.cashier_name ?? "Peta Operator"}
            </h3>
            <span className='ml-auto text-[11px] font-semibold text-slate-400'>
              {selected ? pointCount(selected) : 0} history
            </span>
          </div>

          <div className='flex-1 min-h-0 p-3'>
            <CashierLiveMap
              items={rows}
              selectedId={activeId}
              onSelect={setSelectedId}
              className='h-full min-h-[400px]'
            />
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
