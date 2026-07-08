import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";
import type { UserProfile, ContractProfileUpdatePayload } from "../types";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    /**
     * GET /profile/me
     * Get login user profile details
     */
    getProfile: builder.query<UserProfile, any>({
      query: (params) => ({
        url: "/profile/me",
        method: "GET",
        params,
      }),
      providesTags: ["Profile"],
    }),

    /**
     * PUT /profile/me
     * Update login user profile
     */
    updateProfile: builder.mutation<UserProfile, ContractProfileUpdatePayload>({
      query: (payload) => ({
        url: "/profile/me",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
