import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery,
  tagTypes: ["Catalog"],
  endpoints: (builder) => ({
    /**
     * GET /catalog-outlet
     * List catalog for current outlet
     */
    getCatalog: builder.query({
      query: (params) => ({
        url: "/catalog-outlet",
        method: "GET",
        params,
      }),
      providesTags: ["Catalog"],
    }),

    /**
     * PUT /catalog-outlet/:id
     * Update stock range
     */
    updateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/catalog-outlet/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Catalog"],
    }),

    /**
     * GET /catalog-outlet/:id
     * Catalog outlet detail with fractions
     */
    showCatalog: builder.query({
      query: ({ id, ...params }) => ({
        url: `/catalog-outlet/${id}`,
        method: "GET",
        params,
      }),
      providesTags: ["Catalog"],
    }),

    /**
     * PUT /catalog-outlet/:id/activate
     */
    activateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/catalog-outlet/${id}/activate`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Catalog"],
    }),

    /**
     * PUT /catalog-outlet/:id/deactivate
     */
    deactivateCatalog: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/catalog-outlet/${id}/deactivate`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Catalog"],
    }),
  }),
});

export const {
  useLazyGetCatalogQuery,
  useShowCatalogQuery,
  useLazyShowCatalogQuery,
  useUpdateCatalogMutation,
  useActivateCatalogMutation,
  useDeactivateCatalogMutation,
} = catalogApi;
