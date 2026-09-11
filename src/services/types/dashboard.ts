import type { CashierMapRow } from "./reports";

export interface TopMenu {
  menu_name: string;
  total_qty: number;
  total_revenue: number;
}

export interface PaymentMethodSplit {
  name: string;
  total_paid: number;
  percentage: number;
}

export interface PeakHour {
  hour: number;
  total_transaksi: number;
}

export interface TopMember {
  member_name: string;
  nominal: number;
}

export interface SalesGraph {
  labels: string[];
  data: number[];
}

export interface WeeklyComparison {
  omzet_growth: number;
  transaksi_growth: number;
  trend: "up" | "down" | "flat";
}

export interface OutstandingBillTracker {
  total_outstanding: number;
}

/** Top 5 operator (kasir/manager) — hanya diisi bila brand.type = 'mitra'. */
export interface TopCashier {
  cashier_id: string;
  cashier_name: string;
  role: string;
  total_transactions: number;
  total_revenue: number;
  aov: number;
}

// Contract-aligned types
export interface ContractDashboard {
  total_sales_today: number;
  total_orders_today: number;
  outlet_balance: number;
  total_members: number;
  low_stock_items: number;
  pending_withdrawal: number;
  pending_topup: number;
}

export interface DashboardData {
  omzet_hari_ini?: number;
  omzet?: number;
  total_transaksi?: number;
  sesi_kasir_aktif?: number;
  saldo_outlet?: number;
  stok_kritis?: number;
  omset_penjualan?: number;
  total_outstanding?: number;
  saldo_outlet_detail?: number;
  sales_graph?: SalesGraph;
  aov?: number;
  total_discount?: number;
  total_service?: number;
  weekly_comparison?: WeeklyComparison;
  outstanding_bill_tracker?: OutstandingBillTracker;
  top_menu?: TopMenu[];
  payment_method_split?: PaymentMethodSplit[];
  peak_hours?: PeakHour[];
  top_member?: TopMember[];
  /** Section mitra: top 5 operator by metrik terpilih. */
  top_cashiers?: TopCashier[];
  /** Section mitra: posisi device operator yang sedang bertugas (session opened). */
  cashier_live_map?: CashierMapRow[];
}
