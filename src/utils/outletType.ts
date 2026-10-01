/**
 * Helper untuk membedakan tipe brand (relation `brand` pada session auth).
 * "outlet" → halaman Pembelian internal (Sales Request).
 * Selain itu ("mitra"/null/lain) → tetap memakai app order eksternal.
 */
export function isCompanyOutlet(brand?: {
  type?: string | null;
} | null): boolean {
  return brand?.type?.toLowerCase() === "outlet";
}
