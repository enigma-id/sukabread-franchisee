# Implementation Tasks: Franchisee Web App v2

**Task ID:** franchisee-rebuild
**Created:** 2026-05-06
**Status:** Ready for Implementation
**Based on:** plan.md + spec.md

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 27 |
| Phases | 5 |
| Estimated Effort | ~13 days |
| Based on | Legacy Vue 2 app reverse-engineering |

---

## Phase 1: Foundation (Days 1-3)

**Goal:** Project scaffolding, auth flow, layout shell, routing.

### Task 1.1: Project Scaffolding

**Description:** Initialize Vite + React 18 + TypeScript project with Tailwind CSS, Redux Toolkit, React Router v6, RTK Query, TanStack Table, Recharts. Configure strict TypeScript, path aliases, PWA plugin.

**Acceptance Criteria:**
- [ ] `npm create vite@latest` with React + TypeScript template
- [ ] Tailwind CSS configured with custom theme (colors, fonts)
- [ ] RTK + RTK Query provider wired in main.tsx
- [ ] React Router v6 with Layout route structure
- [ ] Path aliases (`@/src/*`) in tsconfig + vite config
- [ ] PWA manifest and service worker stub
- [ ] `tsconfig strict: true`
- [ ] Vite build produces < 500KB bundle

**Effort:** 3h
**Priority:** Critical
**Dependencies:** None

---

### Task 1.2: Base API Layer & Types

**Description:** Define all TypeScript interfaces matching legacy API response contracts. Build RTK Query base API with JWT injection, 401 handling, file download support.

**Acceptance Criteria:**
- [ ] All entity types defined: User, Session, Order, CashControl, Settlement, Stock, etc.
- [ ] RTK Query `apiSlice` with baseQuery (fetch wrapper)
- [ ] JWT token injection on every request
- [ ] Global 401 → sign out handler wired to store
- [ ] File download handler (octet-stream, text/csv) via response intercept
- [ ] Response shape `{ status: "success", data, total? }` typed
- [ ] API error type with `validations` field for field-level errors

**Effort:** 2h
**Priority:** Critical
**Dependencies:** 1.1

---

### Task 1.3: Auth Slice & Persistence

**Description:** Redux slice for auth state (user, token, authenticated). Token stored in localStorage. Validate on app boot via GET /auth/me.

**Acceptance Criteria:**
- [ ] `authSlice` with: user, token, authenticated, isLoading states
- [ ] `login` thunk: POST /auth/signin, store token + user
- [ ] `validateToken` thunk: GET /auth/me on boot, 401 → clear + redirect
- [ ] `logout` thunk: clear localStorage + reset slice + redirect /login
- [ ] Token persisted in localStorage key `__frut`
- [ ] App initializes auth before rendering routes
- [ ] Loading screen while auth validates

**Effort:** 2h
**Priority:** Critical
**Dependencies:** 1.1, 1.2

---

### Task 1.4: App Layout Shell

**Description:** Sidebar navigation + main content area. Sidebar collapses on mobile. Menu items matching legacy route structure.

**Acceptance Criteria:**
- [ ] Persistent sidebar layout (sidebar + main content)
- [ ] Collapsible on mobile (< 768px)
- [ ] Sidebar menu items: Penjualan, Stok, Laporan, Cash Control, Purchase, Pengaturan
- [ ] Active route highlighted in sidebar
- [ ] User avatar/name in sidebar footer
- [ ] Sign out button in sidebar
- [ ] Main content area with consistent padding/margins

**Effort:** 2h
**Priority:** Critical
**Dependencies:** 1.1, 1.3

---

### Task 1.5: Route Structure & Auth Guard

**Description:** Define all 14 routes with React Router v6. Protected routes redirect to /login if unauthenticated.

**Acceptance Criteria:**
- [ ] Route config: /sales/session, /sales/session/:id, /sales/session/:id/order/:orderId, /report/sales/daily, /report/sales/outstanding, /report/sales/payment, /report/sales/payment/daily, /report/sales/item, /cash/control, /purchase, /setting/user, /setting/user/create, /setting/user/:id/update, /auth/me, default redirect → /sales/session
- [ ] ProtectedRoute wrapper checks auth state
- [ ] Redirect to /login on unauthorized
- [ ] Redirect to /report/sales/payment when /report/sales/payment/daily has no month param
- [ ] Route param types match entity IDs

**Effort:** 1h
**Priority:** Critical
**Dependencies:** 1.3, 1.4

---

## Phase 2: Authentication Pages (Day 3)

**Goal:** Login page + Profile page functional.

### Task 2.1: Login Page

**Description:** Username/password form with field-level validation errors. On success, redirect to /sales/session.

**Acceptance Criteria:**
- [ ] Form: username + password fields
- [ ] Submit → POST /auth/signin
- [ ] Field-level validation errors displayed inline below each field
- [ ] Loading state on submit button
- [ ] On success → navigate to /sales/session
- [ ] On API error → show error message
- [ ] Redirect to /sales/session if already authenticated
- [ ] Clean, styled form matching app design

**Effort:** 2h
**Priority:** Critical
**Dependencies:** 1.2, 1.3, 1.5

---

### Task 2.2: Profile Page (Update Own Account)

**Description:** Read-only name + username display, password change fields. PUT /auth/me on submit.

**Acceptance Criteria:**
- [ ] Page at /auth/me
- [ ] Name and Username shown as disabled/read-only fields
- [ ] Password fields: Password Baru, Konfirmasi Password (optional)
- [ ] If password provided, must match confirmation
- [ ] Submit → PUT /auth/me with name + password (if provided)
- [ ] Field-level errors shown inline
- [ ] Success message or redirect on success
- [ ] Back button or cancel → navigate to /sales/session

**Effort:** 2h
**Priority:** Critical
**Dependencies:** 1.2, 1.3, 1.5

---

## Phase 3: Sales Module (Days 4-6)

**Goal:** Session list, session detail, order detail — matching all business rules.

### Task 3.1: Shared UI Components

**Description:** Reusable components: DataTable (TanStack Table wrapper with pagination/sorting), StatusBadge, CurrencyText, DateRangePicker, LoadingSpinner, EmptyState, PageHeader.

**Acceptance Criteria:**
- [ ] DataTable: columns, pagination (page + per-page), sorting, loading, empty state
- [ ] DataTable config persisted in localStorage key `__tbx_{name}`
- [ ] StatusBadge: colored badge by status string
- [ ] CurrencyText: formats number as `1,234.56` currency
- [ ] DateRangePicker: start/end date with +1 day normalization on submit
- [ ] LoadingSpinner: centered spinner
- [ ] EmptyState: "Tidak ada data" with icon
- [ ] PageHeader: title + optional action slot
- [ ] All components typed with TypeScript

**Effort:** 3h
**Priority:** Critical
**Dependencies:** 1.1, 1.2

---

### Task 3.2: Sales Session List Page

**Description:** Paginated table of cashier sessions with date filter, payment breakdown on hover.

**Acceptance Criteria:**
- [ ] Table columns: Date, Kasir (uppercase), No. Session, Awal Session (HH:mm), Akhir Session (HH:mm or "Ongoing"), Total Transaksi, Status
- [ ] Total Transaksi shows `summary_order.total_charges`; hover reveals popup with payment method breakdown
- [ ] Date range picker with end date +1 day normalization (BR-015)
- [ ] "Ongoing" label for `finished_at === "0001-01-01T00:00:00Z"` (BR-001)
- [ ] Status badge rendered from status string (BR-001)
- [ ] "Lihat Detail" button → navigate to /sales/session/:id
- [ ] Pagination with configurable per-page
- [ ] Table config persisted in localStorage

**Effort:** 3h
**Priority:** Critical
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 3.3: Sales Session Detail Page

**Description:** Full session info: session info panel, cash info panel, sales info panel, pembayaran list, kategori list, topup list, transaction table.

**Acceptance Criteria:**
- [ ] Session Info panel: Session No., Tanggal (DD/MM/YYYY), Awal Session, Akhir Session ("Ongoing" if ongoing)
- [ ] Cash Info panel: Starting Cash, Ending Cash, Expected Cash, Outstanding Bill Payments — all formatted as currency
- [ ] Sales Info panel: Total Sales (total_nett), Total Discount, Total After Discount (total_charges - total_service_charge), Total Service, Grand Total (total_charges), Outstanding Bills
- [ ] Pembayaran Info: list cash_payments, display payment_name (null = "Cash") + subtotal (BR-002)
- [ ] Kategori Info: list category_solds, name + quantity badge (dark bg, white text) + total_charges
- [ ] Topup Info: list topups, name + nominal
- [ ] Transaksi table: index, Tanggal (DD/MM/YYYY HH:mm), Code, Channel (uppercase), Pembayaran (uppercase, null = "CASH"), Total Order, action arrow
- [ ] Click row action arrow → navigate to /sales/session/:id/order/:orderId
- [ ] Back button → navigate to /sales/session

**Effort:** 4h
**Priority:** Critical
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 3.4: Sales Order Detail Page

**Description:** Individual order with items table, pricing breakdown, note section.

**Acceptance Criteria:**
- [ ] Order Info: Code (uppercase), Kasir (uppercase), Payment Ref, Tanggal Order (DD/MM/YYYY), Channel (uppercase), Pembayaran (uppercase, null = "CASH")
- [ ] Items table: #, Item (name, add-ons prefixed "+"), QTY (right), Nett Price (Rp, right), Subtotal (Rp, right)
- [ ] Add-on items (`additional_id` set) show "+" prefix (BR-003)
- [ ] Note section: display order.note, "-" if empty
- [ ] Pricing section: Subtotal + Discount rows shown only if `discount_value > 0` (BR-004); Service row shown only if `service_charge === true` (BR-005); Total always shown; Tax Included always shown
- [ ] Back button → navigate to parent session /sales/session/:id

**Effort:** 3h
**Priority:** Critical
**Dependencies:** 1.2, 1.5, 3.1

---

## Phase 4: Reports Module (Days 7-9)

**Goal:** All 5 report pages functional.

### Task 4.1: Report — Daily Sales

**Description:** Paginated table of daily totals. GET /report/sales/daily.

**Acceptance Criteria:**
- [ ] Table columns: Tanggal (DD/MM/YYYY), Total Order (right-aligned currency)
- [ ] API: GET /report/sales/daily
- [ ] Standard pagination

**Effort:** 1h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 4.2: Report — Outstanding Bills

**Description:** Unpaid orders table with summary header and download. GET /report/sales/outstanding + /summary.

**Acceptance Criteria:**
- [ ] Header metric card: TOTAL CHARGES from /report/sales/outstanding/summary
- [ ] Summary refetches when table filter changes (BR-013)
- [ ] Download button triggers file download
- [ ] Table columns: Code, Tanggal (DD/MM/YYYY HH:mm), Kasir (uppercase), Bill Names (ticket, uppercase), Customer (membership.name or "-"), Total Charges (right-aligned)
- [ ] Date range filter with +1 day normalization
- [ ] Empty state "Tidak ada data"

**Effort:** 2h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 4.3: Report — Settlement Monthly

**Description:** Yearly payment method breakdown. GET /report/settlement with yearly params.

**Acceptance Criteria:**
- [ ] Filter: cashier dropdown (optional) + year picker (default: current year)
- [ ] Summary cards: each payment method shows nominal — special types (Total, Outstanding, Member) larger card (3-col), regular types smaller (2-col) (BR-010)
- [ ] Table: dynamic columns from `payment_methods` array + Date + action arrow
- [ ] Values > 0: bold; values = 0: "-"
- [ ] Download button: `downloadable: true` param (BR-012)
- [ ] Row action arrow → navigate to /report/sales/payment/daily?month={period}
- [ ] APIs: GET /report/settlement (yearly), GET /report/settlement/summary

**Effort:** 3h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 4.4: Report — Settlement Daily

**Description:** Session-level breakdown for specific month. Requires month param, redirects if missing.

**Acceptance Criteria:**
- [ ] Requires `month` query param — if missing, redirect to /report/sales/payment (BR-011)
- [ ] Filter: cashier dropdown (optional)
- [ ] Summary cards: same as monthly view
- [ ] Table: Date, Session Time (started_at - finished_at in DD/MM/YYYY HH:mm), dynamic payment columns
- [ ] APIs: GET /report/settlement (monthly params), GET /report/settlement/summary

**Effort:** 2h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1, 4.3

---

### Task 4.5: Report — Item Sales

**Description:** Product-level quantity report. GET /report/sales/item.

**Acceptance Criteria:**
- [ ] Table columns: Nama (uppercase), Total Sold
- [ ] API: GET /report/sales/item
- [ ] Standard pagination

**Effort:** 1h
**Priority:** Medium
**Dependencies:** 1.2, 1.5, 3.1

---

## Phase 5: Settings & Cash Control (Days 10-11)

**Goal:** User CRUD, Cash Control, Purchase redirect.

### Task 5.1: Cash Control

**Description:** Cash reconciliation table with 4 metric cards. GET /report/cash/control.

**Acceptance Criteria:**
- [ ] Filter: cashier dropdown + date range picker
- [ ] Overview cards (4 metrics): Total Transaksi Cash, Total Topup Cash, Total Setoran Cash, Kekurangan (deficient)
- [ ] Session table: Session (date), Cashier (uppercase), Transaksi Cash, Topup Cash, Setoran Cash, Status
- [ ] Empty state: "Tidak ada data" with icon
- [ ] API: GET /report/cash/control
- [ ] Date filter: start_at + end_at individually (BR-016)

**Effort:** 2h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 5.2: User Management List

**Description:** User list table with activate/deactivate toggles and supervisor checkmark.

**Acceptance Criteria:**
- [ ] Table columns: Nama, Username, Login Terakhir (DD/MM/YYYY HH:mm or "-" for "0001-01-01T00:00:00Z"), Status, Actions
- [ ] Status column: if `is_supervisor === true` → checkmark icon; else if `id === currentUser.id` → "-"; else → toggle switch (BR-007, BR-008)
- [ ] Actions dropdown: "Perbaharui Data" link → /setting/user/:id/update
- [ ] Actions dropdown hidden for current user
- [ ] "Buat User" button → /setting/user/create
- [ ] APIs: GET /user, PUT /user/:id/activate, PUT /user/:id/deactivate

**Effort:** 2h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1

---

### Task 5.3: User Create Page

**Description:** Create new user form. POST /user on submit.

**Acceptance Criteria:**
- [ ] Form fields: Nama, Username, Password, Konfirmasi Password
- [ ] All fields required, validated
- [ ] Password confirmation must match
- [ ] Submit → POST /user → redirect to /setting/user on success
- [ ] Field-level validation errors displayed inline
- [ ] Cancel → navigate to /setting/user

**Effort:** 2h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1, 5.2

---

### Task 5.4: User Update Page

**Description:** Edit existing user form. PUT /user/:id on submit.

**Acceptance Criteria:**
- [ ] Form pre-filled with existing Name and Username (read-only display, not editable)
- [ ] Password and Konfirmasi Password fields optional
- [ ] If password provided, must match confirmation
- [ ] Submit → PUT /user/:id → redirect to /setting/user on success
- [ ] Field-level validation errors displayed inline

**Effort:** 1h
**Priority:** High
**Dependencies:** 1.2, 1.5, 3.1, 5.2

---

### Task 5.5: Purchase (External Redirect)

**Description:** No UI rendered. On mount, open external ordering platform with username param.

**Acceptance Criteria:**
- [ ] On mount: `window.open('https://order.sukabread.com?source=share&username={session.username}', '_blank')` (BR-014)
- [ ] Username sourced from authenticated user session
- [ ] No in-app content rendered
- [ ] Immediate redirect — no loading state needed

**Effort:** 1h
**Priority:** Medium
**Dependencies:** 1.2, 1.3, 1.5

---

### Task 5.6: Stock Page (Stub)

**Description:** Placeholder matching legacy "Hallo STOCK :)" behavior.

**Acceptance Criteria:**
- [ ] Render placeholder/stub text
- [ ] Stock service layer can be built later
- [ ] No functional UI required yet

**Effort:** 1h
**Priority:** Low
**Dependencies:** 1.2, 1.5

---

## Phase 6: Polish & Deployment (Days 12-13)

**Goal:** PWA, testing, final QA, deployment.

### Task 6.1: PWA Configuration

**Description:** Vite PWA plugin setup with offline shell, app icons, manifest.

**Acceptance Criteria:**
- [ ] Service worker caches app shell
- [ ] Web manifest with app name, icons, theme color
- [ ] Installable as PWA on supported browsers
- [ ] Offline fallback page

**Effort:** 2h
**Priority:** Medium
**Dependencies:** All Phase 1-5

---

### Task 6.2: App Initialization Flow

**Description:** Bootstrap logic on app mount: check token → validate with GET /auth/me → set ready state.

**Acceptance Criteria:**
- [ ] On app boot: if token exists → validate via GET /auth/me
- [ ] If 200 → set initialized + ready
- [ ] If 401 → sign out immediately
- [ ] Loading screen until ready/initialized resolved
- [ ] No flash of protected content on refresh

**Effort:** 1h
**Priority:** Critical
**Dependencies:** 1.2, 1.3, 2.1

---

### Task 6.3: Environment Config

**Description:** API base URL configurable via env vars.

**Acceptance Criteria:**
- [ ] VITE_API_BASE_URL env var for API endpoint
- [ ] Default to localhost for dev
- [ ] Document env vars in README

**Effort:** 1h
**Priority:** Medium
**Dependencies:** 1.1

---

### Task 6.4: Bundle Analysis & Optimization

**Description:** Verify bundle size < 500KB gzip. Optimize if needed.

**Acceptance Criteria:**
- [ ] Run `vite build` with bundle analyzer
- [ ] Confirm gzip < 500KB
- [ ] If over budget: code-split routes, lazy load components, tree-shake
- [ ] Report final bundle size

**Effort:** 2h
**Priority:** Medium
**Dependencies:** All Phase 1-5

---

### Task 6.5: TypeScript Strict Mode Verification

**Description:** Ensure zero TypeScript errors in strict mode across entire codebase.

**Acceptance Criteria:**
- [ ] `tsc --noEmit` passes with zero errors
- [ ] All API response shapes typed
- [ ] No `any` types except where absolutely necessary
- [ ] RTK Query fully typed

**Effort:** 2h
**Priority:** High
**Dependencies:** All Phase 1-5

---

## Quick Reference Checklist

- [ ] Task 1.1: Project Scaffolding
- [ ] Task 1.2: Base API Layer & Types
- [ ] Task 1.3: Auth Slice & Persistence
- [ ] Task 1.4: App Layout Shell
- [ ] Task 1.5: Route Structure & Auth Guard
- [ ] Task 2.1: Login Page
- [ ] Task 2.2: Profile Page
- [ ] Task 3.1: Shared UI Components
- [ ] Task 3.2: Sales Session List Page
- [ ] Task 3.3: Sales Session Detail Page
- [ ] Task 3.4: Sales Order Detail Page
- [ ] Task 4.1: Report — Daily Sales
- [ ] Task 4.2: Report — Outstanding Bills
- [ ] Task 4.3: Report — Settlement Monthly
- [ ] Task 4.4: Report — Settlement Daily
- [ ] Task 4.5: Report — Item Sales
- [ ] Task 5.1: Cash Control
- [ ] Task 5.2: User Management List
- [ ] Task 5.3: User Create Page
- [ ] Task 5.4: User Update Page
- [ ] Task 5.5: Purchase (External Redirect)
- [ ] Task 5.6: Stock Page (Stub)
- [ ] Task 6.1: PWA Configuration
- [ ] Task 6.2: App Initialization Flow
- [ ] Task 6.3: Environment Config
- [ ] Task 6.4: Bundle Analysis & Optimization
- [ ] Task 6.5: TypeScript Strict Mode Verification

---

## Next Steps

1. Review task breakdown
2. Run `/implement franchisee-rebuild` to start execution

---

*Tasks created with SDD 4.0 — Phase breakdown for franchisee web app rebuild*