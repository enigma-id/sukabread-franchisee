import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useAuth } from "@/services/auth/hooks";
import { useAppSelector } from "@/hooks";
import { AuthorizedLayout } from "@/components/layout/AuthorizedLayout";
import { UnauthorizedLayout } from "@/components/layout/UnauthorizedLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Purchase } from "@/pages/Purchase";
import { SalesRequestCreate } from "@/pages/purchase/SalesRequestCreate";
import { SalesRequestUpdate } from "@/pages/purchase/SalesRequestUpdate";
import { SalesRequestDetail } from "@/pages/purchase/SalesRequestDetail";
import { Stock } from "@/pages/Stock";
import { StockLog } from "@/pages/StockLog";
import { WithdrawalList } from "@/pages/withdrawal/WithdrawalList";
import { SessionList } from "@/pages/sales/SessionList";
import { SessionDetail } from "@/pages/sales/SessionDetail";
import { OrderDetail } from "@/pages/sales/OrderDetail";
import {
  Outstanding,
  Settlement,
  SettlementDaily,
  ProductSales,
  CashControl,
  ProductItem,
  CancelledProductSales,
  SaldoMembership,
  CashierList,
  CashierDetail,
} from "@/pages/reports";
// Lazy — page peta memuat mapbox-gl yang besar, jangan masuk bundle utama.
const CashierMaps = lazy(() =>
  import("@/pages/reports/CashierMaps").then((m) => ({ default: m.CashierMaps })),
);
import { UserList } from "@/pages/settings/UserList";
import { OutletCatalog } from "@/pages/settings/OutletCatalog";
import { OutletSettings } from "@/pages/settings/OutletSettings";
import { OutletBalanceLog } from "@/pages/settings/OutletBalanceLog";
import { TopupList } from "@/pages/outlet-topup/TopupList";
import TopupCreate from "@/pages/outlet-topup/TopupCreate";
import { PaymentMethodList } from "@/pages/payment-method/PaymentMethodList";
import { Profile } from "@/pages/Profile";
import WithdrawalCreate from "@/pages/withdrawal/WithdrawalCreate";

export function AppRoutes() {
  const { loadProfile } = useAuth();
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);

  // Saat refresh halaman (session ter-rehydrate dari persist), fetch ulang
  // /profile/me supaya data user selalu fresh.
  // Ref guard: cukup sekali per boot, jangan loop saat session di-update.
  const didFetchProfile = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !didFetchProfile.current) {
      didFetchProfile.current = true;
      loadProfile();
    }
  }, [isAuthenticated, loadProfile]);

  return (
    <Routes>
      {/* Public routes — wrapped in UnauthorizedLayout */}
      <Route element={<UnauthorizedLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected routes — wrapped in ProtectedRoute + AuthorizedLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AuthorizedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sales/session" element={<SessionList />} />
        <Route path="/sales/session/:id" element={<SessionDetail />} />
        <Route path="/sales/order/:id" element={<OrderDetail />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/purchase/create" element={<SalesRequestCreate />} />
        <Route path="/purchase/:id/update" element={<SalesRequestUpdate />} />
        <Route path="/purchase/:id" element={<SalesRequestDetail />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/log" element={<StockLog />} />
        <Route path="/report/product-sales" element={<ProductSales />} />
        <Route path="/report/product-item" element={<ProductItem />} />
        <Route
          path="/report/cancelled-product-sales"
          element={<CancelledProductSales />}
        />
        <Route path="/report/outstanding" element={<Outstanding />} />
        <Route path="/report/settlement" element={<Settlement />} />
        <Route path="/report/settlement/daily" element={<SettlementDaily />} />
        <Route path="/report/cash-control" element={<CashControl />} />
        <Route path="/report/cashier" element={<CashierList />} />
        <Route path="/report/cashier/:id" element={<CashierDetail />} />
        <Route
          path="/report/saldo-membership"
          element={<SaldoMembership />}
        />
        <Route
          path="/report/cashier-maps"
          element={
            <Suspense fallback={null}>
              <CashierMaps />
            </Suspense>
          }
        />
        <Route path="/withdrawal" element={<WithdrawalList />} />
        <Route path="/withdrawal/create" element={<WithdrawalCreate />} />
        <Route path="/outlet-topup" element={<TopupList />} />
        <Route path="/outlet-topup/create" element={<TopupCreate />} />
        <Route path="/payment-method" element={<PaymentMethodList />} />
        <Route path="/setting/user" element={<UserList />} />
        <Route path="/setting/catalog" element={<OutletCatalog />} />
        <Route path="/setting/outlet" element={<OutletSettings />} />
        <Route
          path="/setting/outlet/balance-log"
          element={<OutletBalanceLog />}
        />
        <Route path="/auth/me" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
