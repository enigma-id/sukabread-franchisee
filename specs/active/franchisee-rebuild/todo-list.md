# Implementation Todo List: Franchisee Web App v2

**Task ID:** franchisee-rebuild
**Created:** 2026-05-06
**Status:** In Progress

---

## Progress Log

| Date | Phase | Items Done | Remaining | Blockers |
|------|-------|------------|-----------|----------|
| 2026-05-06 | Init | 0 | 68 | None |
| 2026-05-06 | Phase 1–6 | 62 | 6 | None |

---

## Phase 1: Foundation ✅

### 1.1 Project Scaffolding
- [x] Run `npm create vite@latest franchisee-v2 -- --template react-ts`
- [x] Install core deps: `@reduxjs/toolkit react-redux react-router-dom`
- [x] Install data deps: `@tanstack/react-table recharts`
- [x] Install UI deps: `tailwindcss @tailwindcss/forms @headlessui/react`
- [x] Install build deps: `vite-plugin-pwa`
- [x] Configure `tsconfig.json` — strict: true, paths: `@/*`
- [x] Configure `vite.config.ts` — path aliases, PWA plugin
- [x] Configure Tailwind v4 — CSS-first `@theme` in `src/index.css`, `@tailwindcss/vite` plugin
- [x] Create `src/main.tsx` — Provider wrapping (Redux, Router)
- [x] Create `src/App.tsx` — Root layout with Router outlet

### 1.2 Base API Layer & Types
- [x] Create `src/types/auth.ts` — User, LoginRequest, LoginResponse
- [x] Create `src/types/sales.ts` — Session, Order, OrderItem, PaymentMethod, Category, Topup
- [x] Create `src/types/reports.ts` — DailySales, OutstandingBill, Settlement, SettlementSummary, ItemSales
- [x] Create `src/types/cash.ts` — CashControl, CashOverview, CashSessionData
- [x] Create `src/types/user.ts` — ManagedUser (id, name, username, is_active, is_supervisor, last_login_at)
- [x] Create `src/types/api.ts` — ApiResponse<T>, PaginatedResponse<T>, ApiError (merged into auth.ts)
- [x] Create `src/store/index.ts` — configureStore with auth + api slices
- [x] Create `src/store/api/index.ts` — RTK Query createApi with:
  - fetchBaseQuery + JWT prepareHeaders
  - 401 response → dispatch(signOut)
  - File download intercept (octet-stream / text/csv)

### 1.3 Auth Slice & Persistence
- [x] Create `src/store/slices/authSlice.ts`:
  - State: user, token, authenticated, isLoading, isInitialized
  - Actions: setCredentials, setInitialized, signOut, setLoading
  - Persist token/user to localStorage key `__frut`
  - Restore from localStorage on slice init
  - Fix: `PayloadAction` imported as `import type` (RTK v2 + rolldown)
- [x] Wire auth endpoints in `src/store/api/index.ts` — login, getMe, updateProfile
- [x] Wire auth initialization in App.tsx:
  - On mount: if token → call getMe → setCredentials or signOut
  - Show loading screen until resolved

### 1.4 App Layout Shell
- [x] Create `src/layouts/AuthorizedLayout.tsx`:
  - Sidebar + main content grid
  - Responsive sidebar collapse (< 768px)
  - Menu: Penjualan, Stok, Laporan (sub), Cash Control, Purchase, Pengaturan (sub)
  - Active route highlighting via NavLink isActive
  - User info + sign out at bottom
- [x] Create `src/layouts/UnauthorizedLayout.tsx`:
  - Centered login form container
- [x] Create `src/components/ui/LoadingScreen.tsx` — Full-screen loading with Loader2 spinner

### 1.5 Route Configuration
- [x] Create `src/routes/ProtectedRoute.tsx` — redirect /login if !authenticated
- [x] Create `src/routes/index.tsx` — createBrowserRouter with all 14+ routes:
  - `/` → redirect to `/sales/session`
  - `/login` → Login (UnauthorizedLayout)
  - `/sales/session` → SessionList
  - `/sales/session/:id` → SessionDetail
  - `/sales/session/:id/order/:orderId` → OrderDetail
  - `/stock` → Stock
  - `/report/sales/daily` → DailySales
  - `/report/sales/outstanding` → OutstandingBills
  - `/report/sales/payment` → SettlementMonthly
  - `/report/sales/payment/daily` → SettlementDaily
  - `/report/sales/item` → ItemSales
  - `/cash/control` → CashControl
  - `/purchase` → Purchase
  - `/setting/user` → UserList
  - `/setting/user/create` → UserCreate
  - `/setting/user/:id/update` → UserUpdate
  - `/auth/me` → Profile
  - `*` → redirect to `/sales/session`

---

## Phase 2: Authentication Pages ✅

### 2.1 Login Page
- [x] Create `src/pages/Login.tsx`:
  - Username + password form fields
  - Submit → loginMutation via RTK Query
  - Field-level validation error display
  - Loading state on button
  - On success → navigate('/sales/session')
  - Redirect if already authenticated

### 2.2 Profile Page
- [x] Create `src/pages/Profile.tsx`:
  - Name + Username: disabled/read-only inputs
  - Password Baru + Konfirmasi Password: editable
  - Validate password match
  - Submit → updateProfileMutation via RTK Query
  - Success notification
  - Field-level validation error display

---

## Phase 3: Sales Module ✅

### 3.1 Shared UI Components
- [x] Create `src/components/ui/StatusBadge.tsx` — status string → colored badge
- [x] Create `src/components/ui/CurrencyText.tsx` — number → `1,234.56` display
- [x] Create `src/components/ui/DateRangePicker.tsx` — end date +1 day normalization (BR-015)
- [x] Create `src/components/ui/EmptyState.tsx` — "Tidak ada data" with Inbox icon
- [x] Create `src/components/ui/PageHeader.tsx` — title + optional action slot
- [x] Create `src/utils/format.ts`:
  - `formatCurrency(n)` → `1,234.56`
  - `formatDate(d)` → `DD/MM/YYYY`
  - `formatDateTime(d)` → `DD/MM/YYYY HH:mm`
  - `formatTime(d)` → `HH:mm`
  - `isOngoing(d)` → boolean (sentinel `0001-01-01T00:00:00Z`)
  - `isNeverLoggedIn(d)` → boolean (same sentinel)
  - `displayPaymentMethod(name)` → uppercase, null = "CASH"
  - `addOneDay(d)` / `toInputDate(d)` / `fromInputDate(s)` helpers
- [ ] Create `src/components/ui/DataTable.tsx` — TanStack Table wrapper with pagination *(pending)*
- [ ] Create `src/components/ui/SelectCashier.tsx` — searchable user dropdown *(pending)*

### 3.2 RTK Query — Sales Endpoints
- [x] Sales endpoints in `src/store/api/index.ts`:
  - `getSessions`: GET /sales/session (pagination + date_range filter)
  - `getSession`: GET /sales/session/:id
  - `getOrder`: GET /sales/order/:id

### 3.3 Session List Page
- [x] Create `src/pages/sales/SessionList.tsx`:
  - Date range filter (DateRangePicker)
  - Table: Date, Kasir (uppercase), No Session, Awal/Akhir Session, Total Transaksi, Status
  - Akhir Session → "(Ongoing)" if sentinel (BR-001)
  - Status → StatusBadge
  - Row action → /sales/session/:id

### 3.4 Session Detail Page
- [x] Create `src/pages/sales/SessionDetail.tsx`:
  - 6 info panels: Session, Cash, Sales, Pembayaran, Kategori, Topup
  - Cash payments: null name → "Cash" (BR-002)
  - Sales: after-discount calc (BR-006)
  - Transaksi table with row click → OrderDetail
  - Back button

### 3.5 Order Detail Page
- [x] Create `src/pages/sales/OrderDetail.tsx`:
  - Items table with "+" prefix for add-ons (BR-003)
  - Note section
  - Pricing: Discount only if > 0 (BR-004), Service only if true (BR-005)
  - Payment/channel uppercase, null → "CASH"
  - Back button

---

## Phase 4: Reports Module ✅

### 4.1 RTK Query — Report Endpoints
- [x] Report endpoints in `src/store/api/index.ts`:
  - `getDailySales`, `getOutstandingBills`, `getOutstandingSummary`
  - `getSettlement`, `getSettlementSummary`, `getItemSales`, `getCashControl`

### 4.2 Daily Sales Page
- [x] Create `src/pages/reports/DailySales.tsx` — table: Tanggal, Total Order (currency)

### 4.3 Outstanding Bills Page
- [x] Create `src/pages/reports/OutstandingBills.tsx`:
  - Summary card: TOTAL CHARGES
  - Date range filter with +1 day normalization
  - Download button
  - Table: Code, Tanggal, Kasir (upper), Bill Names, Customer, Total Charges

### 4.4 Settlement Monthly Page
- [x] Create `src/pages/reports/SettlementMonthly.tsx`:
  - Filters: year picker + cashier
  - Summary cards (dynamic payment types)
  - Dynamic payment method columns
  - Values > 0 bold, = 0 → "–"
  - Download button
  - Drill-down → /report/sales/payment/daily?month={period}

### 4.5 Settlement Daily Page
- [x] Create `src/pages/reports/SettlementDaily.tsx`:
  - Read `month` from query — missing → redirect to monthly
  - Cashier filter
  - Summary cards
  - Dynamic payment columns
  - Download button

### 4.6 Item Sales Page
- [x] Create `src/pages/reports/ItemSales.tsx` — table: Nama (uppercase), Total Sold

---

## Phase 5: Settings & Misc ✅

### 5.1 RTK Query — User Endpoints
- [x] User endpoints in `src/store/api/index.ts`:
  - `getUsers`, `getUser`, `createUser`, `updateUser`, `activateUser`, `deactivateUser`

### 5.2 User List Page
- [x] Create `src/pages/settings/UserList.tsx`:
  - Table: Nama, Username, Login Terakhir, Status, Actions
  - Login Terakhir: formatted or "–" if sentinel (BR-008)
  - Status: supervisor → checkmark; self → "–"; else → toggle switch (BR-007)
  - Toggle → activate/deactivate API
  - Actions dropdown hidden for current user
  - "Buat User" button

### 5.3 User Create Page
- [x] Create `src/pages/settings/UserCreate.tsx`:
  - Form: Nama, Username, Password, Konfirmasi Password
  - All required, password match validation
  - Submit → createUser → redirect /setting/user
  - Field-level validation errors

### 5.4 User Update Page
- [x] Create `src/pages/settings/UserUpdate.tsx`:
  - Name + Username read-only (disabled)
  - Password + Konfirmasi optional
  - Submit → updateUser → redirect /setting/user

### 5.5 Cash Control Page
- [x] Create `src/pages/cash/CashControl.tsx`:
  - Filters: DateRangePicker (start_at/end_at individual, BR-016)
  - 4 overview metric cards
  - Session table: Session, Cashier (upper), cash fields, Status

### 5.6 Purchase Page
- [x] Create `src/pages/Purchase.tsx`:
  - useEffect → window.open with username param, renders null

### 5.7 Stock Stub Page
- [x] Create `src/pages/Stock.tsx` — placeholder stub

---

## Phase 6: Polish

### 6.1 App Boot Flow ✅
- [x] Full bootstrap in App.tsx: token check → getMe → setCredentials / signOut / setInitialized
- [x] Loading screen while resolving

### 6.2 PWA Setup ✅
- [x] Configure vite-plugin-pwa in vite.config.ts (autoUpdate, manifest, icons defined)
- [ ] Create PWA icon assets: `pwa-192x192.png`, `pwa-512x512.png` *(pending)*
- [ ] Test installability in Chrome *(pending)*

### 6.3 Environment Variables ✅
- [x] Create `.env.example` with `VITE_API_BASE_URL`
- [x] Create `.env` with `VITE_API_BASE_URL=http://localhost:8080`
- [x] Use `import.meta.env.VITE_API_BASE_URL` in baseQuery

### 6.4 Final Verification
- [x] `tsc --noEmit` — zero errors
- [x] `vite build` — 421KB JS / 22KB CSS (gzip: 127KB / 5KB) ✅
- [ ] All 14 routes reachable and functional *(runtime verification pending)*
- [ ] All 20 business rules verified *(runtime verification pending)*
- [ ] Test date filter +1 day normalization
- [ ] Test session ongoing sentinel display
- [ ] Test payment method null → CASH display
- [ ] Test add-on item "+" prefix
- [ ] Test user self-management restrictions
- [ ] Test download functionality
- [ ] Test settlement monthly → daily drill-down

---

## Pending Items Summary (6 remaining)

| # | Item | Phase | Note |
|---|------|-------|------|
| 1 | `DataTable.tsx` — TanStack Table wrapper | 3.1 | Currently using plain HTML tables |
| 2 | `SelectCashier.tsx` — searchable user dropdown | 3.1 | Currently omitted from filter UIs |
| 3 | PWA icon assets (192×192, 512×512 PNG) | 6.2 | Referenced in manifest, files missing |
| 4 | Chrome installability test | 6.2 | Post-icon creation |
| 5 | Runtime route & business rule verification | 6.4 | Needs dev server + backend |
| 6 | Download functionality smoke test | 6.4 | Needs backend |

---

*Todo list updated 2026-05-06 — 62/68 items complete (91%)*
