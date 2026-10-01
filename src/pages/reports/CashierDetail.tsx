/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import {
  Ban,
  History,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Page } from "@/components/app/layout";
import { SummaryCard } from "@/components/app";
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
  SalesSessionSection,
  SettlementSection,
  type ReportSectionProps,
} from "./sections";

const THEMES: Record<string, any> = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316" },
};

// Lazy — tab peta memuat mapbox-gl yang besar, jangan masuk bundle utama.
const CashierMapsSection = lazy(() =>
  import("./sections/CashierMapsSection").then((m) => ({
    default: m.CashierMapsSection,
  })),
);

// Label tab disamakan dengan judul halaman report masing-masing.
// `brand: "outlet" | "mitra" | "all"` menyaring tab yang relevan dengan tipe
// brand — cermin dari gating menu sidebar (Saldo Membership = outlet,
// Mitra Maps = mitra).
type ReportTab = {
  value: string;
  label: string;
  Section: React.ComponentType<ReportSectionProps>;
  brand: "all" | "outlet" | "mitra";
};

const TABS: ReportTab[] = [
  { value: "sales", label: "Sesi", Section: SalesSessionSection, brand: "all" },
  { value: "product-sales", label: "Penjualan Harian", Section: ProductSalesSection, brand: "all" },
  { value: "product-item", label: "Penjualan Menu", Section: ProductItemSection, brand: "all" },
  { value: "outstanding", label: "Outstanding Bills", Section: OutstandingSection, brand: "all" },
  { value: "cancel-order", label: "Penjualan Dibatalkan", Section: CancelledSalesSection, brand: "all" },
  { value: "cash-control", label: "Cash Control", Section: CashControlSection, brand: "all" },
  { value: "settlement", label: "Settlement", Section: SettlementSection, brand: "all" },
  { value: "saldo-log", label: "Saldo Membership", Section: SaldoMembershipSection, brand: "outlet" },
  { value: "mitra-maps", label: "Mitra Maps", Section: CashierMapsSection, brand: "mitra" },
];

const SummaryCashier = ({ data }: { data: any | null }) => {
  if (!data) return null;

  return (
    <div className='grid grid-cols-2 gap-3 mb-4 sm:gap-4 lg:grid-cols-5'>
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
        label='Total Outstanding'
        value={currencyFormat(data.outstanding_amount ?? 0)}
        icon={Receipt}
        theme={THEMES.red}
      />
      <SummaryCard
        label='Total Sesi'
        value={data.total_session ?? 0}
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
  const isMitra = brandType?.toLowerCase() === "mitra";
  const title = isMitra ? "Laporan Mitra" : "Laporan Kasir";

  // Tab disaring mengikuti tipe brand (cermin gating menu sidebar).
  const tabs = useMemo(
    () => TABS.filter((t) => t.brand === "all" || t.brand === brandType?.toLowerCase()),
    [brandType],
  );

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

  const active = tabs.find((t) => t.value === activeTab) ?? tabs[0];

  // Nilai awal filter tiap tab — diambil dari periode yang dibawa halaman list.
  // Filter selengkapnya ada di dalam masing-masing tab (tiap laporan beda).
  const sectionFilter = useMemo(() => {
    if (active.value === "settlement") {
      return startDate ? { periode: startDate.slice(0, 4) } : {};
    }
    // Tab Penjualan = daftar sesi `/sales/session` → rentangnya `start_at`/`end_at`.
    if (active.value === "sales") {
      return { start_at: startDate, end_at: endDate };
    }
    return { start_date: startDate, end_date: endDate };
  }, [active.value, startDate, endDate]);

  if (!id) return null;

  const cashier = cashierResponse?.data?.[0];
  const Section = active.Section;

  // Header hanya menampilkan status operator ("Online"/"Offline").
  const subtitle = cashier?.status ? String(cashier.status) : "";

  return (
    <Page className='h-full flex flex-col min-h-0 bg-slate-50'>
      <Page.Header
        category='Report'
        title={`${title} — ${cashier?.cashier_name ?? "…"}`}
        subtitle={subtitle}
        backTo={() => navigate(-1)}
      />

      <Page.Body className='flex-1 flex flex-col min-h-0'>
        <SummaryCashier data={cashier} />

        <div className='mb-4 flex flex-wrap items-center gap-1 border-b border-slate-200'>
          {tabs.map((tab) => {
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

        <Suspense
          fallback={
            <div className='flex-1 min-h-0 rounded-xl bg-slate-100 animate-pulse' />
          }
        >
          <Section
            key={`${active.value}-${id}`}
            tableName={`cashier_detail_${id}_${active.value}`}
            lockedFilter={{ cashier_id: id }}
            filter={sectionFilter}
          />
        </Suspense>
      </Page.Body>
    </Page>
  );
}
