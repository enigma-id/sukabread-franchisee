/**
 * Helper untuk membedakan tipe franchise (relation `franchise` pada session auth).
 * "Outlet" → halaman Pembelian internal (Sales Request).
 * Selain itu ("Mitra"/null/lain) → tetap memakai app order eksternal.
 */
export function isCompanyOutlet(franchise?: {
  outlet_type_name?: string | null;
} | null): boolean {
  return franchise?.outlet_type_name?.toLowerCase() === "outlet";
}
