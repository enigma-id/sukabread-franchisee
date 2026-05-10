# Research: Franchisee Web App — Legacy System Analysis

**Task ID:** franchisee-rebuild
**Date:** 2026-05-06
**Status:** Complete
**Source:** Reverse-engineered from `clients/web/franchisee/` (Vue 2 legacy codebase)

---

## Executive Summary

The franchisee web app is a **POS monitoring and management dashboard** for bakery franchise outlets (Suka Bread). It is NOT a POS itself — it is a back-office portal that franchisees use to monitor their cashier sessions, orders, inventory, and financial reports.

The system is built on Vue 2 (EOL) with Element UI, Vuetify, Bootstrap, and Vuex. The codebase is outdated, uses deprecated packages, and has technical debt. The business logic and workflows, however, are complete and well-defined.

**Critical discovery:** The `/purchase` route does NOT implement a purchase UI. It redirects the authenticated franchisee user to `https://order.sukabread.com?source=share&username={username}` — the external ordering platform — passing the franchisee username as a pre-fill parameter.

---

## 1. Tech Stack (Legacy)

| Layer | Technology | Version | Status |
|-------|-----------|---------|--------|
| Framework | Vue.js | ~2.6.11 | EOL |
| UI Library | Element UI | ~2.12.0 | Outdated |
| UI Library 2 | Vuetify | ~1.5.21 | Very outdated |
| State Management | Vuex | ~3.1.2 | Vue 2 only |
| Router | Vue Router | ~3.0.7 | Vue 2 only |
| HTTP | fetch (native) + whatwg-fetch polyfill | - | OK |
| Charts | Highcharts + highcharts-vue | ~8.0.0 | OK |
| Date | vue-moment (moment.js) | ~4.0.0 | Outdated |
| Auth Storage | secure-ls (encrypted localStorage) + vuex-persistedstate | - | OK |
| CSS | Bootstrap 4 + SCSS | ~4.3.1 | Outdated |
| Build | Vue CLI 3 | ~3.9.x | Very outdated |
| PWA | @vue/cli-plugin-pwa | - | Present |
| Maps | vue2-google-maps | - | Present (unused in core) |

---

## 2. Application Bootstrap Flow

```
main.js
  → mounts Vue app
  → bootstrap()
      → if store.Auth.token exists → AuthService.initialize() → GET /auth/me
          → if 200 OK → store.dispatch('App/ready') + store.dispatch('App/initialize', true)
          → if 401 → store.dispatch('Auth/signout') → clear localStorage
      → if no token → store.dispatch('App/ready') + store.dispatch('App/initialize', false)

app.vue render logic:
  → !ready || (authenticated && !initialized) → EntranceView (loading screen)
  → authenticated → Authorized layout
  → not authenticated → Unauthorized layout (login page)
```

**Auth state persisted fields:** `token`, `user`, `authenticated` (encrypted localStorage via secure-ls)

---

## 3. Authentication Flow

### Sign In
- POST `/auth/signin` with `{ username, password }`
- Response: `{ user, token }`
- Token stored in Vuex + persisted to encrypted localStorage
- JWT used as Bearer token on all subsequent requests

### Token Validation on Load
- On app boot: GET `/auth/me` to validate token
- If 401 → sign out and clear storage
- If OK → user is authenticated

### Sign Out
- Clear localStorage entirely
- Deauthenticate Vuex state

### Profile Update (own account)
- PUT `/auth/me` with `{ name, password, confirm_password }`
- Name and username are display-only (disabled fields) — only password can be changed

---

## 4. Module Inventory (All Routes)

| Route | Module | Description |
|-------|--------|-------------|
| `/sales/session` | Sales Sessions | List all cashier sessions |
| `/sales/session/:id` | Sales Session Detail | Session details + orders list |
| `/sales/session/:id/order/:orderID` | Sales Order Detail | Individual order detail |
| `/stock` | Stock | (Stub — "Hallo STOCK :)" — not implemented) |
| `/report/sales/outstanding` | Report Outstanding | Unpaid/open bills report |
| `/report/sales/daily` | Report Daily | Daily sales summary |
| `/report/sales/payment` | Report Settlement Monthly | Payment method breakdown by month |
| `/report/sales/payment/daily` | Report Settlement Daily | Payment method breakdown by session day |
| `/report/sales/item` | Report Item Sales | Items sold quantity report |
| `/cash/control` | Cash Control | Cash reconciliation per session |
| `/purchase` | Purchase | Redirects to order.sukabread.com (external) |
| `/setting/user` | User Management | List franchisee system users |
| `/setting/user/create` | Create User | Create new franchisee user |
| `/setting/user/:id/update` | Update User | Edit user details/password |
| `/auth/me` | Profile | Update own password |
| Default `*` | — | Redirects to `/sales/session` |

---

## 5. API Endpoints (All Consumed)

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/signin` | Login |
| GET | `/auth/me` | Validate token / get own profile |
| PUT | `/auth/me` | Update own name/password |

### Sales Sessions
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/sales/session` | List sessions (paginated, filterable) |
| GET | `/sales/session/:id` | Get single session detail |

### Sales Orders
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/sales/order` | List orders |
| GET | `/sales/order/:id` | Get single order detail |

### Inventory
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/inventory/stock` | List stock (read-only) |
| GET | `/inventory/adjustment/:id` | Get adjustment detail |
| POST | `/inventory/adjustment` | Create stock adjustment |
| PUT | `/inventory/adjustment/:id` | Update stock adjustment |
| PUT | `/inventory/adjustment/:id/approve` | Approve stock adjustment |
| DELETE | `/inventory/adjustment/:id` | Delete stock adjustment |

### Reports
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report/sales/daily` | Daily sales totals |
| GET | `/report/sales/outstanding` | Outstanding/open bills |
| GET | `/report/sales/outstanding/summary` | Outstanding summary total |
| GET | `/report/settlement` | Settlement by payment method (monthly/daily) |
| GET | `/report/settlement/summary` | Settlement summary by payment method |
| GET | `/report/sales/item` | Sales per item |
| GET | `/report/cash/control` | Cash control per session |

### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/user` | List users |
| GET | `/user/:id` | Get single user |
| POST | `/user` | Create user |
| PUT | `/user/:id` | Update user |
| DELETE | `/user/:id` | Delete user |
| PUT | `/user/:id/activate` | Activate user |
| PUT | `/user/:id/deactivate` | Deactivate user |

### Response Contract
All API responses follow:
```json
{ "status": "success", "data": {...} }        // single item
{ "status": "success", "data": [...], "total": N }  // paginated list
```
If `status !== "success"` → emit failure event, throw `{ validations, status }`.
Response type `application/octet-stream` or `text/csv` → trigger file download via FileSaver.

---

## 6. Data Entities (Frontend Model)

### Auth User
```
user: {
  id, name, username, is_supervisor
}
token: string (JWT Bearer)
```

### Sales Session
```
session: {
  id,
  transaction_date,      // date string
  started_at,            // datetime (HH:mm)
  finished_at,           // datetime ("0001-01-01T00:00:00Z" = ongoing)
  status,

  cash_started,          // opening cash
  cash_finished,         // closing cash
  cash_due,              // expected cash
  bill_payment,          // outstanding bill payments collected this session

  cashier: { name },

  summary_order: {
    total_nett,          // gross revenue before discounts
    total_discount,
    total_service_charge,
    total_charges,       // grand total = total_nett - discount + service_charge
    total_openbill,      // outstanding bills
  },

  cash_payments: [       // breakdown by payment method
    { payment_name, subtotal }
    // payment_name null = Cash
  ],

  category_solds: [      // breakdown by product category
    { name, quantity, total_charges }
  ],

  topups: [              // cash top-ups during session
    { name, nominal }
  ],

  sales_orders: [...]    // list of orders in this session
}
```

### Sales Order
```
order: {
  id, code,
  ordered_at,
  payment_ref,
  note,

  channel: { name },         // sales channel (dine-in, takeaway, online, etc.)
  payment_method: { name },  // null = CASH

  session: {
    id,
    cashier: { name }
  },

  total_bill,         // subtotal before discount
  discount_value,     // discount amount (shown only if > 0)
  service_charge,     // boolean flag
  service_charge_value,
  total_charges,      // final amount charged
  subtotal_tax,       // tax included in total

  sales_order_items: [
    {
      catalog: { name },
      additional_id,    // if set → item is an add-on (prefix "+" in UI)
      quantity,
      unit_nett,        // unit price
      total_nett        // line total
    }
  ]
}
```

### User
```
user: {
  id, name, username,
  is_active,          // boolean (toggle in list)
  is_supervisor,      // boolean (cannot be toggled by self)
  last_login_at       // datetime ("0001-01-01T00:00:00Z" = never)
}
```

### Cash Control (Report)
```
cash_control: {
  overview_cash: {
    total_transaction,  // total cash transactions
    total_topup,        // total cash top-ups
    total_session,      // total cash deposited/settled
    deficient           // shortfall
  },
  session_data: [
    {
      session,          // date
      cashier,          // name string
      transaction_cash,
      topup_cash,
      session_cash,
      status
    }
  ]
}
```

### Settlement Report
```
// Monthly view: one row per month
row: {
  periode,             // "YYYY-MM" or "YYYY"
  payment_methods: [], // array of payment method names (column headers)
  nominals: []         // array of values aligned to payment_methods
}

// Daily view: one row per session
row: {
  periode,
  started_at, finished_at,
  payment_methods: [],
  nominals: []
}

// Summary
summary: [
  { payment_method, nominal }
  // special values: 'Total', 'Outstanding', 'Member'
  // regular payment methods shown in small cards
  // special ones shown larger
]
```

### Stock (Outlet)
```
stock: {
  // fields unknown — page not implemented (stub only)
}
```

### Stock Adjustment
```
adjustment: {
  id, note,
  items: [{ ... }]
}
```

---

## 7. Business Rules Catalog

### BR-001: Session Status
- `finished_at === "0001-01-01T00:00:00Z"` → session is **Ongoing** (still active)
- Otherwise → session is **Closed/Finished**
- Status field controls badge color via `v-table-status` component

### BR-002: Payment Method Display
- `payment_method === null` → display as **"CASH"** (uppercase)
- `payment_method.name` otherwise → display uppercase
- Same for `cash_payments[].payment_name === null` → display as "Cash"

### BR-003: Order Item Display
- `additional_id` is set → item is an add-on, prefix with **"+"**
- Otherwise → regular item

### BR-004: Discount Visibility
- `discount_value > 0` → show Subtotal and Discount rows
- Otherwise → hide these rows (only show Total)

### BR-005: Service Charge Visibility
- `service_charge === true` → show Service row with `service_charge_value`
- Otherwise → hide

### BR-006: Total After Discount Calculation
- `Total After Discount = total_charges - total_service_charge`

### BR-007: User Self-Management Restrictions
- Current session user (`Auth.user.id === item.id`) → cannot toggle their own status
- If user `is_supervisor` → show checkmark icon instead of status toggle
- User cannot delete or deactivate themselves from user list

### BR-008: User Last Login
- `last_login_at === "0001-01-01T00:00:00Z"` → display as **"-"** (never logged in)

### BR-009: Cash Control Filters
- Filter by cashier (optional, zero = all)
- Filter by date range
- All filters send to `/report/cash/control`

### BR-010: Settlement Report — Payment Method Categorization
- Summary displays `payment_method` cards
- Special types (`Total`, `Outstanding`, `Member`) → larger card (col-lg-3)
- Regular payment types → smaller card (col-lg-2)

### BR-011: Settlement Monthly → Daily Drill-down
- Clicking row in Monthly view → navigates to Daily view with `month` param
- Daily view requires `$route.params.month` — if missing → redirect to monthly

### BR-012: Settlement Download
- Adding `downloadable: true` to request params → backend responds with file
- Response type `application/octet-stream` → auto-download via FileSaver

### BR-013: Outstanding Report
- Has download capability (`downloadable` param)
- Shows summary `total_charges` header value from separate summary endpoint
- Summary re-fetches when table filter changes

### BR-014: Purchase Module
- `/purchase` does NOT implement purchase UI
- On `beforeMount` → opens `https://order.sukabread.com?source=share&username={session.username}` in new tab
- This links franchisee to the external Suka Bread ordering platform

### BR-015: Date Range Filtering (Sales Sessions, Outstanding)
- End date is incremented by +1 day: `moment(end).add(1, 'days').format()`
- Sent as `date_range` array: `[start_at, end_at]`

### BR-016: Date Filter for Cash Control / Settlement
- Sent as `start_at` and `end_at` individually (not array)
- End date also +1 day

### BR-017: Profile Update
- Name and Username are read-only (disabled inputs)
- Only password and confirm_password can be changed

### BR-018: Table Configuration Persistence
- Table filter/pagination/sorting state saved in localStorage key `__tbx_{name}`
- Restored on next visit to same table

### BR-019: Stock Adjustment Approval
- Adjustment can be created, updated, approved, or deleted
- Approve action: PUT `/inventory/adjustment/:id/approve`
- Note: the Stock page UI is a stub — adjustment service exists but no UI

### BR-020: Currency Format
- Values displayed with `.toFixed(2)` and comma thousands separator
- Format: `1,234.56` (no Rp prefix in filter, prefix added manually in some templates)

---

## 8. Navigation / Menu Structure

The sidebar/top menu (inferred from routes and page structure) logically organizes into:

```
Penjualan (Sales)
  └── Session List (/sales/session) ← DEFAULT

Stok (/stock) [STUB]

Laporan (Reports)
  ├── Penjualan Harian (/report/sales/daily)
  ├── Outstanding (/report/sales/outstanding)
  ├── Settlement Monthly (/report/sales/payment)
  └── Penjualan Barang (/report/sales/item)

Cash Control (/cash/control)

Purchase (/purchase) [External redirect]

Pengaturan (Settings)
  ├── User Management (/setting/user)
  └── Update Profile (/auth/me)
```

---

## 9. UI/UX Patterns (Legacy)

### Layout
- Left panel: filters sidebar (`manager-left`)
- Right panel: main content (`manager-right`)
- Single-column detail pages via `page-single` component

### Table Component (`v-table`)
- Generic reusable table bound to Vuex `Table` state
- Configured via `name`, `apiPath`, `fields`, `filter` object
- Supports: pagination, sorting, column visibility, CSV download
- Filters sent as query params
- Config persisted in localStorage

### Status Badge (`v-table-status`)
- Renders colored badge based on `status` string

### Status Toggle (`v-table-status-toggle`)
- Toggle switch for boolean status (activate/deactivate)

### Form Action (`form-action`)
- Reusable submit + cancel buttons
- Accepts `loading` prop for loading state
- `canceled` prop for cancel nav link

### Selectors
- `select-user`: searchable dropdown for user selection (used in filters)
- `select-ingredient`: ingredient selector (select component)

### Notification Pattern
- Form success → redirect (via `watch: { success }`)
- Form failure → show errors inline via `state.Form.error`

---

## 10. State Management Modules

| Module | Purpose |
|--------|---------|
| `App` | App ready/initialized state |
| `Auth` | Authentication state (user, token, authenticated) — persisted |
| `Form` | Global form success/error state |
| `Activity` | Loading state tracker per operation |
| `Table` | Generic table state (config, data, filter, pagination) |
| `SalesSession` | Current viewed session data |
| `SalesOrder` | Current viewed order data |
| `OutletStock` | Stock list (read-only) |
| `StockAdjustment` | Adjustment CRUD state |
| `Report` | Report data fetching actions |
| `User` | User CRUD state |

---

## 11. Critical Business Logic Summary (MUST PRESERVE)

These rules are non-negotiable — they define the actual business behavior:

1. **Session lifecycle**: ongoing vs closed detection via sentinel date value
2. **Multi-payment-method tracking**: sessions show breakdown per payment type
3. **Cash reconciliation**: Starting Cash → Expected Cash → Ending Cash → Deficiency
4. **Cash Top-Up**: separate from sales, tracked per session
5. **Category sales breakdown**: per session, quantity + revenue per category
6. **Outstanding bills**: unpaid orders tracked at session and report level
7. **Settlement monthly drill-down**: year → month → day granularity
8. **Payment method summary**: dynamic columns (number of payment methods varies)
9. **Order pricing components**: nett → discount → after-discount → service charge → tax → total
10. **Add-on items**: visually differentiated with "+" prefix
11. **User activation toggle**: prevented for self; supervisor shown differently
12. **Purchase redirect**: opens external order platform with username auto-fill
13. **Downloadable reports**: outstanding + settlement support CSV/file export
14. **Date range +1 day normalization**: end date always incremented for inclusive range

---

*Research complete — source: `clients/web/franchisee/` reverse engineering*
*Ready for: `/specify franchisee-rebuild` → `/plan franchisee-rebuild`*
