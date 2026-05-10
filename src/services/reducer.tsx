import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer, UnknownAction } from "redux";

import { authApi } from "./auth/api";
import { userApi } from "./user/api";
import { salesApi } from "./sales/api";
import { reportApi } from "./report/api";
import { tableApi } from "./table/api";
import { authReducer, signout } from "./auth/slice";
import { formReducer } from "./form/slice";
import { tableReducer } from "./table/slice";

const appReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  table: tableReducer,

  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [tableApi.reducerPath]: tableApi.reducer,
});

type AppState = ReturnType<typeof appReducer>;

export const apiMiddlewares = [
  authApi.middleware,
  userApi.middleware,
  salesApi.middleware,
  reportApi.middleware,
  tableApi.middleware,
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
