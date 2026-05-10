import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

/**
 * TMS Onward - Authentication API
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    /**
     * POST /auth/login
     * User login with username and password
     */
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),

    /**
     * GET /auth/me
     * Get data user login
     */
    getMe: builder.query({
      query: (params) => ({
        url: "/auth/me",
        method: "GET",
        params,
      }),
    }),

    /**
     * PUT /auth/me
     * Change data user login
     * Body: { name, password, confirm_password }
     */
    updateMe: builder.mutation({
      query: (payload) => ({
        url: "/auth/me",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

// Export RTK Query hooks
export const { useLoginMutation, useLazyGetMeQuery, useUpdateMeMutation } =
  authApi;
