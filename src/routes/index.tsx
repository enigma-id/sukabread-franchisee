import { Routes, Route, Navigate } from "react-router-dom";
import { AuthorizedLayout } from "@/components/layout/AuthorizedLayout";
import { UnauthorizedLayout } from "@/components/layout/UnauthorizedLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Purchase } from "@/pages/Purchase";
import { Stock } from "@/pages/Stock";
import { StockLog } from "@/pages/StockLog";
import { Membership } from "@/pages/membership/MembershipList";
import { MembershipDetail } from "@/pages/membership/MembershipDetail";
import { WithdrawalList } from "@/pages/withdrawal/WithdrawalList";
import { SessionList } from "@/pages/sales/SessionList";
import { SessionDetail } from "@/pages/sales/SessionDetail";
import { OrderDetail } from "@/pages/sales/OrderDetail";
import {
  Outstanding,
  Settlement,
  ProductSales,
  CashControl,
} from "@/pages/reports";
import { UserList } from "@/pages/settings/UserList";
import { UserCreate } from "@/pages/settings/UserCreate";
import { UserUpdate } from "@/pages/settings/UserUpdate";
import { OutletCatalog } from "@/pages/settings/OutletCatalog";
import { OutletSettings } from "@/pages/settings/OutletSettings";
import { OutletBalanceLog } from "@/pages/settings/OutletBalanceLog";
import { Profile } from "@/pages/Profile";
import WithdrawalCreate from "@/pages/withdrawal/WithdrawalCreate";

export function AppRoutes() {
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
        <Route
          path="/sales/session/:id/order/:orderId"
          element={<OrderDetail />}
        />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/stock/log" element={<StockLog />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/:id" element={<MembershipDetail />} />
        <Route path="/report/product-sales" element={<ProductSales />} />
        <Route path="/report/outstanding" element={<Outstanding />} />
        <Route path="/report/settlement" element={<Settlement />} />
        <Route path="/report/cash-control" element={<CashControl />} />
        <Route path="/withdrawal" element={<WithdrawalList />} />
        <Route path="/withdrawal/create" element={<WithdrawalCreate />} />
        <Route path="/setting/user" element={<UserList />} />
        <Route path="/setting/user/create" element={<UserCreate />} />
        <Route path="/setting/user/:id/update" element={<UserUpdate />} />
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
