/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Kontrak umum komponen section report.
 *
 * Section = isi satu laporan (kartu ringkasan + tabel + pagination) tanpa
 * `Page`/`Page.Header`, sehingga bisa dipakai di halaman standalone maupun
 * sebagai tab di halaman detail kasir.
 */
export interface ReportSectionProps {
  /** Key state redux table — wajib unik per konteks (mis. `cashier_detail_<id>_<tab>`). */
  tableName: string;
  /** Filter awal yang dikirim ke endpoint (mis. `start_date`/`end_date`). */
  filter?: Record<string, unknown>;
  /** Filter yang tidak bisa di-clear user (mis. `cashier_id`). */
  lockedFilter?: Record<string, unknown>;
  /** Tampilkan kontrol filter milik report (default true). */
  showFilter?: boolean;
  /** Tampilkan kartu ringkasan report (default true). */
  showSummary?: boolean;
  /** Override aksi klik baris. */
  onRowClick?: (row: any) => void;
}
