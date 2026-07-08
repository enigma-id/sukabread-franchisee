export interface Outlet {
  id: string;
  ref_id?: string;
  brand_id?: string;
  outlet_type_id?: string;
  name: string;
  recipient_name?: string;
  phone?: string;
  address?: string;
  region_id?: string;
  service_charges: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OutletUpdatePayload {
  service_charges: number;
}

// Contract-aligned types
export interface ContractOutletUpdatePayload {
  service_charge?: number;
  name?: string;
  address?: string;
}

export interface ContractBalanceLog {
  id: string;
  brand_id: string;
  outlet_id: string;
  reference_id: string;
  reference_type: string;
  nominal: number;
  balance_before: number;
  balance_after: number;
  created_at: string;
}
