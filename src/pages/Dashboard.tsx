/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wallet,
  BarChart2,
  Medal,
  ConciergeBell,
  Clock10,
  Flame,
  Minus,
  Receipt,
  Landmark,
  UserCheck,
  ArrowUpFromLine,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
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
}: {
  title: string;
  children?: any;
  icon: any;
  theme: any;
}) => (
  <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/20 border border-slate-100 h-full">
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: theme.iconBg }}
      >
        <Icon className={`w-5 h-5 ${theme.text}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
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
    <PipelineCard title="Peak Hours" icon={Clock10} theme={THEMES.red}>
      <div className="grid grid-cols-4 gap-4">
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
                className={`text-sm font-bold ${isPeak ? "text-orange-600 text-base" : isSecond ? "text-amber-600" : isThird ? "text-stone-700" : "text-slate-900"}`}
              >
                {hour.total_transaksi}
              </span>
              {isPeak && (
                <div className="absolute -bottom-1 -right-1 animate-bounce">
                  <Flame className="w-7 h-7 text-orange-500 drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                </div>
              )}
              {isPeak && (
                <span className="text-[7px] uppercase font-black text-orange-500 tracking-widest">
                  Puncak!
                </span>
              )}
              {isSecond && (
                <span className="text-[7px] uppercase font-black text-amber-500 tracking-widest">
                  Runner Up
                </span>
              )}
              {isThird && (
                <span className="text-[7px] uppercase font-black text-stone-400 tracking-widest">
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

  const { get, getResult } = useDashboard();

  useEffect(() => {
    get();
  }, []);

  const data = getResult?.data?.data as DashboardData;
  const isLoading = getResult?.isLoading;

  if (isLoading) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Header
          category="Overview"
          title="Dashboard"
          subtitle="Memuat data..."
        />
        <Page.Body className="p-4 sm:p-6 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Dashboard"
        title="Dashboard"
        subtitle="Selamat datang kembali di panel franchisee Anda."
      />
      <Page.Body className="flex flex-col gap-6 pb-10">
        {/* Sales Chart */}
        <SalesChart
          data={data?.sales_graph}
          isLoading={isLoading}
          title="Performa Penjualan Multi-Saluran"
        />
        <div className="flex flex-col gap-4">
          {/* Main Stats */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <SummaryCard
                label="Saldo Outlet"
                value={currencyFormat(data?.saldo_outlet || 0)}
                icon={Wallet}
                theme={THEMES.blue}
                variant="primary"
              />
            </div>
            <SummaryCard
              label="Omzet Hari Ini"
              value={currencyFormat(data?.omzet_hari_ini || 0)}
              icon={TrendingUp}
              theme={THEMES.green}
            />
            <SummaryCard
              label="Omzet Total"
              value={currencyFormat(data?.omzet || 0)}
              icon={TrendingUp}
              theme={THEMES.green}
            />
            <SummaryCard
              label="Total Transaksi"
              value={data?.total_transaksi || 0}
              icon={ShoppingCart}
              theme={THEMES.blue}
            />
            <SummaryCard
              label="AOV"
              value={currencyFormat(data?.aov || 0)}
              icon={BarChart2}
              theme={THEMES.cyan}
            />
            <SummaryCard
              label="Sesi Kasir Aktif"
              value={data?.sesi_kasir_aktif || 0}
              icon={Users}
              theme={THEMES.purple}
            />
            <SummaryCard
              label="Stok Kritis"
              value={data?.stok_kritis || 0}
              icon={AlertTriangle}
              theme={THEMES.red}
            />
            <SummaryCard
              label="Total Hutang"
              value={currencyFormat(
                data?.outstanding_bill_tracker?.total_outstanding || 0,
              )}
              icon={Receipt}
              theme={THEMES.orange}
            />
            {data?.weekly_comparison && (
              <>
                <SummaryCard
                  label="Growth Weekly Omzet"
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
                  label="Growth Weekly Transaksi"
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
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PipelineCard
              title="Cashier Performance"
              icon={UserCheck}
              theme={THEMES.blue}
            >
              {data?.cashier_performance?.map((cashier, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-500">
                      {cashier.cashier_name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {cashier.total_transaksi} Trans /{" "}
                    {currencyFormat(cashier.omzet)}
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PipelineCard
              title="Payment Method Split"
              icon={Landmark}
              theme={THEMES.cyan}
            >
              {data?.payment_method_split?.map((method, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-500">
                      {method.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {currencyFormat(method.total_paid)} (
                    {method.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PipelineCard title="Top Members" icon={Medal} theme={THEMES.green}>
              {data?.top_member_by_saldo?.map((member, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-500">
                      {member.member_name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {currencyFormat(member.saldo)}
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PipelineCard
              title="Top Menu"
              icon={ConciergeBell}
              theme={THEMES.orange}
            >
              {data?.top_menu?.map((item, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <ConciergeBell className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-500">
                      {item.menu_name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {item.total_qty} x {currencyFormat(item.total_revenue)}
                  </span>
                </div>
              ))}
            </PipelineCard>

            <PeakHoursCard data={data?.peak_hours} />

            {/* Withdrawal Terbaru */}
            <PipelineCard
              title="Penarikan Terbaru"
              icon={ArrowUpFromLine}
              theme={THEMES.orange}
            >
              {data?.withdrawal_terbaru?.length ? (
                data.withdrawal_terbaru.map((w, i) => (
                  <div className="flex items-center justify-between" key={i}>
                    <div className="flex flex-col">
                      <span className="text-sm font-mono text-slate-800">
                        {w.code}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {dateFormat(w.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">
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
                <span className="text-sm text-slate-400">
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
