import {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useActivateMutation,
  useDeactivateMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useFranchiseOutlet = createCrudHook({
  entityName: "franchiseOutlet",
  useLazyGetQuery: useLazyGetListQuery,
  useLazyShowQuery: useLazyShowQuery,
  useCreateMutation: useCreateMutation,
  useUpdateMutation: useUpdateMutation,
  useRemoveMutation: useRemoveMutation,
  customOperations: {
    activate: {
      hook: useActivateMutation,
    },
    deactivate: {
      hook: useDeactivateMutation,
    },
  },
});
