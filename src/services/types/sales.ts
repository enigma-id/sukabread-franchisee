import type { Outlet } from "./outlet";

// Sales Order
export interface SalesOrderSummary {
  id: string;
  code: string;
  ordered_at: string;
  channel: { name: string } | null;
  payment_method: { name: string } | null;
  total_charges: number;
}

// Sales Session
export interface Cashier {
  id: string;
  brand_id: string;
  outlet_id: string;
  username: string;
  name: string;
  role: string;
  is_active: boolean;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  payment_name: string;
  subtotal: number;
}

export interface CategorySold {
  name: string;
  quantity: number;
  total_charges: number;
}

export interface Topup {
  type: string;
  total_nominal: number;
}

export interface SessionSummary {
  id: string;
  session_id: string;
  sales: {
    total_sales: number;
    total_discount: number;
    total_after_discount: number;
    total_service: number;
    grand_total: number;
    outstanding_bill: number;
    outstanding_bill_payment: number;
  };
  payment_methods: PaymentMethod[];
  category_solds: CategorySold[];
  topups: Topup[];
  cash: {
    expected_cash: number;
    topup_cash: number;
  };
  updated_at: string;
}

export interface SalesSession {
  id: string;
  outlet_id: string;
  cashier_id: string;
  transaction_date: string;
  started_at: string;
  finished_at: string;
  cash_started: number;
  cash_finished: number;
  status: string;
  created_at: string;
  updated_at: string;
  outlet?: Outlet;
  cashier?: Cashier;
  summary?: SessionSummary;
  sales_orders: SalesOrderSummary[];
}
