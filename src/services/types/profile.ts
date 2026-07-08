export interface UserProfile {
  id: number;
  name: string;
  identifier: string;
  role: string;
  is_active: boolean;
}

export interface ProfileUpdatePayload {
  name: string;
  password?: string;
  confirm_password?: string;
}

// Contract-aligned types
export interface ContractProfile {
  id: string;
  display_name: string;
  phone: string;
  email: string;
  role: string;
  outlet: {
    id: string;
    name: string;
    address: string;
    outlet_type_id: string;
  };
}

export interface ContractProfileUpdatePayload {
  display_name?: string;
  phone?: string;
  email?: string;
}
