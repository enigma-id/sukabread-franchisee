// Auth
export interface User {
  id: number;
  name: string;
  username: string;
  is_supervisor: boolean;
  is_active: boolean;
  last_login_at: string;
}

export interface AuthUser extends User {
  token?: string;
}

/**
 * Relasi `brand` yang dikembalikan pada response login (entity.Session).
 * `type` membedakan tipe brand: "outlet" (Sales Request internal)
 * vs "mitra" (redirect ke app order eksternal).
 */
export interface SessionBrand {
  id: string;
  ref_id?: string;
  type?: string | null;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface ProfileUpdateRequest {
  name: string;
  password?: string;
  confirm_password?: string;
}

// Contract-aligned types
export interface ContractLoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: string;
    display_name: string;
    phone: string;
    role: string; // "outlet_owner" | "cashier"
  };
  outlet: {
    id: string;
    name: string;
    outlet_type_id: string;
    brand_id: string;
  };
}
