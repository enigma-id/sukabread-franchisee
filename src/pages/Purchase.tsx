import { useAppSelector } from "@/hooks";
import { isCompanyOutlet } from "@/utils/outletType";
import { PurchaseExternal } from "./purchase/PurchaseExternal";
import { SalesRequestList } from "./purchase/SalesRequestList";

/**
 * Gateway halaman /purchase.
 * - Brand tipe "outlet" → halaman Sales Request internal (list + form + detail).
 * - Selain itu ("mitra") → app order eksternal seperti sebelumnya.
 */
export function Purchase() {
  const brand = useAppSelector((s) => s.auth.session?.brand);

  if (isCompanyOutlet(brand)) {
    return <SalesRequestList />;
  }

  return <PurchaseExternal />;
}
