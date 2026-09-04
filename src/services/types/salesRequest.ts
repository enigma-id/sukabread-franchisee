/**
 * Sales Request (order_type='request') — endpoint `/sales/request`.
 * Response gRPC di-serialize via encoding/json sehingga field mengikuti nama proto (snake_case).
 */
export interface SalesRequestItem {
  id?: string;
  catalog_id: string;
  item_id?: string;
  quantity_ordered: number;
  unit_nett?: number;
  total_nett?: number;
  catalog_code?: string;
  catalog_name?: string;
}

export interface SalesRequest {
  id: string;
  franchisor_id?: string;
  franchise_id?: string;
  outlet_id?: string;
  code: string;
  ref_code?: string;
  order_type?: string;
  document_status?: string;
  fulfillment_status?: string;
  payment_status?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  note?: string;
  shipping_date?: string;
  shipping_charges?: number;
  total_charges?: number;
  self_pickup?: boolean;
  created_at?: string;
  updated_at?: string;
  items?: SalesRequestItem[];
}

/** List response: data = { sales_orders: [...], total, page, limit } */
export interface SalesRequestListResponse {
  sales_orders: SalesRequest[];
  total: number;
  page?: number;
  limit?: number;
}

export interface SalesRequestPayloadItem {
  catalog_id: string;
  quantity_ordered: number;
}

export interface CreateSalesRequestPayload {
  outlet_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  note?: string;
  shipping_date: string;
  items: SalesRequestPayloadItem[];
}

export interface UpdateSalesRequestPayload {
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  note?: string;
  shipping_date: string;
  items: SalesRequestPayloadItem[];
}
