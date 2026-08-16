// Daily Sales
export interface DailySalesRow {
  date: string
  total_charges: number
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
  total_charges: number
}

// Settlement
export interface SettlementRow {
  periode: string
  started_at?: string
  finished_at?: string
  payment_methods: string[]
  nominals: number[]
}

export interface SettlementSummaryItem {
  payment_method: string
  nominal: number
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
  order_id: string
  date: string
  channel: string
  payment: string
  outlet: string
  code: string
  menu: string
  quantity: number
  unit_nett: number
  discount: number
  total_nett: number
}

// Product Item — sales grouped per (date, outlet, menu), no discount
export interface ProductItemRow {
  date: string
  outlet: string
  menu: string
  quantity: number
  unit_nett: number
  total_nett: number
}

export interface ProductItemSummary {
  total_qty: number
  total_nett: number
}

// Cancelled Product Sales
export interface CancelledProductSalesRow {
  order_id: string
  date: string
  channel: string
  payment: string
  outlet: string
  code: string
  menu: string
  quantity: number
  unit_nett: number
  discount: number
  total_nett: number
  cancelled_reason: string
  cancelled_by: string
  cancelled_at: string
}

export interface CancelledProductSalesSummary {
  total_qty: number
  total_nett: number
  total_discount: number
}

// Topup Cancelled
export interface TopupCancelledRow {
  date: string
  reference_code: string
  membership: string
  outlet: string
  nominal: number
  cancelled_reason: string
  cancelled_by: string
  cancelled_at: string
}
