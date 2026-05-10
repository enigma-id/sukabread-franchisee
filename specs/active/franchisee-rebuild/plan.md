# Technical Plan: Franchisee Web App v2

**Task ID:** franchisee-rebuild
**Created:** 2026-05-06
**Status:** Ready for Implementation
**Based on:** spec.md + research.md
**Version:** 1.0

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Browser (SPA)                      │
│                                                       │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────────┐│
│  │  React   │  │  Redux   │  │     RTK Query        ││
│  │  Router  │  │  Toolkit │  │   (API Cache Layer)  ││
│  │  v6      │  │  Store   │  │                      ││
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘│
│       │              │                    │            │
│  ┌────▼──────────────▼────────────────────▼──────────┐│
│  │              Page Components                       ││
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐ ││
│  │  │ Sales  │ │Reports │ │Settings│ │ Cash Ctrl  │ ││
│  │  └────────┘ └────────┘ └────────┘ └────────────┘ ││
│  └────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────┐│
│  │           Shared UI Components (Tailwind)          ││
│  │  DataTable │ StatusBadge │ CurrencyText │ Filters  ││
│  └────────────────────────────────────────────────────┘│
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS (Bearer JWT)
                        ▼
              ┌─────────────────┐
              │  Existing API   │
              │  (Unchanged)    │
              │  /auth/*        │
              │  /sales/*       │
              │  /report/*      │
              │  /user/*        │
              │  /inventory/*   │
              └─────────────────┘
```

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SPA vs SSR | SPA | Back-office portal, no SEO need, auth-gated |
| State management | Redux Toolkit + RTK Query | User requested RTK; RTK Query handles caching, loading states, error handling |
| Styling | Tailwind CSS | Utility-first, fast iteration, no unused CSS |
| Component library | Headless (custom) | Tailwind-native, no Element UI/Vuetify dependency |
| Table | TanStack Table | Headless, pagination, sorting, filtering — same flexibility as legacy v-table |
| Router | React Router v6 | Standard, nested routes, loaders |
| Build | Vite | Fast HMR, optimized production builds |
| Date | dayjs | Lightweight moment.js replacement, same API |
| Form | React Hook Form + Zod | Lightweight validation, type-safe schemas |

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Runtime** | React | 18.x | Stable, hooks, concurrent features |
| **Language** | TypeScript | 5.x | Strict mode, full type coverage |
| **State** | @reduxjs/toolkit | 2.x | User-requested; createSlice, createAsyncThunk |
| **API Layer** | RTK Query | (bundled w/ RTK) | Auto-caching, loading/error states, devtools |
| **Router** | react-router-dom | 6.x | Nested routes, outlet pattern |
| **Styling** | Tailwind CSS | 3.x | Utility-first, tree-shaken |
| **Tables** | @tanstack/react-table | 8.x | Headless, pagination, sorting |
| **Forms** | react-hook-form + zod | 7.x / 3.x | Performant forms, schema validation |
| **Date** | dayjs | 1.x | Lightweight, locale support (id) |
| **Charts** | recharts | 2.x | React-native charts (if needed) |
| **Icons** | lucide-react | latest | Clean SVG icons |
| **File Download** | file-saver | 2.x | Preserve legacy download behavior |
| **Storage** | redux-persist + encrypt-storage | latest | Encrypted localStorage (matches legacy secure-ls) |
| **Build** | Vite | 5.x | Fast dev, optimized prod |
| **PWA** | vite-plugin-pwa | latest | Service worker, manifest |
| **Testing** | Vitest + React Testing Library | latest | Fast, Vite-native |
| **Linting** | ESLint + Prettier | latest | Consistent code style |

### Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "redux-persist": "^6.0.0",
    "encrypt-storage": "^2.12.0",
    "@tanstack/react-table": "^8.17.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.23.0",
    "dayjs": "^1.11.0",
    "file-saver": "^2.0.5",
    "lucide-react": "^0.378.0",
    "recharts": "^2.12.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react-swc": "^3.7.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vite-plugin-pwa": "^0.20.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 3. Project Structure

```
franchisee-v2/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── pwa/
│       ├── app-64x64.png
│       ├── app-192x192.png
│       └── app-512x512.png
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root: auth gate + router
│   ├── vite-env.d.ts
│   │
│   ├── app/                        # Redux store setup
│   │   ├── store.ts                # configureStore
│   │   ├── hooks.ts                # useAppDispatch, useAppSelector
│   │   └── api.ts                  # RTK Query base API
│   │
│   ├── features/                   # Feature slices (Redux Toolkit)
│   │   ├── auth/
│   │   │   ├── authSlice.ts        # auth state + reducers
│   │   │   ├── authApi.ts          # RTK Query endpoints
│   │   │   └── types.ts
│   │   ├── sales/
│   │   │   ├── salesApi.ts         # sessions + orders endpoints
│   │   │   └── types.ts
│   │   ├── report/
│   │   │   ├── reportApi.ts        # all report endpoints
│   │   │   └── types.ts
│   │   ├── user/
│   │   │   ├── userApi.ts          # user CRUD endpoints
│   │   │   └── types.ts
│   │   ├── inventory/
│   │   │   ├── inventoryApi.ts     # stock + adjustment endpoints
│   │   │   └── types.ts
│   │   └── table/
│   │       ├── tableSlice.ts       # table config persistence
│   │       └── types.ts
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── sales/
│   │   │   ├── SessionListPage.tsx
│   │   │   ├── SessionDetailPage.tsx
│   │   │   └── OrderDetailPage.tsx
│   │   ├── report/
│   │   │   ├── DailySalesPage.tsx
│   │   │   ├── OutstandingPage.tsx
│   │   │   ├── SettlementMonthlyPage.tsx
│   │   │   ├── SettlementDailyPage.tsx
│   │   │   └── ItemSalesPage.tsx
│   │   ├── cash/
│   │   │   └── CashControlPage.tsx
│   │   ├── purchase/
│   │   │   └── PurchasePage.tsx
│   │   ├── settings/
│   │   │   ├── UserListPage.tsx
│   │   │   ├── UserCreatePage.tsx
│   │   │   └── UserUpdatePage.tsx
│   │   └── stock/
│   │       └── StockPage.tsx
│   │
│   ├── components/                 # Shared UI components
│   │   ├── layout/
│   │   │   ├── AuthLayout.tsx      # Authenticated shell (sidebar + topbar)
│   │   │   ├── GuestLayout.tsx     # Unauthenticated shell (login page)
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageSingle.tsx      # Single-column detail page wrapper
│   │   ├── tables/
│   │   │   ├── DataTable.tsx       # Generic TanStack Table wrapper
│   │   │   ├── TablePagination.tsx
│   │   │   ├── TableTools.tsx      # Search + download button area
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── StatusToggle.tsx
│   │   │   └── ActionDropdown.tsx
│   │   ├── form/
│   │   │   ├── FormAction.tsx      # Submit + cancel buttons
│   │   │   ├── InputField.tsx      # Label + input + error
│   │   │   ├── PasswordField.tsx
│   │   │   └── DateRangePicker.tsx
│   │   ├── select/
│   │   │   └── UserSelect.tsx      # Cashier/user searchable dropdown
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── MetricCard.tsx      # Overview statistic card
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ConfirmDialog.tsx
│   │       └── CurrencyText.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts              # Auth state shortcut
│   │   ├── useDateRangeFilter.ts   # Date range with +1 day normalization
│   │   ├── useTableConfig.ts       # Table config load/save from localStorage
│   │   └── useFileDownload.ts      # Handle octet-stream / csv responses
│   │
│   ├── lib/                        # Utilities
│   │   ├── api-client.ts           # Base fetch wrapper (for RTK Query baseQuery)
│   │   ├── currency.ts             # Currency formatting: toFixed(2) + commas
│   │   ├── date.ts                 # dayjs helpers, sentinel check, formatters
│   │   ├── storage.ts              # Encrypted localStorage wrapper
│   │   └── cn.ts                   # clsx + tailwind-merge utility
│   │
│   ├── router/
│   │   └── index.tsx               # All routes definition
│   │
│   └── styles/
│       └── globals.css             # Tailwind directives + custom base styles
│
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
├── .env
├── .env.production
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---

## 4. Component Design

### 4.1 App Root (App.tsx)

**Purpose:** Auth gate + router mount.

**Logic:**
```
if (!ready || (authenticated && !initialized)) → LoadingScreen
if (authenticated) → AuthLayout + protected routes
if (!authenticated) → GuestLayout + login route
```

Mirrors legacy `app.vue` render logic exactly.

### 4.2 RTK Query Base API (app/api.ts)

**Purpose:** Single API definition with JWT injection and response normalization.

**Responsibilities:**
- `baseUrl` from `VITE_API_URL` env var
- `prepareHeaders`: inject `Authorization: Bearer {token}` from store
- `transformResponse`: unwrap `{ status: "success", data }` envelope
- Handle pagination: if response has `total` field, return `{ data, total }`
- Handle file download: detect `content-type: application/octet-stream` or `text/csv` → trigger FileSaver
- Handle errors: if `status !== "success"` → return `{ validations }` for form display
- On 401 → dispatch `auth/signOut`

### 4.3 Auth Slice (features/auth/authSlice.ts)

**State:**
```typescript
interface AuthState {
  authenticated: boolean;
  user: User | null;
  token: string | null;
}
```

**Persisted fields:** `token`, `user`, `authenticated` (via redux-persist + encrypt-storage)

**Actions:** `setCredentials`, `signOut`

### 4.4 DataTable Component

**Purpose:** Generic reusable table replacing legacy `v-table`.

**Props:**
```typescript
interface DataTableProps<T> {
  name: string;                    // localStorage key prefix
  columns: ColumnDef<T>[];         // TanStack column definitions
  apiEndpoint: string;             // RTK Query endpoint name
  filters?: Record<string, any>;   // External filters
  toolbar?: ReactNode;             // Custom toolbar buttons
  downloadable?: boolean;          // Show download button
  emptyIcon?: string;
  emptyMessage?: string;
}
```

**Features:**
- Server-side pagination via RTK Query
- Sorting (column header click)
- Filter state management
- Config persistence in localStorage (`__tbx_{name}`)
- Download via `downloadable: true` query param

### 4.5 StatusBadge Component

**Props:** `status: string`
**Renders:** Colored pill badge based on status value (maps to Tailwind color classes).

### 4.6 StatusToggle Component

**Props:** `checked: boolean`, `onChange: (checked: boolean) => void`, `disabled?: boolean`
**Renders:** Toggle switch with on/off states.

### 4.7 MetricCard Component

**Props:** `label: string`, `value: number`, `size?: 'sm' | 'lg'`
**Renders:** Stat card with large number + small label. Used in Cash Control and Settlement reports.

### 4.8 DateRangePicker Component

**Props:** `value: [Date, Date] | null`, `onChange: (range: [Date, Date] | null) => void`
**Features:** Two date inputs or calendar popup. Produces date range.

---

## 5. Data Models (TypeScript Interfaces)

```typescript
// === Auth ===
interface User {
  id: number;
  name: string;
  username: string;
  is_supervisor: boolean;
  is_active?: boolean;
  last_login_at?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// === Sales Session ===
interface SalesSession {
  id: string;
  transaction_date: string;
  started_at: string;
  finished_at: string;           // "0001-01-01T00:00:00Z" = ongoing
  status: string;
  cash_started: number;
  cash_finished: number;
  cash_due: number;
  bill_payment: number;
  subtotal_order: number;
  cashier: { name: string };
  summary_order: OrderSummary;
  cash_payments: PaymentBreakdown[];
  category_solds: CategorySold[];
  topups: Topup[];
  sales_orders: SalesOrder[];
}

interface OrderSummary {
  total_nett: number;
  total_discount: number;
  total_service_charge: number;
  total_charges: number;
  total_openbill: number;
}

interface PaymentBreakdown {
  payment_name: string | null;    // null = Cash
  subtotal: number;
}

interface CategorySold {
  name: string;
  quantity: number;
  total_charges: number;
}

interface Topup {
  name: string;
  nominal: number;
}

// === Sales Order ===
interface SalesOrder {
  id: string;
  code: string;
  ordered_at: string;
  payment_ref: string;
  note: string;
  total_bill: number;
  discount_value: number;
  service_charge: boolean;
  service_charge_value: number;
  total_charges: number;
  subtotal_tax: number;
  channel: { name: string };
  payment_method: { name: string } | null;  // null = CASH
  session: {
    id: string;
    cashier: { name: string };
  };
  sales_order_items: OrderItem[];
  ticket?: string;
  membership?: { name: string } | null;
}

interface OrderItem {
  catalog: { name: string };
  additional_id: string | null;   // non-null = add-on (prefix "+")
  quantity: number;
  unit_nett: number;
  total_nett: number;
}

// === Reports ===
interface DailySalesRow {
  dates: string;
  total_order: number;
}

interface OutstandingSummary {
  total_charges: number;
}

interface SettlementRow {
  periode: string;
  payment_methods: string[];
  nominals: number[];
  started_at?: string;
  finished_at?: string;
}

interface SettlementSummaryItem {
  payment_method: string;         // "Total", "Outstanding", "Member" = special
  nominal: number;
}

interface CashControlData {
  overview_cash: {
    total_transaction: number;
    total_topup: number;
    total_session: number;
    deficient: number;
  };
  session_data: CashControlSession[];
}

interface CashControlSession {
  session: string;
  cashier: string;
  transaction_cash: number;
  topup_cash: number;
  session_cash: number;
  status: string;
}

// === Inventory ===
interface StockAdjustment {
  id: string;
  note: string;
  items: StockAdjustmentItem[];
}

interface StockAdjustmentItem {
  // fields TBD — service exists but UI is stub
}

// === Item Sales ===
interface ItemSalesRow {
  name: string;
  total_qty: number;
}

// === API Envelope ===
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  total?: number;
  errors?: Record<string, string>;
}

// === Table Config (persisted) ===
interface TableConfig {
  fields: Record<string, FieldConfig>;
  query: string;
  filter: Record<string, any>;
  currentPage: number;
  perPage: number;
  sorting: { field: string; order: 'asc' | 'desc' } | null;
}

interface FieldConfig {
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: number;
  class?: string;
}
```

---

## 6. API Layer Design (RTK Query)

### 6.1 Base Query Configuration

```typescript
// app/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const contentType = response.headers.get('content-type');

      // File download handling
      if (contentType === 'application/octet-stream') {
        const disposition = response.headers.get('Content-Disposition');
        const fileName = disposition?.split('filename=')[1] || 'download';
        const blob = await response.blob();
        saveAs(blob, fileName);
        return { data: null };
      }
      if (contentType === 'text/csv') {
        const blob = await response.blob();
        saveAs(blob, 'import.csv');
        return { data: null };
      }

      // JSON response
      const json = await response.json();
      if (json.status !== 'success') {
        return { error: { validations: json.errors, status: response.status } };
      }
      if (json.total !== undefined) {
        return { data: json.data, total: json.total };
      }
      return json.data;
    },
  }),
  tagTypes: ['Session', 'Order', 'User', 'Report'],
  endpoints: () => ({}),
});
```

### 6.2 Feature API Slices

Each feature injects endpoints into the base API:

**Auth API:** `signin`, `getMe`, `updateProfile`
**Sales API:** `getSessions`, `getSession`, `getOrder`
**Report API:** `getDailySales`, `getOutstanding`, `getOutstandingSummary`, `getSettlement`, `getSettlementSummary`, `getSalesItem`, `getCashControl`
**User API:** `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser`, `activateUser`, `deactivateUser`
**Inventory API:** `getStock`, `getAdjustment`, `createAdjustment`, `updateAdjustment`, `approveAdjustment`, `deleteAdjustment`

---

## 7. Router Design

```typescript
// router/index.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,       // sidebar + topbar, requires auth
    children: [
      { index: true, element: <Navigate to="/sales/session" /> },
      // Sales
      { path: 'sales/session', element: <SessionListPage /> },
      { path: 'sales/session/:id', element: <SessionDetailPage /> },
      { path: 'sales/session/:id/order/:orderId', element: <OrderDetailPage /> },
      // Stock
      { path: 'stock', element: <StockPage /> },
      // Reports
      { path: 'report/sales/daily', element: <DailySalesPage /> },
      { path: 'report/sales/outstanding', element: <OutstandingPage /> },
      { path: 'report/sales/payment', element: <SettlementMonthlyPage /> },
      { path: 'report/sales/payment/daily', element: <SettlementDailyPage /> },
      { path: 'report/sales/item', element: <ItemSalesPage /> },
      // Cash
      { path: 'cash/control', element: <CashControlPage /> },
      // Purchase
      { path: 'purchase', element: <PurchasePage /> },
      // Settings
      { path: 'setting/user', element: <UserListPage /> },
      { path: 'setting/user/create', element: <UserCreatePage /> },
      { path: 'setting/user/:id/update', element: <UserUpdatePage /> },
      { path: 'auth/me', element: <ProfilePage /> },
      // Catch-all
      { path: '*', element: <Navigate to="/sales/session" /> },
    ],
  },
  {
    path: '/login',
    element: <GuestLayout />,
    children: [
      { index: true, element: <LoginPage /> },
    ],
  },
]);
```

---

## 8. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| JWT storage | Encrypted localStorage via encrypt-storage (matches legacy secure-ls) |
| Token expiry | On 401 → auto sign-out + redirect to login |
| XSS | React auto-escapes JSX; no `dangerouslySetInnerHTML` |
| CSRF | Not applicable (Bearer token auth, no cookies) |
| Password fields | `autocomplete="new-password"` |
| API key exposure | Google Maps key in env var, not committed |

---

## 9. Performance Strategy

| Strategy | Implementation |
|----------|---------------|
| Code splitting | React.lazy + Suspense per route |
| API caching | RTK Query auto-cache with tag invalidation |
| Bundle optimization | Vite tree-shaking + chunk splitting |
| Image optimization | Static assets in /public, lazy loading |
| Table virtualization | TanStack Virtual for large datasets (future) |
| CSS purging | Tailwind JIT — only used classes in bundle |

---

## 10. Implementation Phases

### Phase 1: Foundation (3 days)
- [ ] Project scaffolding (Vite + React + TS + Tailwind)
- [ ] Redux Toolkit store + persist + encrypted storage
- [ ] RTK Query base API with response handler
- [ ] Auth slice + auth API (signin, getMe, signOut)
- [ ] Router with auth guard
- [ ] AuthLayout (sidebar + topbar) + GuestLayout
- [ ] Login page
- [ ] Profile page

### Phase 2: Sales Module (3 days)
- [ ] Sales Session List page + DataTable component
- [ ] Date range filter hook + component
- [ ] Session Detail page (3 info panels + transaction table)
- [ ] Order Detail page (items table + pricing section)
- [ ] StatusBadge + CurrencyText components

### Phase 3: Reports Module (3 days)
- [ ] Daily Sales page
- [ ] Outstanding page (summary header + download)
- [ ] Settlement Monthly page (dynamic columns + drill-down)
- [ ] Settlement Daily page
- [ ] Item Sales page
- [ ] MetricCard component
- [ ] File download hook

### Phase 4: Settings + Cash (2 days)
- [ ] Cash Control page (overview cards + session table)
- [ ] User Management list (status toggle, self-protection)
- [ ] User Create page (form + validation)
- [ ] User Update page (pre-fill + form)
- [ ] Purchase redirect page

### Phase 5: Polish (2 days)
- [ ] PWA configuration (manifest, service worker, icons)
- [ ] Empty states + loading states + error boundaries
- [ ] Table config persistence in localStorage
- [ ] TypeScript strict mode pass (zero errors)
- [ ] Unit tests for business logic utilities
- [ ] E2E smoke tests (auth, session list, report)
- [ ] Lighthouse audit + bundle analysis
- [ ] Production build + deployment config

---

## 11. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| API response shape mismatch | High | Low | Test against real API during Phase 1 |
| Settlement dynamic columns | Medium | Medium | Build flexible column generator, test with real data |
| File download content-type detection | Medium | Low | Replicate exact legacy logic in baseQuery |
| Redux-persist + encrypt-storage compatibility | Medium | Low | Test early in Phase 1 |
| Date sentinel value handling | Low | Low | Create shared utility, test all sentinel comparisons |
| Legacy mixed ID/EN labels | Low | Low | Copy exact strings from legacy codebase |

---

## 12. Open Questions

- [ ] Should RTK Query `baseQuery` use `fetchBaseQuery` (fetch) or `axiosBaseQuery` (axios)?
- [ ] Should table config persistence use RTK slice or standalone localStorage hook?
- [ ] Should encrypted storage use same `secure-ls` library or modern `encrypt-storage`?
- [ ] Deployment target: Firebase Hosting, Vercel, or Docker?

---

## Next Steps

1. Run `/tasks franchisee-rebuild` to generate implementation task breakdown
2. Run `/implement franchisee-rebuild` to start building

---

*Plan created with SDD 4.0*
