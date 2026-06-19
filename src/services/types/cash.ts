// Cash Control
export interface CashOverview {
  total_transaction: number;
  total_topup: number;
  total_session: number;
  deficient: number;
}

export interface CashSessionData {
  transaction_date: string;
  started_at: string;
  finished_at: string;
  transaction_cash: number;
  cash_deposit: number;
  finished_cash: number;
  variance: number;
}

export interface CashControl {
  overview_cash: CashOverview;
  session_data: CashSessionData[];
}

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
