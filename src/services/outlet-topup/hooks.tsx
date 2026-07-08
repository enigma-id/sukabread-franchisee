import {
  useLazyGetListQuery,
  useLazyShowQuery,
  useCreateMutation,
  useRemoveMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useOutletTopup = createCrudHook({
  entityName: "outletTopup",
  useLazyGetQuery: useLazyGetListQuery,
  useLazyShowQuery: useLazyShowQuery,
  useCreateMutation: useCreateMutation,
  useRemoveMutation: useRemoveMutation,
});
