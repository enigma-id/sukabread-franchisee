import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types";

interface SessionOutlet {
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

interface authState {
  authenticated: boolean;
  session: {
    access_token: string;
    user: User;
    outlet: SessionOutlet | null;
  } | null;
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
