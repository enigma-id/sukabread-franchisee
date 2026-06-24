// Cash Control
export interface CashOverview {
  cash_deposit: number;
  finished_cash: number;
  transaction_cash: number;
  variance: number;
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
