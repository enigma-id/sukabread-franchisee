export interface ContractOutletTopup {
  id: string;
  brand_id: string;
  outlet_id: string;
  code: string;
  amount: number;
  payment_method_id: string;
  document_status: "pending" | "approved" | "rejected";
  rejected_reason?: string;
  processed_by?: string;
  processed_at?: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  brand?: {
    id: string;
    name: string;
  };
  outlet?: {
    id: string;
    name: string;
  };
  payment_method?: {
    id: string;
    name: string;
    provider: string;
  };
  payment?: {
    status: string;
    va_number?: string;
    bank_name?: string;
  };
}

export interface ContractCreateTopupRequest {
  amount: number;
  note?: string;
}
