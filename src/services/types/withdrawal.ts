// Contract-aligned types
export interface ContractCreateWithdrawalRequest {
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  notes?: string;
}

export interface WithdrawalRequest {
  id: string;
  brand_id: string;
  outlet_id: string;
  code: string;
  amount: number;
  balance_at_request: number;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  notes: string;
  document_status: string;
  rejected_reason: string;
  processed_by: string;
  processed_at: string;
  is_deleted: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  outlet?: {
    id: string;
    ref_id: string;
    brand_id: string;
    outlet_type_id: string;
    name: string;
    recipient_name: string;
    phone: string;
    address: string;
    region_id: string;
    service_charges: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}
