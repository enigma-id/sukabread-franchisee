import { useLazyGetPaymentMethodQuery } from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const usePaymentMethod = createCrudHook({
  useLazyGetQuery: useLazyGetPaymentMethodQuery,
  entityName: "paymentMethod",
});
