/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import dayjs from "dayjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wallet,
  BarChart2,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { useDashboard } from "@/services/dashboard/hooks";
import { currencyFormat } from "@/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import type { DashboardData } from "@/services/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const THEMES = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  cyan: { text: "text-cyan-500", iconBg: "#cffafe", wave: "#06b6d4" },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce(
      (sum: number, entry: any) => sum + (entry.value || 0),
      0,
    );

    return (
      <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 ring-1 ring-black/5">
        <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          {dayjs(label).format("DD MMMM YYYY")}
        </p>
        <div className="space-y-2.5">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-sm font-bold"
                style={{ color: entry.color }}
              >
                {currencyFormat(entry.value)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-sm font-bold text-slate-800">
              {currencyFormat(total)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export function Dashboard() {
  useDocumentMeta("Dashboard | Sukabread Franchisee", "");

  const { get, getResult } = useDashboard();

  useEffect(() => {
    get();
  }, []);

  const data = getResult?.data?.data as DashboardData | undefined;
  const isLoading = getResult?.isLoading;

  const seriesData = useMemo(() => {
    if (!data?.sales_graph?.labels || !data?.sales_graph?.data) return [];
    return data.sales_graph.labels.map((label: string, index: number) => ({
      date: label,
      "Omset Penjualan": Number(data.sales_graph.data[index]) || 0,
    }));
  }, [data]);

  const seriesConfig = [{ name: "Omset Penjualan" }];

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
      <Page.Body className="p-4 sm:p-6 overflow-y-auto">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Stats */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              label="Saldo Outlet"
              value={currencyFormat(data?.saldo_outlet || 0)}
              icon={Wallet}
              theme={THEMES.blue}
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
              icon={Wallet}
              theme={THEMES.orange}
            />
          </div>

          {/* Sales Chart Area - Spans 2 rows on lg */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-white to-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Tren Penjualan
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="w-full" style={{ height: "300px" }}>
                {seriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={seriesData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 4"
                        vertical={false}
                        stroke="#e2e8f0"
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => dayjs(value).format("DD/MM")}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          value >= 1000
                            ? `${(value / 1000).toFixed(0)}Rb`
                            : value
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {seriesConfig.map((s, i) => (
                        <Area
                          key={i}
                          type="monotone"
                          dataKey={s.name}
                          stroke={COLORS[i % COLORS.length]}
                          fill={`url(#gradient-${i})`}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">
                      Data grafik tidak tersedia
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remaining Detailed Cards (Bento) */}
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Cashier Performance
              </h3>
              <div className="space-y-3">
                {data?.cashier_performance?.slice(0, 3).map((cashier, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium text-slate-700">
                      {cashier.cashier_name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {cashier.total_transaksi} Trans /{" "}
                      {currencyFormat(cashier.omzet)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Payment Method Split
              </h3>
              <div className="space-y-3">
                {data?.payment_method_split?.slice(0, 3).map((method, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium text-slate-700">
                      {method.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {currencyFormat(method.total_paid)} (
                      {method.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Top Members
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {data?.top_member_by_saldo?.slice(0, 6).map((member, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium text-slate-700 truncate">
                      {member.member_name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {currencyFormat(member.saldo)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* New: Top Menu */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Top Menu
              </h3>
              <div className="space-y-3">
                {data?.top_menu?.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-medium text-slate-700">
                      {item.menu_name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.total_qty} x {currencyFormat(item.total_revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* New: Peak Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Peak Hours
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {data?.peak_hours?.map((hour, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-2 bg-slate-50 rounded-lg"
                  >
                    <span className="text-[10px] text-slate-500 font-medium">
                      {hour.hour}:00
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {hour.total_transaksi}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
