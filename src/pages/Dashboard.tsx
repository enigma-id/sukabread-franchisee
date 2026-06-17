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
  Legend,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wallet,
  Zap,
  BarChart2,
  TrendingDown,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { useDashboard } from "@/services/dashboard/hooks";
import { currencyFormat } from "@/utils";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import clsx from "clsx";
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

const MiniStatCard = ({ label, value, trend, trendValue }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
    <div
      className={clsx(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold",
        trend === "up"
          ? "bg-green-100 text-green-600"
          : trend === "down"
            ? "bg-red-100 text-red-600"
            : "bg-slate-100 text-slate-500",
      )}
    >
      {trend === "up" ? (
        <TrendingUp className="w-3 h-3" />
      ) : trend === "down" ? (
        <TrendingDown className="w-3 h-3" />
      ) : null}
      {trendValue}
    </div>
  </div>
);

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export function Dashboard() {
  useDocumentMeta("Dashboard | Sukabread Franchisee", "");

  const { get, getResult } = useDashboard();

  useEffect(() => {
    get({});
  }, []);

  const data = getResult?.data as DashboardData | undefined;
  const isLoading = getResult?.isLoading;

  const seriesData = useMemo(() => {
    if (!data?.sales_graph?.labels || !data?.sales_graph?.data) return [];
    return data.sales_graph.labels.map((label: string, index: number) => ({
      date: label,
      "Omset Penjualan": Number(data.sales_graph.data[index]) || 0,
    }));
  }, [data]);

  const hasData = useMemo(() => {
    return seriesData.some((item: any) => item["Omset Penjualan"] > 0);
  }, [seriesData]);

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
        category="Overview"
        title="Dashboard"
        subtitle="Selamat datang kembali di panel franchisee Anda."
      />
      <Page.Body className="p-4 sm:p-6 overflow-y-auto">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            label="Omzet Hari Ini"
            value={currencyFormat(data?.omzet_hari_ini || 0)}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Advanced Sales Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-linear-to-r from-white to-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Tren Penjualan
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <MiniStatCard
                  label="Growth Omzet"
                  value={`${data?.weekly_comparison?.omzet_growth || 0}%`}
                  trend={
                    data?.weekly_comparison?.trend === "up"
                      ? "up"
                      : data?.weekly_comparison?.trend === "down"
                        ? "down"
                        : "neutral"
                  }
                  trendValue="Mingguan"
                />
                <MiniStatCard
                  label="Avg Order Value"
                  value={currencyFormat(data?.aov || 0)}
                  trend="neutral"
                  trendValue="Rerata"
                />
                <MiniStatCard
                  label="Outstanding"
                  value={currencyFormat(
                    data?.outstanding_bill_tracker?.total_outstanding || 0,
                  )}
                  trend="neutral"
                  trendValue="Piutang"
                />
              </div>

              <div
                className="w-full outline-none focus:outline-none relative"
                style={{ height: "300px", minHeight: "300px" }}
              >
                {seriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={seriesData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <defs>
                        {seriesConfig.map((_, i) => (
                          <linearGradient
                            key={i}
                            id={`gradient-${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={COLORS[i % COLORS.length]}
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="50%"
                              stopColor={COLORS[i % COLORS.length]}
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="100%"
                              stopColor={COLORS[i % COLORS.length]}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="2 4"
                        vertical={false}
                        stroke="#e2e8f0"
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        tickFormatter={(value) => dayjs(value).format("DD/MM")}
                        dy={8}
                        tickMargin={8}
                        interval={Math.floor(seriesData.length / 7)}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: "#94a3b8",
                          fontWeight: 500,
                        }}
                        domain={hasData ? [0, "auto"] : [0, 100000]}
                        tickFormatter={(value) => {
                          if (value >= 1000000)
                            return `${(value / 1000000).toFixed(1)}Jt`;
                          if (value >= 1000)
                            return `${(value / 1000).toFixed(0)}Rb`;
                          return value;
                        }}
                        dx={-8}
                        tickMargin={8}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        height={32}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingBottom: "12px" }}
                        formatter={(value) => (
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                            {value}
                          </span>
                        )}
                      />
                      {seriesConfig.map((s, i) => (
                        <Area
                          key={i}
                          type="monotone"
                          dataKey={s.name}
                          name={s.name}
                          stroke={COLORS[i % COLORS.length]}
                          strokeWidth={2.5}
                          fill={`url(#gradient-${i})`}
                          animationDuration={1000}
                          animationEasing="ease-out"
                          dot={false}
                          activeDot={{
                            r: 5,
                            fill: COLORS[i % COLORS.length],
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">
                      Data grafik tidak tersedia
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Metrics */}
          <div className="flex flex-col gap-4">
            <SummaryCard
              label="Saldo Outlet"
              value={currencyFormat(data?.saldo_outlet || 0)}
              icon={Wallet}
              theme={THEMES.orange}
              variant="primary"
            />

            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                Weekly Performance
              </h3>
              <div className="space-y-6 flex-1">
                {/* Revenue Growth Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-slate-500 font-medium">
                      Pertumbuhan Omset
                    </p>
                    <p
                      className={clsx(
                        "text-lg font-black",
                        (data?.weekly_comparison?.omzet_growth || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {data?.weekly_comparison?.omzet_growth || 0}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full transition-all duration-1000",
                        (data?.weekly_comparison?.omzet_growth || 0) >= 0
                          ? "bg-green-500"
                          : "bg-red-500",
                      )}
                      style={{
                        width: `${Math.min(
                          Math.abs(data?.weekly_comparison?.omzet_growth || 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Transaction Growth Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-slate-500 font-medium">
                      Pertumbuhan Transaksi
                    </p>
                    <p
                      className={clsx(
                        "text-lg font-black",
                        (data?.weekly_comparison?.transaksi_growth || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {data?.weekly_comparison?.transaksi_growth || 0}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full transition-all duration-1000",
                        (data?.weekly_comparison?.transaksi_growth || 0) >= 0
                          ? "bg-green-500"
                          : "bg-red-500",
                      )}
                      style={{
                        width: `${Math.min(
                          Math.abs(
                            data?.weekly_comparison?.transaksi_growth || 0,
                          ),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        Trend Saat Ini
                      </p>
                      <p className="text-sm font-bold text-indigo-900 capitalize">
                        {data?.weekly_comparison?.trend || "Flat"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
