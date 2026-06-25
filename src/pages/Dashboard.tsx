/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Wallet,
  BarChart2,
  User,
  Medal,
  ConciergeBell,
  Clock10,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { useDashboard } from "@/services/dashboard/hooks";
import { currencyFormat } from "@/utils";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Stats */}
          <div className="col-span-1 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Remaining Detailed Cards (Bento) */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PipelineCard
              title="Cashier Performance"
              icon={TrendingUp}
              theme={THEMES.blue}
            >
              {data?.cashier_performance?.map((cashier, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
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
              icon={Wallet}
              theme={THEMES.cyan}
            >
              {data?.payment_method_split?.map((method, i) => (
                <div className="flex items-center justify-between" key={i}>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
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
                    <User className="w-4 h-4 text-amber-500" />
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

            <PipelineCard title="Peak Hours" icon={Clock10} theme={THEMES.red}>
              <div className="grid grid-cols-4 gap-4">
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
            </PipelineCard>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
