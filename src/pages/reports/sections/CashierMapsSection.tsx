/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useLazyGetCashierMapsQuery } from "@/services/report/api";
import { CashierLiveMap } from "@/components/app/CashierLiveMap";
import { RemoteSelect } from "@/components/ui";
import type { CashierMapRow } from "@/services/types";
import {
  currencyFormat,
  deviceStatusColor,
  deviceStatusFromTime,
  deviceStatusLabel,
  formatDate,
  formatTime,
} from "@/utils";
import clsx from "clsx";
import type { ReportSectionProps } from "./types";

/** Response bisa dibungkus `{ data }` / `{ datas }` — ambil array-nya. */
const parseRows = <T,>(rawResponse: any): T[] => {
  const raw = rawResponse?.data ?? rawResponse;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.datas)) return raw.datas;
  return [];
};

/** Baris atas opsi sesi: tanggal sesi dibuka. */
const sessionDate = (row: CashierMapRow) => formatDate(row.started_at);
/** Baris bawah opsi sesi: jam mulai – jam selesai (sesi `opened` = "Sekarang"). */
const sessionTimes = (row: CashierMapRow) =>
  `${formatTime(row.started_at)} – ${
    row.finished_at ? formatTime(row.finished_at) : "Sekarang"
  }`;
const sessionLabel = (row: CashierMapRow) =>
  `${sessionDate(row)} · ${sessionTimes(row)}`;

/**
 * Tab peta untuk halaman detail kasir — menampilkan jejak GPS per SESI operator
 * (dibatasi `cashier_id`), sesi dipilih lewat dropdown.
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
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  // Refresh tiap menit — omset & posisi sesi berjalan ikut berubah.
  useEffect(() => {
    if (!cashierId) return;

    const params = { cashier_id: cashierId };
    trigger(params);
    const timer = setInterval(() => trigger(params), 60 * 1000);
    return () => clearInterval(timer);
  }, [cashierId, trigger]);

  const sessions = useMemo(
    () => parseRows<CashierMapRow>(rawResponse),
    [rawResponse],
  );

  const activeSessionId =
    selectedSessionId && sessions.some((s) => s.session_id === selectedSessionId)
      ? selectedSessionId
      : (sessions[0]?.session_id ?? null);

  const selected = sessions.find((s) => s.session_id === activeSessionId);
  const status = deviceStatusFromTime(
    selected?.historys?.[selected.historys.length - 1]?.created_at,
  );

  return (
    <div className='flex-1 min-h-0 flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden'>
      <div className='px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 shrink-0'>
        <MapPin className='w-4 h-4 text-emerald-600 shrink-0' />
        <h3 className='text-sm font-bold text-slate-800'>
          {selected?.cashier_name ?? "Peta Operator"}
        </h3>
        {selected && (
          <span className='flex items-center gap-1.5'>
            <span
              className='h-1.5 w-1.5 rounded-full'
              style={{ background: deviceStatusColor(status) }}
            />
            <span
              className='text-[10px] font-bold uppercase tracking-wide'
              style={{ color: deviceStatusColor(status) }}
            >
              {deviceStatusLabel(status)}
            </span>
          </span>
        )}
        <span className='ml-auto text-[11px] font-semibold text-slate-400'>
          {sessions.length > 0 ? `${sessions.length} sesi` : ""}
        </span>
        {sessions.length > 0 && (
          <RemoteSelect<CashierMapRow>
            placeholder='Pilih sesi'
            value={selected ?? null}
            onChange={(row) => setSelectedSessionId(row.session_id)}
            onClear={() => setSelectedSessionId(null)}
            data={sessions}
            getLabel={sessionLabel}
            renderItem={(row) => (
              <div className='flex items-start justify-between gap-3'>
                <div className='flex flex-col'>
                  <span className='text-xs font-semibold text-slate-700'>
                    {sessionDate(row)}
                  </span>
                  <span className='text-[10px] text-slate-500'>
                    {sessionTimes(row)}
                  </span>
                </div>
                <span
                  className={clsx(
                    "mt-0.5 text-[10px] font-bold uppercase",
                    row.status === "opened"
                      ? "text-emerald-600"
                      : "text-slate-400",
                  )}
                >
                  {row.status}
                </span>
              </div>
            )}
            inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm w-[260px]'
          />
        )}
      </div>

      {showSummary && selected && (
        <div className='px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1 shrink-0'>
          <span className='text-[11px] text-slate-500'>
            Omset sesi:{" "}
            <span className='font-bold text-emerald-600'>
              {currencyFormat(selected.total_charges)}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Battery:{" "}
            <span className='font-bold text-slate-700'>
              {selected.last_battery_health || "-"}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Sesi:{" "}
            <span className='font-bold text-slate-700'>
              {sessionLabel(selected)}
            </span>
          </span>
        </div>
      )}

      <div className='flex-1 min-h-0 relative'>
        {isLoading && !selected ? (
          <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
            <Loader2 className='w-5 h-5 animate-spin' />
          </div>
        ) : !selected ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-400'>
            <MapPin className='w-8 h-8 text-slate-300 mb-2' />
            <p className='text-sm font-medium'>Belum ada data posisi</p>
            <p className='mt-1 max-w-sm text-center text-[11px]'>
              Peta menampilkan jejak perjalanan tiap sesi kasir operator ini.
            </p>
          </div>
        ) : (
          <CashierLiveMap
            items={[selected]}
            selectedId={selected.cashier_id}
            onSelect={() => undefined}
            className='h-full min-h-[420px] rounded-none'
          />
        )}
      </div>
    </div>
  );
}
