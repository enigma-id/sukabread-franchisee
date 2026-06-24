import { useLazyGetLogQuery, useUpdateOutletMutation } from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useOutlet = createCrudHook({
  useLazyGetQuery: useLazyGetLogQuery,
  useUpdateMutation: useUpdateOutletMutation,
  customOperations: {
    service: { hook: useUpdateOutletMutation },
  },
  entityName: "outlet",
});
