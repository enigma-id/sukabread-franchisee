import { CashierSessionsPanel } from "./CashierSessionsPanel";
import type { ReportSectionProps } from "./types";

/**
 * Tab peta untuk halaman detail kasir — jejak GPS per SESI operator (dibatasi
 * `cashier_id`), sesi dipilih lewat dropdown.
 *
 * Memuat `mapbox-gl`, jadi komponen ini WAJIB di-lazy-load oleh pemanggilnya.
 */
export function CashierMapsSection({
  lockedFilter,
  showSummary = true,
}: ReportSectionProps) {
  const cashierId = (lockedFilter?.cashier_id as string) ?? "";

  return (
    <CashierSessionsPanel
      cashierId={cashierId}
      showSummary={showSummary}
      className='flex-1 min-h-0'
    />
  );
}
