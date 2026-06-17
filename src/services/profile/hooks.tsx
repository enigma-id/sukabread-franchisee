import {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "./api";
import { createCrudHook } from "../hooks/createCrudHook";

export const useProfile = createCrudHook({
  useLazyGetQuery: useLazyGetProfileQuery,
  useUpdateMutation: useUpdateProfileMutation,
  entityName: "profile",
});
