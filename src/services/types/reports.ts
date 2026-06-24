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
  started_at: string;
  finished_at: string;
  transaction_cash: number;
  cash_deposit: number;
  finished_cash: number;
  variance: number;
}

// Product Sales
export interface ProductSalesRow {
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
