// Sales Session
export interface Cashier {
  id: number
  name: string
}

export interface SummaryOrder {
  total_nett: number
  total_discount: number
  total_service_charge: number
  total_charges: number
  total_openbill: number
}

export interface CashPayment {
  payment_name: string | null
  subtotal: number
}

export interface CategorySold {
  name: string
  quantity: number
  total_charges: number
}

export interface SalesSession {
  id: number
  transaction_date: string
  started_at: string
  finished_at: string
  status: string
  cash_started: number
  cash_finished: number
  cash_due: number
  cash_topup: number // API returns this as number, not topups array
  bill_payment: number
  cashier: Cashier
  summary_order: SummaryOrder
  cash_payments: CashPayment[]
  category_solds: CategorySold[]
  sales_orders: SalesOrderSummary[]
}

export interface SalesOrderSummary {
  id: number
  code: string
  ordered_at: string
  channel: { name: string } | null
  payment_method: { name: string } | null
  total_charges: number
}

// Sales Order Detail
export interface SalesOrderItem {
  id: number
  catalog: { name: string }
  additional_id: number | null
  quantity: number
  unit_nett: number
  total_nett: number
  note?: string | null
}

export interface SalesOrder {
  id: number
  code: string
  ordered_at: string
  payment_ref: string | null
  note: string | null
  channel: { name: string } | null
  payment_method: { name: string } | null
  session: {
    id: number
    cashier: Cashier
  }
  total_bill: number
  discount_value: number
  service_charge: boolean
  service_charge_value: number
  total_charges: number
  subtotal_tax: number
  sales_order_items: SalesOrderItem[]
}
