import { useAppSelector } from "@/hooks";
import { isCompanyOutlet } from "@/utils/outletType";
import { PurchaseExternal } from "./purchase/PurchaseExternal";
import { SalesRequestList } from "./purchase/SalesRequestList";

/**
 * Gateway halaman /purchase.
 * - Franchise tipe "Outlet" → halaman Sales Request internal (list + form + detail).
 * - Selain itu ("Mitra") → app order eksternal seperti sebelumnya.
 */
export function Purchase() {
  const franchise = useAppSelector((s) => s.auth.session?.franchise);

  if (isCompanyOutlet(franchise)) {
    return <SalesRequestList />;
  }

  return <PurchaseExternal />;
}
