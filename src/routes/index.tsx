import { Routes, Route, Navigate } from "react-router-dom";
import { AuthorizedLayout } from "@/components/layout/AuthorizedLayout";
import { UnauthorizedLayout } from "@/components/layout/UnauthorizedLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "@/pages/Login";
import { Purchase } from "@/pages/Purchase";
import { Stock } from "@/pages/Stock";
import { Profile } from "@/pages/Profile";
import { SessionList } from "@/pages/sales/SessionList";
import { SessionDetail } from "@/pages/sales/SessionDetail";
import { OrderDetail } from "@/pages/sales/OrderDetail";
import {
  DailySales,
  OutstandingBills,
  SettlementMonthly,
  SettlementDaily,
  ItemSales,
} from "@/pages/reports";
import { CashControl } from "@/pages/cash/CashControl";
import { UserList } from "@/pages/settings/UserList";
import { UserCreate } from "@/pages/settings/UserCreate";
import { UserUpdate } from "@/pages/settings/UserUpdate";

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
        <Route path="/sales/session" element={<SessionList />} />
        <Route path="/sales/session/:id" element={<SessionDetail />} />
        <Route
          path="/sales/session/:id/order/:orderId"
          element={<OrderDetail />}
        />
        <Route path="/stock" element={<Stock />} />
        <Route path="/report/sales/daily" element={<DailySales />} />
        <Route
          path="/report/sales/outstanding"
          element={<OutstandingBills />}
        />
        <Route path="/report/sales/payment" element={<SettlementMonthly />} />
        <Route
          path="/report/sales/payment/daily"
          element={<SettlementDaily />}
        />
        <Route path="/report/sales/item" element={<ItemSales />} />
        <Route path="/cash/control" element={<CashControl />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/setting/user" element={<UserList />} />
        <Route path="/setting/user/create" element={<UserCreate />} />
        <Route path="/setting/user/:id/update" element={<UserUpdate />} />
        <Route path="/auth/me" element={<Profile />} />
        <Route path="*" element={<SessionList />} />
        <Route path="*" element={<Navigate to="/sales/session" replace />} />
      </Route>
    </Routes>
  );
}
