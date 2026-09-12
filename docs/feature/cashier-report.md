# Laporan Kasir / Mitra (per-Operator) — Franchisee FE

**Status:** Planned
**Scope:** `franq-franchisee` (frontend)

## Tujuan

Nambah menu **Laporan Kasir** (di brand `mitra` labelnya **Laporan Mitra**) dengan:

- **List page** — tabel per-operator dari `GET /report/cashier` + kartu summary `GET /report/cashier/summary`, ada aksi ke detail.
- **Detail page** — Summary Cashier + 7 **Tab Laporan existing** (Penjualan Harian, Penjualan Menu, Outstanding Bills, Penjualan Dibatalkan, Cash Control, Settlement, Saldo Membership).
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
  - `cashier_live_map` — posisi device terakhir **semua** operator outlet (tanpa syarat punya sesi aktif). Item `CashierDeviceItem`:
    `cashier_id, cashier_name, last_activity_at, last_battery_health, last_latitude, last_longitude`.
    Recency device (`online`/`stale`/`offline`) **diturunkan di FE** dari `last_activity_at` (`deviceStatusFromTime`) — backend tidak lagi mengirim `status`/`role`/`last_seen`.
  - `withdrawal_terbaru` **dihapus** dari response (`DashboardFranchisePortal`).
- **Proxy franchisor** (untuk portal franchisor, bukan franchisee): `GET /report/franchise/cashier`(+`/summary`) + permission `frontend.franchisor.report.mitra.cashier`. Tidak dipakai FE ini.
- Doc backend: `franq/docs/feature/outlet-dashboard-and-cashier-report.md`.

## Keputusan (hasil diskusi)

1. **7 tab inti**: Penjualan Harian, Penjualan Menu, Outstanding Bills, Penjualan Dibatalkan, Cash Control, Settlement, Saldo Membership (label = judul halaman report-nya). Plus tab **Mitra Maps** dan gating per brand — lihat §4.
2. **Opsi tengah (dipilih)**: bikin komponen **section reusable** khusus dipakai halaman detail + tab. **7 halaman report standalone TIDAK disentuh** — nol risiko regresi. Migrasi halaman lama ke section diserahkan ke PR terpisah (follow-up). Lihat *Arsitektur §1*.
3. **Semua tipe brand**, label menu dinamis: `mitra` → "Laporan Mitra", lainnya → "Laporan Kasir".
4. **Filter per tab**: tiap tab di halaman detail merender filter milik laporannya sendiri (bukan satu date-range global di header), karena tiap laporan filternya beda. Periode dari halaman list dipakai sebagai nilai awal.
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

### 4. Halaman Detail — Tab + filter per tab

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

- **Summary Cashier** pakai `GET /report/cashier?cashier_id=` (1 request, sekaligus dapat `cashier_name/status` untuk header) — 5 kartu: Omzet, Transaksi, Total Outstanding, Total Sesi, Dibatalkan. Kartu **AOV dihapus** (dianggap ambigu). `/report/cashier/summary` dipakai di halaman **list**. Subtitle header hanya menampilkan `status` operator (`Online`/`Offline`) — role & outlet tidak ditampilkan.
- **Filter ada di dalam masing-masing tab** (bukan di header) — karena tiap laporan punya filter berbeda: Penjualan Harian punya catalog + tanggal, Saldo Membership punya tipe + status + tanggal, Settlement punya YearPicker tahunan, sisanya rentang tanggal. Setiap tab merender komponen filter miliknya sendiri dengan `tableName` terpisah, jadi filternya tidak saling mengganggu.
- Periode dari halaman list tetap dipakai sebagai **nilai awal**: `sectionFilter` = `{ start_date, end_date }` (atau `{ periode: <tahun dari start_date> }` untuk Settlement) dioper lewat prop `filter`.
- **Gate tab per brand** (`brand: "all" | "outlet" | "mitra"`), cermin gating menu sidebar:
  - `saldo-log` (Saldo Membership) → hanya brand **outlet**.
  - `mitra-maps` (Mitra Maps) → hanya brand **mitra**.
  - Sisanya `all`. Tab yang tidak relevan tidak dirender; kalau `?tab=` menunjuk tab yang tersaring, otomatis jatuh ke tab pertama.
- **Tab "Mitra Maps"** memakai section `sections/CashierMapsSection.tsx`: fetch `/report/cashier-maps?cashier_id=<id>` (satu baris per **sesi**, `opened` maupun `closed`), auto-refresh 1 menit, dropdown **pilih sesi**, render `CashierLiveMap`, plus ringkas omset/battery/rentang sesi. Komponen ini **di-lazy-load** (`React.lazy` + `Suspense`) dan **tidak** diekspor dari barrel `sections/` supaya `mapbox-gl` tidak ikut ke bundle utama — terverifikasi muncul sebagai chunk `CashierMapsSection-*.js` terpisah.
- **Tab**: label disamakan dengan judul halaman report masing-masing (mis. "Penjualan Menu", bukan "Product Item"). Implementasinya tab bar inline (bukan komponen `Tabs` — root-nya `overflow-hidden` dan bakal memotong dropdown filter yang tidak pakai portal). Item tab hanya mengubah search param `tab`; section aktif dirender di bawahnya.

```tsx
const TABS = [
  { value: "product-sales", label: "Penjualan Harian", Section: ProductSalesSection, brand: "all" },
  { value: "product-item",  label: "Penjualan Menu",   Section: ProductItemSection, brand: "all" },
  { value: "outstanding",   label: "Outstanding Bills", Section: OutstandingSection, brand: "all" },
  { value: "cancel-order",  label: "Penjualan Dibatalkan", Section: CancelledSalesSection, brand: "all" },
  { value: "cash-control",  label: "Cash Control",    Section: CashControlSection, brand: "all" },
  { value: "settlement",    label: "Settlement",      Section: SettlementSection, brand: "all" },
  { value: "saldo-log",     label: "Saldo Membership", Section: SaldoMembershipSection, brand: "outlet" },
  { value: "mitra-maps",    label: "Mitra Maps",      Section: CashierMapsSection, brand: "mitra" },
];

const active = TABS.find((t) => t.value === activeTab) ?? TABS[0];

// Nilai awal filter tiap tab (dari periode halaman list). Filter selengkapnya
// dirender masing-masing section di dalam tab.
const sectionFilter = useMemo(
  () =>
    active.value === "settlement"
      ? startDate
        ? { periode: startDate.slice(0, 4) }
        : {}
      : { start_date: startDate, end_date: endDate },
  [active.value, startDate, endDate],
);

<Page.Header category="Report" title={`${isMitra ? "Laporan Mitra" : "Laporan Kasir"} — ${cashier?.cashier_name ?? ""}`} backTo={() => navigate(-1)} />
<Page.Body>
  <CashierSummaryCards data={cashier} />                     {/* kartu Summary Cashier */}

  {/* tab bar inline (bukan komponen Tabs — lihat catatan di bawah) */}
  <div className="...">
    {TABS.map((tab) => <button onClick={() => setQuery({ tab: tab.value })}>{tab.label}</button>)}
  </div>

  <active.Section
    key={`${active.value}-${id}`}
    tableName={`cashier_detail_${id}_${active.value}`}
    lockedFilter={{ cashier_id: id }}
    filter={sectionFilter}
  />
</Page.Body>
```

`tableName` per tab (`cashier_detail_<id>_<tab>`) supaya tidak bentrok state dengan halaman standalone. Filter di-render oleh section-nya sendiri (`showFilter` default `true`), jadi tiap tab punya kontrol yang sesuai laporannya.

### 5. Halaman List

`src/pages/reports/CashierList.tsx` — pola `CashControl.tsx`:

- `createTableConfig({ onRowClick: (row) => navigate(`/report/cashier/${row.cashier_id}?start_date=${start}&end_date=${end}`) })`
- `useTable("report_cashier", config)` (url `/report/cashier`)
- `OverviewCards` dari `GET /report/cashier/summary` (trigger effect dgn filter locked+filter+search, pola `CashControl.tsx`)

`table/cashier.config.tsx` (url `/report/cashier`), kolom (urut kunci = urut kolom), semua `sortable: false` (backend abaikan `order_by`):
`cashier_name` "Kasir" · `status` "Status" (Badge — `Online` hijau, selain itu default) · `total_sales` "Transaksi" · `omzet` "Omzet" (currencyFormat, kanan) · `total_outstanding` "Outstanding" · `outstanding_amount` "Total Outstanding" (currencyFormat) · `total_session` "Total Sesi" · `cancelled_count` "Dibatalkan" · `action` (ChevronRight). Kolom AOV dihapus (dianggap ambigu di level daftar).

Bentuk baris `ReportCashier` (terbaru): `cashier_id, cashier_name, status, total_sales, omzet, total_outstanding, outstanding_amount, total_session, aov, cancelled_count`. Field `role`, `username`, `outlet_id`, `outlet_name`, dan `active_session` **sudah tidak dikirim** backend; `status` (`"Online"`/`"Offline"`, dari ada-tidaknya sesi `opened`) menggantikan `active_session`. Kolom Role/Username/Outlet tidak ditampilkan.

`table/cashier.filter.tsx` — pola `saldo-membership.filter.tsx` (`TableFilters` + `DatePicker`): hanya filter **rentang tanggal**. Filter Role dihapus karena kolom Role tidak ada. Search sudah dari `Table.Tools`.

Kartu summary list (`CashierReportSummary`): Total Operator (`total_cashier`), Total Transaksi (`total_sales`), Total Omzet (`total_omzet`), Kasir Aktif (`active_cashier`).

### 6. Menu & routes

`src/routes/index.tsx`:

```tsx
<Route path="/report/cashier" element={<CashierList />} />
<Route path="/report/cashier/:id" element={<CashierDetail />} />
```

(import dari `@/pages/reports` barrel.)

`src/components/layout/AuthorizedLayout.tsx` — item **paling atas** di section "Laporan":

```tsx
{
  label: type === "mitra" ? "Laporan Mitra" : "Laporan Kasir",
  path: "/report/cashier",
  icon: <UsersRound size={16} />,
},
```

Urutan section "Laporan" setelah perubahan: **Laporan Mitra/Kasir** → Penjualan Harian → Penjualan Menu → Penjualan Dibatalkan → Outstanding Bills → Settlement → Cash Control → (Saldo Membership khusus `outlet`) → (Mitra Maps khusus `mitra`).

Wording menu **diselaraskan dengan judul halaman** masing-masing: "Product Sales" → **Penjualan Harian**, "Product Item" → **Penjualan Menu**, "Outstanding" → **Outstanding Bills**.

Catatan: active-state menu cek segmen path terakhir, jadi saat di halaman detail (`/report/cashier/<uuid>`) item ini tidak ter-highlight — sama seperti detail page existing lainnya.

### 6b. Filter kasir di halaman Laporan existing

Semua 7 halaman Laporan dapat filter **Kasir** lewat komponen baru `SelectCashier` (`src/components/ui/select-cashier`) — reuse `RemoteSelect` + `GET /user` (backend sudah membatasi ke role `cashier`/`manager` dan outlet sesi). Nilainya adalah `cashier_id` yang memang sudah diterima ketujuh endpoint report. **Tanpa label** (mengikuti input lain seperti catalog/date range di halaman yang sama); placeholder "Semua Kasir". Grid filter memakai `items-end` supaya input tanpa label tetap sejajar dengan field yang berlabel.

- **Filter inline (bukan dropdown)**: Penjualan Harian, Penjualan Menu, Penjualan Dibatalkan, Outstanding, Cash Control, Saldo Membership. Kontrol filter tampil langsung di toolbar tabel — tidak ada tombol/panel "Filter Options" yang harus diklik dulu, dan **tanpa label** (select/date pakai placeholder). Jumlah kolom grid menyesuaikan field yang kelihatan — saat kasir disembunyikan (drill-down) kolomnya ikut berkurang, jadi tidak ada slot/track kosong.
- **Auto-apply**: tiap kontrol langsung memanggil `table.filter(...)` saat berubah — **tanpa tombol "Apply Filter" maupun "Clear"**. Reset dilakukan dengan mengosongkan kontrolnya (pilih "All" / clear date). Select/Remoteselect apply begitu dipilih/di-clear; rentang tanggal baru apply saat dua sisi terisi (atau dua-duanya dikosongkan) supaya tidak fetch setengah filter.
- **Kelas input seragam**: semua kontrol filter (RemoteSelect, SelectCashier, DatePicker, YearPicker) memakai `FILTER_INPUT_CLASS` dari `components/ui/table/filter.styles.ts` supaya tampilannya konsisten antar halaman.
- **Inline (tetap)**: Settlement — YearPicker adalah kontrol utama, jadi tidak dibungkus panel; `SelectCashier` diletakkan di sampingnya.
- **Otomatis disembunyikan saat kasir dikunci**: filter membaca `State.lockedFilter.cashier_id`. Di tab detail kasir, field ini hidden supaya tidak bisa diubah dari dalam konteks yang sudah terfilter.
- Nama file `SelectCashier.tsx` sudah dirujuk di rencana lama (audit UI) tapi belum pernah dibuat — sekarang benar-benar ada.

---

## 7. Penyesuaian Dashboard

Backend `GET /dashboard` sudah berubah (lihat *Status backend*), jadi FE harus disesuaikan supaya tidak drift:

**a. Hapus kartu "Penarikan Terbaru".**
Backend sudah tidak mengirim `withdrawal_terbaru`, jadi kartu ini sekarang **selalu** nampilin "Tidak ada penarikan" — misleading. Hapus blok `PipelineCard title='Penarikan Terbaru'` di `Dashboard.tsx`, lalu bersihkan: field `WithdrawalTerbaru` di `DashboardData`, dan import yang jadi tak terpakai (`ArrowUpFromLine`, `dateFormat`).

**b. Widget "Top Kasir" (semua tipe brand).**
Backend mengisi `top_cashiers` untuk **semua tipe brand** (bukan cuma mitra) — hanya `cashier_live_map` yang khusus mitra. Jadi widget ini dirender tanpa gate brand, sebagai kartu ke-4 di grid bento (`md:grid-cols-2 lg:grid-cols-4`). Pakai pola `PipelineCard` yang ada:

```tsx
<PipelineCard title='Top Kasir' icon={Medal} theme={THEMES.green}
              onClick={go("/report/cashier")}>
  {data?.top_cashiers?.length ? (
    data.top_cashiers.map((c) => (
      <div key={c.cashier_id}
           className='flex items-center justify-between cursor-pointer rounded-lg px-1 -mx-1 hover:bg-slate-50'
           onClick={go(`/report/cashier/${c.cashier_id}`)}>
        <div className='flex items-center gap-2 min-w-0'>
          <Medal className='w-4 h-4 text-amber-500 shrink-0' />
          <span className='text-xs font-medium text-slate-500 truncate'>{c.cashier_name}</span>
          <span className='text-[9px] uppercase font-bold text-slate-400'>{c.role}</span>
        </div>
        <div className='flex flex-col items-end leading-tight shrink-0'>
          <span className='text-[10px] text-slate-500'>{c.total_transactions} trx</span>
          <span className='text-xs font-bold text-slate-800'>{currencyFormat(c.total_revenue)}</span>
        </div>
      </div>
    ))
  ) : (
    <CardEmpty />
  )}
</PipelineCard>
```

Operator role `cashier` hanya melihat dirinya sendiri (backend yang membatasi).

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

**c. Widget "Live Mitra" (khusus mitra, full width di paling atas).**

Backend sudah menyediakan `cashier_live_map` di response `/dashboard` — jadi peta bisa langsung dirender di dashboard tanpa call tambahan. Isinya **posisi device terakhir semua operator outlet** (`CashierDeviceItem`: `last_activity_at`, `last_battery_health`, `last_latitude`, `last_longitude`); recency device diturunkan FE dari `last_activity_at`.

- Ditaruh **paling atas, full width**, sebelum Sales Chart. Judul kartu: **"Live Mitra"**. Render hanya kalau `liveMap.length > 0` (backend mengosongkan untuk non-mitra).
- Tinggi peta ~520px + baris chip operator di atasnya untuk memilih operator (marker digambar dari posisi device terakhir tiap operator).
- Komponen **`CashierLiveMap`** diekstrak ke `src/components/app/CashierLiveMap.tsx` (init mapbox, marker per operator, trail operator terpilih, popup) — props `items`, `selectedId`, `onSelect`, `className`. Dipakai bersama dashboard dan halaman `CashierMaps.tsx`.
- Karena `mapbox-gl` besar, widget di `Dashboard.tsx` **lazy-load** via `React.lazy` + `Suspense`. Terverifikasi: build menghasilkan chunk `CashierLiveMap-*.js` terpisah (~1.8 MB) dan main chunk tetap ~897 kB.
- **Marker = satu per titik.** Baris device (dashboard) cuma punya posisi terakhir → satu titik per operator; baris sesi (halaman Mitra Maps) punya `historys` → satu titik per log, jadi perpindahan posisi kelihatan:
  - Titik terkini → radius 12px, warna status device (`online` hijau / `stale` kuning / `offline` abu), opacity 1.
  - Titik sebelumnya → radius **12px (sama)**, warna **biru** (`HISTORY_COLOR`) — sengaja bukan abu-abu supaya tidak ketuker dengan status `offline`, opacity 0.85.
  - **Label nama kasir** di titik terkini (`symbol` layer `cashier-markers-labels`) — jadi jelas pin itu milik operator siapa. Titik sebelumnya tidak diberi label supaya teks tidak menumpuk; `text-allow-overlap: false` membuat mapbox otomatis menyembunyikan label yang bertabrakan. Padding `fitBounds` dibuat lebih besar di bawah agar label tidak terpotong.
  - Garis jejak memakai warna biru yang sama. Legend di pojok kiri bawah mencakup Online/Stale/Offline + "Titik sebelumnya".

**Data per titik (baru di backend).** `DeviceHistoryPoint` sekarang membawa:

| Field | Arti |
|---|---|
| `total_charges` | Omset yang terjadi **selagi device di titik ini** — dari `created_at` titik ini sampai titik berikutnya (atau `finished_at`/`now` untuk titik terakhir). |
| `total_transactions` | Jumlah transaksi pada rentang yang sama. |

Konsekuensinya: **omzet tidak boleh diatribusikan ke posisi terkini saja**. Contoh: operator dengan 2 titik di mana titik pertama 30.000 dan titik terakhir 0 — uangnya masuk di titik pertama. Karena itu popup menampilkan "Transaksi di titik ini" & "Omset di titik ini" (per titik).

Popup berisi: nama kasir, status device (recency) + waktu log, titik ke-n, waktu, battery, transaksi & omset di titik itu, dan koordinat. Role (cashier/manager) **tidak** ditampilkan.

Catatan: titik `uncertain` (terakhir sesi `opened` yang >30 menit tanpa log baru) ditandai `(±)` di popup — omzetnya tetap dihitung.

- Auto-refresh: dashboard ikut `periode`; widget live tidak polling sendiri (menghindari refetch `/dashboard` yang berat) — refresh saat periode berubah / reload.

**d. `CashierMaps.tsx` → "Mitra Maps" (menu & judul halaman).**
Halaman ini memakai **dua endpoint**:
- `/report/cashier-device` → daftar **semua** operator outlet + posisi device terakhirnya (list kiri). Recency (`online`/`stale`/`offline`) diturunkan FE dari `last_activity_at`.
- `/report/cashier-maps?cashier_id=<id>` → satu baris per **sesi** operator terpilih (`opened`/`closed`) + jejak GPS sesi. Ada dropdown **pilih sesi**; peta menggambar jejak sesi yang dipilih (`items={selected ? [selected] : []}`).

Keduanya auto-refresh tiap 1 menit. `CashierLiveMap` dipakai bersama dashboard & tab detail — menerima baris sesi (punya `historys`) maupun baris device (cuma posisi terakhir, digambar satu titik). Wording menu/judul: **"Mitra Maps"**.

---

## File yang diubah / ditambah

| # | File | Aksi |
|---|---|---|
| 1 | `src/services/types/reports.ts` | + `CashierReportRow`, `CashierReportSummary`; perluas `CashierMapRow` (`role, session_id, started_at, battery_health, last_seen, status`) & `CashierMapHistory` (`total_charges`, `total_transactions`) |
| 2 | `src/services/report/api.tsx` | + `getCashierReport`, `getCashierReportSummary` + export `useLazyGetCashierReportQuery`, `useLazyGetCashierReportSummaryQuery` |
| 3 | `src/pages/reports/sections/types.ts` | **new** `ReportSectionProps` |
| 4–10 | `sections/{ProductSales,ProductItem,CancelledSales,Outstanding,CashControl,Settlement,SaldoMembership}Section.tsx` | **new** |
| 11 | `src/pages/reports/sections/CashierMapsSection.tsx` | **new** — tab Mitra Maps (di-lazy-load, tidak lewat barrel) |
| 11b | `src/pages/reports/sections/index.ts` | **new** barrel (tanpa `CashierMapsSection`) |
| 12–18 | `table/{product-sales,product-item,cancelled-sales,outstanding,cash-control,settlement,saldo-membership}.config.tsx` | tambah/merge `lockedFilter` (aditif, non-breaking) |
| 19 | `src/pages/reports/table/cashier.config.tsx` | **new** |
| 20 | `src/pages/reports/table/cashier.filter.tsx` | **new** |
| 21 | `src/pages/reports/CashierList.tsx` | **new** |
| 22 | `src/pages/reports/CashierDetail.tsx` | **new** |
| 23 | `src/pages/reports/index.ts` | export `CashierList`, `CashierDetail` |
| 24 | `src/routes/index.tsx` | + 2 route |
| 25 | `src/components/layout/AuthorizedLayout.tsx` | + menu item (label dinamis) |
| 26 | `src/pages/Dashboard.tsx` | hapus kartu "Penarikan Terbaru"; + widget **Live Mitra** (full width, paling atas) + **Top Kasir** (grid bento) untuk mitra |
| 27 | `src/services/types/dashboard.ts` | − `WithdrawalTerbaru`, − `cashier_performance`; + `TopCashier`, + `DashboardData.top_cashiers`, + `DashboardData.cashier_live_map` |
| 28 | `src/components/app/CashierLiveMap.tsx` | **new** — komponen peta reusable (di-lazy-load) |
| 29 | `src/utils/deviceStatus.ts` | **new** — warna & label status device (online/stale/offline), dipakai map + chip |
| 30 | `src/pages/reports/CashierMaps.tsx` | "Mitra Maps": pakai komponen + field baru, refresh tiap menit, empty-state |
| 31 | `src/components/ui/select-cashier/{types.ts,select-cashier.tsx,index.ts}` | **new** — `SelectCashier` (dropdown operator) |
| 32 | `src/components/ui/index.ts` | export `select-cashier` |
| 33–39 | `table/{product-sales,product-item,cancelled-sales,outstanding,cash-control,settlement,saldo-membership}.filter.tsx` | + filter Kasir/Operator (panel atau inline untuk Settlement) |
| 40 | `src/services/dashboard/api.tsx` (opsional) | dukung param `metric` bila toggle metrik dibuat |

**Tidak ada** file yang dihapus/dirombak besar. 7 halaman report standalone tidak diubah (tampilan/kartu/tabelnya sama; hanya filter yang dapat tambahan).
Tidak ada perubahan backend (semua sudah disiapkan backend). Tidak ada dependency baru (`mapbox-gl` sudah terpasang).

---

## Urutan implementasi

1. Types + API (`reports.ts`, `report/api.tsx`).
2. `sections/` (types, 7 section, barrel).
3. Update 7 `*.config.tsx` untuk `lockedFilter` — cek cepat halaman report lama masih normal.
4. `cashier.config.tsx` + `cashier.filter.tsx` + `CashierList.tsx`.
5. `CashierDetail.tsx` (summary + tab + filter per tab).
6. Routes + menu + barrel export.
7. Penyesuaian Dashboard (hapus "Penarikan Terbaru" + widget Top Kasir + Live Cashier Map mitra; ekstrak `CashierLiveMap`).
8. Rapikan `CashierMaps.tsx` pakai komponen + field baru.
9. `npm run lint` + `npm run build`, tes manual, lalu commit & push.

---

## Verifikasi

1. `npm run lint` dan `npm run build` (tsc -b + vite build) clean.
2. **Cek ringan report existing** (hanya karena `*.config.tsx` tersentuh): buka Product Sales, Product Item, Penjualan Dibatalkan, Outstanding, Settlement, Cash Control, Saldo Membership → tampilan, kartu summary, filter, download XLSX, dan row click **sama seperti sebelumnya**. Tidak ada refactor di halamannya, jadi ini konfirmasi cepat saja.
3. **List**: `/report/cashier` → baris termasuk `status` `Online`/`Offline`; filter rentang tanggal jalan; search jalan; kartu summary = agregat; tombol download menghasilkan XLSX.
4. **Detail**: klik baris → `/report/cashier/<id>?start_date=&end_date=` → header nampilkan nama operator + status (`Online`/`Offline`), kartu Summary Cashier terisi.
5. Tiap tab memuat tabel + kartu ringkasan + **filter milik laporannya sendiri**, terfilter `cashier_id`; nilai awal periode mengikuti halaman list.
6. **Gating tab**: brand `mitra` → hanya tab non-Saldo Membership + tab **Mitra Maps**; brand `outlet` → sebaliknya (tanpa Mitra Maps). Tab Settlement tetap pakai YearPicker tahunan sendiri dan terfilter `cashier_id`.
7. **Tab Mitra Maps** memuat peta posisi operator itu (chunk mapbox terpisah, bukan bundle utama).
8. Recap: jumlah `omzet` semua kasir di list ≈ Omzet dashboard periode sama (manager ikut kehitung).
9. Menu "Laporan": **Laporan Mitra/Kasir tampil paling atas** (sebelum Penjualan Harian); wording menu cocok dengan judul halaman; brand `mitra` → "Laporan Mitra" + Mitra Maps, brand `outlet` → "Laporan Kasir" + Saldo Membership.
10. **Dashboard**: **Top Kasir** muncul di **semua tipe brand** (outlet & mitra), **Live Mitra** hanya brand `mitra` dan posisinya paling atas full width; kartu "Penarikan Terbaru" hilang di kedua tipe brand; kartu Payment Method / Top Member / Top Menu / Peak Hours menampilkan "Belum ada transaksi" saat kosong.
11. **Live map**: marker satu per titik history (semua ukuran sama); titik terkini warna status + label nama kasir, titik sebelumnya biru; popup menampilkan **transaksi & omzet per titik**; bundle dashboard tetap ramping (widget di-lazy-load).
12. **Role gating**: login sebagai `cashier` → list kasir & live map hanya berisi baris dirinya sendiri; login `manager`/owner → semua operator outlet.
13. **`CashierMaps.tsx`** (menu "Mitra Maps"): list kiri = **semua** operator outlet dari `/report/cashier-device` (status recency/battery/aktivitas terakhir); pilih operator → dropdown **pilih sesi** (`/report/cashier-maps`), peta menggambar jejak sesi terpilih.
14. **Filter kasir**: di ketujuh halaman Laporan, pilih satu kasir → tabel + kartu ringkasan ikut terfilter; Clear mengembalikan semua. Di tab detail kasir, field kasir tidak muncul (terkunci).
15. **Label tab detail** = judul halaman report (Penjualan Harian, Penjualan Menu, Outstanding Bills, Penjualan Dibatalkan, Cash Control, Settlement, Saldo Membership, Mitra Maps).

## Catatan / trade-off

- **Section shell ada 2 salinan** (halaman lama + section baru) sampai halaman lama dimigrasi. Ini harga dari opsi tengah: kerja lebih sedikit & nol risiko, tapi belum benar-benar single-source. Follow-up: migrasi 7 halaman standalone ke `sections/` kapan-kapan, lalu hapus duplikasinya.
- `tableName` tiap section **wajib** eksplisit dari pemanggil (`cashier_detail_*`) supaya tidak menabrak state redux halaman lama.
- **Filter per tab di halaman detail**: tiap laporan punya filter sendiri (catalog/tanggal, tipe/status/tanggal, YearPicker), jadi kontrolnya diletakkan di dalam tab, bukan di header. Konsekuensi: mengubah filter di satu tab tidak memengaruhi tab lain, dan saat berpindah tab lalu kembali, filter tab tersebut kembali ke nilai awal dari halaman list.
- Detail memakai `/report/cashier?cashier_id=` (bukan `/summary`) agar identitas + metrik didapat sekali jalan; `/summary` dipakai halaman list.
- Kolom list tidak `sortable` karena backend mengabaikan `order_by`.
- Kalau ternyata perlu drill-down settlement per-kasir dari tab, halaman `SettlementDaily` belum menerima `cashier_id` — di luar scope, catat sebagai follow-up.
- `withdrawal_terbaru` sudah **dihapus** dari backend, jadi kartu dashboard-nya harus ikut dihapus (bukan cuma dikosongkan) supaya tidak jadi dead code.
- **Live Mitra bukan call baru**: datanya sudah ikut di response `/dashboard` (`cashier_live_map`). Widget **tidak** polling sendiri — refresh mengikuti perubahan `periode` / reload — supaya tidak memanggil ulang `/dashboard` (endpoint berat) tiap menit. Kalau nanti butuh benar-benar live, refetch ke `/report/cashier-maps` (endpoint ringan) alih-alih polling dashboard.
- `mapbox-gl` besar → widget Live Mitra wajib di-lazy-load supaya tidak masuk bundle utama dashboard.
- Gate widget Live Mitra memakai `data?.cashier_live_map?.length` (backend hanya mengisi untuk mitra). Top Kasir **tanpa gate brand** karena backend mengisi untuk semua tipe.
- **Filter Settlement tetap inline** (YearPicker + SelectCashier), tidak dibungkus panel — YearPicker adalah kontrol utama halaman itu, sayang kalau disembunyikan di balik dropdown.
- `SelectCashier` memanggil `GET /user` (limit 100) sekali untuk me-resolve nama dari `cashier_id` yang tersimpan, lalu paginasi/search saat dropdown dibuka — jadi filter bisa direstor dari state/URL tanpa kehilangan label.
- **`CashierMaps.tsx` (Mitra Maps)** pakai `/report/cashier-device` untuk daftar operator (semua operator, bukan cuma sesi `opened`) dan `/report/cashier-maps` per sesi untuk peta. Recency device diturunkan di FE (`deviceStatusFromTime`, timestamp WIB) karena backend tidak mengirim `status`/`role`/`last_seen`.
