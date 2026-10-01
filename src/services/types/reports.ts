// Saldo Log Report
export interface SaldoLogReportRow {
  date: string;
  reference_type: string;
  reference_code: string;
  payment_type: string;
  nominal: number;
  status: string;
  membership: string;
  card_id: string;
  outlet: string;
  cancelled_reason: string;
  cancelled_by: string;
  cancelled_at: string;
}

export interface SaldoLogReportSummary {
  total_nominal: number;
  total_count: number;
}

// Cashier Maps (mitra) — live map posisi device operator.
export interface CashierMapHistory {
  latitude: number;
  longitude: number;
  created_at: string;
  /** Penjualan yang terjadi selagi device berada di titik ini (sampai titik berikutnya). */
  total_charges: number;
  total_transactions: number;
  /** Titik terakhir sesi `opened` yang rentangnya >30 mnt tanpa log baru (omzet tetap dihitung). */
  uncertain?: boolean;
}

/** Recency device operator: online (<=5 menit) | stale (5-15 menit) | offline. */
export type CashierDeviceStatus = "online" | "stale" | "offline";

/** Baris `GET /report/cashier-maps` — satu baris per SESI operator. */
export interface CashierMapRow {
  cashier_id: string;
  cashier_name: string;
  session_id: string;
  started_at: string;
  /** Kosong (`""`) selama sesi masih `opened`. */
  finished_at: string;
  /** Status sales_session: `opened` | `closed`. */
  status: string;
  total_charges: number;
  last_latitude: number;
  last_longitude: number;
  last_battery_health: string;
  historys: CashierMapHistory[];
}

/** Baris `GET /report/cashier-device` — semua operator + posisi device terakhir. */
export interface CashierDeviceRow {
  cashier_id: string;
  cashier_name: string;
  /** Kapan device terakhir melapor (WIB); kosong kalau belum pernah kirim device. */
  last_activity_at?: string;
  last_battery_health?: string;
  last_latitude: number;
  last_longitude: number;
}

/**
 * Bentuk minimal yang bisa digambar `CashierLiveMap`: kirim `historys` untuk
 * jejak perjalanan, atau cukup `last_latitude`/`last_longitude` untuk satu titik
 * posisi terakhir. Dipenuhi oleh `CashierMapRow` maupun `CashierDeviceRow`.
 */
export interface CashierLiveRow {
  cashier_id: string;
  cashier_name: string;
  last_battery_health?: string;
  last_activity_at?: string;
  last_latitude?: number;
  last_longitude?: number;
  historys?: CashierMapHistory[];
}

// Laporan per-operator (cashier + manager)
export interface CashierReportRow {
  cashier_id: string;
  cashier_name: string;
  /** "Online" bila operator punya sesi kasir terbuka, selain itu "Offline". */
  status: string;
  total_sales: number;
  omzet: number;
  total_outstanding: number;
  outstanding_amount: number;
  total_session: number;
  aov: number;
  cancelled_count: number;
}

export interface CashierReportSummary {
  total_cashier: number;
  total_sales: number;
  total_omzet: number;
  total_outstanding: number;
  outstanding_amount: number;
  total_session: number;
  active_cashier: number;
  cancelled_count: number;
}

// Daily Sales
export interface DailySalesRow {
  date: string;
  total_charges: number;
}

// Outstanding Bills
export interface OutstandingBill {
  code: string;
  date: string;
  outlet: string;
  cashier: string;
  bill_name: string;
  total_charges: number;
}

export interface OutstandingSummary {
  total_charges: number;
}

// Settlement
export interface SettlementRow {
  periode: string;
  started_at?: string;
  finished_at?: string;
  payment_methods: string[];
  nominals: number[];
}

export interface SettlementSummaryItem {
  payment_method: string;
  nominal: number;
}

// Cash Control
export interface CashControlRow {
  transaction_date: string;
  cashier: string;
  started_at: string;
  finished_at: string;
  transaction_cash: number;
  cash_deposit: number;
  finished_cash: number;
  variance: number;
}

// Product Sales
export interface ProductSalesRow {
  order_id: string;
  date: string;
  channel: string;
  payment: string;
  outlet: string;
  code: string;
  menu: string;
  quantity: number;
  unit_nett: number;
  discount: number;
  total_nett: number;
}

// Product Item — sales grouped per (date, outlet, menu), no discount
export interface ProductItemRow {
  date: string;
  outlet: string;
  menu: string;
  quantity: number;
  unit_nett: number;
  total_nett: number;
}

export interface ProductItemSummary {
  total_qty: number;
  total_nett: number;
}

// Cancelled Product Sales
export interface CancelledProductSalesRow {
  order_id: string;
  date: string;
  channel: string;
  payment: string;
  outlet: string;
  code: string;
  menu: string;
  quantity: number;
  unit_nett: number;
  discount: number;
  total_nett: number;
  cancelled_reason: string;
  cancelled_by: string;
  cancelled_at: string;
}

export interface CancelledProductSalesSummary {
  total_qty: number;
  total_nett: number;
  total_discount: number;
}
