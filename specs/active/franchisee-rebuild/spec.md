# Specification: Franchisee Web App v2

**Task ID:** franchisee-rebuild
**Created:** 2026-05-06
**Status:** Ready for Planning
**Version:** 1.0

---

## 1. Problem Statement

The existing franchisee web portal is built on deprecated technology (Vue 2, Element UI, Vuetify 1.x, Node 8/10) with no TypeScript, no maintainable state management, and an outdated build pipeline. The business logic is complete and functional. This specification defines the requirements for a 1:1 rebuild preserving all existing business rules, workflows, and data flows.

---

## 2. User Personas

### Primary: Franchise Owner
- **Who:** Bakery franchise owner (1-3 outlets), operates daily
- **Goals:** Monitor sales sessions, verify cash reconciliation, manage staff, review financial reports
- **Pain Points:** Legacy app is slow, hard to maintain, can't add features

### Secondary: Supervisor / Senior Staff
- **Who:** Senior staff member with elevated access
- **Goals:** View sessions, check reports, assist with monitoring
- **Constraints:** Cannot manage other users, cannot deactivate own account

### Tertiary: Cashier
- **Who:** POS operator using portal for supplementary reporting
- **Goals:** View own session history, check orders
- **Constraints:** Limited to read-only operations

---

## 3. Functional Requirements

### FR-001: Authentication & Session Persistence

**User Story:**
> As a franchisee user, I want to log in with my credentials and stay logged in across page refreshes so I can access the system reliably.

**Acceptance Criteria:**
- [ ] AC-1: Login form submits `POST /auth/signin` with `{ username, password }`
- [ ] AC-2: On success: JWT stored in encrypted storage (localStorage or httpOnly cookie), user object cached
- [ ] AC-3: On app boot: `GET /auth/me` validates token — if 401, sign out and redirect to login
- [ ] AC-4: Sign out clears all stored state and redirects to login
- [ ] AC-5: Login form shows field-level validation errors from API

**Business Rules:** BR-001 (auth token lifecycle)

---

### FR-002: Sales Session List

**User Story:**
> As a franchise owner, I want to browse all cashier sessions with date filtering so I can monitor daily activity.

**Acceptance Criteria:**
- [ ] AC-1: Table columns: Date, Kasir (cashier name, uppercase), No. Session, Awal Session (HH:mm), Akhir Session (HH:mm or "Ongoing"), Total Transaksi, Status
- [ ] AC-2: Total Transaksi column shows `summary_order.total_charges`; hover reveals payment method breakdown popup
- [ ] AC-3: Date range picker: selecting range filters data by `date_range: [start, end+1day]`
- [ ] AC-4: Ongoing sessions (finished_at === "0001-01-01T00:00:00Z") show "(Ongoing)" label
- [ ] AC-5: Status badge renders based on session status string
- [ ] AC-6: Row action: "Lihat Detail" button navigates to `/sales/session/:id`
- [ ] AC-7: Standard pagination with configurable per-page
- [ ] AC-8: Table config (sort, pagination, filters) persisted in localStorage

**Business Rules:** BR-001, BR-002, BR-015

---

### FR-003: Sales Session Detail

**User Story:**
> As a franchise owner, I want to see complete session information including cash flow, sales breakdown, and all orders so I can audit transactions.

**Acceptance Criteria:**
- [ ] AC-1: **Session Info panel**: Session No., Tanggal (DD/MM/YYYY), Awal Session (HH:mm), Akhir Session (HH:mm or "(Ongoing)")
- [ ] AC-2: **Cash Info panel**: Starting Cash, Ending Cash, Expected Cash, Outstanding Bill Payments — all formatted as currency
- [ ] AC-3: **Sales Info panel**: Total Sales (total_nett), Total Discount, Total After Discount (total_charges - total_service_charge), Total Service (total_service_charge), Grand Total (total_charges), Outstanding Bills (total_openbill)
- [ ] AC-4: **Pembayaran Info panel**: list cash_payments array — each shows payment_name (null = "Cash") + subtotal
- [ ] AC-5: **Kategori Info panel**: list category_solds — each shows name, quantity badge (dark bg, white text), total_charges
- [ ] AC-6: **Topup Info panel**: list topups — each shows name + nominal
- [ ] AC-7: **Transaksi table**: columns: index, Tanggal (DD/MM/YYYY HH:mm), Code, Channel (uppercase), Pembayaran (uppercase, null = "CASH"), Total Order (total_charges), action arrow
- [ ] AC-8: Click action arrow → navigate to `/sales/session/:id/order/:orderId`
- [ ] AC-9: Back button → navigate to `/sales/session`

**Business Rules:** BR-001, BR-002, BR-006, BR-015

---

### FR-004: Sales Order Detail

**User Story:**
> As a franchise owner, I want to inspect individual order details including itemized breakdown and pricing so I can verify transactions.

**Acceptance Criteria:**
- [ ] AC-1: **Order Info section**: Code (uppercase), Kasir (uppercase), Payment Ref, Tanggal Order (DD/MM/YYYY), Channel (uppercase), Pembayaran (uppercase, null = "CASH")
- [ ] AC-2: **Items table**: columns: #, Item (name, add-ons prefixed "+"), QTY (right), Nett Price (Rp, right), Subtotal (Rp, right)
- [ ] AC-3: Add-on items (additional_id set) show "+" prefix
- [ ] AC-4: **Note section**: displays order.note, "-" if empty
- [ ] AC-5: **Pricing section**:
  - Subtotal + Discount rows: shown only if `discount_value > 0`
  - Service row: shown only if `service_charge === true`, displays `service_charge_value`
  - Total (total_charges): always shown
  - Tax Included (subtotal_tax): always shown
- [ ] AC-6: Back button → navigate to parent session `/sales/session/:id`

**Business Rules:** BR-003, BR-004, BR-005, BR-006

---

### FR-005: Report — Daily Sales

**User Story:**
> As a franchise owner, I want to see a daily sales total so I can quickly assess daily performance.

**Acceptance Criteria:**
- [ ] AC-1: Table columns: Tanggal (DD/MM/YYYY), Total Order (right-aligned currency)
- [ ] AC-2: API: `GET /report/sales/daily`
- [ ] AC-3: Standard pagination

---

### FR-006: Report — Outstanding Bills

**User Story:**
> As a franchise owner, I want to see unpaid/open orders with a total summary and export capability.

**Acceptance Criteria:**
- [ ] AC-1: Header metric card: TOTAL CHARGES from separate summary API
- [ ] AC-2: Summary refetches when table filter changes
- [ ] AC-3: Download button triggers CSV/file export
- [ ] AC-4: Table columns: Code, Tanggal (DD/MM/YYYY HH:mm), Kasir (uppercase), Bill Names (ticket, uppercase), Customer (membership.name or "-"), Total Charges (right-aligned)
- [ ] AC-5: Date range filter with +1 day normalization
- [ ] AC-6: APIs: `GET /report/sales/outstanding`, `GET /report/sales/outstanding/summary`

**Business Rules:** BR-013, BR-015

---

### FR-007: Report — Settlement Monthly

**User Story:**
> As a franchise owner, I want to see payment method breakdown by month for a selected year so I can analyze revenue by payment type.

**Acceptance Criteria:**
- [ ] AC-1: Filter: cashier dropdown (optional) + year picker (default: current year)
- [ ] AC-2: Summary cards: each payment method shows nominal
  - Special types (Total, Outstanding, Member): larger card (3-col)
  - Regular types: smaller card (2-col)
- [ ] AC-3: Table: dynamic columns = `payment_methods` array + Date + action
- [ ] AC-4: Values > 0: bold; values = 0: "-"
- [ ] AC-5: Download button: `downloadable: true` param
- [ ] AC-6: Row action arrow → navigate to Settlement Daily with month param
- [ ] AC-7: APIs: `GET /report/settlement` (yearly), `GET /report/settlement/summary`

**Business Rules:** BR-010, BR-012, BR-016

---

### FR-008: Report — Settlement Daily

**User Story:**
> As a franchise owner, I want to see payment method breakdown per session for a specific month.

**Acceptance Criteria:**
- [ ] AC-1: Requires `month` param from route — if missing, redirect to monthly view
- [ ] AC-2: Filter: cashier dropdown (optional)
- [ ] AC-3: Table: Date, Session Time (started_at - finished_at in DD/MM/YYYY HH:mm), dynamic payment columns
- [ ] AC-4: APIs: `GET /report/settlement` (monthly), `GET /report/settlement/summary`

**Business Rules:** BR-011

---

### FR-009: Report — Item Sales

**User Story:**
> As a franchise owner, I want to see total quantity sold per product.

**Acceptance Criteria:**
- [ ] AC-1: Table columns: Nama (uppercase), Total Sold
- [ ] AC-2: API: `GET /report/sales/item`
- [ ] AC-3: Standard pagination

---

### FR-010: Cash Control

**User Story:**
> As a franchise owner, I want to see per-session cash reconciliation including transactions, topups, and shortages.

**Acceptance Criteria:**
- [ ] AC-1: Filter: cashier dropdown + date range picker
- [ ] AC-2: **Overview cards** (4 metrics): Total Transaksi Cash, Total Topup Cash, Total Setoran Cash, Kekurangan (deficient)
- [ ] AC-3: **Session table**: columns: Session (date), Cashier (uppercase), Transaksi Cash, Topup Cash, Setoran Cash, Status
- [ ] AC-4: Empty state: "Tidak ada data" with icon
- [ ] AC-5: API: `GET /report/cash/control`

**Business Rules:** BR-009, BR-016

---

### FR-011: Purchase (External Redirect)

**User Story:**
> As a franchise owner, I want to access the external ordering platform pre-filled with my credentials.

**Acceptance Criteria:**
- [ ] AC-1: On mount: `window.open('https://order.sukabread.com?source=share&username={session.username}', '_blank')`
- [ ] AC-2: Username sourced from authenticated user session
- [ ] AC-3: No in-app content rendered on this page

**Business Rules:** BR-014

---

### FR-012: User Management List

**User Story:**
> As a franchise owner, I want to manage staff accounts including creation, activation, and deactivation.

**Acceptance Criteria:**
- [ ] AC-1: Table columns: Nama, Username, Login Terakhir (DD/MM/YYYY HH:mm or "-"), Status, Actions
- [ ] AC-2: **Status column logic**:
  - If `is_supervisor === true`: show checkmark icon
  - Else if `id === currentUser.id`: show "-" (no toggle)
  - Else: show toggle switch (activate/deactivate)
- [ ] AC-3: **Actions dropdown**: "Perbaharui Data" link → `/setting/user/:id/update`
- [ ] AC-4: Actions dropdown hidden for current user
- [ ] AC-5: "Buat User" button → `/setting/user/create`
- [ ] AC-6: API: `GET /user`, `PUT /user/:id/activate`, `PUT /user/:id/deactivate`

**Business Rules:** BR-007, BR-008

---

### FR-013: User Create

**Acceptance Criteria:**
- [ ] AC-1: Form fields: Nama, Username, Password, Konfirmasi Password
- [ ] AC-2: All fields required (validated)
- [ ] AC-3: Password confirmation must match
- [ ] AC-4: Submit → `POST /user` → redirect to `/setting/user` on success
- [ ] AC-5: Field-level validation errors from API displayed inline
- [ ] AC-6: Cancel → navigate to `/setting/user`

---

### FR-014: User Update

**Acceptance Criteria:**
- [ ] AC-1: Form pre-filled with existing Name and Username (read-only display, not editable)
- [ ] AC-2: Password and Konfirmasi Password fields optional
- [ ] AC-3: If password provided, must match confirmation
- [ ] AC-4: Submit → `PUT /user/:id` → redirect to `/setting/user` on success
- [ ] AC-5: Field-level validation errors displayed inline

---

### FR-015: Profile Update

**Acceptance Criteria:**
- [ ] AC-1: Page at `/auth/me`
- [ ] AC-2: Name and Username displayed as disabled/read-only fields
- [ ] AC-3: Password change fields: Password Baru, Konfirmasi Password
- [ ] AC-4: Submit → `PUT /auth/me` with current values + new password
- [ ] AC-5: Success → show success message (stay on page or redirect)

**Business Rules:** BR-017

---

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|------------|--------|
| NFR-1 | Bundle size (gzip) | < 500KB |
| NFR-2 | First Contentful Paint | < 1.5s |
| NFR-3 | TypeScript strict mode | 100% coverage |
| NFR-4 | Test coverage (business logic) | > 60% |
| NFR-5 | Browser support | Chrome 90+, Firefox 90+, Safari 15+ |
| NFR-6 | Accessibility | WCAG 2.1 AA (form labels, keyboard nav) |
| NFR-7 | PWA | Installable, offline shell |

---

## 5. Out of Scope

- Backend API changes
- POS system rebuild
- External ordering platform rebuild
- Multi-language support (preserve mixed ID/EN)
- Mobile-native app
- Stock page full implementation (preserve stub)

---

## 6. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| API returns 401 | Sign out, clear storage, redirect to login |
| API returns validation errors | Display inline per-field error messages |
| Session ongoing (no end time) | Display "(Ongoing)" instead of time |
| User never logged in | Display "-" for last_login_at |
| Order has no discount | Hide subtotal and discount rows |
| Order has no service charge | Hide service row |
| Empty report data | Show "Tidak ada data" empty state |
| Missing month param on daily settlement | Redirect to monthly settlement page |
| API timeout | Show error toast, allow retry |
| File download response | Auto-trigger browser download |

---

## 7. Success Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Feature parity | 100% | Manual QA checklist |
| Business rules preserved | 20/20 | Automated test suite |
| TypeScript errors | 0 | `tsc --strict` |
| Bundle size | < 500KB gzip | Vite build analysis |
| Page load (LCP) | < 2.5s | Lighthouse CI |

---

## 8. Open Questions

- [ ] Should Stock page (FR-012 from PRD) be implemented in this rebuild?
- [ ] Should JWT use httpOnly cookie instead of localStorage?
- [ ] Is Google Maps API key configured for future use?
- [ ] Should the Purchase redirect URL be environment-configurable?
- [ ] Should RTK Query replace manual fetch/axios for all API calls?
- [ ] PWA push notifications: needed or keep simple offline shell?

---

## 9. Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-06 | Initial specification from legacy codebase analysis | System |

---

*Specification created with SDD 4.0*
