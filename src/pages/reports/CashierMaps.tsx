/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, MapPinned } from "lucide-react";
import { Page } from "@/components/app/layout";
import { useLazyGetCashierDeviceQuery } from "@/services/report/api";
import type { CashierDeviceRow } from "@/services/types";
import {
  deviceStatusColor,
  deviceStatusFromTime,
  deviceStatusLabel,
} from "@/utils";
import clsx from "clsx";
import { CashierSessionsPanel } from "./sections/CashierSessionsPanel";

/** Response bisa dibungkus `{ data }` / `{ datas }` — ambil array-nya. */
const parseRows = <T,>(rawResponse: any): T[] => {
  const raw = rawResponse?.data ?? rawResponse;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.datas)) return raw.datas;
  return [];
};

export function CashierMaps() {
  const [triggerDevice, { data: deviceResponse, isLoading: deviceLoading }] =
    useLazyGetCashierDeviceQuery();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(
    null,
  );

  // Sumber daftar operator: SEMUA operator outlet + posisi device terakhirnya.
  const operators = useMemo(
    () => parseRows<CashierDeviceRow>(deviceResponse),
    [deviceResponse],
  );

  // Refresh tiap menit — posisi & recency device ikut berubah.
  useEffect(() => {
    triggerDevice(undefined);
    const timer = setInterval(() => triggerDevice(undefined), 60 * 1000);
    return () => clearInterval(timer);
  }, [triggerDevice]);

  // Default ke operator pertama; klik list menimpa pilihan.
  const activeOperatorId =
    selectedOperatorId &&
    operators.some((o) => o.cashier_id === selectedOperatorId)
      ? selectedOperatorId
      : (operators[0]?.cashier_id ?? null);

  const operator = operators.find((o) => o.cashier_id === activeOperatorId);

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title='Mitra Maps'
        subtitle='Posisi device seluruh operator berdasarkan history GPS terakhir.'
      />
      <Page.Body className='flex-1 flex flex-col md:flex-row gap-4 min-h-0'>
        {/* Left — daftar operator outlet */}
        <div className='w-full md:w-[380px] shrink-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
          <div className='px-5 py-4 border-b border-slate-100 flex items-center gap-2.5'>
            <MapPinned className='w-4 h-4 text-emerald-600' />
            <h3 className='text-sm font-bold text-slate-800'>Operator</h3>
            <span className='ml-auto text-[11px] font-semibold text-slate-400'>
              {operators.length} Operator
            </span>
          </div>

          <div className='flex-1 overflow-y-auto min-h-0'>
            {deviceLoading && operators.length === 0 ? (
              <div className='flex items-center justify-center py-12 text-slate-400'>
                <Loader2 className='w-5 h-5 animate-spin' />
              </div>
            ) : operators.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-slate-400'>
                <MapPin className='w-8 h-8 text-slate-300 mb-2' />
                <p className='text-sm font-medium'>Tidak ada operator</p>
                <p className='mt-1 px-6 text-center text-[11px]'>
                  Semua operator outlet (kasir &amp; manager) akan muncul di
                  sini.
                </p>
              </div>
            ) : (
              operators.map((row) => {
                const active = row.cashier_id === activeOperatorId;
                const status = deviceStatusFromTime(row.last_activity_at);
                const color = deviceStatusColor(status);
                return (
                  <button
                    key={row.cashier_id}
                    onClick={() => setSelectedOperatorId(row.cashier_id)}
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
                      <span className='flex items-center gap-1 shrink-0'>
                        <span
                          className='h-1.5 w-1.5 rounded-full'
                          style={{ background: color }}
                        />
                        <span
                          className='text-[10px] font-bold'
                          style={{ color }}
                        >
                          {deviceStatusLabel(status)}
                        </span>
                      </span>
                    </div>

                    <p className='text-[10px] text-slate-500 mt-1 font-mono'>
                      {row.last_latitude && row.last_longitude
                        ? `${row.last_latitude.toFixed(5)}, ${row.last_longitude.toFixed(5)}`
                        : "Lokasi belum tersedia"}
                    </p>

                    <p className='text-[10px] text-slate-400 mt-0.5'>
                      {row.last_battery_health
                        ? `Battery ${row.last_battery_health}`
                        : "Battery -"}
                      {row.last_activity_at ? ` • ${row.last_activity_at}` : ""}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right — pilih sesi lalu gambar jejaknya di peta */}
        <CashierSessionsPanel
          cashierId={activeOperatorId ?? ""}
          title={operator?.cashier_name}
          onSelect={setSelectedOperatorId}
          className='flex-1 min-w-0'
        />
      </Page.Body>
    </Page>
  );
}
