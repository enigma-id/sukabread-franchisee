export interface TopMenu {
  menu_name: string;
  total_qty: number;
  total_revenue: number;
}

export interface CashierPerformance {
  cashier_name: string;
  total_transaksi: number;
  omzet: number;
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

export interface TopMemberBySaldo {
  member_name: string;
  saldo: number;
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

export interface WithdrawalTerbaru {
  code: string;
  amount: number;
  status: string;
  created_at: string;
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
  saldo_outlet_detail?: number;
  sales_graph?: SalesGraph;
  aov?: number;
  weekly_comparison?: WeeklyComparison;
  outstanding_bill_tracker?: OutstandingBillTracker;
  top_menu?: TopMenu[];
  cashier_performance?: CashierPerformance[];
  payment_method_split?: PaymentMethodSplit[];
  peak_hours?: PeakHour[];
  top_member_by_saldo?: TopMemberBySaldo[];
  withdrawal_terbaru?: WithdrawalTerbaru[];
}
