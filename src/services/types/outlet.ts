export interface Outlet {
  id: string;
  name: string;
  service_charges: number;
}

export interface OutletUpdatePayload {
  service_charges: number;
}
