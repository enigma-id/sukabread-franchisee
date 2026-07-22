# Product Requirements Document: Franchisee Web App v2

**Task ID:** franchisee-rebuild
**Date:** 2026-05-06
**Version:** 1.0
**Status:** Ready for Review
**Source:** Reverse-engineered from `clients/web/franchisee/` legacy Vue 2 app

---

## 1. Executive Summary

The Franchisee Web App is a back-office portal for Suka Bread bakery franchise owners and their staff. It provides monitoring and management capabilities for sales sessions, orders, cash reconciliation, financial reports, user management, and inventory oversight.

The current system is built on Vue 2 (EOL), Element UI 1.x, Vuetify 1.5, and Vue CLI 3 — all deeply outdated and no longer maintained. This rebuild preserves 100% of existing business logic and workflows while migrating to a modern, maintainable stack.

**Goal:** Rebuild from scratch using React 18 + TypeScript + Redux Toolkit + Tailwind CSS, keeping every business rule, data flow, and user interaction identical.

---

## 2. Problem Statement

### The Problem

The existing franchisee portal is built on a technology stack that reached end-of-life. Vue 2, Element UI, Vuetify 1.x, and Node 8/10 are no longer receiving security patches or bug fixes. The codebase is unmaintainable for new developers, has no TypeScript type safety, and uses deprecated build tooling (Vue CLI 3).

### Current Situation

- Franchisee staff use the portal daily to monitor sales, check cash reconciliation, and generate reports
- The system works but cannot be updated, extended, or maintained safely
- New features (e.g., implementing the Stock page, which is currently a stub) cannot be built on the existing foundation
- Security vulnerabilities in outdated dependencies cannot be patched

### Desired Outcome

A 1:1 functional replacement built on modern tooling that:

- Preserves every existing workflow and business rule
- Enables future feature development (stock management, enhanced reports)
- Uses TypeScript for type safety and maintainability
- Is deployable via modern CI/CD (Docker, Vercel, etc.)

---

## 3. Target Users

### Primary User: Franchise Owner

- **Who:** Bakery franchise owner operating 1-3 outlets
- **Goals:** Monitor sales performance, verify cash reconciliation, manage staff accounts, review financial reports
- **Behavior:** Logs in daily, checks sessions, reviews settlement reports monthly, manages staff as needed
- **Language:** Indonesian (Bahasa Indonesia) — UI labels are mixed Indonesian/English

### Secondary User: Franchise Staff (Supervisor)

- **Who:** Senior staff member with supervisory access
- **Goals:** View sales data, check own sessions, monitor daily performance
- **Behavior:** Checks sessions and reports, cannot manage other users or delete accounts
- **Restriction:** Cannot toggle own active status, shown differently in user list

### Tertiary: Cashier (View-Only Access)

- **Who:** POS cashier accessing the portal for limited reporting
- **Goals:** View own session history, check order details
- **Behavior:** Primarily uses the POS app — portal access is supplementary

---

## 4. Functional Requirements

### FR-001: Authentication & Authorization

**Description:** JWT-based login with token validation on app boot.

**User Stories:**

- As a franchisee user, I want to sign in with username/password so I can access my outlet's data
- As a franchisee user, I want my session to persist across page refreshes so I don't have to re-login
- As a franchisee user, I want to update my password from the profile page

**Acceptance Criteria:**

- [ ] Login via POST `/auth/signin` with `{ username, password }`
- [ ] JWT token stored in encrypted localStorage (persisted state)
- [ ] On app boot: validate token via GET `/auth/me`
- [ ] If 401 → sign out, clear storage, redirect to login
- [ ] Profile page shows name/username as read-only, password fields editable
- [ ] Password update via PUT `/auth/me` with `{ name, password, confirm_password }`
- [ ] Sign out clears all localStorage and Vuex/RTK state

**Priority:** Must Have

---

### FR-002: Sales Session Management

**Description:** List, filter, and inspect cashier sales sessions.

**User Stories:**

- As a franchise owner, I want to see all cashier sessions so I can monitor daily operations
- As a franchise owner, I want to filter sessions by date range so I can review specific periods
- As a franchise owner, I want to see session details including cash info, sales summary, payment breakdown, and category breakdown

**Acceptance Criteria:**

- [ ] Session list shows: Date, Cashier Name (uppercase), Session No., Start Time, End Time, Total Transaction, Status
- [ ] Date range filter with start/end picker (end date +1 day for inclusive range)
- [ ] `finished_at === "0001-01-01T00:00:00Z"` displays as "(Ongoing)"
- [ ] Hovering Total Transaction shows payment method breakdown popup
- [ ] Session detail page shows 3 info sections:
  - Session Info: No, Date, Start, End
  - Cash Info: Starting Cash, Ending Cash, Expected Cash, Outstanding Bill Payments
  - Sales Info: Total Sales (total_nett), Total Discount, Total After Discount (total_charges - total_service_charge), Total Service, Grand Total (total_charges), Outstanding Bills (total_openbill)
- [ ] Payment breakdown section: list each payment method + subtotal (null name = "Cash")
- [ ] Category breakdown section: product category name, quantity badge, total_charges
- [ ] Top-up section: name + nominal for each cash top-up
- [ ] Transaction table: list all orders in session with Date, Code, Channel (uppercase), Payment Method (uppercase, null = "CASH"), Total Order
- [ ] Click order row → navigate to order detail

**Priority:** Must Have

---

### FR-003: Sales Order Detail

**Description:** View individual order details with itemized breakdown.

**User Stories:**

- As a franchise owner, I want to see every item in an order so I can verify transactions
- As a franchise owner, I want to see discount, service charge, and tax breakdown

**Acceptance Criteria:**

- [ ] Order info: Code (uppercase), Cashier Name (uppercase), Payment Ref, Order Date, Channel (uppercase), Payment Method (uppercase, null = "CASH")
- [ ] Order items table: Item Name, QTY, Nett Price (Rp), Subtotal (Rp)
- [ ] Add-on items (additional_id set) prefixed with "+" in name
- [ ] Note section displayed below items
- [ ] Pricing section:
  - Subtotal shown only if `discount_value > 0`
  - Discount row shown only if `discount_value > 0`
  - Service row shown only if `service_charge === true`
  - Total always shown
  - Tax Included always shown
- [ ] Back navigation to parent session

**Priority:** Must Have

---

### FR-004: Reports — Daily Sales

**Description:** Paginated table of daily sales totals.

**Acceptance Criteria:**

- [ ] Table columns: Date (DD/MM/YYYY), Total Order (right-aligned, currency format)
- [ ] Standard table with pagination
- [ ] API: GET `/report/sales/daily`

**Priority:** Must Have

---

### FR-005: Reports — Outstanding Bills

**Description:** List of unpaid/open orders with summary and download.

**Acceptance Criteria:**

- [ ] Header shows total_charges summary from `/report/sales/outstanding/summary`
- [ ] Summary re-fetches when table filter changes
- [ ] Download button exports CSV/file
- [ ] Table columns: Code, Date (DD/MM/YYYY HH:mm), Cashier (uppercase), Bill Names (ticket, uppercase), Customer (membership name or "-"), Total Charges (right-aligned)
- [ ] Date range filter with +1 day normalization
- [ ] API: GET `/report/sales/outstanding`

**Priority:** Must Have

---

### FR-006: Reports — Settlement Monthly

**Description:** Payment method breakdown aggregated by month within a year.

**Acceptance Criteria:**

- [ ] Filter by cashier (optional) and year
- [ ] Summary cards: each payment method shows nominal — special types (Total, Outstanding, Member) larger layout, regular types smaller
- [ ] Table: Date column + dynamic columns per payment method + drill-down arrow
- [ ] Values > 0 shown bold, values = 0 shown as "-"
- [ ] Column headers from `payment_methods` array in first row
- [ ] Download button exports file with `downloadable: true` param
- [ ] Click row → navigate to Settlement Daily with `month` param
- [ ] API: GET `/report/settlement` with `periode_type: 'yearly'`
- [ ] Summary: GET `/report/settlement/summary`

**Priority:** Must Have

---

### FR-007: Reports — Settlement Daily

**Description:** Payment method breakdown per session for a specific month.

**Acceptance Criteria:**

- [ ] Requires `month` route param — if missing, redirect to monthly view
- [ ] Filter by cashier (optional)
- [ ] Summary cards identical to monthly view
- [ ] Table: Date, Session Time (start - end), dynamic payment method columns
- [ ] API: GET `/report/settlement` with `periode_type: 'monthly'`
- [ ] Download button

**Priority:** Must Have

---

### FR-008: Reports — Item Sales

**Description:** Product-level sales quantity report.

**Acceptance Criteria:**

- [ ] Table columns: Name (uppercase), Total Sold
- [ ] Standard paginated table
- [ ] API: GET `/report/sales/item`

**Priority:** Must Have

---

### FR-009: Cash Control

**Description:** Cash reconciliation view showing per-session cash tracking.

**Acceptance Criteria:**

- [ ] Filter by cashier (optional) and date range
- [ ] Overview cards (4 metrics): Total Transaksi Cash, Total Topup Cash, Total Setoran Cash, Kekurangan (deficiency)
- [ ] Session table: Session (date), Cashier (uppercase), Transaksi Cash, Topup Cash, Setoran Cash, Status badge
- [ ] Empty state: "Tidak ada data" message
- [ ] API: GET `/report/cash/control`

**Priority:** Must Have

---

### FR-010: Purchase (External Link)

**Description:** Redirects franchisee to external ordering platform.

**Acceptance Criteria:**

- [ ] On page mount → `window.open('https://order.sukabread.com?source=share&username={username}', '_blank')`
- [ ] Username taken from authenticated user session
- [ ] No in-app UI rendered

**Priority:** Must Have

---

### FR-011: User Management

**Description:** CRUD operations for franchisee outlet staff.

**User Stories:**

- As a franchise owner, I want to create new user accounts so my staff can access the system
- As a franchise owner, I want to activate/deactivate user accounts
- As a franchise owner, I want to update user details

**Acceptance Criteria:**

- [ ] User list table: Name, Username, Last Login (DD/MM/YYYY HH:mm or "-" for never), Status (toggle), Actions (dropdown)
- [ ] Create user form: Name, Username, Password, Confirm Password — redirect to list on success
- [ ] Update user form: pre-filled Name/Username, optional Password/Confirm Password — redirect to list on success
- [ ] Status toggle: activate (PUT `/user/:id/activate`) / deactivate (PUT `/user/:id/deactivate`)
- [ ] Current user cannot toggle their own status (toggle hidden)
- [ ] If own user `is_supervisor` → show checkmark icon instead of toggle
- [ ] Actions dropdown hidden for current user
- [ ] API validation errors displayed inline per field

**Priority:** Must Have

---

### FR-012: Stock Page (Currently Stub)

**Description:** Stock listing page — currently unimplemented in legacy.

**Acceptance Criteria:**

- [ ] Render placeholder/stub matching legacy behavior
- [ ] Stock service exists (GET `/inventory/stock`) — can implement basic list view
- [ ] Stock adjustment service exists (CRUD + approve) — UI TBD

**Priority:** Nice to Have (preserve service layer, implement UI when backend is ready)

---

## 5. Non-Functional Requirements

### NFR-001: Performance

- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 500KB gzipped

### NFR-002: Browser Support

- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Responsive: desktop-first (matching legacy), mobile-friendly left panel collapse

### NFR-003: Security

- JWT stored in encrypted storage (or httpOnly cookie consideration)
- No sensitive data in URL params
- API errors never expose stack traces to UI
- Password fields use `autocomplete="new-password"`

### NFR-004: Localization

- UI labels predominantly Indonesian (Bahasa Indonesia)
- Some labels English (legacy pattern — preserve as-is)
- Currency format: `1,234.56` with 2 decimal places

### NFR-005: Accessibility

- Form fields have labels
- Interactive elements keyboard-accessible
- Status badges have semantic meaning (not color-only)

### NFR-006: PWA

- Service worker for offline shell
- Installable as PWA (icon assets exist in legacy)

---

## 6. Technical Constraints

- **Backend API is unchanged** — all endpoints remain the same
- **API response contract** must be compatible: `{ status: "success", data, total? }`
- **File download** via response content-type detection (octet-stream, text/csv)
- **Date sentinel** for "never" / "ongoing" states: `"0001-01-01T00:00:00Z"`
- **Google Maps** plugin present in legacy — usage unclear (preserve capability)
- **Firebase hosting** configured in legacy — deployment target TBD

---

## 7. Out of Scope

- **Backend changes** — API endpoints and response shapes remain unchanged
- **POS application** — separate system, not part of this rebuild
- **External ordering platform** (`order.sukabread.com`) — only linked, not rebuilt
- **New features** — this rebuild preserves existing functionality only
- **Multi-language support** — legacy is mixed ID/EN, preserve as-is
- **Mobile-native app** — web-only (PWA is sufficient)

---

## 8. Success Metrics

| Metric              | Target                            | How to Measure               |
| ------------------- | --------------------------------- | ---------------------------- |
| Feature Parity      | 100% of existing features working | Manual QA against legacy app |
| Page Load Time      | < 2s on 4G                        | Lighthouse audit             |
| Bundle Size         | < 500KB gzipped                   | Build output analysis        |
| TypeScript Coverage | 100% strict mode                  | tsconfig + CI check          |
| Test Coverage       | > 60% on business logic           | Jest/Vitest coverage report  |
| Zero Regression     | All 20 business rules preserved   | Automated E2E tests          |

---

## 9. Timeline Estimate

| Phase                 | Duration     | Scope                                |
| --------------------- | ------------ | ------------------------------------ |
| Phase 1: Foundation   | 3 days       | Project setup, auth, layout, routing |
| Phase 2: Sales Module | 3 days       | Sessions, orders, detail views       |
| Phase 3: Reports      | 3 days       | All 5 report pages                   |
| Phase 4: Settings     | 2 days       | User CRUD, profile, cash control     |
| Phase 5: Polish       | 2 days       | PWA, testing, QA, deployment         |
| **Total**             | **~13 days** |                                      |

---

## 10. Open Questions

- [ ] Should the Stock page (FR-012) be fully implemented in this rebuild or kept as stub?
- [ ] Is Google Maps integration actively used by any module? (present in legacy but no visible usage)
- [ ] Should the purchase redirect URL be configurable or remain hardcoded?
- [ ] Are there plans to change the API backend, or will it remain stable?
- [ ] Should we support mobile layout beyond basic responsiveness?

---

## 11. Appendix

### A. Legacy Route Map

| Legacy Route                        | New Route (Proposed)                | Module   |
| ----------------------------------- | ----------------------------------- | -------- |
| `/sales/session`                    | `/sales/session`                    | Sales    |
| `/sales/session/:id`                | `/sales/session/:id`                | Sales    |
| `/sales/session/:id/order/:orderID` | `/sales/session/:id/order/:orderId` | Sales    |
| `/stock`                            | `/stock`                            | Stock    |
| `/report/sales/daily`               | `/report/sales/daily`               | Reports  |
| `/report/sales/outstanding`         | `/report/sales/outstanding`         | Reports  |
| `/report/sales/payment`             | `/report/sales/payment`             | Reports  |
| `/report/sales/payment/daily`       | `/report/sales/payment/daily`       | Reports  |
| `/report/sales/item`                | `/report/sales/item`                | Reports  |
| `/cash/control`                     | `/cash/control`                     | Cash     |
| `/purchase`                         | `/purchase`                         | Purchase |
| `/setting/user`                     | `/setting/user`                     | Settings |
| `/setting/user/create`              | `/setting/user/create`              | Settings |
| `/setting/user/:id/update`          | `/setting/user/:id/update`          | Settings |
| `/auth/me`                          | `/auth/me`                          | Settings |

### B. Business Rule Index

See `research.md` — BR-001 through BR-020

---

_PRD generated with SDD 4.0 — Full rebuild preserving 100% business logic_
