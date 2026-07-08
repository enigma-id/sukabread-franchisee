# API Contract — Franchise Module

Base path: `/api/v1/franchise` (internal) or direct via API gateway.

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "success",
  "data": { ... }
}
```

### Paginated
```json
{
  "success": true,
  "message": "success",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "page_size": 10,
    "total": 50,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": "Validation error message"
  }
}
```

---

## 1. Authentication

### POST /auth/login

Authenticate franchise user (outlet owner/cashier).

**Auth:** None (`s.WithAuth(false)`)

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `phone` | string | yes | valid phone number |
| `password` | string | yes | min length |

**Response `data`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "display_name": "string",
    "phone": "string",
    "role": "outlet_owner | cashier"
  },
  "outlet": {
    "id": "uuid",
    "name": "string",
    "outlet_type_id": "uuid",
    "brand_id": "uuid"
  }
}
```

---

## 2. Profile

### GET /profile/me

Get current authenticated user's profile.

**Auth:** Bearer token (`s.Restricted()`)

**Response `data`:**
```json
{
  "id": "uuid",
  "display_name": "string",
  "phone": "string",
  "email": "string",
  "role": "string",
  "outlet": {
    "id": "uuid",
    "name": "string",
    "address": "string",
    "outlet_type_id": "uuid"
  }
}
```

### PUT /profile/me

Update current user profile.

**Auth:** Bearer token

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `display_name` | string | no | |
| `phone` | string | no | valid phone |
| `email` | string | no | email format |

---

## 3. Outlet

### PUT /outlet

Update outlet settings (service charges, etc.).

**Auth:** Bearer token

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `service_charges` | float64 | no | |
| `name` | string | no | |
| `address` | string | no | |

**Response `data`:**
```json
{
  "id": "uuid",
  "name": "string",
  "service_charges": 0.0,
  "address": "string"
}
```

### GET /outlet/balance/log

Get outlet balance mutation history.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "outlet_id": "uuid",
    "type": "topup | withdrawal | payment",
    "amount": 100000,
    "balance_before": 500000,
    "balance_after": 400000,
    "reference": "string",
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

---

## 4. Catalog Outlet

### GET /catalog-outlet

List catalog items assigned to the current outlet (manage active/inactive).

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `status` | string | Filter: `active`, `inactive` |
| `q` | string | Search keyword |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "catalog_id": "uuid",
    "catalog_name": "string",
    "category_name": "string",
    "min_stock": 0,
    "max_stock": 0,
    "base_price": 50000,
    "is_active": true,
    "stock": 100
  }
]
```

### GET /catalog-outlet/{id}

Get catalog outlet detail.

**Auth:** Bearer token

**Path Params:** `id` (uuid) — Catalog outlet ID

**Response `data`:**
```json
{
  "id": "uuid",
  "catalog_id": "uuid",
  "catalog_name": "string",
  "description": "string",
  "category_name": "string",
  "min_stock": 0,
  "max_stock": 0,
  "base_price": 50000,
  "is_active": true,
  "stock": 100,
  "fractions": [
    {
      "id": "uuid",
      "name": "kg",
      "value": 1.0
    }
  ]
}
```

### PUT /catalog-outlet/{id}

Update `min_stock` and `max_stock` for catalog in outlet.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `min_stock` | int | no | >= 0 |
| `max_stock` | int | no | >= min_stock |

### PUT /catalog-outlet/{id}/activate

Activate catalog in specific outlet.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

### PUT /catalog-outlet/{id}/deactivate

Deactivate catalog in specific outlet.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

---

## 5. Stock Management

### GET /stock

List current stock levels per outlet.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `catalog_id` | uuid | Filter by catalog |
| `q` | string | Search by name |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "catalog_id": "uuid",
    "catalog_name": "string",
    "stock": 100,
    "min_stock": 10,
    "max_stock": 200,
    "fraction": {
      "id": "uuid",
      "name": "kg"
    }
  }
]
```

### GET /stock/log

Audit log of stock movements.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |
| `type` | string | Movement type: `in`, `out`, `adjustment` |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "catalog_id": "uuid",
    "catalog_name": "string",
    "type": "in | out | adjustment",
    "quantity": 50,
    "stock_before": 100,
    "stock_after": 150,
    "reference": "SO-XXXXXX",
    "note": "string",
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

---

## 6. User Management (Cashier)

### GET /user

List cashiers per outlet.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `status` | string | Filter: `active`, `inactive` |
| `q` | string | Search by name/phone |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "display_name": "string",
    "phone": "string",
    "role": "cashier",
    "is_active": true,
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

### POST /user

Create new cashier.

**Auth:** Bearer token

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `display_name` | string | yes | |
| `phone` | string | yes | valid phone, unique |
| `password` | string | yes | min 6 chars |

### GET /user/{id}

Get cashier detail.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

### PUT /user/{id}

Update cashier (name, role, status).

**Auth:** Bearer token

**Path Params:** `id` (uuid)

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `display_name` | string | no | |
| `phone` | string | no | valid phone |
| `password` | string | no | min 6 chars |
| `is_active` | bool | no | |

### DELETE /user/{id}

Soft-delete cashier.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

---

## 7. Membership

### GET /membership

List all member cards for the outlet.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `q` | string | Search by name/phone/card number |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "card_number": "string",
    "member_name": "string",
    "phone": "string",
    "balance": 500000,
    "point": 1500,
    "is_active": true,
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

### GET /membership/{id}

Get member detail & balance.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

**Response `data`:**
```json
{
  "id": "uuid",
  "card_number": "string",
  "member_name": "string",
  "phone": "string",
  "email": "string",
  "balance": 500000,
  "point": 1500,
  "is_active": true,
  "created_at": "2026-07-08T10:00:00Z"
}
```

### GET /membership/{id}/log

Get member balance history.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "type": "topup | payment | refund",
    "amount": 50000,
    "balance_before": 450000,
    "balance_after": 500000,
    "reference": "string",
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

---

## 8. Sales Session & Order

### GET /sales/session

List all sales sessions for the outlet.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `start_date` | string | Filter start (YYYY-MM-DD) |
| `end_date` | string | Filter end (YYYY-MM-DD) |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "session_number": 1,
    "opened_at": "2026-07-08T08:00:00Z",
    "closed_at": null,
    "status": "open | closed",
    "total_sales": 1500000,
    "total_transactions": 25,
    "opened_by": "string"
  }
]
```

### GET /sales/session/{id}

Get session detail with transaction summary.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

### GET /sales/order/{id}

Get POS order detail with items.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

**Response `data`:**
```json
{
  "id": "uuid",
  "code": "POS-XXXXXXXX",
  "session_id": "uuid",
  "total_amount": 150000,
  "payment_method": "cash | qris | etc",
  "items": [
    {
      "id": "uuid",
      "catalog_name": "string",
      "quantity": 2,
      "unit_price": 75000,
      "subtotal": 150000
    }
  ],
  "created_at": "2026-07-08T10:00:00Z"
}
```

---

## 9. Payment Method

### GET /payment-method

List payment methods available for the franchise.

**Auth:** Bearer token

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "provider": "saldo | midtrans | xendit",
    "is_active": true
  }
]
```

---

## 10. Withdrawal Request

### GET /withdrawal-request

List outlet withdrawal requests.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `status` | string | Filter: `pending`, `approved`, `rejected`, `completed` |

**Response `data`:**
```json
[
  {
    "id": "uuid",
    "amount": 500000,
    "bank_name": "string",
    "account_number": "string",
    "account_name": "string",
    "status": "pending | approved | rejected | completed",
    "note": "string",
    "created_at": "2026-07-08T10:00:00Z"
  }
]
```

### GET /withdrawal-request/{id}

Get withdrawal request detail.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

### POST /withdrawal-request

Create new withdrawal request.

**Auth:** Bearer token

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `amount` | float64 | yes | > 0, <= outlet balance |
| `bank_name` | string | yes | |
| `account_number` | string | yes | |
| `account_name` | string | yes | |
| `note` | string | no | |

### PUT /withdrawal-request/{id}/cancel

Cancel pending withdrawal request.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

---

## 11. Outlet Topup Request

### GET /outlet-topup-request

List outlet topup requests.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `status` | string | Filter: `pending`, `approved`, `rejected`, `completed` |

### GET /outlet-topup-request/{id}

Get topup request detail.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

### POST /outlet-topup-request

Create topup request (saldo充值).

**Auth:** Bearer token

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `amount` | float64 | yes | > 0 |
| `note` | string | no | |

### DELETE /outlet-topup-request/{id}

Cancel/reject pending topup request.

**Auth:** Bearer token

**Path Params:** `id` (uuid)

---

## 12. Dashboard

### GET /dashboard

Get outlet dashboard summary.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `period` | string | `today`, `this_week`, `this_month` (default: `today`) |

**Response `data`:**
```json
{
  "total_sales_today": 2500000,
  "total_orders_today": 35,
  "outlet_balance": 5000000,
  "total_members": 120,
  "low_stock_items": 5,
  "pending_withdrawal": 1,
  "pending_topup": 0
}
```

---

## 13. Reports

### GET /report/cash-control

Cash control report.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `start_date` | string | (YYYY-MM-DD) |
| `end_date` | string | (YYYY-MM-DD) |

### GET /report/cash-control/summary

**Response `data`:**
```json
{
  "total_income": 5000000,
  "total_expense": 3000000,
  "net_cash": 2000000,
  "period_start": "2026-07-01",
  "period_end": "2026-07-08"
}
```

### GET /report/outstanding

Outstanding receivables/payables report.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `page_size` | int | Items per page |
| `type` | string | `receivable`, `payable` |

### GET /report/outstanding/summary

### GET /report/settlement

Settlement report.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | |
| `page_size` | int | |
| `start_date` | string | |
| `end_date` | string | |

### GET /report/settlement/summary

### GET /report/product-sales

Product sales report.

**Auth:** Bearer token

**Query Params:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | |
| `page_size` | int | |
| `start_date` | string | |
| `end_date` | string | |
| `catalog_id` | uuid | Filter by catalog |

### GET /report/product-sales/summary

---

## 14. gRPC Service: FranchiseReportService (Internal)

Used by franchisor module to pull franchise-side report data.

**Service:** `FranchiseReportService`

| Method | Request | Response | Description |
|--------|---------|----------|-------------|
| `GetCashControl` | `ReportRequest` | `ReportResponse` | Pull cash control data |
| `GetOutstanding` | `ReportRequest` | `ReportResponse` | Pull outstanding data |
| `GetSettlement` | `ReportRequest` | `ReportResponse` | Pull settlement data |
| `GetProductSales` | `ReportRequest` | `ReportResponse` | Pull product sales data |

**Common Request:**
```protobuf
message ReportRequest {
  string franchisor_id = 1;
  string outlet_id = 2;
  string start_date = 3;
  string end_date = 4;
  int32 page = 5;
  int32 page_size = 6;
}
```

---

## Event Pub/Sub

### Subscribed Events

| Event | Publisher | Action |
|-------|-----------|--------|
| `franchisor:signup` | franchisor-api | Create brand + admin user |
| `franchisor:brand.updated` | franchisor-api | Update brand row |
| `franchisor:brand.deleted` | franchisor-api | Soft-delete brand |
| `franchisor:outlet.created` | franchisor-api | Insert outlet + user |
| `franchisor:outlet.updated` | franchisor-api | Update outlet |
| `franchisor:outlet.deleted` | franchisor-api | Soft-delete outlet |
| `franchisor:menu.created` | franchisor-api | Insert catalog |
| `franchisor:menu.updated` | franchisor-api | Update catalog |
| `franchisor:menu.deleted` | franchisor-api | Soft-delete catalog |
| `franchisor:menu.category.created` | franchisor-api | Insert catalog_category |
| `franchisor:menu.category.updated` | franchisor-api | Update catalog_category |
| `franchisor:menu.category.deleted` | franchisor-api | Soft-delete catalog_category |
| `franchisor:catalog.created` | franchisor-api | Insert ingredient |
| `franchisor:catalog.updated` | franchisor-api | Update ingredient |
| `franchisor:catalog.deleted` | franchisor-api | Soft-delete ingredient |
| `franchisor:catalog.activated` | franchisor-api | Activate ingredient |
| `franchisor:catalog.deactivated` | franchisor-api | Deactivate ingredient |
| `franchisor:payment.method.created` | franchisor-api | Insert payment_method |
| `franchisor:payment.method.updated` | franchisor-api | Update payment_method |
| `franchisor:payment.method.deleted` | franchisor-api | Soft-delete payment_method |
| `franchisor:pos.channel.created` | franchisor-api | Insert sales_channel |
| `franchisor:pos.channel.updated` | franchisor-api | Update sales_channel |
| `franchisor:pos.channel.deleted` | franchisor-api | Soft-delete sales_channel |
| `warehouse:delivery.order.completed` | warehouse-api | Increment stock |
| `franchisor:item.base_price.updated` | franchisor-api | Update base price |
| `franchisor:menu.assigned_to_outlet_type` | franchisor-api | Insert catalog_outlet rows |
