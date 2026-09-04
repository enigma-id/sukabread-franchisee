import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const ingredientApi = createApi({
  reducerPath: "ingredientApi",
  baseQuery,
  tagTypes: ["Ingredient"],
  endpoints: (builder) => ({
    /**
     * GET /ingredient
     * List ingredients for current franchise brand
     */
    getIngredient: builder.query({
      query: (params) => ({
        url: "/ingredient",
        method: "GET",
        params,
      }),
      providesTags: ["Ingredient"],
    }),
  }),
});

export const { useLazyGetIngredientQuery } = ingredientApi;
