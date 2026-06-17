import { useLazyGetLogQuery, useUpdateOutletMutation } from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useOutlet = createCrudHook({
  useUpdateMutation: useUpdateOutletMutation,
  useLazyGetQuery: useLazyGetLogQuery,
  entityName: "outlet",
});
