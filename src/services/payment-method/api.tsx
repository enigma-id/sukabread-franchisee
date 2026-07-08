import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const paymentMethodApi = createApi({
  reducerPath: "paymentMethodApi",
  baseQuery,
  endpoints: (builder) => ({
    getPaymentMethod: builder.query({
      query: () => ({
        url: "/payment-method",
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetPaymentMethodQuery } = paymentMethodApi;
