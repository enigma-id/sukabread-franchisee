/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLazyGetCashierMapsQuery } from "@/services/report/api";
import { useLazyGetSessionQuery } from "@/services/sales/api";
import { CashierLiveMap } from "@/components/app/CashierLiveMap";
import { RemoteSelect } from "@/components/ui";
import type { CashierMapRow, SalesSession } from "@/services/types";
import {
  currencyFormat,
  deviceStatusColor,
  deviceStatusFromTime,
  deviceStatusLabel,
  formatDate,
  formatDateTime,
  isOngoing,
} from "@/utils";

/** Response bisa dibungkus `{ data }` / `{ datas }` — ambil array-nya. */
const parseRows = <T,>(rawResponse: any): T[] => {
  const raw = rawResponse?.data ?? rawResponse;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.datas)) return raw.datas;
  return [];
};

/** Baris atas opsi sesi: tanggal sesi dibuka. */
const sessionDate = (row: { started_at: string }) => formatDate(row.started_at);
/** Baris bawah opsi sesi: mulai – selesai `DD/MM/YYYY HH:mm` (`opened` = "Sekarang"). */
const sessionTimes = (row: { started_at: string; finished_at: string }) =>
  `${formatDateTime(row.started_at)} – ${
    // `/sales/session` menyimpan finished_at sesi opened sebagai zero-time
    // (`0001-01-01`), jadi pakai isOngoing — bukan cek truthy string.
    isOngoing(row.finished_at) ? "Sekarang" : formatDateTime(row.finished_at)
  }`;

interface CashierSessionsPanelProps {
  /** Operator yang sesinya ditampilkan. */
  cashierId: string;
  /** Nama operator untuk header (fallback dari data sesi bila kosong). */
  title?: string;
  /** Dipanggil saat marker operator diklik. */
  onSelect?: (cashierId: string) => void;
  showSummary?: boolean;
  className?: string;
}

/**
 * Panel peta per-sesi operator: daftar sesi dari `/sales/session` (buat dropdown)
 * + jejak GPS sesi terpilih dari `/report/cashier-maps?sales_session_id=` (backend
 * memfilter satu sesi). Auto-refresh 1 menit. Memuat `mapbox-gl` → WAJIB lazy-load.
 */
export function CashierSessionsPanel({
  cashierId,
  title,
  onSelect,
  showSummary = true,
  className,
}: CashierSessionsPanelProps) {
  const [
    triggerSessions,
    { data: sessionsResponse, isLoading: sessionsLoading },
  ] = useLazyGetSessionQuery();
  const [triggerMap, { data: mapResponse, isLoading: mapLoading }] =
    useLazyGetCashierMapsQuery();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  // Opsi sesi: daftar sesi penjualan operator.
  useEffect(() => {
    if (!cashierId) return;

    const params = { cashier_id: cashierId, page: 1, limit: 50 };
    triggerSessions(params);
    const timer = setInterval(() => triggerSessions(params), 60 * 1000);
    return () => clearInterval(timer);
  }, [cashierId, triggerSessions]);

  const sessions = useMemo(
    () =>
      parseRows<SalesSession>(sessionsResponse)
        // Guard data operator lama saat berganti operator.
        .filter((s) => !s.cashier_id || s.cashier_id === cashierId)
        // Terbaru dulu → pilihan default = sesi terakhir.
        .sort(
          (a, b) =>
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
        ),
    [sessionsResponse, cashierId],
  );

  const activeSessionId =
    selectedSessionId && sessions.some((s) => s.id === selectedSessionId)
      ? selectedSessionId
      : (sessions[0]?.id ?? null);

  // Jejak sesi terpilih — backend memfilter via `sales_session_id`.
  useEffect(() => {
    if (!cashierId || !activeSessionId) return;

    const params = { cashier_id: cashierId, sales_session_id: activeSessionId };
    triggerMap(params);
    const timer = setInterval(() => triggerMap(params), 60 * 1000);
    return () => clearInterval(timer);
  }, [cashierId, activeSessionId, triggerMap]);

  const selectedRow = useMemo(() => {
    const rows = parseRows<CashierMapRow>(mapResponse);
    return rows.find((r) => r.session_id === activeSessionId) ?? rows[0];
  }, [mapResponse, activeSessionId]);

  const selectedOption = sessions.find((s) => s.id === activeSessionId);
  const status = deviceStatusFromTime(
    selectedRow?.historys?.[(selectedRow?.historys?.length ?? 0) - 1]?.created_at,
  );
  const name =
    title ??
    selectedRow?.cashier_name ??
    selectedOption?.cashier?.name ??
    "Peta Operator";

  return (
    <div
      className={clsx(
        "flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden",
        className,
      )}
    >
      <div className='px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 shrink-0'>
        <MapPin className='w-4 h-4 text-emerald-600 shrink-0' />
        <h3 className='text-sm font-bold text-slate-800'>{name}</h3>
        {selectedRow && (
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
          <RemoteSelect<SalesSession>
            placeholder='Pilih sesi'
            value={selectedOption ?? null}
            onChange={(row) => setSelectedSessionId(row.id)}
            onClear={() => setSelectedSessionId(null)}
            data={sessions}
            getLabel={sessionTimes}
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
            inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm w-[280px]'
          />
        )}
      </div>

      {showSummary && selectedRow && (
        <div className='px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1 shrink-0'>
          <span className='text-[11px] text-slate-500'>
            Omset sesi:{" "}
            <span className='font-bold text-emerald-600'>
              {currencyFormat(selectedRow.total_charges)}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Battery:{" "}
            <span className='font-bold text-slate-700'>
              {selectedRow.last_battery_health || "-"}
            </span>
          </span>
          <span className='text-[11px] text-slate-500'>
            Sesi:{" "}
            <span className='font-bold text-slate-700'>
              {selectedOption
                ? sessionTimes(selectedOption)
                : sessionTimes(selectedRow)}
            </span>
          </span>
        </div>
      )}

      <div className='flex-1 min-h-0 relative'>
        {sessionsLoading && !activeSessionId ? (
          <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
            <Loader2 className='w-5 h-5 animate-spin' />
          </div>
        ) : !activeSessionId ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-400'>
            <MapPin className='w-8 h-8 text-slate-300 mb-2' />
            <p className='text-sm font-medium'>Belum ada sesi</p>
            <p className='mt-1 max-w-sm text-center text-[11px]'>
              Operator ini belum punya sesi kasir, jadi belum ada jejak
              perjalanan yang bisa digambar.
            </p>
          </div>
        ) : mapLoading && !selectedRow ? (
          <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
            <Loader2 className='w-5 h-5 animate-spin' />
          </div>
        ) : (
          <CashierLiveMap
            items={selectedRow ? [selectedRow] : []}
            selectedId={selectedRow?.cashier_id}
            onSelect={onSelect}
            className='h-full min-h-[420px] rounded-none'
          />
        )}
      </div>
    </div>
  );
}
