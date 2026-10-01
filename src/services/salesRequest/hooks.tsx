import {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useUpdateMutation,
  usePublishMutation,
  useCancelMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useSalesRequest = createCrudHook({
  entityName: "salesRequest",
  useLazyGetQuery: useLazyGetListQuery,
  useLazyShowQuery: useLazyShowQuery,
  useCreateMutation: useCreateMutation,
  useUpdateMutation: useUpdateMutation,
  customOperations: {
    publish: {
      hook: usePublishMutation,
    },
    cancel: {
      hook: useCancelMutation,
    },
  },
});
