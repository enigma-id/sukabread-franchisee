/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, MapPinned } from "lucide-react";
import { Page } from "@/components/app/layout";
import { CashierLiveMap } from "@/components/app/CashierLiveMap";
import { RemoteSelect } from "@/components/ui";
import {
  useLazyGetCashierDeviceQuery,
  useLazyGetCashierMapsQuery,
} from "@/services/report/api";
import type { CashierDeviceRow, CashierMapRow } from "@/services/types";
import {
  currencyFormat,
  deviceStatusColor,
  deviceStatusFromTime,
  deviceStatusLabel,
  formatDate,
  formatTime,
} from "@/utils";
import clsx from "clsx";

/** Response bisa dibungkus `{ data }` / `{ datas }` — ambil array-nya. */
const parseRows = <T,>(rawResponse: any): T[] => {
  const raw = rawResponse?.data ?? rawResponse;
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.datas)) return raw.datas;
  return [];
};

const pointCount = (historys?: CashierMapRow["historys"]) =>
  (historys ?? []).filter(
    (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
  ).length;

/** Baris atas opsi sesi: tanggal sesi dibuka. */
const sessionDate = (row: CashierMapRow) => formatDate(row.started_at);
/** Baris bawah opsi sesi: jam mulai – jam selesai (sesi `opened` = "Sekarang"). */
const sessionTimes = (row: CashierMapRow) =>
  `${formatTime(row.started_at)} – ${
    row.finished_at ? formatTime(row.finished_at) : "Sekarang"
  }`;
const sessionLabel = (row: CashierMapRow) =>
  `${sessionDate(row)} · ${sessionTimes(row)}`;

export function CashierMaps() {
  const [triggerDevice, { data: deviceResponse, isLoading: deviceLoading }] =
    useLazyGetCashierDeviceQuery();
  const [triggerMaps, { data: mapsResponse, isLoading: mapsLoading }] =
    useLazyGetCashierMapsQuery();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(
    null,
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
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

  // Satu baris per sesi; data operator lama tersaring keluar saat berganti.
  const sessions = useMemo(
    () =>
      parseRows<CashierMapRow>(mapsResponse).filter(
        (s) => s.cashier_id === activeOperatorId,
      ),
    [mapsResponse, activeOperatorId],
  );

  useEffect(() => {
    if (!activeOperatorId) return;

    const params = { cashier_id: activeOperatorId };
    triggerMaps(params);
    const timer = setInterval(() => triggerMaps(params), 60 * 1000);
    return () => clearInterval(timer);
  }, [activeOperatorId, triggerMaps]);

  // Sesi dari operator lain otomatis tidak match (`sessions` sudah difilter per
  // operator), jadi pilihan jatuh ke sesi terbaru operator yang aktif.
  const activeSessionId =
    selectedSessionId && sessions.some((s) => s.session_id === selectedSessionId)
      ? selectedSessionId
      : (sessions[0]?.session_id ?? null);

  const selectedSession = sessions.find((s) => s.session_id === activeSessionId);
  const operator = operators.find((o) => o.cashier_id === activeOperatorId);
  const selectedStatus = deviceStatusFromTime(
    selectedSession?.historys?.[selectedSession.historys.length - 1]
      ?.created_at ?? operator?.last_activity_at,
  );

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

                    <p className='text-[10px] text-slate-400 mt-1'>
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
        <div className='flex-1 min-w-0 bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col'>
          <div className='px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3'>
            <MapPin className='w-4 h-4 text-emerald-600 shrink-0' />
            <h3 className='text-sm font-bold text-slate-800'>
              {operator?.cashier_name ?? "Peta Operator"}
            </h3>
            {selectedSession && (
              <span className='flex items-center gap-1.5'>
                <span
                  className='h-1.5 w-1.5 rounded-full'
                  style={{ background: deviceStatusColor(selectedStatus) }}
                />
                <span
                  className='text-[10px] font-bold uppercase tracking-wide'
                  style={{ color: deviceStatusColor(selectedStatus) }}
                >
                  {deviceStatusLabel(selectedStatus)}
                </span>
              </span>
            )}
            <span className='ml-auto text-[11px] font-semibold text-slate-400'>
              {selectedSession
                ? `${pointCount(selectedSession.historys)} titik`
                : ""}
            </span>
            {sessions.length > 0 && (
              <RemoteSelect<CashierMapRow>
                placeholder='Pilih sesi'
                value={selectedSession ?? null}
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

          {selectedSession && (
            <div className='px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-1 shrink-0'>
              <span className='text-[11px] text-slate-500'>
                Omset sesi:{" "}
                <span className='font-bold text-emerald-600'>
                  {currencyFormat(selectedSession.total_charges)}
                </span>
              </span>
              <span className='text-[11px] text-slate-500'>
                Battery:{" "}
                <span className='font-bold text-slate-700'>
                  {selectedSession.last_battery_health || "-"}
                </span>
              </span>
              <span className='text-[11px] text-slate-500'>
                Sesi:{" "}
                <span className='font-bold text-slate-700'>
                  {sessionLabel(selectedSession)}
                </span>
              </span>
            </div>
          )}

          <div className='flex-1 min-h-0 p-3 relative'>
            {mapsLoading && !selectedSession ? (
              <div className='absolute inset-0 flex items-center justify-center text-slate-400 z-20'>
                <Loader2 className='w-5 h-5 animate-spin' />
              </div>
            ) : !selectedSession ? (
              <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-400'>
                <MapPin className='w-8 h-8 text-slate-300 mb-2' />
                <p className='text-sm font-medium'>Belum ada sesi</p>
                <p className='mt-1 max-w-sm text-center text-[11px]'>
                  Operator ini belum pernah membuka sesi kasir, jadi belum ada
                  jejak perjalanan yang bisa digambar.
                </p>
              </div>
            ) : (
              <CashierLiveMap
                items={[selectedSession]}
                selectedId={selectedSession.cashier_id}
                onSelect={setSelectedOperatorId}
                className='h-full min-h-[400px]'
              />
            )}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
