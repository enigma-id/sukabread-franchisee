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

export interface DashboardData {
  omzet_hari_ini: number;
  omzet: number;
  total_transaksi: number;
  sesi_kasir_aktif: number;
  saldo_outlet: number;
  stok_kritis: number;
  omset_penjualan: number;
  saldo_outlet_detail: number;
  sales_graph: SalesGraph;
  aov: number;
  weekly_comparison: WeeklyComparison;
  outstanding_bill_tracker: OutstandingBillTracker;
}
