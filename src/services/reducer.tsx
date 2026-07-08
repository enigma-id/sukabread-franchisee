import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "redux";

import { authApi } from "./auth/api";
import { dashboardApi } from "./dashboard/api";
import { userApi } from "./user/api";
import { salesApi } from "./sales/api";
import { reportApi } from "./report/api";
import { tableApi } from "./table/api";
import { catalogApi } from "./catalog/api";
import { profileApi } from "./profile/api";
import { outletApi } from "./outlet/api";
import { membershipApi } from "./membership/api";
import { withdrawalApi } from "./withdrawal/api";
import { stockApi } from "./stock/api";
import { paymentMethodApi } from "./payment-method/api";
import { outletTopupApi } from "./outlet-topup/api";
import { authReducer, signout } from "./auth/slice";
import { formReducer } from "./form/slice";
import { tableReducer } from "./table/slice";

const appReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  table: tableReducer,

  [authApi.reducerPath]: authApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [outletApi.reducerPath]: outletApi.reducer,
  [membershipApi.reducerPath]: membershipApi.reducer,
  [stockApi.reducerPath]: stockApi.reducer,
  [withdrawalApi.reducerPath]: withdrawalApi.reducer,
  [paymentMethodApi.reducerPath]: paymentMethodApi.reducer,
  [outletTopupApi.reducerPath]: outletTopupApi.reducer,
});

type AppState = ReturnType<typeof appReducer>;

export const apiMiddlewares = [
  authApi.middleware,
  dashboardApi.middleware,
  userApi.middleware,
  salesApi.middleware,
  reportApi.middleware,
  tableApi.middleware,
  catalogApi.middleware,
  profileApi.middleware,
  outletApi.middleware,
  membershipApi.middleware,
  stockApi.middleware,
  withdrawalApi.middleware,
  paymentMethodApi.middleware,
  outletTopupApi.middleware,
];

export const rootReducer: Reducer<AppState, UnknownAction> = (
  state,
  action,
) => {
  if (action.type === signout.type) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:root");
    }
    state = undefined;
  }
  return appReducer(state, action);
};
