/**
 * Outlet milik franchise — endpoint `/franchise/outlets`
 * (backend handler `outlet/manage`; data via gRPC proto OutletResp).
 * Response data = { outlets: [...], total, page, limit }.
 */
export interface FranchiseOutlet {
  id: string;
  franchisor_id?: string;
  franchise_id?: string;
  outlet_type_id?: string;
  name: string;
  recipient_name?: string;
  phone?: string;
  address?: string;
  service_charges?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  pos_channel_ids?: string[];
}

export interface FranchiseOutletListResponse {
  outlets: FranchiseOutlet[];
  total: number;
  page?: number;
  limit?: number;
}

/** POST /franchise/outlets — wajib sertakan data owner (role manager) */
export interface CreateFranchiseOutletPayload {
  name: string;
  phone: string;
  recipient_name?: string;
  address?: string;
  service_charges?: number;
  owner_username: string;
  owner_password: string;
  owner_name: string;
}

/** PUT /franchise/outlets/{id} — tanpa data owner */
export interface UpdateFranchiseOutletPayload {
  name: string;
  phone?: string;
  recipient_name?: string;
  address?: string;
  service_charges?: number;
}
