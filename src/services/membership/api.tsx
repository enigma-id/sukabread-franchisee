import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const membershipApi = createApi({
  reducerPath: "membershipApi",
  baseQuery,
  tagTypes: ["Membership", "MembershipLog"],
  endpoints: (builder) => ({
    /**
     * GET /membership
     * List members
     */
    getMembership: builder.query({
      query: (params) => ({
        url: "/membership",
        method: "GET",
        params,
      }),
      providesTags: ["Membership"],
    }),

    /**
     * GET /membership/:id
     * Show member details
     */
    showMembership: builder.query({
      query: ({ id }) => ({
        url: `/membership/${id}`,
        method: "GET",
      }),
      providesTags: ["Membership"],
    }),

    /**
     * GET /membership/:id/log
     * Get member points/activity log
     */
    getMembershipLogs: builder.query({
      query: ({ id, ...params }) => ({
        url: `/membership/${id}/log`,
        method: "GET",
        params,
      }),
      providesTags: ["MembershipLog"],
    }),
  }),
});

export const {
  useLazyGetMembershipQuery,
  useLazyShowMembershipQuery,
  useLazyGetMembershipLogsQuery,
} = membershipApi;
