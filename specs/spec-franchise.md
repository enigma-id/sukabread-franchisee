# Franchise Module — Implementation Spec

## 1. Entities

### Brand
```go
type Brand struct {
    bun.BaseModel `bun:"table:brands"`

    ID        uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    RefID     uuid.UUID `bun:"ref_id,unique,notnull" json:"ref_id"`
    Code      string    `bun:"code,unique,notnull" json:"code"`
    Name      string    `bun:"name,notnull" json:"name"`
    Address   string    `bun:"address" json:"address"`
    Phone     string    `bun:"phone" json:"phone"`
    Logo      string    `bun:"logo" json:"logo"`
    IsActive  bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt time.Time `bun:"updated_at" json:"updated_at"`
}
```

### Outlet
```go
type Outlet struct {
    bun.BaseModel `bun:"table:outlets"`

    ID             uuid.UUID  `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    RefID          uuid.UUID  `bun:"ref_id,unique,notnull" json:"ref_id"`
    BrandID        uuid.UUID  `bun:"brand_id,notnull" json:"brand_id"`
    OutletTypeID   uuid.UUID  `bun:"outlet_type_id,notnull" json:"outlet_type_id"`
    Name           string     `bun:"name,notnull" json:"name"`
    Address        string     `bun:"address" json:"address"`
    Phone          string     `bun:"phone" json:"phone"`
    ServiceCharge  float64    `bun:"service_charge" json:"service_charge"`
    IsActive       bool       `bun:"is_active,default:true" json:"is_active"`
    Balance        float64    `bun:"balance,default:0" json:"balance"`
    LastActivityAt *time.Time `bun:"last_activity_at" json:"last_activity_at"`
    CreatedAt      time.Time  `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt      time.Time  `bun:"updated_at" json:"updated_at"`
}
```

### User
```go
type User struct {
    bun.BaseModel `bun:"table:users,alias:users"`

    ID             uuid.UUID  `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    BrandID        uuid.UUID  `bun:"brand_id,notnull" json:"brand_id"`
    OutletID       uuid.UUID  `bun:"outlet_id,notnull" json:"outlet_id"`
    Username       string     `bun:"username,unique,notnull" json:"username"`
    Password       string     `bun:"password,notnull" json:"-"`
    Name           string     `bun:"name,notnull" json:"name"`
    Role           string     `bun:"role,notnull" json:"role"`
    IsActive       bool       `bun:"is_active,default:true" json:"is_active"`
    LastActivityAt *time.Time `bun:"last_activity_at" json:"last_activity_at"`
    CreatedAt      time.Time  `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt      time.Time  `bun:"updated_at,default:current_timestamp" json:"updated_at"`
}
```

### OutletStock
```go
type OutletStock struct {
    bun.BaseModel `bun:"table:outlet_stocks"`

    ID           uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID     uuid.UUID `bun:"outlet_id,notnull,unique:outlet_catalog" json:"outlet_id"`
    CatalogID    uuid.UUID `bun:"catalog_id,notnull,unique:outlet_catalog" json:"catalog_id"`
    CatalogName  string    `bun:"catalog_name,notnull" json:"catalog_name"`
    CategoryName string    `bun:"category_name,notnull" json:"category_name"`
    Quantity     float64   `bun:"quantity,default:0" json:"quantity"`
    MinStock     float64   `bun:"min_stock,default:0" json:"min_stock"`
    MaxStock     float64   `bun:"max_stock,default:0" json:"max_stock"`
    BasePrice    float64   `bun:"base_price,default:0" json:"base_price"`
    IsActive     bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt    time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt    time.Time `bun:"updated_at" json:"updated_at"`
}
```

### OutletStockLog
```go
type OutletStockLog struct {
    bun.BaseModel `bun:"table:outlet_stock_logs"`

    ID          uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID    uuid.UUID `bun:"outlet_id,notnull" json:"outlet_id"`
    CatalogID   uuid.UUID `bun:"catalog_id,notnull" json:"catalog_id"`
    Type        string    `bun:"type,notnull" json:"type"` // in, out, adjustment
    Quantity    float64   `bun:"quantity,notnull" json:"quantity"`
    QtyBefore   float64   `bun:"qty_before,notnull" json:"qty_before"`
    QtyAfter    float64   `bun:"qty_after,notnull" json:"qty_after"`
    Reference   string    `bun:"reference" json:"reference"`
    Description string    `bun:"description" json:"description"`
    CreatedBy   string    `bun:"created_by" json:"created_by"`
    CreatedAt   time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
}
```

### SalesChannel
```go
type SalesChannel struct {
    bun.BaseModel `bun:"table:sales_channel"`

    ID        uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    RefID     uuid.UUID `bun:"ref_id,unique,notnull" json:"ref_id"`
    BrandID   uuid.UUID `bun:"brand_id,notnull" json:"brand_id"`
    Name      string    `bun:"name,notnull" json:"name"`
    IsActive  bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt time.Time `bun:"updated_at" json:"updated_at"`
}
```

### PaymentMethod
```go
type PaymentMethod struct {
    bun.BaseModel `bun:"table:payment_methods"`

    ID        uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    RefID     uuid.UUID `bun:"ref_id,unique,notnull" json:"ref_id"`
    BrandID   uuid.UUID `bun:"brand_id,notnull" json:"brand_id"`
    Name      string    `bun:"name,notnull" json:"name"`
    Provider  string    `bun:"provider,notnull" json:"provider"` // saldo, midtrans, xendit
    IsActive  bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt time.Time `bun:"updated_at" json:"updated_at"`
}
```

### Catalog
```go
type Catalog struct {
    bun.BaseModel `bun:"table:catalogs"`

    ID           uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    RefID        uuid.UUID `bun:"ref_id,unique,notnull" json:"ref_id"`
    BrandID      uuid.UUID `bun:"brand_id,notnull" json:"brand_id"`
    CategoryID   uuid.UUID `bun:"category_id,notnull" json:"category_id"`
    Name         string    `bun:"name,notnull" json:"name"`
    Description  string    `bun:"description" json:"description"`
    BasePrice    float64   `bun:"base_price,default:0" json:"base_price"`
    IsActive     bool      `bun:"is_active,default:true" json:"is_active"`
    ImageURL     string    `bun:"image_url" json:"image_url"`
    CreatedAt    time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt    time.Time `bun:"updated_at" json:"updated_at"`

    Category *Category `bun:"rel:belongs-to,join:category_id=id" json:"category,omitempty"`
}
```

### CatalogOutlet
```go
type CatalogOutlet struct {
    bun.BaseModel `bun:"table:catalog_outlet"`

    ID        uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID  uuid.UUID `bun:"outlet_id,notnull,unique:catalog_outlet" json:"outlet_id"`
    CatalogID uuid.UUID `bun:"catalog_id,notnull,unique:catalog_outlet" json:"catalog_id"`
    MinStock  float64   `bun:"min_stock,default:0" json:"min_stock"`
    MaxStock  float64   `bun:"max_stock,default:0" json:"max_stock"`
    IsActive  bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt time.Time `bun:"updated_at" json:"updated_at"`
}
```

### Membership (MemberCard)
```go
type Membership struct {
    bun.BaseModel `bun:"table:member_cards"`

    ID         uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID   uuid.UUID `bun:"outlet_id,notnull" json:"outlet_id"`
    CardNumber string    `bun:"card_number,unique,notnull" json:"card_number"`
    MemberName string    `bun:"member_name,notnull" json:"member_name"`
    Phone      string    `bun:"phone" json:"phone"`
    Email      string    `bun:"email" json:"email"`
    Balance    float64   `bun:"balance,default:0" json:"balance"`
    Point      float64   `bun:"point,default:0" json:"point"`
    IsActive   bool      `bun:"is_active,default:true" json:"is_active"`
    CreatedAt  time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt  time.Time `bun:"updated_at" json:"updated_at"`
}
```

### SalesOrder
```go
type SalesOrder struct {
    bun.BaseModel `bun:"table:sales_orders"`

    ID              uuid.UUID  `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID        uuid.UUID  `bun:"outlet_id,notnull" json:"outlet_id"`
    SessionID       uuid.UUID  `bun:"session_id" json:"session_id"`
    ChannelID       uuid.UUID  `bun:"channel_id" json:"channel_id"`
    Code            string     `bun:"code,notnull" json:"code"`
    CustomerName    string     `bun:"customer_name" json:"customer_name"`
    TotalSales      float64    `bun:"total_sales,default:0" json:"total_sales"`
    TotalDiscount   float64    `bun:"total_discount,default:0" json:"total_discount"`
    TotalService    float64    `bun:"total_service,default:0" json:"total_service"`
    GrandTotal      float64    `bun:"grand_total,default:0" json:"grand_total"`
    PaymentMethod   string     `bun:"payment_method" json:"payment_method"`
    AmountPaid      float64    `bun:"amount_paid,default:0" json:"amount_paid"`
    AmountChange    float64    `bun:"amount_change,default:0" json:"amount_change"`
    IsBill          bool       `bun:"is_bill,default:false" json:"is_bill"`
    BillStatus      string     `bun:"bill_status" json:"bill_status"` // unpaid, paid
    DocumentStatus  string     `bun:"document_status,notnull" json:"document_status"`
    CreatedAt       time.Time  `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt       time.Time  `bun:"updated_at" json:"updated_at"`

    Items []*SalesOrderItem `bun:"rel:has-many,join:id=order_id" json:"items,omitempty"`
}
```

### SalesOrderItem
```go
type SalesOrderItem struct {
    bun.BaseModel `bun:"table:sales_order_item"`

    ID                   uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OrderID              uuid.UUID `bun:"order_id,notnull" json:"order_id"`
    AdditionalID         uuid.UUID `bun:"additional_id,nullzero" json:"additional_id"`
    CatalogID            uuid.UUID `bun:"catalog_id,notnull" json:"catalog_id"`
    CatalogName          string    `bun:"catalog_name,notnull" json:"catalog_name"`
    CategoryName         string    `bun:"category_name,notnull" json:"category_name"`
    UnitBase             float64   `bun:"unit_base,notnull" json:"unit_base"`
    UnitGross            float64   `bun:"unit_gross,notnull" json:"unit_gross"`
    DiscountPercentage   float64   `bun:"discount_percentage" json:"discount_percentage"`
    DiscountValue        float64   `bun:"discount_value,notnull" json:"discount_value"`
    IsDiscountPercentage bool      `bun:"is_discount_percentage,notnull" json:"is_discount_percentage"`
    UnitNett             float64   `bun:"unit_nett,notnull" json:"unit_nett"`
    UnitTax              float64   `bun:"unit_tax,notnull" json:"unit_tax"`
    UnitTaxed            float64   `bun:"unit_taxed,notnull" json:"unit_taxed"`
    UnitBill             float64   `bun:"unit_bill,notnull" json:"unit_bill"`
    Quantity             float64   `bun:"quantity,notnull" json:"quantity"`

    Catalog *Catalog          `bun:"rel:belongs-to,join:catalog_id=id" json:"catalog,omitempty"`
    Addons  []*SalesOrderItem `bun:"rel:has-many,join:id=additional_id" json:"addons,omitempty"`
}
```

### SalesSession
```go
type SalesSession struct {
    bun.BaseModel `bun:"table:sales_session"`

    ID              uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    OutletID        uuid.UUID `bun:"outlet_id,notnull" json:"outlet_id"`
    CashierID       uuid.UUID `bun:"cashier_id,notnull" json:"cashier_id"`
    TransactionDate time.Time `bun:"transaction_date,type:date" json:"transaction_date"`
    StartedAt       time.Time `bun:"started_at,notnull" json:"started_at"`
    FinishedAt      time.Time `bun:"finished_at" json:"finished_at"`
    CashStarted     float64   `bun:"cash_started,notnull" json:"cash_started"`
    CashFinished    float64   `bun:"cash_finished" json:"cash_finished"`
    Status          string    `bun:"status,notnull" json:"status"` // open, closed
    CreatedAt       time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt       time.Time `bun:"updated_at" json:"updated_at"`

    Outlet  *Outlet              `bun:"rel:belongs-to,join:outlet_id=id" json:"outlet,omitempty"`
    Cashier *User                `bun:"rel:belongs-to,join:cashier_id=id" json:"cashier,omitempty"`
    Summary *SalesSessionSummary `bun:"rel:has-one,join:id=session_id" json:"summary,omitempty"`
    Orders  []*SalesOrder        `bun:"rel:has-many,join:id=session_id" json:"orders,omitempty"`
}
```

### WithdrawalRequest
```go
type WithdrawalRequest struct {
    bun.BaseModel `bun:"table:withdrawal_request,alias:withdrawal_request"`

    ID                uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    BrandID           uuid.UUID `bun:"brand_id,notnull" json:"brand_id"`
    OutletID          uuid.UUID `bun:"outlet_id,notnull" json:"outlet_id"`
    Code              string    `bun:"code,notnull" json:"code"`
    Amount            float64   `bun:"amount,notnull" json:"amount"`
    BalanceAtRequest  float64   `bun:"balance_at_request,notnull" json:"balance_at_request"`
    BankName          string    `bun:"bank_name,notnull" json:"bank_name"`
    BankAccountName   string    `bun:"bank_account_name,notnull" json:"bank_account_name"`
    BankAccountNumber string    `bun:"bank_account_number,notnull" json:"bank_account_number"`
    Notes             string    `bun:"notes" json:"notes"`
    DocumentStatus    string    `bun:"document_status,notnull" json:"document_status"` // pending, approved, rejected, completed
    RejectedReason    string    `bun:"rejected_reason" json:"rejected_reason"`
    ProcessedBy       string    `bun:"processed_by" json:"processed_by"`
    ProcessedAt       time.Time `bun:"processed_at" json:"processed_at"`
    IsDeleted         bool      `bun:"is_deleted,default:false" json:"is_deleted"`
    CreatedBy         string    `bun:"created_by,notnull" json:"created_by"`
    UpdatedBy         string    `bun:"updated_by" json:"updated_by"`
    CreatedAt         time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt         time.Time `bun:"updated_at" json:"updated_at"`

    Outlet *Outlet `bun:"rel:belongs-to,join:outlet_id=id" json:"outlet,omitempty"`
}
```

### OutletTopupRequest
```go
type OutletTopupRequest struct {
    bun.BaseModel `bun:"table:outlet_topup_requests"`

    ID             uuid.UUID `bun:"id,pk,type:uuid,default:uuid_generate_v4()" json:"id"`
    BrandID        uuid.UUID `bun:"brand_id,notnull" json:"brand_id"`
    OutletID       uuid.UUID `bun:"outlet_id,notnull" json:"outlet_id"`
    Code           string    `bun:"code,notnull" json:"code"`
    Amount         float64   `bun:"amount,notnull" json:"amount"`
    DocumentStatus string    `bun:"document_status,notnull" json:"document_status"` // pending, approved, rejected, completed
    Notes          string    `bun:"notes" json:"notes"`
    RejectedReason string    `bun:"rejected_reason" json:"rejected_reason"`
    IsDeleted      bool      `bun:"is_deleted,default:false" json:"is_deleted"`
    CreatedBy      string    `bun:"created_by,notnull" json:"created_by"`
    CreatedAt      time.Time `bun:"created_at,default:current_timestamp" json:"created_at"`
    UpdatedAt      time.Time `bun:"updated_at" json:"updated_at"`
}
```

### Session Claims
```go
type FranchiseSessionClaims struct {
    *common.SessionClaims
    BrandID  uuid.UUID `json:"brand_id"`
    OutletID uuid.UUID `json:"outlet_id"`
    Username string    `json:"username"`
    Role     string    `json:"role"`
}

func (s *FranchiseSessionClaims) GetBase() *common.SessionClaims {
    return s.SessionClaims
}

type Session struct {
    User         *User   `json:"user"`
    Outlet       *Outlet `json:"outlet"`
    AccessToken  string  `json:"access_token,omitempty"`
    RefreshToken string  `json:"refresh_token,omitempty"`
}
```

---

## 2. SQL Schema

```sql
-- ========================
-- FRANCHISE DATABASE
-- ========================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE brands (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id     UUID UNIQUE NOT NULL,
    code       VARCHAR(50) UNIQUE NOT NULL,
    name       VARCHAR(255) NOT NULL,
    address    TEXT,
    phone      VARCHAR(20),
    logo       TEXT,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE outlet_types (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id     UUID UNIQUE NOT NULL,
    brand_id   UUID NOT NULL REFERENCES brands(id),
    name       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE outlets (
    id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id           UUID UNIQUE NOT NULL,
    brand_id         UUID NOT NULL REFERENCES brands(id),
    outlet_type_id   UUID NOT NULL REFERENCES outlet_types(id),
    name             VARCHAR(255) NOT NULL,
    address          TEXT,
    phone            VARCHAR(20),
    service_charge   DECIMAL(15,2) DEFAULT 0,
    is_active        BOOLEAN DEFAULT true,
    balance          DECIMAL(15,2) DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ
);

CREATE TABLE categories (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id     UUID UNIQUE NOT NULL,
    brand_id   UUID NOT NULL REFERENCES brands(id),
    name       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE catalogs (
    id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id      UUID UNIQUE NOT NULL,
    brand_id    UUID NOT NULL REFERENCES brands(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    base_price  DECIMAL(15,2) DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    image_url   TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ
);

CREATE TABLE users (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id        UUID NOT NULL REFERENCES brands(id),
    outlet_id       UUID NOT NULL REFERENCES outlets(id),
    username        VARCHAR(100) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'cashier', -- outlet_owner, cashier
    is_active       BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_channels (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id     UUID UNIQUE NOT NULL,
    brand_id   UUID NOT NULL REFERENCES brands(id),
    name       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE payment_methods (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ref_id     UUID UNIQUE NOT NULL,
    brand_id   UUID NOT NULL REFERENCES brands(id),
    name       VARCHAR(255) NOT NULL,
    provider   VARCHAR(50) NOT NULL, -- saldo, midtrans, xendit
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE catalog_outlet (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id  UUID NOT NULL REFERENCES outlets(id),
    catalog_id UUID NOT NULL REFERENCES catalogs(id),
    min_stock  DECIMAL(15,2) DEFAULT 0,
    max_stock  DECIMAL(15,2) DEFAULT 0,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    UNIQUE (outlet_id, catalog_id)
);

CREATE TABLE outlet_stocks (
    id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id     UUID NOT NULL REFERENCES outlets(id),
    catalog_id    UUID NOT NULL REFERENCES catalogs(id),
    catalog_name  VARCHAR(255) NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    quantity      DECIMAL(15,2) DEFAULT 0,
    min_stock     DECIMAL(15,2) DEFAULT 0,
    max_stock     DECIMAL(15,2) DEFAULT 0,
    base_price    DECIMAL(15,2) DEFAULT 0,
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ,
    UNIQUE (outlet_id, catalog_id)
);

CREATE TABLE outlet_stock_logs (
    id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id   UUID NOT NULL REFERENCES outlets(id),
    catalog_id  UUID NOT NULL REFERENCES catalogs(id),
    type        VARCHAR(50) NOT NULL, -- in, out, adjustment
    quantity    DECIMAL(15,2) NOT NULL,
    qty_before  DECIMAL(15,2) NOT NULL,
    qty_after   DECIMAL(15,2) NOT NULL,
    reference   VARCHAR(255),
    description TEXT,
    created_by  VARCHAR(255),
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE member_cards (
    id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id   UUID NOT NULL REFERENCES outlets(id),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    email       VARCHAR(255),
    balance     DECIMAL(15,2) DEFAULT 0,
    point       DECIMAL(15,2) DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ
);

CREATE TABLE sales_session (
    id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id        UUID NOT NULL REFERENCES outlets(id),
    cashier_id       UUID NOT NULL REFERENCES users(id),
    transaction_date DATE,
    started_at       TIMESTAMPTZ NOT NULL,
    finished_at      TIMESTAMPTZ,
    cash_started     DECIMAL(15,2) NOT NULL,
    cash_finished    DECIMAL(15,2),
    status           VARCHAR(50) NOT NULL DEFAULT 'open', -- open, closed
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ
);

CREATE TABLE sales_orders (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    outlet_id       UUID NOT NULL REFERENCES outlets(id),
    session_id      UUID REFERENCES sales_session(id),
    channel_id      UUID REFERENCES sales_channels(id),
    code            VARCHAR(50) NOT NULL,
    customer_name   VARCHAR(255),
    total_sales     DECIMAL(15,2) DEFAULT 0,
    total_discount  DECIMAL(15,2) DEFAULT 0,
    total_service   DECIMAL(15,2) DEFAULT 0,
    grand_total     DECIMAL(15,2) DEFAULT 0,
    payment_method  VARCHAR(50),
    amount_paid     DECIMAL(15,2) DEFAULT 0,
    amount_change   DECIMAL(15,2) DEFAULT 0,
    is_bill         BOOLEAN DEFAULT false,
    bill_status     VARCHAR(50), -- unpaid, paid
    document_status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, completed, canceled
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ
);

CREATE TABLE sales_order_item (
    id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id              UUID NOT NULL REFERENCES sales_orders(id),
    additional_id         UUID REFERENCES sales_order_item(id),
    catalog_id            UUID NOT NULL REFERENCES catalogs(id),
    catalog_name          VARCHAR(255) NOT NULL,
    category_name         VARCHAR(255) NOT NULL,
    unit_base             DECIMAL(15,2) NOT NULL,
    unit_gross            DECIMAL(15,2) NOT NULL,
    discount_percentage   DECIMAL(5,2),
    discount_value        DECIMAL(15,2) NOT NULL,
    is_discount_percentage BOOLEAN NOT NULL DEFAULT false,
    unit_nett             DECIMAL(15,2) NOT NULL,
    unit_tax              DECIMAL(15,2) NOT NULL,
    unit_taxed            DECIMAL(15,2) NOT NULL,
    unit_bill             DECIMAL(15,2) NOT NULL,
    quantity              DECIMAL(15,2) NOT NULL
);

CREATE TABLE withdrawal_request (
    id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id            UUID NOT NULL REFERENCES brands(id),
    outlet_id           UUID NOT NULL REFERENCES outlets(id),
    code                VARCHAR(50) NOT NULL,
    amount              DECIMAL(15,2) NOT NULL,
    balance_at_request  DECIMAL(15,2) NOT NULL,
    bank_name           VARCHAR(255) NOT NULL,
    bank_account_name   VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(100) NOT NULL,
    notes               TEXT,
    document_status     VARCHAR(50) NOT NULL DEFAULT 'pending',
    rejected_reason     TEXT,
    processed_by        VARCHAR(255),
    processed_at        TIMESTAMPTZ,
    is_deleted          BOOLEAN DEFAULT false,
    created_by          VARCHAR(255) NOT NULL,
    updated_by          VARCHAR(255),
    created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ
);

CREATE TABLE outlet_topup_requests (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id        UUID NOT NULL REFERENCES brands(id),
    outlet_id       UUID NOT NULL REFERENCES outlets(id),
    code            VARCHAR(50) NOT NULL,
    amount          DECIMAL(15,2) NOT NULL,
    document_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    notes           TEXT,
    rejected_reason TEXT,
    is_deleted      BOOLEAN DEFAULT false,
    created_by      VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_outlets_brand_id ON outlets(brand_id);
CREATE INDEX idx_outlets_outlet_type_id ON outlets(outlet_type_id);
CREATE INDEX idx_users_outlet_id ON users(outlet_id);
CREATE INDEX idx_outlet_stocks_outlet_id ON outlet_stocks(outlet_id);
CREATE INDEX idx_outlet_stock_logs_outlet_id ON outlet_stock_logs(outlet_id);
CREATE INDEX idx_outlet_stock_logs_created_at ON outlet_stock_logs(created_at);
CREATE INDEX idx_member_cards_outlet_id ON member_cards(outlet_id);
CREATE INDEX idx_sales_session_outlet_id ON sales_session(outlet_id);
CREATE INDEX idx_sales_orders_session_id ON sales_orders(session_id);
CREATE INDEX idx_sales_orders_outlet_id ON sales_orders(outlet_id);
CREATE INDEX idx_withdrawal_request_outlet_id ON withdrawal_request(outlet_id);
CREATE INDEX idx_outlet_topup_requests_outlet_id ON outlet_topup_requests(outlet_id);
```

---

## 3. Route Registration

```go
package src

import (
    "github.com/logistics-id/engine/transport/rest"
    "github.com/logistics-id/franq-franchise/src/handler/rest/auth"
    "github.com/logistics-id/franq-franchise/src/handler/rest/catalog_outlet"
    "github.com/logistics-id/franq-franchise/src/handler/rest/dashboard"
    "github.com/logistics-id/franq-franchise/src/handler/rest/membership"
    "github.com/logistics-id/franq-franchise/src/handler/rest/outlet"
    "github.com/logistics-id/franq-franchise/src/handler/rest/outlet_topup_request"
    "github.com/logistics-id/franq-franchise/src/handler/rest/payment_method"
    "github.com/logistics-id/franq-franchise/src/handler/rest/profile"
    cashCtrl "github.com/logistics-id/franq-franchise/src/handler/rest/report/cash_control"
    outstanding "github.com/logistics-id/franq-franchise/src/handler/rest/report/outstanding"
    prodSales "github.com/logistics-id/franq-franchise/src/handler/rest/report/product_sales"
    settlement "github.com/logistics-id/franq-franchise/src/handler/rest/report/settlement"
    "github.com/logistics-id/franq-franchise/src/handler/rest/sales"
    stockLog "github.com/logistics-id/franq-franchise/src/handler/rest/stock/log"
    stockOutlet "github.com/logistics-id/franq-franchise/src/handler/rest/stock/outlet"
    "github.com/logistics-id/franq-franchise/src/handler/rest/user"
    "github.com/logistics-id/franq-franchise/src/handler/rest/withdrawal_request"
    "github.com/logistics-id/franq-franchise/src/usecase"
)

func RegisterRestRoutes(s *rest.RestServer) {
    uc := usecase.NewFactory()

    auth.RegisterHandler(s, uc)              // POST /auth/login
    profile.RegisterHandler(s, uc)           // GET,PUT /profile/me
    outlet.RegisterHandler(s, uc)            // PUT /outlet, GET /outlet/balance/log
    catalog_outlet.RegisterHandler(s, uc)    // GET catalog-outlet, GET/PUT /catalog-outlet/{id}, activate, deactivate
    stockOutlet.RegisterHandler(s, uc)       // GET /stock
    stockLog.RegisterHandler(s, uc)          // GET /stock/log
    user.RegisterHandler(s, uc)              // CRUD /user
    membership.RegisterHandler(s, uc)        // GET /membership, GET /membership/{id}, GET /membership/{id}/log
    sales.RegisterHandler(s, uc)             // GET /sales/session, /sales/session/{id}, /sales/order/{id}
    withdrawal_request.RegisterHandler(s, uc) // CRUD /withdrawal-request + cancel
    paymentMethod.RegisterHandler(s, uc)      // GET /payment-method
    outlet_topup_request.RegisterHandler(s, uc) // CRUD /outlet-topup-request
    dashboard.RegisterHandler(s, uc)         // GET /dashboard
    cashCtrl.RegisterHandler(s, uc)          // GET /report/cash-control, /report/cash-control/summary
    outstanding.RegisterHandler(s, uc)       // GET /report/outstanding, /report/outstanding/summary
    settlement.RegisterHandler(s, uc)        // GET /report/settlement, /report/settlement/summary
    prodSales.RegisterHandler(s, uc)         // GET /report/product-sales, /report/product-sales/summary
}
```

---

## 4. Handler Pattern (Standard)

Each handler follows this exact pattern:

```go
type handler struct {
    uc *usecase.Factory
}

func RegisterHandler(s *rest.RestServer, uc *usecase.Factory) {
    h := &handler{uc: uc}
    s.GET("/path", h.methodName, s.Restricted())
    s.POST("/path", h.create, s.Restricted())
    s.PUT("/path/{id}", h.update, s.Restricted())
    s.DELETE("/path/{id}", h.delete, s.Restricted())
}

func (h *handler) methodName(ctx *rest.Context) (err error) {
    var req someRequest
    var res *rest.ResponseBody
    if err = ctx.Bind(req.with(ctx, h.uc)); err == nil {
        res, err = req.execute()
    }
    return ctx.Respond(res, err)
}
```

### Auth Handler
| Method | Path | Auth | Request DTO |
|--------|------|------|-------------|
| POST | `/auth/login` | `s.WithAuth(false)` | `loginRequest` (phone, password) |

### Profile Handler
| Method | Path | Auth | Request DTO |
|--------|------|------|-------------|
| GET | `/profile/me` | `s.Restricted()` | `getRequest` |
| PUT | `/profile/me` | `s.Restricted()` | `updateRequest` |

### Outlet Handler
| Method | Path | Auth | Request DTO |
|--------|------|------|-------------|
| PUT | `/outlet` | `s.Restricted()` | `updateRequest` (service_charge, name, address) |
| GET | `/outlet/balance/log` | `s.Restricted()` | `getBalanceLogRequest` (paginated) |

### Catalog Outlet Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/catalog-outlet` | `getRequest` → `list()` |
| GET | `/catalog-outlet/{id}` | `getRequest` → `detail(id)` |
| PUT | `/catalog-outlet/{id}` | `updateRequest` → `execute()` |
| PUT | `/catalog-outlet/{id}/activate` | `activateRequest` → `execute()` |
| PUT | `/catalog-outlet/{id}/deactivate` | `deactivateRequest` → `execute()` |

### Stock Outlet Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/stock` | `getRequest` → `list()` |

### Stock Log Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/stock/log` | `getRequest` → `list()` |

### User Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/user` | `getRequest` → `list()` |
| POST | `/user` | `createRequest` → `execute()` |
| GET | `/user/{id}` | `getRequest` → `detail(id)` |
| PUT | `/user/{id}` | `updateRequest` → `execute()` |
| DELETE | `/user/{id}` | `deleteRequest` → `execute()` |

### Membership Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/membership` | `getRequest` → `list()` |
| GET | `/membership/{id}` | `getRequest` → `detail(id)` |
| GET | `/membership/{id}/log` | `getRequest` → `log(id)` |

### Sales Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/sales/session` | `getRequest` → `list()` |
| GET | `/sales/session/{id}` | `getRequest` → `detail(id)` |
| GET | `/sales/order/{id}` | `getRequest` → `orderDetail(id)` |

### Withdrawal Request Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/withdrawal-request` | `getRequest` → `list()` |
| GET | `/withdrawal-request/{id}` | `getRequest` → `detail(id)` |
| POST | `/withdrawal-request` | `createRequest` → `execute()` |
| PUT | `/withdrawal-request/{id}/cancel` | `cancelRequest` → `execute()` |

### Payment Method Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/payment-method` | `getRequest` → `list()` |

### Outlet Topup Request Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/outlet-topup-request` | `getRequest` → `list()` |
| GET | `/outlet-topup-request/{id}` | `getRequest` → `detail(id)` |
| POST | `/outlet-topup-request` | `createRequest` → `execute()` |
| DELETE | `/outlet-topup-request/{id}` | `deleteRequest` → `execute()` |

### Dashboard Handler
| Method | Path | Request DTO |
|--------|------|-------------|
| GET | `/dashboard` | `getRequest` → `list()` |

### Report Handlers
| Handler | Path | Request DTO |
|---------|------|-------------|
| Cash Control | `/report/cash-control` + `/report/cash-control/summary` | `getRequest` → `list()` / `getSummary()` |
| Outstanding | `/report/outstanding` + `/report/outstanding/summary` | `getRequest` → `list()` / `getSummary()` |
| Settlement | `/report/settlement` + `/report/settlement/summary` | `getRequest` → `list()` / `getSummary()` |
| Product Sales | `/report/product-sales` + `/report/product-sales/summary` | `getRequest` → `list()` / `getSummary()` |

---

## 5. Request DTO Patterns

### Auth — loginRequest
```go
type loginRequest struct {
    Phone    string `json:"phone" valid:"required"`
    Password string `json:"password" valid:"required"`
    ctx context.Context
    uc  *usecase.Factory
}
// Methods: with(ctx, uc) → Validate() → Messages() → toEntity() → execute() → *rest.ResponseBody
```

### Profile — getRequest / updateRequest
```go
type getRequest struct {
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
// detail() returns user + outlet profile

type updateRequest struct {
    DisplayName string `json:"display_name"`
    Phone       string `json:"phone"`
    Email       string `json:"email"`
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
```

### Outlet — updateRequest
```go
type updateRequest struct {
    Name          string  `json:"name"`
    Address       string  `json:"address"`
    ServiceCharge float64 `json:"service_charge"`
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
```

### User — createRequest / updateRequest / deleteRequest
```go
type createRequest struct {
    DisplayName string `json:"display_name" valid:"required"`
    Phone       string `json:"phone" valid:"required"`
    Password    string `json:"password" valid:"required|min:6"`
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
```

### Withdrawal — createRequest
```go
type createRequest struct {
    Amount          float64 `json:"amount" valid:"required|gt:0"`
    BankName        string  `json:"bank_name" valid:"required"`
    AccountName     string  `json:"account_name" valid:"required"`
    AccountNumber   string  `json:"account_number" valid:"required"`
    Notes           string  `json:"notes"`
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
// Validate: amount <= outlet balance
```

### Topup — createRequest
```go
type createRequest struct {
    Amount float64 `json:"amount" valid:"required|gt:0"`
    Notes  string  `json:"notes"`
    ctx     context.Context
    uc      *usecase.Factory
    session *entity.FranchiseSessionClaims
}
```

---

## 6. Business Rules / State Machines

### WithdrawalRequest Status Flow
```
pending ──→ approved ──→ completed
  │
  └──→ rejected
```

### OutletTopupRequest Status Flow
```
pending ──→ approved ──→ completed
  │
  └──→ rejected
```

### SalesSession Status
```
open ──→ closed
```

### SalesOrder Status
```
draft ──→ completed
  │
  └──→ canceled
```

### Bill Status (if is_bill = true)
```
unpaid ──→ paid
```

### Outlet Balance Rules
- **Topup (approved)**: `outlet.balance += amount`
- **Withdrawal (approved)**: `outlet.balance -= amount`
- **POS Sale (cash)**: `outlet.balance += grand_total`
- **POS Sale (bill)**: No immediate balance change

### Stock Movement Rules
- `type = "in"` → `outlet_stocks.quantity += amount`
- `type = "out"` → `outlet_stocks.quantity -= amount`
- `type = "adjustment"` → `outlet_stocks.quantity = new_value`
- Every movement writes to `outlet_stock_logs` with `qty_before` and `qty_after`

---

## 7. gRPC Service: FranchiseReportService (Internal)

Used by franchisor module to query franchise-side aggregated data.

**Service definition:**
```protobuf
service FranchiseReportService {
    rpc GetCashControl(ReportRequest) returns (ReportResponse);
    rpc GetOutstanding(ReportRequest) returns (ReportResponse);
    rpc GetSettlement(ReportRequest) returns (ReportResponse);
    rpc GetProductSales(ReportRequest) returns (ReportResponse);
}

message ReportRequest {
    string franchisor_id = 1;
    string outlet_id = 2;
    string start_date = 3;
    string end_date = 4;
    int32 page = 5;
    int32 page_size = 6;
}

message ReportResponse {
    string json_data = 1; // JSON-encoded report data
}
```

---

## 8. Event Subscriptions

| Event | Action |
|-------|--------|
| `franchisor:signup` | Create brand + admin user in db_franchise |
| `franchisor:brand.updated` | Sync brand row |
| `franchisor:brand.deleted` | Soft-delete brand |
| `franchisor:outlet.created` | Insert outlet + create outlet_owner user |
| `franchisor:outlet.updated` | Sync outlet fields |
| `franchisor:outlet.deleted` | Soft-delete outlet |
| `franchisor:menu.created/updated/deleted` | Sync catalog |
| `franchisor:menu.category.created/updated/deleted` | Sync category |
| `franchisor:catalog.created/updated/deleted/activated/deactivated` | Sync ingredient |
| `franchisor:payment.method.created/updated/deleted` | Sync payment_method |
| `franchisor:pos.channel.created/updated/deleted` | Sync sales_channel |
| `warehouse:delivery.order.completed` | Increment outlet stock |
| `franchisor:item.base_price.updated` | Update base_price on outlet_stocks |
| `franchisor:menu.assigned_to_outlet_type` | Insert catalog_outlet rows |
