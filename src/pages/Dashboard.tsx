/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Wallet,
  BarChart2,
  Medal,
  ConciergeBell,
  Clock10,
  Flame,
  Minus,
  Receipt,
  Landmark,
  ArrowUpFromLine,
  BadgePercent,
  Percent,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { MonthPicker } from "@/components/ui";
import dayjs from "dayjs";
import { useDashboard } from "@/services/dashboard/hooks";
import { currencyFormat, dateFormat } from "@/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import type { DashboardData } from "@/services/types";
import SalesChart from "@/components/app/SalesChart";

const THEMES = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  cyan: { text: "text-cyan-500", iconBg: "#cffafe", wave: "#06b6d4" },
};

const PipelineCard = ({
  title,
  children,
  icon: Icon,
  theme,
  onClick,
}: {
  title: string;
  children?: any;
  icon: any;
  theme: any;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/20 border border-slate-100 h-full ${
      onClick
        ? "cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-150 group"
        : ""
    }`}
  >
    <div className='flex items-center gap-3 mb-3'>
      <div
        className='w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg'
        style={{ backgroundColor: theme.iconBg }}
      >
        <Icon className={`w-5 h-5 ${theme.text}`} />
      </div>
      <h3 className='text-sm font-bold text-slate-800'>{title}</h3>
    </div>
    <div className='space-y-3'>{children}</div>
  </div>
);

// ─── Peak Hours Card with Fire Animation ─────────────────────────────────────
const PeakHoursCard = ({
  data,
}: {
  data?: { hour: number; total_transaksi: number }[];
}) => {
  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.total_transaksi - a.total_transaksi);
  }, [data]);
  const maxTx = sorted[0]?.total_transaksi ?? 0;

  return (
    <PipelineCard title='Peak Hours' icon={Clock10} theme={THEMES.red}>
      <div className='grid grid-cols-4 gap-4'>
        {data?.map((hour, i) => {
          const rank = sorted.findIndex((s) => s.hour === hour.hour);
          const isPeak = rank === 0 && maxTx > 0;
          const isSecond = rank === 1;
          const isThird = rank === 2;
          return (
            <div
              key={i}
              className={`flex flex-col items-center p-2 rounded-lg relative overflow-hidden transition-all duration-300 ${
                isPeak
                  ? "bg-gradient-to-b from-orange-100 to-red-50 shadow-lg shadow-red-200 scale-105"
                  : isSecond
                    ? "bg-gradient-to-b from-amber-50 to-yellow-50 shadow-md shadow-amber-100"
                    : isThird
                      ? "bg-gradient-to-b from-stone-50 to-slate-50 shadow-sm"
                      : "bg-slate-50"
              }`}
            >
              <span
                className={`text-[10px] font-medium ${isPeak ? "text-orange-700" : isSecond ? "text-amber-700" : isThird ? "text-stone-600" : "text-slate-500"}`}
              >
                {hour.hour}:00
              </span>
              <span
                className={`text-xs font-bold ${isPeak ? "text-orange-600 text-sm" : isSecond ? "text-amber-600" : isThird ? "text-stone-700" : "text-slate-900"}`}
              >
                {hour.total_transaksi}
              </span>
              {isPeak && (
                <div className='absolute -bottom-1 -right-1 animate-bounce'>
                  <Flame className='w-7 h-7 text-orange-500 drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]' />
                </div>
              )}
              {isPeak && (
                <span className='text-[7px] uppercase font-black text-orange-500 tracking-widest'>
                  Puncak!
                </span>
              )}
              {isSecond && (
                <span className='text-[7px] uppercase font-black text-amber-500 tracking-widest'>
                  Runner Up
                </span>
              )}
              {isThird && (
                <span className='text-[7px] uppercase font-black text-stone-400 tracking-widest'>
                  Ketiga
                </span>
              )}
            </div>
          );
        })}
      </div>
    </PipelineCard>
  );
};

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export function Dashboard() {
  useDocumentMeta("Dashboard | Sukabread Franchisee", "");
  const navigate = useNavigate();
  const go = (path: string) => () => navigate(path);

  const { get, getResult } = useDashboard();

  const [periode, setPeriode] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    get({ periode });
  }, [periode]);

  const data = getResult?.data?.data as DashboardData;
  const isLoading = getResult?.isLoading;

  if (isLoading) {
    return (
      <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
        <Page.Header
          category='Overview'
          title='Dashboard'
          subtitle='Memuat data...'
          action={
            <MonthPicker
              value={periode}
              onChange={(v) => v && setPeriode(v)}
              placeholder='Pilih periode'
              inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm'
            />
          }
        />
        <Page.Body className='p-4 sm:p-6 flex items-center justify-center'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Dashboard'
        title='Dashboard'
        subtitle='Selamat datang kembali di panel franchisee Anda.'
        action={
          <MonthPicker
            value={periode}
            onChange={(v) => v && setPeriode(v)}
            placeholder='Pilih periode'
            inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm'
          />
        }
      />
      <Page.Body className='flex flex-col gap-6 pb-10'>
        {/* Sales Chart */}
        <SalesChart
          data={data?.sales_graph}
          isLoading={isLoading}
          title='Performa Penjualan Multi-Saluran'
        />
        <div className='flex flex-col gap-4'>
          {/* Main Stats */}
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='sm:col-span-2 lg:col-span-2'>
              <SummaryCard
                label='Saldo Outlet'
                value={currencyFormat(data?.saldo_outlet || 0)}
                icon={Wallet}
                theme={THEMES.blue}
                variant='primary'
              />
            </div>
            <SummaryCard
              label='Omset Hari Ini'
              value={currencyFormat(data?.omzet_hari_ini || 0)}
              icon={TrendingUp}
              theme={THEMES.green}
              onClick={go(
                `/report/settlement/daily?date=${dayjs().format("YYYY-MM")}`,
              )}
            />
            <SummaryCard
              label='Omset Total'
              value={currencyFormat(data?.omzet || 0)}
              icon={TrendingUp}
              theme={THEMES.green}
              onClick={go(`/report/settlement/daily?date=${periode}`)}
            />
            <SummaryCard
              label='Total Transaksi'
              value={data?.total_transaksi || 0}
              icon={ShoppingCart}
              theme={THEMES.blue}
              onClick={go("/sales/session")}
            />
            <SummaryCard
              label='Rata-Rata Per-Transaksi'
              value={currencyFormat(data?.aov || 0)}
              icon={BarChart2}
              theme={THEMES.cyan}
            />
            <SummaryCard
              label='Sesi Kasir Aktif'
              value={data?.sesi_kasir_aktif || 0}
              icon={Users}
              theme={THEMES.purple}
              onClick={go("/sales/session")}
            />
            <SummaryCard
              label='Total Outstanding'
              value={currencyFormat(
                data?.total_outstanding ??
                  data?.outstanding_bill_tracker?.total_outstanding ??
                  0,
              )}
              icon={Receipt}
              theme={THEMES.orange}
              onClick={go("/report/outstanding")}
            />
            <SummaryCard
              label='Total Discount'
              value={currencyFormat(data?.total_discount || 0)}
              icon={BadgePercent}
              theme={THEMES.red}
            />
            <SummaryCard
              label='Total Service'
              value={currencyFormat(data?.total_service || 0)}
              icon={Percent}
              theme={THEMES.purple}
            />
            {data?.weekly_comparison && (
              <>
                <SummaryCard
                  label='Growth Weekly Omset'
                  value={`${data.weekly_comparison.omzet_growth > 0 ? "+" : ""}${data.weekly_comparison.omzet_growth.toFixed(2)}%`}
                  icon={
                    data.weekly_comparison.trend === "up"
                      ? TrendingUp
                      : data.weekly_comparison.trend === "down"
                        ? TrendingDown
                        : Minus
                  }
                  theme={
                    data.weekly_comparison.trend === "up"
                      ? THEMES.green
                      : data.weekly_comparison.trend === "down"
                        ? THEMES.red
                        : THEMES.blue
                  }
                />
                <SummaryCard
                  label='Growth Weekly Transaksi'
                  value={`${data.weekly_comparison.transaksi_growth > 0 ? "+" : ""}${data.weekly_comparison.transaksi_growth.toFixed(2)}%`}
                  icon={
                    data.weekly_comparison.trend === "up"
                      ? TrendingUp
                      : data.weekly_comparison.trend === "down"
                        ? TrendingDown
                        : Minus
                  }
                  theme={
                    data.weekly_comparison.trend === "up"
                      ? THEMES.green
                      : data.weekly_comparison.trend === "down"
                        ? THEMES.red
                        : THEMES.blue
                  }
                />
              </>
            )}
          </div>

          {/* Remaining Detailed Cards (Bento) */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <PipelineCard
              title='Payment Method'
              icon={Landmark}
              theme={THEMES.cyan}
              onClick={go("/report/settlement/daily")}
            >
              {data?.payment_method_split?.map((method, i) => (
                <div className='flex items-center justify-between' key={i}>
                  <div className='flex items-center gap-2'>
                    <Landmark className='w-4 h-4 text-amber-500' />
                    <span className='text-xs font-medium text-slate-500'>
                      {method.name}
                    </span>
                  </div>
                  <span className='text-xs font-bold text-slate-800'>
                    {currencyFormat(method.total_paid)}
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PipelineCard
              title='Top Member Topup'
              icon={Medal}
              theme={THEMES.green}
              onClick={go("/membership")}
            >
              {data?.top_member?.map((member, i) => (
                <div className='flex items-center justify-between' key={i}>
                  <div className='flex items-center gap-2'>
                    <Medal className='w-4 h-4 text-amber-500' />
                    <span className='text-xs font-medium text-slate-500'>
                      {member.member_name}
                    </span>
                  </div>
                  <span className='text-xs font-bold text-slate-800'>
                    {currencyFormat(member.nominal)}
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PipelineCard
              title='Top Menu'
              icon={ConciergeBell}
              theme={THEMES.orange}
              onClick={go("/report/product-sales")}
            >
              {data?.top_menu?.map((item, i) => (
                <div className='flex items-center justify-between' key={i}>
                  <div className='flex items-center gap-2'>
                    <ConciergeBell className='w-4 h-4 text-amber-500' />
                    <span className='text-xs font-medium text-slate-500'>
                      {item.menu_name}
                    </span>
                  </div>
                  <div className='flex flex-col items-end leading-tight'>
                    <span className='text-[10px] text-slate-500'>
                      {item.total_qty} PCS
                    </span>
                    <span className='text-xs font-bold text-slate-800'>
                      {currencyFormat(item.total_revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </PipelineCard>
          </div>

          {/* Bottom Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <PeakHoursCard data={data?.peak_hours} />

            {/* Withdrawal Terbaru */}
            <PipelineCard
              title='Penarikan Terbaru'
              icon={ArrowUpFromLine}
              theme={THEMES.orange}
              onClick={go("/withdrawal")}
            >
              {data?.withdrawal_terbaru?.length ? (
                data.withdrawal_terbaru.map((w, i) => (
                  <div className='flex items-center justify-between' key={i}>
                    <div className='flex flex-col'>
                      <span className='text-xs font-mono text-slate-800'>
                        {w.code}
                      </span>
                      <span className='text-[10px] text-slate-400'>
                        {dateFormat(w.created_at)}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-bold text-slate-800'>
                        {currencyFormat(w.amount)}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                          w.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : w.status === "approved"
                              ? "bg-blue-100 text-blue-700"
                              : w.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span className='text-sm text-slate-400'>
                  Tidak ada penarikan
                </span>
              )}
            </PipelineCard>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
