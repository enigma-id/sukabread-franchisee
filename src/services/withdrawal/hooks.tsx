import {
  useLazyGetListQuery,
  useCancelMutation,
  useCreateMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useWithdrawal = createCrudHook({
  entityName: "withdrawal",
  useLazyGetQuery: useLazyGetListQuery,
  useCreateMutation: useCreateMutation,
  customOperations: {
    cancel: {
      hook: useCancelMutation,
    },
  },
});
