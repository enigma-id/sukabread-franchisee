export interface Membership {
  id: string;
  brand_id: string;
  card_id: string;
  reff_code: string;
  name: string;
  saldo: number;
  created_at: string;
  updated_at: string;
}

// Contract-aligned types
export interface ContractMembership {
  id: string;
  card_number: string;
  member_name: string;
  phone: string;
  balance: number;
  point: number;
  is_active: boolean;
  created_at: string;
}

export interface ContractMembershipDetail {
  id: string;
  card_number: string;
  member_name: string;
  phone: string;
  email: string;
  balance: number;
  point: number;
  is_active: boolean;
  created_at: string;
}

export interface ContractMembershipLog {
  id: string;
  type: "topup" | "payment" | "refund";
  amount: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  created_at: string;
}
