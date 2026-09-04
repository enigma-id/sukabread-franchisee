import { createSlice } from "@reduxjs/toolkit";
import type { SessionFranchise, User } from "../types";

export interface SessionOutlet {
  id: string;
  name: string;
  outlet_type_id: string;
  brand_id: string;
  service_charges: number;
  phone: string;
  address: string;
  recipient_name: string;
  region_id: string;
  is_active: boolean;
}

export interface AuthSession {
  access_token: string;
  user: User;
  franchise?: SessionFranchise | null;
  outlet?: SessionOutlet | null;
}

interface authState {
  authenticated: boolean;
  session: AuthSession | null;
}

const defineInitialState = (): authState => ({
  authenticated: false,
  session: null,
});

export const authSlice = createSlice({
  name: "auth",
  initialState: defineInitialState(),
  reducers: {
    signin: (state, action) => {
      state.session = action.payload;
      state.authenticated = true;
    },
    signout: (state) => {
      state.session = null;
      state.authenticated = false;
    },
    session: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const { signin, signout, session } = authSlice.actions;
export const authReducer = authSlice.reducer;
