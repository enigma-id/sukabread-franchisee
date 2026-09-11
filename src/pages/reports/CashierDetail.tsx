/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import clsx from "clsx";
import {
  Ban,
  BarChart2,
  History,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
import { DatePicker } from "@/components/ui";
import { useLazyGetCashierReportQuery } from "@/services/report/api";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useAppSelector } from "@/hooks";
import { currencyFormat } from "@/utils";
import {
  CashControlSection,
  CancelledSalesSection,
  OutstandingSection,
  ProductItemSection,
  ProductSalesSection,
  SaldoMembershipSection,
  SettlementSection,
  type ReportSectionProps,
} from "./sections";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
  cyan: { text: "text-cyan-500", iconBg: "#cffafe", wave: "#06b6d4" },
};

const TABS: {
  value: string;
  label: string;
  Section: React.ComponentType<ReportSectionProps>;
}[] = [
  { value: "product-sales", label: "Product Sales", Section: ProductSalesSection },
  { value: "product-item", label: "Product Item", Section: ProductItemSection },
  { value: "outstanding", label: "Outstanding", Section: OutstandingSection },
  { value: "cancel-order", label: "Cancel Order", Section: CancelledSalesSection },
  { value: "cash-control", label: "Cash Control", Section: CashControlSection },
  { value: "settlement", label: "Settlement", Section: SettlementSection },
  { value: "saldo-log", label: "Saldo Log", Section: SaldoMembershipSection },
];

const SummaryCashier = ({ data }: { data: any | null }) => {
  if (!data) return null;

  const active = Number(data.active_session) > 0;

  return (
    <div className='grid grid-cols-2 gap-3 mb-4 sm:gap-4 lg:grid-cols-6'>
      <SummaryCard
        label='Omzet'
        value={currencyFormat(data.omzet ?? 0)}
        icon={TrendingUp}
        theme={THEMES.orange}
      />
      <SummaryCard
        label='Transaksi'
        value={data.total_sales ?? 0}
        icon={ShoppingCart}
        theme={THEMES.blue}
      />
      <SummaryCard
        label='Nilai Outstanding'
        value={currencyFormat(data.outstanding_amount ?? 0)}
        icon={Receipt}
        theme={THEMES.red}
      />
      <SummaryCard
        label='AOV'
        value={currencyFormat(data.aov ?? 0)}
        icon={BarChart2}
        theme={THEMES.cyan}
      />
      <SummaryCard
        label='Total Sesi'
        value={`${data.total_session ?? 0}${active ? ` (${data.active_session} aktif)` : ""}`}
        icon={History}
        theme={THEMES.purple}
      />
      <SummaryCard
        label='Dibatalkan'
        value={data.cancelled_count ?? 0}
        icon={Ban}
        theme={THEMES.red}
      />
    </div>
  );
};

export function CashierDetail() {
  const { id } = useParams<{ id: string }>();
  const [params, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const brandType = useAppSelector((s) => s.auth.session?.brand?.type);
  const title = brandType?.toLowerCase() === "mitra" ? "Laporan Mitra" : "Laporan Kasir";

  const startDate = params.get("start_date") ?? "";
  const endDate = params.get("end_date") ?? "";
  const activeTab = params.get("tab") ?? TABS[0].value;

  useDocumentMeta(
    `${title} Detail | Sukabread Franchisee`,
    "Detail laporan per kasir / operator.",
  );

  const [triggerCashier, { data: cashierResponse }] =
    useLazyGetCashierReportQuery();

  useEffect(() => {
    if (!id) {
      navigate("/report/cashier", { replace: true });
      return;
    }

    triggerCashier({
      cashier_id: id,
      start_date: startDate,
      end_date: endDate,
      page: 1,
      limit: 1,
    });
  }, [id, startDate, endDate, triggerCashier, navigate]);

  const setQuery = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const dateRange = useMemo(() => {
    if (!startDate || !endDate) return undefined;
    return [dayjs(startDate), dayjs(endDate)] as [Dayjs, Dayjs];
  }, [startDate, endDate]);

  if (!id) return null;

  const cashier = cashierResponse?.data?.[0];
  const active = TABS.find((t) => t.value === activeTab) ?? TABS[0];
  const Section = active.Section;
  const isSettlement = active.value === "settlement";

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`${title} — ${cashier?.cashier_name ?? "…"}`}
        subtitle={
          cashier
            ? `${cashier.role} • ${cashier.outlet_name}${
                Number(cashier.active_session) > 0 ? " • sedang bertugas" : ""
              }`
            : ""
        }
        backTo={() => navigate(-1)}
        action={
          <DatePicker
            mode='range'
            value={dateRange}
            onChange={(date) => {
              if (Array.isArray(date)) {
                setQuery({
                  start_date: date[0]?.format("YYYY-MM-DD") ?? "",
                  end_date: date[1]?.format("YYYY-MM-DD") ?? "",
                });
              } else {
                setQuery({ start_date: "", end_date: "" });
              }
            }}
            placeholder='Pilih periode'
            inputClassName='!h-9 !min-h-0 !py-0 !shadow-sm'
          />
        }
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <SummaryCashier data={cashier} />

        <div className='mb-4 flex flex-wrap items-center gap-1 border-b border-slate-200'>
          {TABS.map((tab) => {
            const isActive = tab.value === active.value;
            return (
              <button
                key={tab.value}
                type='button'
                onClick={() => setQuery({ tab: tab.value })}
                className={clsx(
                  "-mb-px cursor-pointer rounded-t-lg border-b-2 px-3 py-2 text-[13px] font-semibold transition-colors",
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-primary",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <Section
          key={`${active.value}-${id}-${startDate}-${endDate}`}
          tableName={`cashier_detail_${id}_${active.value}`}
          lockedFilter={{ cashier_id: id }}
          filter={
            isSettlement ? {} : { start_date: startDate, end_date: endDate }
          }
          showFilter={isSettlement}
        />
      </Page.Body>
    </Page>
  );
}
