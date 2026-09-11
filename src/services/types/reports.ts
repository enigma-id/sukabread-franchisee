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
}

/** Recency device operator: online (<=5 menit) | stale (5-15 menit) | offline. */
export type CashierDeviceStatus = "online" | "stale" | "offline";

export interface CashierMapRow {
  cashier_id: string;
  cashier_name: string;
  role: string;
  session_id: string;
  started_at: string;
  battery_health: string;
  last_seen: string;
  status: CashierDeviceStatus;
  total_charges: number;
  historys: CashierMapHistory[];
}

// Laporan per-operator (cashier + manager)
export interface CashierReportRow {
  cashier_id: string;
  cashier_name: string;
  username: string;
  role: string;
  outlet_id: string;
  outlet_name: string;
  total_sales: number;
  omzet: number;
  total_outstanding: number;
  outstanding_amount: number;
  total_session: number;
  active_session: number;
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
