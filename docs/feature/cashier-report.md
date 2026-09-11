# Laporan Kasir / Mitra (per-Operator) — Franchisee FE

**Status:** Planned
**Scope:** `franq-franchisee` (frontend)

## Tujuan

Nambah menu **Laporan Kasir** (di brand `mitra` labelnya **Laporan Mitra**) dengan:

- **List page** — tabel per-operator dari `GET /report/cashier` + kartu summary `GET /report/cashier/summary`, ada aksi ke detail.
- **Detail page** — Summary Cashier + 7 **Tab Laporan existing** (Product Sales, Product Item, Outstanding, Cancel Order, Cash Control, Settlement, Saldo Log).
- **Penyesuaian Dashboard** — hapus kartu "Penarikan Terbaru" (sudah di-drop backend) + tambah widget mitra: **Top Kasir** dan **Live Cashier Map**.

## Status backend — SUDAH SIAP

`franq/backend/franchise` (branch `feature/refactor-franchisor`, commit `562df66` + perubahan WIP di working tree) sudah menyediakan:

- `GET /report/cashier` — list per-operator. Response `ReportCashier`:
  `cashier_id, cashier_name, username, role, outlet_id, outlet_name, total_sales, omzet, total_outstanding, outstanding_amount, total_session, active_session, aov, cancelled_count`
- `GET /report/cashier/summary` — `ReportCashierSummary`: `total_cashier, total_sales, total_omzet, total_outstanding, outstanding_amount, total_session, active_cashier, cancelled_count`
- Query params: `start_date, end_date, role, cashier_id, search, page, limit, order_by, downloadable`
- Sumber operator: `role IN ('cashier','manager')` (manager wajib ikut biar omset rekonsiliasi).
- **7 report existing semua sudah menerima `cashier_id`** → tab bisa langsung difilter.
- Catatan: list **mengabaikan `order_by`** (ORDER BY `u.name` hardcoded) → kolom list jangan diberi `sortable`.
- **Role gating**: kalau `session.Role == 'cashier'`, backend otomatis membatasi ke data dirinya sendiri di `/report/cashier` (+summary), `/report/cashier-maps`, dan section mitra dashboard. FE tidak perlu kirim apa-apa — cukup jangan mengasumsikan selalu melihat semua operator.
- **Dashboard (`GET /dashboard`) sudah menyediakan section mitra** (hanya terisi bila `brand.type = 'mitra'`):
  - `top_cashiers` — top 5 operator. Item: `cashier_id, cashier_name, role, total_transactions, total_revenue, aov`. Query param `metric`: `revenue` (default) | `transactions` | `aov`.
  - `cashier_live_map` — posisi device operator yang **sedang bertugas** (session `opened`). Bentuknya reuse `CashierMapsReportItem`:
    `cashier_id, cashier_name, role, session_id, started_at, battery_health, last_seen, status, total_charges, historys[]`
    `status` = recency device: `online` (≤5 mnt) | `stale` (5–15 mnt) | `offline` (>15 mnt / belum ada log).
  - `withdrawal_terbaru` **dihapus** dari response (`DashboardFranchisePortal`).
- **Proxy franchisor** (untuk portal franchisor, bukan franchisee): `GET /report/franchise/cashier`(+`/summary`) + permission `frontend.franchisor.report.mitra.cashier`. Tidak dipakai FE ini.
- Doc backend: `franq/docs/feature/outlet-dashboard-and-cashier-report.md`.

## Keputusan (hasil diskusi)

1. **7 tab lengkap**: Product Sales, Product Item, Outstanding, Cancel Order, Cash Control, Settlement, Saldo Log.
2. **Opsi tengah (dipilih)**: bikin komponen **section reusable** khusus dipakai halaman detail + tab. **7 halaman report standalone TIDAK disentuh** — nol risiko regresi. Migrasi halaman lama ke section diserahkan ke PR terpisah (follow-up). Lihat *Arsitektur §1*.
3. **Semua tipe brand**, label menu dinamis: `mitra` → "Laporan Mitra", lainnya → "Laporan Kasir".
4. **Periode**: satu **date-range global** di halaman detail (dipakai tab date-based + Summary Cashier), bisa diubah, inherit dari list via URL. **Tab Settlement tetap YearPicker sendiri** (periode tahunan).
5. **Dashboard mitra** ikut disesuaikan: buang "Penarikan Terbaru", tambah **Top Kasir** + **Live Cashier Map** (keduanya dari response `/dashboard` yang sudah menyediakan `top_cashiers` & `cashier_live_map`).
6. **Role gating** diserahkan ke backend (cashier hanya lihat dirinya sendiri); FE tidak menambah logika filter sendiri.

---

## Arsitektur

### 1. Section reusable (khusus tab detail)

Folder baru `src/pages/reports/sections/`, 1 file per report. **Dipakai hanya oleh halaman detail kasir** — halaman standalone lama dibiarkan apa adanya. Yang di-reuse dari kode existing: `createTableConfig` factory, komponen `*TableFilter`, dan summary hook — jadi kolom/format/query tetap satu sumber. Yang baru cuma shell-nya (useTable + effect summary + kartu). Semua mengikuti signature sama:

```ts
// src/pages/reports/sections/types.ts
export interface ReportSectionProps {
  tableName: string;                        // key redux table (unik per konteks)
  filter?: Record<string, unknown>;         // filter awal (mis. start_date/end_date)
  lockedFilter?: Record<string, unknown>;   // mis. { cashier_id }
  showFilter?: boolean;                     // render filter kontrol tab (default true)
  showSummary?: boolean;                    // render kartu ringkasan (default true)
  onRowClick?: (row: any) => void;          // override row click
}
```

Contoh `src/pages/reports/sections/ProductSalesSection.tsx`:

```tsx
export function ProductSalesSection({
  tableName,
  filter, lockedFilter, showFilter = true, showSummary = true, onRowClick,
}: ReportSectionProps) {
  const navigate = useNavigate();
  const tableConfig = useMemo(() => createTableConfig({
    filter, lockedFilter,
    onRowClick: onRowClick ?? ((row) => navigate(`/sales/order/${row.order_id}`)),
  }), [filter, lockedFilter, onRowClick, navigate]);

  const Table = useTable(tableName, tableConfig as TableConfig<unknown>);
  // ... effect summary (pola sama seperti ProductSales.tsx) ...
  return (
    <>
      {showSummary && <OverviewCards data={summary} />}
      <Table.Tools downloadable>{showFilter && <TableFilter table={Table} />}</Table.Tools>
      <Table.Render emptyTitle='...' emptyDescription='...' />
      <Table.Pagination />
    </>
  );
}
```

Section lain:

| File | Sumber summary | Catatan |
|---|---|---|
| `ProductSalesSection.tsx` | `productSalesSummary` | rowClick → order detail |
| `ProductItemSection.tsx` | `productItemSummary` | |
| `CancelledSalesSection.tsx` | `cancelledSalesSummary` | rowClick → order detail |
| `OutstandingSection.tsx` | `outstandingSummary` | |
| `CashControlSection.tsx` | `cashControlSummary` | |
| `SettlementSection.tsx` | `useLazyGetSettlementSummaryQuery` | YearPicker; `dataKey:"datas"` |
| `SaldoMembershipSection.tsx` | `useLazyGetSaldoLogSummaryQuery` | `searchable={false}` |

`THEMES` (palette kartu) **tetap inline di masing-masing file section**, mengikuti konvensi yang sudah ada di 7 halaman report. Tidak dibuat file `themes.ts` bersama — modul baru hanya dipakai 7 section, dan file bersama cuma jadi konvensi kedua untuk konstanta yang sama (8 salinan lama tetap ada). Barrel `sections/index.ts` re-export semua section.

**Konsekuensi yang diterima:** shell report kini ada 2 salinan (halaman lama + section baru) sampai halaman lama dimigrasi. `tableName` section **wajib** di-set eksplisit oleh pemanggil supaya tidak bentrok dengan state redux halaman lama.

### 2. Config factory dapat `lockedFilter`

Config table yang belum mendukung `lockedFilter` perlu ditambah param & di-spread (supaya `cashier_id` tidak bisa ke-clear):
`product-sales.config.tsx`, `product-item.config.tsx`, `cancelled-sales.config.tsx`, `outstanding.config.tsx`, `cash-control.config.tsx` → tambah `lockedFilter?: Record<string, unknown>` dan `lockedFilter` di return.
`settlement.config.tsx` → `lockedFilter: { periode_type: "yearly", ...(incomingLockedFilter || {}) }`.
`saldo-membership.config.tsx` → `lockedFilter: { status: "completed", ...(incomingLockedFilter || {}) }`.

### 3. Halaman standalone tidak disentuh

`ProductSales.tsx`, `ProductItem.tsx`, `CancelledSales.tsx`, `Outstanding.tsx`, `CashControl.tsx`, `Settlement.tsx`, `SaldoMembership.tsx` **dibiarkan utuh** — tidak ada perubahan sama sekali. Report existing tetap jalan lewat kode yang sekarang, memakai `tableName` lama (`report_product_sales`, dst) yang tidak bentrok dengan `tableName` tab (`cashier_detail_*`).

Satu-satunya perubahan pada file lama adalah di `*.config.tsx` (§2), dan itu **aditif**: pemanggil lama yang mengirim `createTableConfig({})` tidak berubah perilakunya karena `lockedFilter` yang di-spread bernilai `undefined`.

### 4. Halaman Detail — Tab + periode global

Route `/report/cashier/:id` dengan search params `start_date`, `end_date`, `tab`.

```tsx
export function CashierDetail() {
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const startDate = params.get("start_date") ?? "";
  const endDate = params.get("end_date") ?? "";
  const activeTab = params.get("tab") ?? "product-sales";

  // Identitas + metrik kasir dalam 1 call: list endpoint dengan cashier_id.
  const [trigger, { data: res, isLoading }] = useLazyGetCashierReportQuery();
  useEffect(() => {
    if (id) trigger({ cashier_id: id, start_date: startDate, end_date: endDate, page: 1, limit: 1 });
  }, [id, startDate, endDate, trigger]);

  const cashier = res?.data?.[0];
  // ...
}
```

- **Summary Cashier** pakai `GET /report/cashier?cashier_id=` (1 request, sekaligus dapat `cashier_name/role/username/outlet_name` untuk header). `/report/cashier/summary` dipakai di halaman **list**.
- **Periode global**: satu `DatePicker mode="range"` di baris atas body, nilainya ditulis ke URL. Ubah periode → URL berubah → section remount (lihat key) → refetch.
- **Tab**: pakai komponen `Tabs` (`@/components/ui/tabs`, daisyUI v5 sudah aktif) — `variant="boxed"`. Item tab tanpa `content`; section aktif dirender sebagai `children`.

```tsx
const TABS = [
  { value: "product-sales", label: "Product Sales", Section: ProductSalesSection },
  { value: "product-item",  label: "Product Item",  Section: ProductItemSection },
  { value: "outstanding",   label: "Outstanding",   Section: OutstandingSection },
  { value: "cancel-order",  label: "Cancel Order",  Section: CancelledSalesSection },
  { value: "cash-control",  label: "Cash Control",  Section: CashControlSection },
  { value: "settlement",    label: "Settlement",    Section: SettlementSection },
  { value: "saldo-log",     label: "Saldo Log",     Section: SaldoMembershipSection },
];

const active = TABS.find((t) => t.value === activeTab) ?? TABS[0];
const isSettlement = active.value === "settlement";
const periodKey = `${id}-${startDate}-${endDate}`;

<Page.Header category="Report" title={`${isMitra ? "Laporan Mitra" : "Laporan Kasir"} — ${cashier?.cashier_name ?? ""}`} backTo={() => navigate(-1)} />
<Page.Body>
  <CashierSummaryCards data={cashier} />                     {/* kartu Summary Cashier */}
  {/* baris periode global */}
  <DateRangeControl start={startDate} end={endDate} onChange={...} />

  <Tabs items={TABS.map(({value,label}) => ({value,label}))} value={activeTab}
        onChange={(v) => setTab(v)} variant="boxed">
    <active.Section
      key={`${active.value}-${periodKey}`}        // remount = boot ulang dengan filter baru
      tableName={`cashier_detail_${active.value}`}
      lockedFilter={{ cashier_id: id }}
      filter={isSettlement ? {} : { start_date: startDate, end_date: endDate }}
      showFilter={isSettlement}                    // Settlement: YearPicker sendiri
    />
  </Tabs>
</Page.Body>
```

`key` mengandung periode → `useTable.boot()` jalan ulang (hasBootedRef reset) dan `config.filter` menimpa filter lama. `tableName` per tab (`cashier_detail_*`) supaya tidak bentrok state dengan halaman standalone.

**Konsekuensi yang disepakati**: di konteks tab, filter tanggal milik report tidak ditampilkan (pakai periode global). Filter non-tanggal (catalog di Product Sales, tipe/status di Saldo Log) tidak muncul di tab detail — bisa ditambah belakangan kalau perlu. Tab Settlement tetap punya YearPicker-nya sendiri.

### 5. Halaman List

`src/pages/reports/CashierList.tsx` — pola `CashControl.tsx`:

- `createTableConfig({ onRowClick: (row) => navigate(`/report/cashier/${row.cashier_id}?start_date=${start}&end_date=${end}`) })`
- `useTable("report_cashier", config)` (url `/report/cashier`)
- `OverviewCards` dari `GET /report/cashier/summary` (trigger effect dgn filter locked+filter+search, pola `CashControl.tsx`)

`table/cashier.config.tsx` (url `/report/cashier`), kolom (urut kunci = urut kolom), semua `sortable: false` (backend abaikan `order_by`):
`cashier_name` "Kasir / Operator" · `role` (Badge, capitalize) · `username` · `outlet_name` "Outlet" · `total_sales` "Transaksi" · `omzet` "Omzet" (currencyFormat, kanan) · `total_outstanding` "Outstanding" · `outstanding_amount` "Nilai Outstanding" (currencyFormat) · `total_session` "Total Sesi" · `active_session` "Sesi Aktif" · `aov` "AOV" (currencyFormat) · `cancelled_count` "Dibatalkan" · `action` (ChevronRight).

`table/cashier.filter.tsx` — pola `saldo-membership.filter.tsx` (`TableFilters` + `RemoteSelect` + `DatePicker`): filter **date range** + **role** (options: All / `cashier` / `manager`). Search sudah dari `Table.Tools`.

Kartu summary list (`CashierReportSummary`): Total Operator (`total_cashier`), Total Transaksi (`total_sales`), Total Omzet (`total_omzet`), Kasir Aktif (`active_cashier`).

### 6. Menu & routes

`src/routes/index.tsx`:

```tsx
<Route path="/report/cashier" element={<CashierList />} />
<Route path="/report/cashier/:id" element={<CashierDetail />} />
```

(import dari `@/pages/reports` barrel.)

`src/components/layout/AuthorizedLayout.tsx` — di section "Laporan" (setelah "Cash Control"):

```tsx
{
  label: type === "mitra" ? "Laporan Mitra" : "Laporan Kasir",
  path: "/report/cashier",
  icon: <UsersRound size={16} />,
},
```

Catatan: active-state menu cek segmen path terakhir, jadi saat di halaman detail (`/report/cashier/<uuid>`) item ini tidak ter-highlight — sama seperti detail page existing lainnya.

---

## 7. Penyesuaian Dashboard

Backend `GET /dashboard` sudah berubah (lihat *Status backend*), jadi FE harus disesuaikan supaya tidak drift:

**a. Hapus kartu "Penarikan Terbaru".**
Backend sudah tidak mengirim `withdrawal_terbaru`, jadi kartu ini sekarang **selalu** nampilin "Tidak ada penarikan" — misleading. Hapus blok `PipelineCard title='Penarikan Terbaru'` di `Dashboard.tsx`, lalu bersihkan: field `WithdrawalTerbaru` di `DashboardData`, dan import yang jadi tak terpakai (`ArrowUpFromLine`, `dateFormat`).

**b. Tambah widget "Top Kasir / Operator" (khusus mitra).**
Render hanya kalau `data?.top_cashiers?.length` (backend mengosongkan/omit field ini untuk brand non-mitra). Pakai pola `PipelineCard` yang sudah ada:

```tsx
{data?.top_cashiers?.length ? (
  <PipelineCard title='Top Kasir' icon={Medal} theme={THEMES.green}
                onClick={go("/report/cashier")}>
    {data.top_cashiers.map((c) => (
      <div key={c.cashier_id}
           className='flex items-center justify-between cursor-pointer'
           onClick={go(`/report/cashier/${c.cashier_id}`)}>
        <div className='flex items-center gap-2'>
          <Medal className='w-4 h-4 text-amber-500' />
          <span className='text-xs font-medium text-slate-500'>{c.cashier_name}</span>
          <span className='text-[9px] uppercase font-bold text-slate-400'>{c.role}</span>
        </div>
        <div className='flex flex-col items-end leading-tight'>
          <span className='text-[10px] text-slate-500'>{c.total_transactions} trx</span>
          <span className='text-xs font-bold text-slate-800'>{currencyFormat(c.total_revenue)}</span>
        </div>
      </div>
    ))}
  </PipelineCard>
) : null}
```

- Klik baris → **`/report/cashier/<cashier_id>`** (langsung ke halaman detail baru, tab default).
- Opsional: toggle metrik (`revenue`/`transactions`/`aov`) → panggil `get({ periode, metric })`. Endpoint sudah menerima `metric`; tanpa toggle, urutan default `revenue`.
- Type baru di `src/services/types/dashboard.ts`:
  ```ts
  export interface TopCashier {
    cashier_id: string;
    cashier_name: string;
    role: string;
    total_transactions: number;
    total_revenue: number;
    aov: number;
  }
  // DashboardData: + top_cashiers?: TopCashier[]
  ```
- `cashier_performance` di `DashboardData` sudah tidak dipakai & tidak dikirim backend — hapus (dead type).

**c. Widget "Live Cashier Map" (khusus mitra).**

Backend sudah menyediakan `cashier_live_map` di response `/dashboard` — jadi peta bisa langsung dirender di dashboard tanpa call tambahan. Isinya **hanya operator dengan session `opened`** (sedang bertugas), plus `status` recency device (`online`/`stale`/`offline`), `battery_health`, dan `last_seen`.

Rencana:
- Ekstrak komponen **`CashierLiveMap`** reusable dari `src/pages/reports/CashierMaps.tsx` (init mapbox, draw trail + marker, popup) — terima props `items: CashierMapRow[]`. Halaman `CashierMaps.tsx` tetap bisa memakainya (opsional; kalau tidak, cukup dipakai widget dashboard).
- Karena `mapbox-gl` besar, **lazy-load** widget di `Dashboard.tsx` lewat `React.lazy` + `Suspense` (sama seperti pola route `/report/cashier-maps`), supaya bundle dashboard tidak membengkak.
- Warna marker per `status`: `online` hijau, `stale` kuning, `offline` abu. Marker terakhir dapat penanda "Posisi Terakhir". Isi popup: nama, role, `last_seen`, `battery_health`, `total_charges` session berjalan — opsional link ke `/report/cashier/<cashier_id>`.
- Gate render dari **data**: `data?.cashier_live_map?.length` (backend sudah mengosongkan untuk non-mitra).
- Type: reuse `CashierMapRow` yang sudah ada di `src/services/types/reports.ts`; tambahkan field baru (`role`, `session_id`, `started_at`, `battery_health`, `last_seen`, `status`) yang sebelumnya belum ada di tipe FE.
- Auto-refresh: dashboard sudah fetch per `periode`; widget live idealnya refresh sendiri tiap ~1 menit (`setInterval`) mengikuti pola di `CashierMaps.tsx`. Catatan: `/dashboard` bukan endpoint ringan, jadi kalau mau polling, pertimbangkan refetch khusus widget dari `/report/cashier-maps` ketimbang seluruh dashboard — putuskan saat implementasi.

**d. `CashierMaps.tsx` ("Outlet Maps") juga kena drift.**
Halaman ini masih menganggap list berisi **semua** user outlet, padahal backend sekarang hanya mengembalikan operator dengan session `opened`. Efeknya list jadi kosong kalau tidak ada kasir yang sedang sesi. Sekalian pakai field baru (`status` + warna recency, `battery_health`, `last_seen`) supaya konsisten dengan widget dashboard.

---

## File yang diubah / ditambah

| # | File | Aksi |
|---|---|---|
| 1 | `src/services/types/reports.ts` | + `CashierReportRow`, `CashierReportSummary`; perluas `CashierMapRow` (`role, session_id, started_at, battery_health, last_seen, status`) |
| 2 | `src/services/report/api.tsx` | + `getCashierReport`, `getCashierReportSummary` + export `useLazyGetCashierReportQuery`, `useLazyGetCashierReportSummaryQuery` |
| 3 | `src/pages/reports/sections/types.ts` | **new** `ReportSectionProps` |
| 4–10 | `sections/{ProductSales,ProductItem,CancelledSales,Outstanding,CashControl,Settlement,SaldoMembership}Section.tsx` | **new** |
| 11 | `src/pages/reports/sections/index.ts` | **new** barrel |
| 12–18 | `table/{product-sales,product-item,cancelled-sales,outstanding,cash-control,settlement,saldo-membership}.config.tsx` | tambah/merge `lockedFilter` (aditif, non-breaking) |
| 19 | `src/pages/reports/table/cashier.config.tsx` | **new** |
| 20 | `src/pages/reports/table/cashier.filter.tsx` | **new** |
| 21 | `src/pages/reports/CashierList.tsx` | **new** |
| 22 | `src/pages/reports/CashierDetail.tsx` | **new** |
| 23 | `src/pages/reports/index.ts` | export `CashierList`, `CashierDetail` |
| 24 | `src/routes/index.tsx` | + 2 route |
| 25 | `src/components/layout/AuthorizedLayout.tsx` | + menu item (label dinamis) |
| 26 | `src/pages/Dashboard.tsx` | hapus kartu "Penarikan Terbaru"; + widget Top Kasir + Live Cashier Map (mitra) |
| 27 | `src/services/types/dashboard.ts` | − `WithdrawalTerbaru`, − `cashier_performance`; + `TopCashier`, + `DashboardData.top_cashiers`, + `DashboardData.cashier_live_map` |
| 28 | `src/components/app/CashierLiveMap.tsx` | **new** — komponen peta reusable (di-lazy-load) |
| 29 | `src/pages/reports/CashierMaps.tsx` | pakai komponen + field baru (status/battery/last_seen) |
| 30 | `src/services/dashboard/api.tsx` (opsional) | dukung param `metric` bila toggle metrik dibuat |

**Tidak ada** file yang dihapus/dirombak besar. 7 halaman report standalone tidak diubah.
Tidak ada perubahan backend (semua sudah disiapkan backend). Tidak ada dependency baru (`mapbox-gl` sudah terpasang).

---

## Urutan implementasi

1. Types + API (`reports.ts`, `report/api.tsx`).
2. `sections/` (types, 7 section, barrel).
3. Update 7 `*.config.tsx` untuk `lockedFilter` — cek cepat halaman report lama masih normal.
4. `cashier.config.tsx` + `cashier.filter.tsx` + `CashierList.tsx`.
5. `CashierDetail.tsx` (summary + tab + periode global).
6. Routes + menu + barrel export.
7. Penyesuaian Dashboard (hapus "Penarikan Terbaru" + widget Top Kasir + Live Cashier Map mitra; ekstrak `CashierLiveMap`).
8. Rapikan `CashierMaps.tsx` pakai komponen + field baru.
9. `npm run lint` + `npm run build`, tes manual, lalu commit & push.

---

## Verifikasi

1. `npm run lint` dan `npm run build` (tsc -b + vite build) clean.
2. **Cek ringan report existing** (hanya karena `*.config.tsx` tersentuh): buka Product Sales, Product Item, Penjualan Dibatalkan, Outstanding, Settlement, Cash Control, Saldo Membership → tampilan, kartu summary, filter, download XLSX, dan row click **sama seperti sebelumnya**. Tidak ada refactor di halamannya, jadi ini konfirmasi cepat saja.
3. **List**: `/report/cashier` → baris termasuk role `cashier` **dan** `manager`; filter date range + role jalan; search jalan; kartu summary = agregat; tombol download menghasilkan XLSX.
4. **Detail**: klik baris → `/report/cashier/<id>?start_date=&end_date=` → header nampilkan nama + role, kartu Summary Cashier terisi.
5. Tiap tab memuat tabel + kartu ringkasan report-nya, terfilter `cashier_id` dan periode global; ganti periode global → tab aktif reload dengan periode baru; reload halaman tetap konsisten (state dari URL).
6. Tab Settlement tetap pakai YearPicker tahunan sendiri dan terfilter `cashier_id`.
7. Recap: jumlah `omzet` semua kasir di list ≈ Omzet dashboard periode sama (manager ikut kehitung).
8. Menu: brand `mitra` → label "Laporan Mitra"; brand `outlet` → "Laporan Kasir".
9. **Dashboard**: brand `mitra` → widget Top Kasir + Live Cashier Map muncul; brand non-mitra → tidak muncul; kartu "Penarikan Terbaru" hilang di kedua tipe brand; tidak ada type/import nyangkut.
10. **Live map**: marker hanya operator session `opened`; warna ikut `status` (online/stale/offline); popup menampilkan `last_seen` + `battery_health`; bundle dashboard tetap ramping (widget di-lazy-load).
11. **Role gating**: login sebagai `cashier` → list kasir & live map hanya berisi baris dirinya sendiri; login `manager`/owner → semua operator outlet.
12. **`CashierMaps.tsx`**: list mengikuti perilaku baru (hanya session `opened`) dan menampilkan status/battery/last_seen.

## Catatan / trade-off

- **Section shell ada 2 salinan** (halaman lama + section baru) sampai halaman lama dimigrasi. Ini harga dari opsi tengah: kerja lebih sedikit & nol risiko, tapi belum benar-benar single-source. Follow-up: migrasi 7 halaman standalone ke `sections/` kapan-kapan, lalu hapus duplikasinya.
- `tableName` tiap section **wajib** eksplisit dari pemanggil (`cashier_detail_*`) supaya tidak menabrak state redux halaman lama.
- Filter tanggal per-tab disembunyikan di konteks detail (pakai periode global) supaya tidak ada dua sumber tanggal. Filter non-tanggal (catalog/tife-status) belum tampil di tab detail.
- Detail memakai `/report/cashier?cashier_id=` (bukan `/summary`) agar identitas + metrik didapat sekali jalan; `/summary` dipakai halaman list.
- Kolom list tidak `sortable` karena backend mengabaikan `order_by`.
- Kalau ternyata perlu drill-down settlement per-kasir dari tab, halaman `SettlementDaily` belum menerima `cashier_id` — di luar scope, catat sebagai follow-up.
- `withdrawal_terbaru` sudah **dihapus** dari backend, jadi kartu dashboard-nya harus ikut dihapus (bukan cuma dikosongkan) supaya tidak jadi dead code.
- Widget Top Kasir & Live Map gate-nya dari **data**, bukan dari `brand.type` di FE: backend hanya mengisi `top_cashiers`/`cashier_live_map` untuk mitra, jadi cukup cek `data?.top_cashiers?.length` / `data?.cashier_live_map?.length`.
- **Live Cashier Map bukan call baru**: datanya sudah ikut di response `/dashboard` (`cashier_live_map`). Tapi kalau widget mau auto-refresh cepat, sebaiknya refetch ke `/report/cashier-maps` (endpoint ringan) ketimbang polling `/dashboard` yang berat.
- `mapbox-gl` besar → widget live map wajib di-lazy-load supaya tidak masuk bundle utama dashboard.
- **`CashierMaps.tsx` sekarang drift** dengan backend: list-nya kini hanya berisi session `opened`, bukan semua user outlet. Perlu disesuaikan sekalian (atau minimal diberi empty-state yang jelas).
